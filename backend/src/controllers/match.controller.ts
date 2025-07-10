import { Request, Response } from 'express';
import { AxiosError } from 'axios';

interface ApiError extends Error {
    code?: string;
    status?: number;
    response?: AxiosError['response'];
}

interface AnalysisResult {
    matchScore?: number;
    feedback?: string;
    matchedSkills?: string[];
    // Add other properties as they become clear from AI response structure
}
import admin from 'firebase-admin';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Resume } from '../models/resume.model'; // To potentially fetch resume by ID
// Import initialized db from config
import { db } from '../config/firebase.config';
import pdfParse from 'pdf-parse'; // For parsing PDF files
import mammoth from 'mammoth'; // For parsing DOCX files

interface CustomRequest extends Request {
    user?: admin.auth.DecodedIdToken;
}

// const db = admin.firestore(); // Removed: Use imported db

// Re-initialize AI client (Consider centralizing this later)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Old model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // Use current recommended model

export const matchResumeToJob = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized: User not authenticated' });
            return;
        }
        const userId = req.user.uid;

        // Destructure jobDescription from req.body. resumeId and resumeText are no longer primary inputs from frontend.
        const { jobDescription, resumeId, resumeText: fallbackResumeText } = req.body;

        if (!jobDescription) {
            res.status(400).json({ message: 'Bad Request: Missing jobDescription' });
            return;
        }

        let currentResumeText = '';
        let resumeSourceDescription = 'Unknown';

        // --- Get Resume Text --- 
        if (req.file) {
            console.log(`[match]: Processing uploaded resume file for user ${userId}: ${req.file.originalname}`);
            resumeSourceDescription = `Uploaded file: ${req.file.originalname}`;
            try {
                if (req.file.mimetype === "application/pdf") {
                    const data = await pdfParse(req.file.buffer);
                    currentResumeText = data.text;
                } else if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    const { value } = await mammoth.extractRawText({ buffer: req.file.buffer });
                    currentResumeText = value;
                } else {
                    // This should be caught by multer's fileFilter, but handle defensively
                    res.status(400).json({ message: 'Unsupported file type provided.' });
                    return;
                }
                if (!currentResumeText || !currentResumeText.trim()) {
                    console.error(`[match]: Failed to extract text from uploaded file ${req.file.originalname} for user ${userId}. Mimetype: ${req.file.mimetype}`);
                    res.status(400).json({ message: 'Could not extract text from the uploaded resume file. It might be empty or corrupted.' });
                    return;
                }
                console.log(`[match]: Successfully extracted text from ${req.file.originalname} for user ${userId}`);
            } catch (extractionError: unknown) {
                if (extractionError instanceof Error) {
                    console.error(`[match]: Error extracting text from file ${req.file.originalname} for user ${userId}:`, extractionError.message);
                    res.status(500).json({ message: 'Error processing uploaded resume file.', error: extractionError.message });
                }
                return;
            }
        } else if (resumeId) { // Fallback if frontend or API caller still uses resumeId
            console.log(`[match]: Fetching resume by ID ${resumeId} for user ${userId} (fallback)`);
            resumeSourceDescription = `ID: ${resumeId}`;
            const resumeRef = db.collection('resumes').doc(resumeId);
            const resumeDoc = await resumeRef.get();

            if (!resumeDoc.exists) {
                res.status(404).json({ message: 'Resume not found for the given ID' });
                return;
            }
            const resumeData = resumeDoc.data() as Resume;
            if (resumeData.userId !== userId) {
                res.status(403).json({ message: 'Forbidden: You do not own this resume' });
                return;
            }
            if (!resumeData.parsedText) {
                res.status(400).json({ message: 'Cannot match: Resume text is missing or empty for the given ID' });
                return;
            }
            currentResumeText = resumeData.parsedText;
            console.log(`[match]: Fetched resume text for ${resumeId} (fallback)`);
        } else if (fallbackResumeText) { // Fallback for direct text submission
            console.log(`[match]: Using provided resume text for user ${userId} (fallback)`);
            resumeSourceDescription = 'Direct Text (fallback)';
            currentResumeText = fallbackResumeText;
        } else {
            // No resume source provided
            res.status(400).json({ message: 'Bad Request: No resume source provided (file, ID, or text).' });
            return;
        }

        if (!currentResumeText.trim()) {
            res.status(400).json({ message: 'Resume text is empty. Cannot perform match.' });
            return;
        }

        console.log(`[match]: Starting comparison for user ${userId}. Resume source: ${resumeSourceDescription}`);

        // --- Prepare Prompt for Gemini --- 
        const prompt = `
          Analyze the alignment between the following Resume Text and Job Description.
          Provide your response as a JSON object with the following keys:
          - "matchScore": An integer score from 0 to 100 representing how well the resume matches the job description requirements.
          - "missingKeywords": An array of important skills or keywords found in the Job Description but missing or poorly represented in the Resume Text.
          - "matchingKeywords": An array of important skills or keywords found in both the Job Description and the Resume Text.
          - "suggestions": An array of specific, actionable suggestions (as strings) for how to tailor the Resume Text to better fit the Job Description.

          Resume Text:
          --- START RESUME ---
          ${currentResumeText}
          --- END RESUME ---

          Job Description:
          --- START JOB DESCRIPTION ---
          ${jobDescription}
          --- END JOB DESCRIPTION ---

          JSON Response:
        `;

        // --- Call Gemini API --- 
        const generationConfig = { temperature: 0.3 }; // Balance between accuracy and slight variation
        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];

        console.log(`[match]: Sending comparison prompt to Gemini for user ${userId}. Prompt length (approx): ${prompt.length}`);
        const result = await model.generateContent(
            prompt,
            // generationConfig, // Consider re-adding if issues persist with default settings
            // safetySettings  // Consider re-adding if issues persist with default settings
        );
        const response = await result.response;
        const aiTextResponse = response.text();
        console.log(`[match]: Received raw comparison response from Gemini for user ${userId}. Length: ${aiTextResponse.length}`);

        // --- Parse Gemini Response --- 
        let analysisResult: AnalysisResult = {};
        try {
            // Improved JSON extraction: look for JSON block specifically
            const jsonMatch = aiTextResponse.match(/```json\n(\{.*?\})\n```/s) || aiTextResponse.match(/(\{.*?\})/s);
            if (jsonMatch && jsonMatch[1]) {
                analysisResult = JSON.parse(jsonMatch[1]);
                console.log(`[match]: Successfully parsed JSON from Gemini comparison response.`);
            } else {
                console.error(`[match]: Failed to find valid JSON in Gemini comparison response for user ${userId}. Response: ${aiTextResponse}`);
                throw new Error('Failed to parse AI matching response as JSON.');
            }
        } catch (parseError: unknown) {
            if (parseError instanceof Error) {
                console.error(`[match]: Error parsing Gemini comparison response for user ${userId}:`, parseError.message);
                console.error(`[match]: Raw AI comparison response for user ${userId}: ${aiTextResponse}`);
                res.status(500).json({ message: 'Failed to parse AI matching response', error: parseError.message, rawResponse: aiTextResponse });
            }
            return;
        }

        // --- Return Result --- 
        res.status(200).json({ message: 'Resume matched to job description successfully', analysis: analysisResult });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("[match]: Resume-Job matching error for user", req.user?.uid, ":", error.message);
            const err = error as { code?: string; status?: string; message: string };
            if (err.message && err.message.includes('GOOGLE_API_KEY_INVALID')) {
                res.status(500).json({ message: 'Internal Server Error: Invalid Gemini API Key configured.' });
            } else if (err.code === 'permission-denied' || (err.status && err.status === 'PERMISSION_DENIED')) {
                res.status(500).json({ message: 'Internal Server Error: Firebase/Google API permission issue.' });
            } else {
                res.status(500).json({ message: 'Internal server error during matching', error: err.message });
            }
        }
    }
}; 