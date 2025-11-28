/**
 * OAuth Configuration
 *
 * Handles OAuth authentication strategies (Google, etc.)
 */

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// NOTE: OAuth is now handled by Firebase Auth. This passport implementation is legacy.
// TODO: Remove passport OAuth and use Firebase Auth OAuth providers instead.
import { getFirestore } from './firebase.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback';

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn('⚠️  Google OAuth credentials not configured. Google sign-in will not be available.');
}

/**
 * Configure Google OAuth Strategy
 * 
 * NOTE: OAuth is now handled by Firebase Auth. This passport implementation is disabled.
 * The routes in index.ts should be updated to use Firebase Auth OAuth providers instead.
 */
if (false && GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  // Disabled - using Firebase Auth for OAuth now
  // passport.use(new GoogleStrategy(...));
}

/**
 * Serialize user for session
 */
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

/**
 * Deserialize user from session
 * 
 * NOTE: Disabled - using Firebase Auth now. Sessions are handled by Firebase.
 */
passport.deserializeUser(async (id: string, done) => {
  // Disabled - using Firebase Auth
  done(new Error('Passport OAuth is disabled. Use Firebase Auth instead.'), null);
});

export { passport };
