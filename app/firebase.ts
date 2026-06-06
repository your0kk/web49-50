import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * Initialize Firebase using environment variables.  The Vite build
 * system exposes variables that begin with VITE_ from your `.env`
 * file.  To configure authentication create a `.env` file at the
 * project root with your Firebase project credentials prefixed by
 * `VITE_`:
 *
 * ```env
 * VITE_FIREBASE_API_KEY=your_key
 * VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
 * VITE_FIREBASE_PROJECT_ID=your_project_id
 * VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
 * VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
 * VITE_FIREBASE_APP_ID=your_app_id
 * ```
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
/**
 * Shared Firebase authentication instance.  Import this from any
 * module that needs to access the current user or perform login,
 * registration or logout operations.
 */
export const auth = getAuth(app);