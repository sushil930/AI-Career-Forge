import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
// Import controller and multer config
import { uploadResume, analyzeResume, getUploadedResumes } from '../controllers/resume.controller';
import upload from '../config/multer.config'; // Import the configured multer instance

const router = Router();

// GET /api/resumes - Get list of uploaded resumes for the user
router.get(
    '/', // Root path relative to /api/resumes
    authenticateToken,
    getUploadedResumes
);

// POST /api/resumes/upload - Upload and parse a resume
router.post(
    '/upload',
    authenticateToken, // First, ensure user is authenticated
    upload.single('resumeFile'), // Then, handle single file upload named 'resumeFile'
    uploadResume // Finally, process the uploaded file
);

// POST /api/resumes/:resumeId/analyze - Analyze a specific resume
router.post(
    '/:resumeId/analyze',
    authenticateToken, // Ensure user is authenticated
    analyzeResume // Call the analysis controller function
);

// TODO: Add other resume routes later (e.g., GET /api/resumes/:id)

export default router; 