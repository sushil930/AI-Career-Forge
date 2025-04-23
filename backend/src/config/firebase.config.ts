import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config(); // Ensure env vars are loaded

let db: admin.firestore.Firestore;
let auth: admin.auth.Auth;

try {
    console.log('[firebase-config]: Attempting Firebase Admin SDK initialization...');
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!serviceAccountPath) {
        throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.');
    }
    // Check if already initialized (useful for hot-reloading environments)
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccountPath)
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
    // process.exit(1);
    // Or handle it so controllers get undefined db/auth, which they should check
}

// Export the initialized services
export { db, auth }; 