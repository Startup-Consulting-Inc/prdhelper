/**
 * Firebase Client SDK Initialization
 *
 * This module initializes the Firebase client SDK for frontend operations:
 * - Firebase Authentication
 * - Client-side auth state management
 */

import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator,
  type Auth,
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type UserCredential,
} from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth: Auth = getAuth(app);

// Connect to Auth emulator in development (optional)
if (import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST) {
  const emulatorHost = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST;
  const [host, port] = emulatorHost.split(':');
  connectAuthEmulator(auth, `http://${host}:${port}`);
  console.log('Connected to Firebase Auth Emulator:', emulatorHost);
}

// Google OAuth provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account', // Always show account selection
});

/**
 * Sign in with email and password
 *
 * @param email - User email
 * @param password - User password
 * @returns User credential with ID token
 */
export async function signIn(
  email: string,
  password: string
): Promise<UserCredential> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);

  // Get ID token for API calls
  const idToken = await userCredential.user.getIdToken();
  localStorage.setItem('firebaseToken', idToken);

  return userCredential;
}

/**
 * Sign up with email and password
 *
 * @param email - User email
 * @param password - User password
 * @returns User credential
 */
export async function signUp(
  email: string,
  password: string
): Promise<UserCredential> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  // Get ID token for API calls
  const idToken = await userCredential.user.getIdToken();
  localStorage.setItem('firebaseToken', idToken);

  return userCredential;
}

/**
 * Sign in with Google OAuth
 *
 * @returns User credential
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  const result = await signInWithPopup(auth, googleProvider);

  // Get ID token for API calls
  const idToken = await result.user.getIdToken();
  localStorage.setItem('firebaseToken', idToken);

  return result;
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
  localStorage.removeItem('firebaseToken');
}

/**
 * Send email verification to current user
 *
 * @param user - Current Firebase user
 */
export async function sendVerificationEmail(user: User): Promise<void> {
  await sendEmailVerification(user);
}

/**
 * Send password reset email
 *
 * @param email - User email
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Update user password
 *
 * @param user - Current Firebase user
 * @param newPassword - New password
 */
export async function changePassword(user: User, newPassword: string): Promise<void> {
  await updatePassword(user, newPassword);
}

/**
 * Update user profile
 *
 * @param user - Current Firebase user
 * @param profile - Profile data to update
 */
export async function updateUserProfile(
  user: User,
  profile: { displayName?: string; photoURL?: string }
): Promise<void> {
  await updateProfile(user, profile);
}

/**
 * Get current user's ID token
 *
 * @param forceRefresh - Force refresh token
 * @returns ID token string or null if not authenticated
 */
export async function getIdToken(forceRefresh = false): Promise<string | null> {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return null;
  }

  const idToken = await currentUser.getIdToken(forceRefresh);
  localStorage.setItem('firebaseToken', idToken);

  return idToken;
}

/**
 * Get ID token from localStorage (synchronous)
 *
 * @returns ID token string or null
 */
export function getStoredIdToken(): string | null {
  return localStorage.getItem('firebaseToken');
}

/**
 * Subscribe to auth state changes
 *
 * @param callback - Callback function called on auth state change
 * @returns Unsubscribe function
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Update stored token on auth state change
      const token = await user.getIdToken();
      localStorage.setItem('firebaseToken', token);
    } else {
      // Clear token on sign out
      localStorage.removeItem('firebaseToken');
    }

    callback(user);
  });
}

/**
 * Check if user is authenticated
 *
 * @returns True if user is authenticated
 */
export function isAuthenticated(): boolean {
  return auth.currentUser !== null;
}

/**
 * Get current user
 *
 * @returns Current Firebase user or null
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Token refresh mechanism
 *
 * Firebase ID tokens expire after 1 hour. This mechanism automatically
 * refreshes the token every 50 minutes to prevent expiration.
 */
let tokenRefreshInterval: NodeJS.Timeout | null = null;

/**
 * Start automatic token refresh
 *
 * Refreshes Firebase ID token every 50 minutes to prevent expiration.
 * Should be called when user signs in.
 */
export function startTokenRefresh(): void {
  // Clear any existing interval
  if (tokenRefreshInterval) {
    clearInterval(tokenRefreshInterval);
  }

  let refreshFailureCount = 0;
  const MAX_REFRESH_FAILURES = 3;

  // Refresh token every 50 minutes (3000000ms)
  // Tokens expire after 1 hour, so 50 minutes provides a safety margin
  tokenRefreshInterval = setInterval(async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const newToken = await currentUser.getIdToken(true); // Force refresh
        localStorage.setItem('firebaseToken', newToken);
        console.log('Firebase token refreshed automatically');
        refreshFailureCount = 0; // Reset on success
      } catch (error) {
        refreshFailureCount++;
        console.error(`Automatic token refresh failed (attempt ${refreshFailureCount}/${MAX_REFRESH_FAILURES}):`, error);
        // Only sign out after multiple consecutive failures to avoid
        // logging out users due to transient network issues
        if (refreshFailureCount >= MAX_REFRESH_FAILURES) {
          console.error('Token refresh failed too many times, signing out');
          await signOut();
        }
      }
    }
  }, 50 * 60 * 1000); // 50 minutes in milliseconds
}

/**
 * Stop automatic token refresh
 *
 * Should be called when user signs out.
 */
export function stopTokenRefresh(): void {
  if (tokenRefreshInterval) {
    clearInterval(tokenRefreshInterval);
    tokenRefreshInterval = null;
  }
}

// Export Firebase instances
export { app, auth, googleProvider };

// Export Firebase types for convenience
export type { User, UserCredential, Auth };
