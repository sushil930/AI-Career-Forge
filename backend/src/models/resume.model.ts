import admin from 'firebase-admin';

export interface Resume {
    id?: string; // Document ID
    userId: string; // ID of the user who uploaded the resume
    originalFilename: string; // Original name of the uploaded file
    parsedText: string; // Extracted text content
    uploadTimestamp: admin.firestore.Timestamp; // When the file was uploaded
    analysis?: { // Optional: To store results from Phase 3
        overallScore?: number;
        categoryScores?: { [key: string]: number };
        suggestions?: string[];
        highlights?: string[];
        analysisTimestamp?: admin.firestore.Timestamp;
    };
    // Add any other relevant fields later, e.g., file storage path if not just using text
} 