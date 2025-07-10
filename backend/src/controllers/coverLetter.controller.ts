import { Request, Response } from 'express';

interface ApiError extends Error {
    code?: string;
    status?: number;
    response?: {
        status?: number;
        data?: { message?: string; };
    };
}
import admin from 'firebase-admin';
import { db } from '../config/firebase.config'; // Import Firestore instance
import { Resume } from '../models/resume.model'; // Import Resume interface
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'; // Import Gemini AI

// Initialize Google Generative AI
// Ensure GEMINI_API_KEY is set in your environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // Use the same model as resume analysis

interface CustomRequest extends Request {
    user?: admin.auth.DecodedIdToken;
}

// Controller to handle cover letter generation requests
export const generateCoverLetterController = async (req: CustomRequest, res: Response): Promise<void> => {
    // Ensure user is authenticated (middleware should have already done this)
    if (!req.user || !req.user.uid) {
        res.status(401).json({ message: 'Unauthorized: User not authenticated or UID missing.' });
        return;
    }
    const userId = req.user.uid;

    const { 
        selectedResume, // This is the resume ID
        jobDescription, 
        companyName, 
        roleName, 
        selectedTemplate 
    } = req.body;

    if (!selectedResume || !jobDescription) {
        res.status(400).json({ message: 'Bad Request: Missing selected resume ID or job description.' });
        return;
    }
    
    console.log(`[CoverLetterGen] User: ${userId} attempting to generate cover letter.`);
    console.log(`[CoverLetterGen] Using Resume ID: ${selectedResume}, Company: ${companyName}, Role: ${roleName}, Template: ${selectedTemplate}`);

    try {
        // 1. Fetch resume content based on selectedResume ID and user ID
        const resumeRef = db.collection('resumes').doc(selectedResume);
        const resumeDoc = await resumeRef.get();

        if (!resumeDoc.exists) {
            console.warn(`[CoverLetterGen] Resume not found: ID ${selectedResume} for user ${userId}`);
            res.status(404).json({ message: 'Selected resume not found.' });
            return;
        }

        const resumeData = resumeDoc.data() as Resume;

        // Verify ownership of the resume
        if (resumeData.userId !== userId) {
            console.warn(`[CoverLetterGen] User ${userId} attempted to access unauthorized resume ${selectedResume}`);
            res.status(403).json({ message: 'Forbidden: You do not have permission to use this resume.' });
            return;
        }

        if (!resumeData.parsedText || resumeData.parsedText.trim() === '') {
            console.warn(`[CoverLetterGen] Resume ${selectedResume} has no parsable text for user ${userId}`);
            res.status(400).json({ message: 'Selected resume contains no text to use for generation.' });
            return;
        }

        const resumeContent = resumeData.parsedText;
        console.log(`[CoverLetterGen] Successfully fetched resume content for ${selectedResume}. Length: ${resumeContent.length}`);

        // 2. Construct AI prompt using fetched resume, job details, and template
        let templateInstructions = "Write in a standard professional tone.";
        if (selectedTemplate === "modern") {
            templateInstructions = "Write in a confident, slightly less formal, modern professional tone. Use strong action verbs.";
        } else if (selectedTemplate === "creative") {
            templateInstructions = "Write in a creative and engaging tone. Feel free to use a more unique structure or opening, while still being professional.";
        }

        const prompt = `
          Generate a professional cover letter based *strictly* on the provided resume and job description.
          
          **Instructions:**
          1.  Tailor the letter for the position of **${roleName || '[Role Name]'}** at **${companyName || '[Company Name]'}**.
          2.  Use the tone specified: **${templateInstructions}**
          3.  Highlight relevant skills and experiences from the resume that match the job description.
          4.  Structure it as a standard cover letter (introduction, body paragraphs connecting experience to the role, conclusion).
          5.  Do **NOT** invent skills or experiences not present in the resume.
          6.  Address it generically (e.g., "Dear Hiring Manager,") unless a specific name is implied in the job description (which is unlikely here).
          7.  Conclude professionally (e.g., "Sincerely,").
          8.  The final output should be **ONLY** the full text of the cover letter, with appropriate paragraph breaks (using \\n\\n). Do **NOT** include any surrounding text, commentary, markdown formatting like \`\`, or labels.
          
          **Resume Content:**
          --- START RESUME ---
          ${resumeContent}
          --- END RESUME ---
          
          **Job Description:**
          --- START JOB DESCRIPTION ---
          ${jobDescription}
          --- END JOB DESCRIPTION ---
          
          **Generated Cover Letter Text Only:**
        `;
        
        console.log(`[CoverLetterGen] Prompt constructed for Gemini. Template: ${selectedTemplate}`);
        
        // 3. Call AI service to generate the cover letter
        const generationConfig = {
            temperature: 0.6, // Slightly more creative than resume analysis
            topK: 1,
            topP: 0.95,
            maxOutputTokens: 3072, // Allow for longer cover letter text
        };
        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];
        
        const result = await model.generateContent(
            prompt
            // Pass config if needed: { generationConfig, safetySettings }
        );
        const response = await result.response;
        const generatedCoverLetter = response.text();
        
        if (!generatedCoverLetter || generatedCoverLetter.trim() === '') {
            console.error(`[CoverLetterGen] Gemini returned empty response for user ${userId}, resume ${selectedResume}`);
            throw new Error('AI generation resulted in an empty cover letter.');
        }
        
        console.log(`[CoverLetterGen] Received cover letter from Gemini. Length: ${generatedCoverLetter.length}`);
        
        // TODO: 4. (Optional) Save the generated letter
        
        res.status(200).json({
            message: "Cover letter generated successfully",
            generatedCoverLetter: generatedCoverLetter.trim(), // Trim whitespace from AI response
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`[CoverLetterGen] Error for user ${req.user?.uid}, resume ${req.body.selectedResume}:`, error.message);
            let errorMessage = 'Failed to generate cover letter due to an internal error.';
            if (error.message.includes('GOOGLE_API_KEY_INVALID') || error.message.includes('API key not valid')) {
                errorMessage = 'Internal Server Error: Invalid Gemini API Key configured.';
            } else if (error.message.includes('429') || error.message.includes('rate limit')) {
                errorMessage = 'AI service is busy. Please try again in a moment.';
            } else if ((error as ApiError).code === 'permission-denied') {
                errorMessage = 'Database permission error while fetching resume.';
            } else if (error.message.includes('AI generation resulted in an empty')) {
                errorMessage = error.message; // Use the specific error message
            } else if ((error as ApiError).response?.status === 500) {
                const apiError = error as ApiError;
                if (apiError.response?.data && typeof apiError.response.data === 'object' && 'message' in apiError.response.data) {
                    errorMessage = `AI Service Error: ${(apiError.response.data as { message: string }).message}`;
                }
            }
            res.status(500).json({ message: errorMessage });
        }
    }
}; 