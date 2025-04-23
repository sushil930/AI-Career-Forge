import admin from 'firebase-admin';

// Define structure for the input data used to generate the resume
export interface ResumeInputData {
    personalInfo: {
        name: string;
        email: string;
        phone?: string;
        linkedin?: string;
        portfolio?: string;
        address?: string;
    };
    summary?: string; // Optional professional summary
    education: {
        institution: string;
        degree: string;
        fieldOfStudy?: string;
        startDate?: string; // e.g., "YYYY-MM"
        endDate?: string;   // e.g., "YYYY-MM" or "Present"
        details?: string[]; // e.g., GPA, relevant coursework
    }[];
    experience: {
        jobTitle: string;
        company: string;
        location?: string;
        startDate: string; // e.g., "YYYY-MM"
        endDate: string;   // e.g., "YYYY-MM" or "Present"
        responsibilities: string[]; // Bullet points describing duties/achievements
    }[];
    skills: {
        category?: string; // e.g., "Programming Languages", "Software", "Soft Skills"
        items: string[];
    }[];
    certifications?: {
        name: string;
        issuingOrganization?: string;
        dateObtained?: string; // e.g., "YYYY-MM"
    }[];
    projects?: {
        name: string;
        description: string;
        technologies?: string[];
        link?: string;
    }[];
    targetJobRole?: string; // Optional target job role name
    targetJobDescription?: string; // Optional pasted job description
    // Add other sections as needed (e.g., awards, publications)
}

// Define structure for the Firestore document
export interface GeneratedResume {
    id?: string; // Document ID
    userId: string;
    inputData: ResumeInputData; // The structured data used for generation
    generatedText: string; // The raw text output from the AI
    // Consider adding a more structured version if AI can provide it reliably
    // structuredOutput?: any; 
    version: number; // For potential future versioning
    createdAt: admin.firestore.Timestamp;
} 