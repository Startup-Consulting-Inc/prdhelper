/**
 * Firebase Admin SDK Initialization
 *
 * This module initializes the Firebase Admin SDK for server-side operations:
 * - Firestore database access
 * - Firebase Authentication verification
 * - Admin-level operations
 */

import admin from 'firebase-admin';
import { createRequire } from 'module';
import { logger } from './logger.js';

const require = createRequire(import.meta.url);

let firebaseApp: admin.app.App | null = null;
let firestoreInstance: admin.firestore.Firestore | null = null;

/**
 * Initialize Firebase Admin SDK
 *
 * In production: Uses Application Default Credentials from Secret Manager
 * In development: Uses service account key file from local filesystem
 */
export function initializeFirebase(): admin.app.App {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    // Check if service account key is provided via environment variable (from Secret Manager)
    const serviceAccountKey = process.env.FIREBASE_ADMIN_SDK_KEY;
    
    if (serviceAccountKey) {
      // Production: Use service account key from Secret Manager
      logger.info('Initializing Firebase Admin SDK with service account key from Secret Manager');
      
      let serviceAccount: admin.ServiceAccount;
      try {
        // Parse the JSON string from Secret Manager
        // Handle both raw JSON and base64 encoded JSON
        if (typeof serviceAccountKey === 'string') {
          if (serviceAccountKey.trim().startsWith('{')) {
            serviceAccount = JSON.parse(serviceAccountKey);
          } else {
            // Try base64 decoding if it doesn't look like JSON
            const decoded = Buffer.from(serviceAccountKey, 'base64').toString('utf-8');
            if (decoded.trim().startsWith('{')) {
              serviceAccount = JSON.parse(decoded);
            } else {
              // Fallback: assume it's a path or invalid, try parsing original string
              serviceAccount = JSON.parse(serviceAccountKey); 
            }
          }
        } else {
          serviceAccount = serviceAccountKey;
        }
      } catch (parseError) {
        logger.error({ error: parseError }, 'Failed to parse FIREBASE_ADMIN_SDK_KEY');
        throw new Error('FIREBASE_ADMIN_SDK_KEY must be valid JSON');
      }

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT_ID || serviceAccount.projectId,
      });
    } else if (process.env.NODE_ENV === 'production') {
      // Production fallback: Use Application Default Credentials
      // Cloud Run service account must have Firebase Admin permissions
      logger.info('Initializing Firebase Admin SDK with Application Default Credentials');

      firebaseApp = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT_ID,
      });
    } else {
      // Development: Use service account key file
      logger.info('Initializing Firebase Admin SDK with service account key file');

      const serviceAccountPath = process.env.FIREBASE_ADMIN_SDK_KEY_PATH;

      if (!serviceAccountPath) {
        throw new Error(
          'FIREBASE_ADMIN_SDK_KEY_PATH environment variable is required in development. ' +
          'Run: terraform output -raw firebase_admin_key_base64 | base64 -d > serviceAccountKey.json'
        );
      }

      // Import service account key (Node.js require-style)
      // TypeScript will handle the import at build time
      const serviceAccount = require(serviceAccountPath);

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT_ID,
      });
    }

    logger.info({
      projectId: firebaseApp.options.projectId,
    }, 'Firebase Admin SDK initialized successfully');

    return firebaseApp;
  } catch (error) {
    logger.error({ error }, 'Failed to initialize Firebase Admin SDK');
    throw error;
  }
}

/**
 * Get Firestore instance
 *
 * @returns Firestore database instance
 */
export function getFirestore(): admin.firestore.Firestore {
  // Return cached instance if available
  if (firestoreInstance) {
    return firestoreInstance;
  }

  if (!firebaseApp) {
    initializeFirebase();
  }

  const databaseId = process.env.FIRESTORE_DATABASE_ID || '(default)';
  
  // Get Firestore instance
  // Note: For named databases, use the firebase-admin/firestore import
  let db: admin.firestore.Firestore;
  if (databaseId === '(default)') {
    db = admin.firestore(firebaseApp as admin.app.App);
  } else {
    // For named databases, we need to use the modular API
    // Import getFirestore from firebase-admin/firestore for named database support
    const { getFirestore: getFirestoreDb } = require('firebase-admin/firestore');
    db = getFirestoreDb(firebaseApp, databaseId);
  }

  // Configure Firestore settings (can only be called once)
  db.settings({
    ignoreUndefinedProperties: true, // Ignore undefined values in documents
  });

  // Cache the instance
  firestoreInstance = db;

  return db;
}

/**
 * Get Firebase Auth instance
 *
 * @returns Firebase Auth instance for user management
 */
export function getAuth(): admin.auth.Auth {
  if (!firebaseApp) {
    initializeFirebase();
  }

  return admin.auth();
}

/**
 * Get Firebase Storage instance
 *
 * @returns Firebase Storage instance (uses existing GCS bucket)
 */
export function getStorage(): admin.storage.Storage {
  if (!firebaseApp) {
    initializeFirebase();
  }

  return admin.storage();
}

/**
 * Verify Firebase ID token
 *
 * @param idToken - Firebase ID token from client
 * @returns Decoded token with user information
 */
export async function verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  const auth = getAuth();

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    logger.error({ error }, 'Failed to verify Firebase ID token');
    throw new Error('Invalid or expired token');
  }
}

/**
 * Create custom token for user
 *
 * @param uid - User ID
 * @param claims - Optional custom claims
 * @returns Custom token string
 */
export async function createCustomToken(
  uid: string,
  claims?: object
): Promise<string> {
  const auth = getAuth();

  try {
    const customToken = await auth.createCustomToken(uid, claims);
    return customToken;
  } catch (error) {
    logger.error({ error, uid }, 'Failed to create custom token');
    throw error;
  }
}

/**
 * Get user by email
 *
 * @param email - User email address
 * @returns User record
 */
export async function getUserByEmail(email: string): Promise<admin.auth.UserRecord> {
  const auth = getAuth();

  try {
    const userRecord = await auth.getUserByEmail(email);
    return userRecord;
  } catch (error) {
    logger.error({ error, email }, 'Failed to get user by email');
    throw error;
  }
}

/**
 * Batch get users
 *
 * @param uids - Array of user IDs
 * @returns Array of user records
 */
export async function getUsers(uids: string[]): Promise<admin.auth.UserRecord[]> {
  const auth = getAuth();

  try {
    const getUsersResult = await auth.getUsers(uids.map(uid => ({ uid })));
    return getUsersResult.users;
  } catch (error) {
    logger.error({ error, uids }, 'Failed to batch get users');
    throw error;
  }
}

// Export admin for direct access if needed
export { admin };

// Export Firestore types for convenience
export type { Firestore, DocumentReference, CollectionReference, Query, QuerySnapshot, DocumentSnapshot, FieldValue, Timestamp } from 'firebase-admin/firestore';
export type { DecodedIdToken, UserRecord } from 'firebase-admin/auth';
