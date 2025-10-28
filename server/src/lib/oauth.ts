/**
 * OAuth Configuration
 *
 * Handles OAuth authentication strategies (Google, etc.)
 */

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from './db.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback';

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn('⚠️  Google OAuth credentials not configured. Google sign-in will not be available.');
}

/**
 * Configure Google OAuth Strategy
 */
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists with this Google account
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: 'google',
                providerAccountId: profile.id,
              },
            },
            include: {
              user: true,
            },
          });

          if (existingAccount) {
            // User already exists, return user
            return done(null, existingAccount.user);
          }

          // Check if user with this email already exists
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email provided by Google'));
          }

          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            // Email exists but not linked to Google - link it
            await prisma.account.create({
              data: {
                userId: user.id,
                type: 'oauth',
                provider: 'google',
                providerAccountId: profile.id,
                access_token: accessToken,
                refresh_token: refreshToken,
                token_type: 'Bearer',
                scope: 'profile email',
              },
            });
          } else {
            // Create new user with Google account
            user = await prisma.user.create({
              data: {
                email,
                name: profile.displayName || email.split('@')[0],
                image: profile.photos?.[0]?.value,
                emailVerified: new Date(), // Google emails are verified
                accounts: {
                  create: {
                    type: 'oauth',
                    provider: 'google',
                    providerAccountId: profile.id,
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    token_type: 'Bearer',
                    scope: 'profile email',
                  },
                },
              },
            });
          }

          return done(null, user);
        } catch (error) {
          console.error('Google OAuth error:', error);
          return done(error as Error);
        }
      }
    )
  );
}

/**
 * Serialize user for session
 */
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

/**
 * Deserialize user from session
 */
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export { passport };
