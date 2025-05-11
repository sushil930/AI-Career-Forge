import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import upload from '../config/multer.config'; // Import multer configuration
// Import controller
import { matchResumeToJob } from '../controllers/match.controller';

const router = Router();

// POST /api/match/resume-job - Compare a resume (file or text) to a job description
router.post(
    '/resume-job',
    authenticateToken, // Ensure user is authenticated
    upload.single('resumeFile'), // Handle single file upload named 'resumeFile'
    matchResumeToJob // Use the controller function
);

export default router; 