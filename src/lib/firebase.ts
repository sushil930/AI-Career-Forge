// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore"; // Add if you need client-side Firestore access
// import { getStorage } from "firebase/storage";   // Add if you need client-side Storage access

// Your web app's Firebase configuration from environment variables
// Ensure VITE_ prefix for Vite projects
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate that config values are present
if (
    !firebaseConfig.apiKey ||
    !firebaseConfig.authDomain ||
    !firebaseConfig.projectId ||
    !firebaseConfig.appId
) {
    console.error("Error: Missing Firebase configuration values in environment variables.");
    console.error("Please ensure VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, and VITE_FIREBASE_APP_ID are set in your .env file.");
    // Depending on your app's needs, you might throw an error or handle this differently
}

// Initialize Firebase
let app: FirebaseApp;
try {
    app = initializeApp(firebaseConfig);
    console.log("Firebase Client SDK initialized successfully.");
} catch (error) {
    console.error("Error initializing Firebase Client SDK:", error);
    // Handle initialization error appropriately
    throw error; // Rethrow or handle gracefully
}

// Get Firebase services
const auth: Auth = getAuth(app);
// const db = getFirestore(app); // Initialize Firestore if needed
// const storage = getStorage(app); // Initialize Storage if needed

// Export the initialized services
export { app, auth /*, db, storage */ }; 