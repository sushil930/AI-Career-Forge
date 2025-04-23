import { Request, Response } from 'express';
// import admin from 'firebase-admin'; // No longer needed directly here
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Resume } from '../models/resume.model'; // To potentially fetch resume by ID
// Import initialized db from config
import { db } from '../config/firebase.config';

// const db = admin.firestore(); // Removed: Use imported db

// Re-initialize AI client (Consider centralizing this later)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Old model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // Use current recommended model

export const matchResumeToJob = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized: User not authenticated' });
            return;
        }
        const userId = req.user.uid;

        const { resumeId, resumeText, jobDescription } = req.body;

        if (!jobDescription || (!resumeId && !resumeText)) {
            res.status(400).json({ message: 'Bad Request: Missing jobDescription and either resumeId or resumeText' });
            return;
        }

        let currentResumeText = '';

        // --- Get Resume Text --- 
        if (resumeId) {
            console.log(`[match]: Fetching resume ${resumeId} for user ${userId}`);
            const resumeRef = db.collection('resumes').doc(resumeId);
            const resumeDoc = await resumeRef.get();

            if (!resumeDoc.exists) {
                res.status(404).json({ message: 'Resume not found' });
                return;
            }
            const resumeData = resumeDoc.data() as Resume;
            if (resumeData.userId !== userId) {
                res.status(403).json({ message: 'Forbidden: You do not own this resume' });
                return;
            }
            if (!resumeData.parsedText) {
                res.status(400).json({ message: 'Cannot match: Resume text is missing or empty' });
                return;
            }
            currentResumeText = resumeData.parsedText;
            console.log(`[match]: Fetched resume text for ${resumeId}`);
        } else if (resumeText) {
            console.log(`[match]: Using provided resume text for user ${userId}`);
            currentResumeText = resumeText;
        } else {
            // Should be caught by initial validation, but handle defensively
            res.status(400).json({ message: 'Internal Error: No resume source identified' });
            return;
        }

        console.log(`[match]: Starting comparison for user ${userId}, Resume source: ${resumeId ? `ID ${resumeId}` : 'Direct Text'}`);

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

        console.log(`[match]: Sending comparison prompt to Gemini for user ${userId}`);
        const result = await model.generateContent(
            prompt
            // { generationConfig, safetySettings } // Consider enabling these
        );
        const response = await result.response;
        const aiTextResponse = response.text();
        console.log(`[match]: Received raw comparison response from Gemini for user ${userId}`);

        // --- Parse Gemini Response --- 
        let analysisResult: any = {};
        try {
            const jsonMatch = aiTextResponse.match(/\{.*\}/s);
            if (jsonMatch && jsonMatch[0]) {
                analysisResult = JSON.parse(jsonMatch[0]);
                console.log(`[match]: Successfully parsed JSON from Gemini comparison response.`);
            } else {
                console.error(`[match]: Failed to find valid JSON in Gemini comparison response. Response: ${aiTextResponse}`);
                throw new Error('Failed to parse AI matching response as JSON.');
            }
            // TODO: Add validation for the structure of analysisResult
        } catch (parseError: any) {
            console.error(`[match]: Error parsing Gemini comparison response:`, parseError);
            console.error(`[match]: Raw AI comparison response: ${aiTextResponse}`);
            res.status(500).json({ message: 'Failed to parse AI matching response', error: parseError.message });
            return;
        }

        // --- Return Result --- 
        res.status(200).json({ message: 'Resume matched to job description successfully', analysis: analysisResult });

    } catch (error: any) {
        console.error("[match]: Resume-Job matching error:", error);
        if (error.message.includes('GOOGLE_API_KEY_INVALID')) {
            res.status(500).json({ message: 'Internal Server Error: Invalid Gemini API Key configured.' });
        } else if (error.code === 'permission-denied' || error.status === 'PERMISSION_DENIED') {
            res.status(500).json({ message: 'Internal Server Error: Firebase permission issue.' });
        } else {
            res.status(500).json({ message: 'Internal server error during matching', error: error.message });
        }
    }
}; 