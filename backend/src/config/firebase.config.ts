import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

// Ensure env vars are loaded
dotenv.config();

let db: admin.firestore.Firestore;
let auth: admin.auth.Auth;

try {
    console.log('[firebase-config]: Attempting Firebase Admin SDK initialization...');
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!serviceAccountPath) {
        throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.');
    }

    // Resolve absolute path in case relative path is provided
    const resolvedPath = path.resolve(serviceAccountPath);

    // Check if already initialized (useful for hot-reloading environments)
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(resolvedPath)
        });
        console.log('[firebase-config]: Firebase Admin SDK initialized successfully.');
    } else {
        console.log('[firebase-config]: Firebase Admin SDK already initialized.');
    }

    // Get the initialized services
    db = admin.firestore();
    auth = admin.auth();

} catch (error) {
    console.error('[firebase-config]: FATAL Error initializing Firebase Admin SDK:', error);
    // Optional: Rethrow or exit to prevent the app from starting in a broken state
    throw error;
}

// Export the initialized services
export { db, auth };