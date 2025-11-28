/**
 * tRPC Context
 *
 * Creates the context object that is available in all tRPC procedures.
 * Includes Firestore database client and authenticated user information.
 */

import type { Request, Response } from 'express';
import type { Firestore, DecodedIdToken } from '../firebase.js';
import { getFirestore, getAuth, verifyIdToken } from '../firebase.js';
import { logger } from '../logger.js';
import admin from 'firebase-admin';

/**
 * User type from Firestore
 */
export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image: string | null;
  role: 'USER' | 'ADMIN';
  modePreference: 'PLAIN' | 'TECHNICAL';
  bio: string | null;
  company: string | null;
  jobTitle: string | null;
  linkedInUrl: string | null;
  websiteUrl: string | null;
  location: string | null;
  githubUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Context interface available in all tRPC procedures
 */
export interface Context {
  db: Firestore;
  auth: ReturnType<typeof getAuth>;
  user: User | null;
  firebaseUser: DecodedIdToken | null;
  req: Request;
  res: Response;
}

/**
 * Extract Firebase ID token from Authorization header
 *
 * @param authorization - Authorization header value
 * @returns ID token string or null
 */
function extractTokenFromHeader(authorization: string | undefined): string | null {
  if (!authorization) {
    return null;
  }

  // Expected format: "Bearer <token>"
  const parts = authorization.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Create context for each request
 * Extracts and verifies Firebase ID token, fetches user from Firestore
 */
export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<Context> {
  const db = getFirestore();
  const auth = getAuth();

  // Extract token from Authorization header
  const token = extractTokenFromHeader(req.headers.authorization);

  let user: User | null = null;
  let firebaseUser: DecodedIdToken | null = null;

  if (token) {
    try {
      // Verify Firebase ID token
      firebaseUser = await verifyIdToken(token);

      if (firebaseUser) {
        // Fetch user document from Firestore
        const userDoc = await db.collection('users').doc(firebaseUser.uid).get();

        if (userDoc.exists) {
          const data = userDoc.data();

          if (data) {
            user = {
              id: userDoc.id,
              email: data.email,
              name: data.name,
              emailVerified: data.emailVerified ?? false,
              image: data.image ?? null,
              role: data.role ?? 'USER',
              modePreference: data.modePreference ?? 'PLAIN',
              bio: data.bio ?? null,
              company: data.company ?? null,
              jobTitle: data.jobTitle ?? null,
              linkedInUrl: data.linkedInUrl ?? null,
              websiteUrl: data.websiteUrl ?? null,
              location: data.location ?? null,
              githubUrl: data.githubUrl ?? null,
              createdAt: data.createdAt?.toDate() ?? new Date(),
              updatedAt: data.updatedAt?.toDate() ?? new Date(),
            };
          }
        } else {
          // AUTO-CREATE user document if Firebase user exists but Firestore doc doesn't
          // This serves as a safety net for edge cases where document creation failed
          logger.warn({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          }, 'User document not found in Firestore - auto-creating');

          const userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.name || firebaseUser.email?.split('@')[0] || 'User',
            role: 'USER' as const,
            modePreference: 'PLAIN' as const,
            image: firebaseUser.picture || null,
            bio: null,
            company: null,
            jobTitle: null,
            linkedInUrl: null,
            websiteUrl: null,
            location: null,
            githubUrl: null,
            emailVerified: firebaseUser.email_verified ?? false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          };

          try {
            // Create the document in Firestore
            await db.collection('users').doc(firebaseUser.uid).set(userData);

            // Set user object for context (convert timestamps to Date for type safety)
            user = {
              ...userData,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            logger.info({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
            }, 'Auto-created user document in Firestore');

            // Create audit log for auto-creation
            await db.collection('auditLogs').add({
              userId: firebaseUser.uid,
              userName: userData.name,
              action: 'USER_DOCUMENT_AUTO_CREATED',
              details: {
                email: userData.email,
                name: userData.name,
                reason: 'Firebase user exists but Firestore document missing',
              },
              ipAddress: req.ip || req.socket.remoteAddress || null,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          } catch (error) {
            logger.error({
              error,
              uid: firebaseUser.uid,
            }, 'Failed to auto-create user document');
          }
        }
      }
    } catch (error) {
      // Token verification failed, user remains null
      logger.error({ error }, 'Firebase token verification error:');
    }
  }

  return {
    db,
    auth,
    user,
    firebaseUser,
    req,
    res,
  };
}

export type AppContext = Awaited<ReturnType<typeof createContext>>;
