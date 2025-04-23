import { Router } from 'express';
// Import controller
import { getTips } from '../controllers/tips.controller';
// Import middleware if authentication is needed later
// import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// GET /api/tips - Fetch general resume tips
router.get(
    '/', 
    // authenticateToken, // Add this later if tips become personalized
    getTips 
);

export default router; 