import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
// Import controller
import { matchResumeToJob } from '../controllers/match.controller';

const router = Router();

// POST /api/match/resume-job - Compare a resume (by ID or text) to a job description
router.post(
    '/resume-job',
    authenticateToken, // Ensure user is authenticated
    matchResumeToJob // Use the controller function
);

export default router; 