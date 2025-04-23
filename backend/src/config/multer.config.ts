import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

// Define allowed mime types
const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // DOCX
];

// Configure file filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.')); // Reject file
        // Note: It's often better to handle this error gracefully in the controller or an error handling middleware
    }
};

// Configure multer storage (using memory storage for simplicity)
const storage = multer.memoryStorage();

// Create multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // Limit file size to 10MB
    }
});

export default upload; 