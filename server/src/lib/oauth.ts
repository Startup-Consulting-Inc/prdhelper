/**
 * OAuth Configuration
 *
 * Handles OAuth authentication strategies (Google, etc.)
 */

import passport from 'passport';
// NOTE: OAuth is now handled by Firebase Auth. This passport implementation is legacy.
// Passport is still exported for backward compatibility with existing routes in index.ts,
// but the OAuth strategy is disabled. Consider removing passport entirely in the future.

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
