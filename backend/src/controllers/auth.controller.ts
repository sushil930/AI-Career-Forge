import { Request, Response } from 'express';
// Import initialized services from config
import { db, auth } from '../config/firebase.config';
import admin from 'firebase-admin'; // Still needed for admin.firestore.FieldValue

// Define CustomRequest interface
interface CustomRequest extends Request {
    user?: admin.auth.DecodedIdToken;
}

// const db = admin.firestore(); // Removed: Use imported db

// Placeholder for signup function
export const signup = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { email, password, displayName } = req.body;

        // Basic validation
        if (!email || !password || !displayName) {
            res.status(400).json({ message: 'Missing required fields: email, password, displayName' });
            return;
        }

        // Use imported auth service
        const userRecord = await auth.createUser({
            email,
            password,
            displayName,
        });

        // Use imported db service
        // Note: Need admin namespace for FieldValue type
        await db.collection('users').doc(userRecord.uid).set({
            email: userRecord.email,
            displayName: userRecord.displayName,
            createdAt: admin.firestore.FieldValue.serverTimestamp(), // Keep admin namespace for FieldValue
        });

        console.log(`Successfully created new user: ${userRecord.email} (${userRecord.uid})`);
        // Respond with user info (excluding sensitive data like password)
        res.status(201).json({
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Signup error:", error.message);
            // Handle specific Firebase Auth errors (e.g., email already exists)
            const err = error as { code?: string; message: string };
            if (err.code === 'auth/email-already-exists') {
                res.status(409).json({ message: 'Email already in use.' }); // 409 Conflict
            } else {
                res.status(500).json({ message: 'Internal server error during signup', error: err.message });
            }
        }
    }
};

// Actual login function (placeholder implementation)
export const login = async (req: CustomRequest, res: Response): Promise<void> => {
    // Note: Firebase Auth login is typically handled client-side.
    // The backend usually verifies the ID token sent by the client after login.
    // This endpoint might be used for custom logic or session management if needed,
    // but often isn't strictly necessary when using Firebase client-side auth.
    console.warn("[auth]: /login endpoint hit - usually not needed with Firebase client-side auth.");
    res.status(501).json({ message: 'Login endpoint not typically implemented for Firebase Auth; verify ID token instead.' });
    // No try/catch needed for this simple placeholder
}; 