import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
// Import controller
import { generateResume, downloadGeneratedResume, getGeneratedResumes } from '../controllers/builder.controller';

const router = Router();

// GET /api/builder/generated - Get list of generated resumes for the user
router.get(
    '/generated',
    authenticateToken,
    getGeneratedResumes
);

// POST /api/builder/generate - Generate a resume based on input data
router.post(
    '/generate',
    authenticateToken, // Ensure user is authenticated
    generateResume // Use the controller function
);

// GET /api/builder/download/:generatedResumeId - Download a generated resume as PDF
router.get(
    '/download/:generatedResumeId',
    authenticateToken, // Ensure user is authenticated
    downloadGeneratedResume // Use the download controller function
);

export default router; 