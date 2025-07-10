import { Request, Response } from 'express';
import { AxiosError } from 'axios';

interface ApiError extends Error {
    code?: string;
    status?: string | number;
    response?: {
        status?: string | number;
        data?: { message?: string; };
    };
}

interface ResumeAnalysisResult {
    skills?: string[];
    experience?: string[];
    education?: string[];
    summary?: string;
    // Add other properties as they become clear from AI response structure
}
// import admin from 'firebase-admin'; // Keep for FieldValue type
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { Resume } from '../models/resume.model';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
// Import initialized db from config
import { db } from '../config/firebase.config';
import admin from 'firebase-admin'; // Still needed for admin.firestore.FieldValue

interface CustomRequest extends Request {
    user?: admin.auth.DecodedIdToken;
}

// const db = admin.firestore(); // Removed: Use imported db

// Initialize Google Generative AI 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Old model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // Use current recommended model

// Placeholder for uploadResume function
export const uploadResume = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        // If user is not authenticated, assign a generic or null userId
        const userId = req.user ? req.user.uid : 'anonymous';

        // Check if a file was uploaded by multer
        if (!req.file) {
            res.status(400).json({ message: 'Bad Request: No file uploaded' });
            return;
        }

        const file = req.file;
        let parsedText = '';

        console.log(`[upload]: Processing file: ${file.originalname}, Type: ${file.mimetype}, Size: ${file.size} bytes`);

        // Parse based on mimetype
        if (file.mimetype === 'application/pdf') {
            const data = await pdfParse(file.buffer);
            parsedText = data.text;
            console.log(`[upload]: PDF parsed successfully.`);
        } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const { value } = await mammoth.extractRawText({ buffer: file.buffer });
            parsedText = value;
            console.log(`[upload]: DOCX parsed successfully.`);
        } else {
            // This case should ideally be prevented by multer's fileFilter, but handle defensively
            res.status(400).json({ message: 'Unsupported file type' });
            return;
        }

        // Create Resume data object
        const resumeData: Omit<Resume, 'id'> = {
            userId: userId,
            originalFilename: file.originalname,
            parsedText: parsedText,
            uploadTimestamp: admin.firestore.FieldValue.serverTimestamp() as admin.firestore.Timestamp,
            // analysis field will be added later in Phase 3
        };

        // Use imported db service
        const resumeRef = await db.collection('resumes').add(resumeData);
        console.log(`[upload]: Resume data saved to Firestore with ID: ${resumeRef.id}`);

        // Respond with the ID of the newly created resume document
        res.status(201).json({ message: 'Resume uploaded and parsed successfully', resumeId: resumeRef.id });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("[upload]: Resume upload/parsing error:", error.message);
            res.status(500).json({ message: 'Internal server error during resume processing', error: error.message });
        }
    }
};

// --- Analyze Resume Function ---
export const analyzeResume = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user ? req.user.uid : 'anonymous';
        const { resumeId } = req.params;

        if (!resumeId) {
            res.status(400).json({ message: 'Bad Request: Missing resumeId parameter' });
            return;
        }

        // Use imported db service
        const resumeRef = db.collection('resumes').doc(resumeId);
        const resumeDoc = await resumeRef.get();

        if (!resumeDoc.exists) {
            res.status(404).json({ message: 'Resume not found' });
            return;
        }

        const resumeData = resumeDoc.data() as Resume;

        // Verify ownership, allowing anonymous users to analyze anonymously uploaded resumes
        if (resumeData.userId !== userId && !(resumeData.userId === 'anonymous' && userId === 'anonymous')) {
            res.status(403).json({ message: 'Forbidden: You do not own this resume' });
            return;
        }

        if (!resumeData.parsedText || resumeData.parsedText.trim() === '') {
            res.status(400).json({ message: 'Cannot analyze empty resume text' });
            return;
        }

        console.log(`[analyze]: Starting analysis for resume: ${resumeId}, User: ${userId}`);

        // --- Prepare Prompt for Gemini --- (Aligned with frontend ResumeAnalysis interface)
        const prompt = `
          Analyze the following resume text and provide feedback. Structure your response as a JSON object adhering STRICTLY to the following format:
          {
            "overallScore": <integer score 0-100>,
            "categoryScores": {
              "formatting": <integer score 0-100 for layout, readability, consistency>,
              "content": <integer score 0-100 for clarity, conciseness, grammar, spelling>,
              "keywords": <integer score 0-100 for relevance of skills and terms to common job descriptions>,
              "impact": <integer score 0-100 for showcasing achievements and quantifiable results>
            },
            "suggestions": [<array of specific, actionable suggestion strings>],
            "strengths": [<array of specific strength strings>]
          }

          Resume Text:
          --- START RESUME ---
          ${resumeData.parsedText}
          --- END RESUME ---

          Ensure your entire response is ONLY the JSON object requested, without any introductory text, code block markers (\`\`\`), or explanations.

          JSON Response:
        `;

        // --- Call Gemini API --- (Consider adding safety settings)
        const generationConfig = {
            temperature: 0.2, // Lower temperature for more deterministic/factual response
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };
        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];

        const result = await model.generateContent(
            prompt
            // Consider passing generationConfig and safetySettings if needed
            // { generationConfig, safetySettings }
        );
        const response = await result.response;
        const aiTextResponse = response.text();

        console.log(`[analyze]: Received raw response from Gemini for resume ${resumeId}.`);

        // --- Parse Gemini Response --- (Robust parsing needed)
        let analysisResult: ResumeAnalysisResult = {};
        try {
            // Attempt to parse the text response as JSON
            // Find the start and end of the JSON block if necessary
            const jsonMatch = aiTextResponse.match(/\{.*\}/s);
            if (jsonMatch && jsonMatch[0]) {
                analysisResult = JSON.parse(jsonMatch[0]);
                console.log(`[analyze]: Successfully parsed JSON from Gemini response for resume ${resumeId}.`);
            } else {
                console.error(`[analyze]: Failed to find valid JSON in Gemini response for resume ${resumeId}. Response: ${aiTextResponse}`);
                throw new Error('Failed to parse AI analysis response as JSON.');
            }

            // TODO: Add validation for the structure of analysisResult (ensure required keys exist)

        } catch (parseError: unknown) {
            if (parseError instanceof Error) {
                console.error(`[analyze]: Error parsing Gemini response for resume ${resumeId}:`, parseError.message);
                // Log the raw response for debugging
                console.error(`[analyze]: Raw AI response: ${aiTextResponse}`);
                res.status(500).json({ message: 'Failed to parse AI analysis response', error: parseError.message });
                return;
            }
        }

        // --- Update Firestore --- 
        const analysisUpdateData = {
            analysis: {
                ...analysisResult, // Spread the parsed data
                analysisTimestamp: admin.firestore.FieldValue.serverTimestamp() // Keep admin namespace
            }
        };
        // Use resumeRef obtained earlier
        await resumeRef.update(analysisUpdateData);
        console.log(`[analyze]: Analysis results updated in Firestore for resume: ${resumeId}`);

        res.status(200).json({ message: 'Resume analyzed successfully', analysis: analysisUpdateData.analysis });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`[analyze]: Error during resume analysis for resume ${req.params.resumeId}:`, error.message);
            if ((error as ApiError).message.includes('GOOGLE_API_KEY_INVALID')) {
                res.status(500).json({ message: 'Internal Server Error: Invalid Gemini API Key configured.' });
            } else if ((error as ApiError).code === 'permission-denied' || (error as ApiError).status === 'PERMISSION_DENIED') {
                res.status(500).json({ message: 'Internal Server Error: Firebase permission issue.' });
            } else {
                res.status(500).json({ message: 'Internal server error during analysis', error: (error as ApiError).message });
            }
        }
    }
};

// --- Get Uploaded Resumes Function ---
export const getUploadedResumes = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized: User not authenticated' });
            return;
        }
        const userId = req.user.uid;

        console.log(`[getResumes]: Fetching uploaded resumes for user ${userId}`);

        const resumesSnapshot = await db.collection('resumes')
            .where('userId', '==', userId)
            .orderBy('uploadTimestamp', 'desc') // Order by newest first
            .get();

        if (resumesSnapshot.empty) {
            console.log(`[getResumes]: No uploaded resumes found for user ${userId}`);
            res.status(200).json({ resumes: [] }); // Return empty array, not an error
            return;
        }

        const resumes = resumesSnapshot.docs.map(doc => {
            const data = doc.data() as Resume;
            // Return only necessary fields to the frontend
            return {
                id: doc.id,
                originalFilename: data.originalFilename,
                uploadTimestamp: data.uploadTimestamp,
                overallScore: data.analysis?.overallScore, // Include score if available
                analysisTimestamp: data.analysis?.analysisTimestamp
            };
        });

        console.log(`[getResumes]: Found ${resumes.length} uploaded resumes for user ${userId}`);
        res.status(200).json({ resumes });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`[getResumes]: Error fetching uploaded resumes for user ${req.user?.uid}:`, error.message);
            if ((error as ApiError).code === 'permission-denied' || (error as ApiError).status === 'PERMISSION_DENIED') {
                res.status(500).json({ message: 'Internal Server Error: Firebase permission issue.' });
            } else {
                res.status(500).json({ message: 'Internal server error fetching uploaded resumes', error: error.message });
            }
        }
    }
};

// TODO: Add other resume controller functions later (getResumeById, getAllResumes) 