// backend/scripts/getIdToken.js

// IMPORTANT: Replace with your actual Firebase client config values!
const firebaseConfig = {
  apiKey: "AIzaSyDtSgOc-KP0GQswqKF6XKkJyyu9vb-FrHg",
  authDomain: "rps-db-2ed0f.firebaseapp.com",
  projectId: "rps-db-2ed0f",
  storageBucket: "rps-db-2ed0f.firebasestorage.app",
  messagingSenderId: "636556352171",
  appId: "1:636556352171:web:e67188d5eddacc884cb5ee"
};

// IMPORTANT: Replace with the email/password of a user you created
// via the signup endpoint or directly in the Firebase console.
const userEmail = "testuser2@example.com"; // The email you used to sign up
const userPassword = "password123"; // The password for that user

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
    console.error("Check your firebaseConfig values and user credentials in getIdToken.js");
  }
}

getFirebaseIdToken();
