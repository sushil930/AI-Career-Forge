import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// Firebase admin import might not be needed here anymore if init is handled elsewhere
// import admin from 'firebase-admin'; 

// Import routes
import authRoutes from './routes/auth.routes';
import resumeRoutes from './routes/resume.routes'; // Import resume routes
import builderRoutes from './routes/builder.routes'; // Import builder routes
import matchRoutes from './routes/match.routes'; // Import match routes
import tipsRoutes from './routes/tips.routes'; // Import tips routes
import coverLetterRoutes from './routes/coverLetter.routes'; // Import the new routes
import activityRoutes from './routes/activity.routes'; // Import activity routes

dotenv.config(); // Load environment variables from .env file

// --- Firebase Admin SDK Initialization REMOVED (handled in config/firebase.config.ts) ---
// try { ... } catch { ... } block removed
// ------------------------------------------------------------------------------------

const app: Express = express();
const port = process.env.PORT || 3001; // Default to 3001 if PORT not in .env

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL, // Allow requests from the frontend URL specified in .env
    credentials: true, // Optional: If you need to send cookies or authorization headers
}));
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// API Routes
app.use('/api/auth', authRoutes); // Use auth routes under /api/auth
app.use('/api/resumes', resumeRoutes); // Use resume routes under /api/resumes
app.use('/api/builder', builderRoutes); // Use builder routes under /api/builder
app.use('/api/match', matchRoutes); // Use match routes under /api/match
app.use('/api/tips', tipsRoutes); // Use tips routes under /api/tips
app.use('/api/cover-letter', coverLetterRoutes); // Use the new routes
app.use('/api/activity', activityRoutes); // Use activity routes

// Basic route
app.get('/', (req: Request, res: Response) => {
    res.send('AI Resume Pro Backend is running!');
});

// Start the server only if running directly (not imported as a module)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}

export default app; // Export the app instance for testing 