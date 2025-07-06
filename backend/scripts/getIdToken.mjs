// backend/scripts/getIdToken.mjs

// IMPORTANT: Replace with your actual Firebase client config values!
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// IMPORTANT: Replace with the email/password of a user you created
// via the signup endpoint or directly in the Firebase console.
const userEmail = process.env.USER_EMAIL; // The email you used to sign up
const userPassword = process.env.USER_PASSWORD; // The password for that user

// --- Script Logic ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
async function getFirebaseIdToken() {
  try {
    console.log("Initializing Firebase Client SDK...");
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    console.log(`Attempting to sign in as ${userEmail}...`);

    const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword);
    const user = userCredential.user;
    console.log(`Successfully signed in as ${user.email} (UID: ${user.uid})`);

    console.log("Requesting ID Token...");
    const idToken = await user.getIdToken();
    console.log("\n--- Firebase ID Token ---");
    console.log(idToken); // Print the token to the console
    console.log("-------------------------\n");
    console.log("Copy the long token string above (starts with 'ey...') and use it in Postman's Authorization header (Bearer Token).");

  } catch (error) {
    console.error("\n--- Error getting ID token ---");
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.message);
    console.error("----------------------------\n");
    console.error("Check your firebaseConfig values and user credentials in getIdToken.mjs");
  }
}

getFirebaseIdToken();
