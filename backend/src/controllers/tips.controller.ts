import { Request, Response } from 'express';

// Define a simple structure for a tip
interface Tip {
    id: string;
    category: string;
    content: string;
}

// Mock data for tips
const mockTips: Tip[] = [
    {
        id: 'tip-001',
        category: 'Keywords',
        content: 'Tailor keywords in your resume to match the specific job description. Use tools like the Job Match feature to identify relevant terms.'
    },
    {
        id: 'tip-002',
        category: 'Quantify Achievements',
        content: 'Whenever possible, quantify your accomplishments with numbers and data. Instead of "Improved performance", try "Improved performance by 15% in 6 months".'
    },
    {
        id: 'tip-003',
        category: 'Action Verbs',
        content: 'Start bullet points describing your experience with strong action verbs (e.g., Developed, Managed, Implemented, Led, Created).'
    },
    {
        id: 'tip-004',
        category: 'Formatting',
        content: 'Keep formatting clean, consistent, and easy to read. Use standard fonts and ensure adequate white space. Avoid tables or columns that confuse Applicant Tracking Systems (ATS).'
    },
    {
        id: 'tip-005',
        category: 'Proofread',
        content: 'Always proofread your resume multiple times for typos and grammatical errors. Consider asking someone else to review it as well.'
    },
    {
        id: 'tip-006',
        category: 'Summary/Objective',
        content: 'Write a concise and compelling summary or objective statement at the top, tailored to the job you are applying for.'
    }
];

// Controller function to get tips
export const getTips = async (req: Request, res: Response): Promise<void> => {
    try {
        // In a real implementation, this could fetch personalized tips
        // based on req.user, user profile data, or other context.
        // For now, we just return the mock list.

        console.log('[tips]: Fetching mock tips.');
        res.status(200).json({ tips: mockTips });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("[tips]: Error fetching tips:", error.message);
            res.status(500).json({ message: 'Internal server error fetching tips', error: error.message });
        }
    }
}; 