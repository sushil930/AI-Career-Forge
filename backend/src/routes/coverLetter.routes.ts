import { Router } from 'express';
import { generateCoverLetterController } from '../controllers/coverLetter.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// POST /api/cover-letter/generate - Generate a cover letter
router.post('/generate', requireAuth, generateCoverLetterController);

export default router; 