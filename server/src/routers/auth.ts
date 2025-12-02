/**
 * Authentication Router (Firebase Auth)
 *
 * tRPC router for authentication operations with Firebase Authentication:
 * - User registration (creates Firestore user document)
 * - Profile management
 * - Account deletion
 *
 * Note: Most authentication operations (login, password reset, email verification)
 * are handled client-side with Firebase Auth SDK. This router focuses on
 * server-side user data management in Firestore.
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../lib/trpc/trpc.js';
import {
  signUpSchema,
  updateProfileSchema,
} from '../lib/validations/auth.js';
import { admin } from '../lib/firebase.js';
import { logger } from '../lib/logger.js';

export const authRouter = router({
  /**
   * Create user in Firestore after Firebase Auth signup
   *
   * This is called after the client creates a user with Firebase Auth.
   * Creates the corresponding user document in Firestore.
   */
  createUserDocument: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        name: z.string(),
        email: z.string().email(),
        modePreference: z.enum(['PLAIN', 'TECHNICAL']).default('PLAIN'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user document already exists
        const existingUserDoc = await ctx.db.collection('users').doc(input.uid).get();

        if (existingUserDoc.exists) {
          logger.warn({ uid: input.uid }, 'User document already exists');
          return {
            success: true,
            message: 'User already exists',
          };
        }

        // Create user document in Firestore
        await ctx.db.collection('users').doc(input.uid).set({
          id: input.uid,
          name: input.name,
          email: input.email,
          emailVerified: false, // Will be updated when Firebase Auth email is verified
          image: null,
          role: 'USER',
          modePreference: input.modePreference,
          bio: null,
          company: null,
          jobTitle: null,
          linkedInUrl: null,
          websiteUrl: null,
          location: null,
          githubUrl: null,
          techPreferences: null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: input.uid,
          userName: input.name,
          action: 'USER_SIGNED_UP',
          details: {
            email: input.email,
            name: input.name,
            modePreference: input.modePreference,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ uid: input.uid, email: input.email }, 'User document created');

        return {
          success: true,
          message: 'User document created successfully',
        };
      } catch (error) {
        logger.error({ error, uid: input.uid }, 'Failed to create user document');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user document',
        });
      }
    }),

  /**
   * Sign up new user with email/password
   *
   * Creates both Firebase Auth user and Firestore user document.
   * Sends email verification link.
   */
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // 1. Create Firebase Auth user
        const userRecord = await ctx.auth.createUser({
          email: input.email,
          password: input.password,
          displayName: input.name,
          emailVerified: false,
        });

        // 2. Create Firestore user document
        const userData = {
          id: userRecord.uid,
          email: input.email,
          name: input.name,
          role: 'USER',
          modePreference: input.modePreference,
          image: null,
          bio: null,
          company: null,
          jobTitle: null,
          linkedInUrl: null,
          websiteUrl: null,
          location: null,
          githubUrl: null,
          techPreferences: null,
          emailVerified: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await ctx.db.collection('users').doc(userRecord.uid).set(userData);

        // 3. Generate and send verification email
        try {
          const verificationLink = await ctx.auth.generateEmailVerificationLink(input.email);
          // TODO: Send email with verificationLink using email service
          logger.info({ uid: userRecord.uid, email: input.email }, 'Email verification link generated');
        } catch (error) {
          logger.error({ error, uid: userRecord.uid }, 'Failed to generate verification link');
          // Don't fail signup if email generation fails
        }

        // 4. Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: userRecord.uid,
          userName: input.name,
          action: 'USER_SIGNED_UP',
          details: {
            email: input.email,
            name: input.name,
            method: 'email',
            modePreference: input.modePreference,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info({ uid: userRecord.uid, email: input.email }, 'User signed up successfully');

        return {
          success: true,
          userId: userRecord.uid,
          emailVerified: false,
        };
      } catch (error: any) {
        logger.error({ error, email: input.email }, 'Failed to sign up user');

        // Handle Firebase Auth errors
        if (error.code === 'auth/email-already-exists') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Email already in use',
          });
        }

        if (error.code === 'auth/invalid-email') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid email address',
          });
        }

        if (error.code === 'auth/weak-password') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Password is too weak',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create account',
        });
      }
    }),

  /**
   * Update email verified status
   *
   * Called after Firebase Auth email verification completes
   */
  updateEmailVerified: publicProcedure
    .input(z.object({ uid: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const userRef = ctx.db.collection('users').doc(input.uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        // Update email verification status
        await userRef.update({
          emailVerified: true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: input.uid,
          userName: userDoc.data()?.name || null,
          action: 'USER_VERIFIED_EMAIL',
          details: {
            email: userDoc.data()?.email,
          },
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return {
          success: true,
          message: 'Email verified successfully',
        };
      } catch (error) {
        logger.error({ error, uid: input.uid }, 'Failed to update email verification');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update email verification',
        });
      }
    }),

  /**
   * Get current user profile
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    try {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Not authenticated',
        });
      }

      return {
        id: ctx.user.id,
        name: ctx.user.name || 'User',
        email: ctx.user.email || '',
        role: ctx.user.role || 'USER',
        modePreference: ctx.user.modePreference || 'PLAIN',
        image: ctx.user.image ?? null,
        bio: ctx.user.bio ?? null,
        company: ctx.user.company ?? null,
        jobTitle: ctx.user.jobTitle ?? null,
        linkedInUrl: ctx.user.linkedInUrl ?? null,
        websiteUrl: ctx.user.websiteUrl ?? null,
        location: ctx.user.location ?? null,
        githubUrl: ctx.user.githubUrl ?? null,
        techPreferences: ctx.user.techPreferences ?? null,
        emailVerified: ctx.user.emailVerified ?? false,
        createdAt: ctx.user.createdAt || new Date(),
      };
    } catch (error) {
      logger.error({ error, userId: ctx.user?.id }, 'Error in auth.me endpoint');
      throw error;
    }
  }),

  /**
   * Update user profile
   */
  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Not authenticated',
        });
      }

      try {
        // Prepare update data - convert empty strings to null
        const updateData: any = {
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        if (input.name !== undefined) updateData.name = input.name;
        if (input.modePreference !== undefined) updateData.modePreference = input.modePreference;
        if (input.bio !== undefined) updateData.bio = input.bio === '' ? null : input.bio;
        if (input.company !== undefined) updateData.company = input.company === '' ? null : input.company;
        if (input.jobTitle !== undefined) updateData.jobTitle = input.jobTitle === '' ? null : input.jobTitle;
        if (input.linkedInUrl !== undefined) updateData.linkedInUrl = input.linkedInUrl === '' ? null : input.linkedInUrl;
        if (input.websiteUrl !== undefined) updateData.websiteUrl = input.websiteUrl === '' ? null : input.websiteUrl;
        if (input.location !== undefined) updateData.location = input.location === '' ? null : input.location;
        if (input.githubUrl !== undefined) updateData.githubUrl = input.githubUrl === '' ? null : input.githubUrl;

        // Handle tech preferences - clean empty strings
        if (input.techPreferences !== undefined) {
          if (input.techPreferences === null) {
            updateData.techPreferences = null;
          } else {
            const cleanedPrefs: any = {};
            Object.entries(input.techPreferences).forEach(([key, value]) => {
              cleanedPrefs[key] = value === '' ? null : value || null;
            });
            updateData.techPreferences = cleanedPrefs;
          }
        }

        // Update Firestore document
        const userRef = ctx.db.collection('users').doc(ctx.user.id);
        await userRef.update(updateData);

        // If name changed, update Firebase Auth displayName
        if (input.name !== undefined) {
          try {
            await ctx.auth.updateUser(ctx.user.id, {
              displayName: input.name,
            });
          } catch (error) {
            logger.error({ error, uid: ctx.user.id }, 'Failed to update Firebase Auth displayName');
            // Don't fail the request if Auth update fails
          }
        }

        // Get updated user
        const updatedUserDoc = await userRef.get();
        const updatedUser = updatedUserDoc.data();

        // Create audit log
        await ctx.db.collection('auditLogs').add({
          userId: ctx.user.id,
          userName: ctx.user.name,
          action: 'USER_UPDATED_PROFILE',
          details: input,
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return {
          id: ctx.user.id,
          name: updatedUser?.name || ctx.user.name,
          email: ctx.user.email,
          role: ctx.user.role,
          modePreference: updatedUser?.modePreference || ctx.user.modePreference,
          image: updatedUser?.image || null,
          bio: updatedUser?.bio || null,
          company: updatedUser?.company || null,
          jobTitle: updatedUser?.jobTitle || null,
          linkedInUrl: updatedUser?.linkedInUrl || null,
          websiteUrl: updatedUser?.websiteUrl || null,
          location: updatedUser?.location || null,
          githubUrl: updatedUser?.githubUrl || null,
          techPreferences: updatedUser?.techPreferences || null,
          createdAt: ctx.user.createdAt,
        };
      } catch (error) {
        logger.error({ error, uid: ctx.user.id }, 'Failed to update profile');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update profile',
        });
      }
    }),

  /**
   * Change password
   *
   * Note: With Firebase Auth, password changes should be done client-side
   * using firebase.auth().currentUser.updatePassword()
   * This endpoint is kept for API compatibility but delegates to Firebase Auth
   */
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Not authenticated',
        });
      }

      // With Firebase Auth, password changes should be done client-side
      // This is a server-side operation that requires special handling
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Password changes must be done through Firebase Auth on the client side. Use the "Change Password" feature in your account settings.',
      });
    }),

  /**
   * Delete account (soft delete - archives projects)
   */
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not authenticated',
      });
    }

    try {
      const userId = ctx.user.id;
      const batch = ctx.db.batch();

      // Archive all user projects
      const projectsSnapshot = await ctx.db
        .collection('projects')
        .where('userId', '==', userId)
        .get();

      projectsSnapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { status: 'ARCHIVED' });
      });

      // Delete sessions subcollection
      const sessionsSnapshot = await ctx.db
        .collection('users')
        .doc(userId)
        .collection('sessions')
        .get();

      sessionsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Mark user as deleted (soft delete)
      const userRef = ctx.db.collection('users').doc(userId);
      batch.update(userRef, {
        email: `deleted_${userId}@deleted.com`,
        name: 'Deleted User',
        emailVerified: false,
        image: null,
        bio: null,
        company: null,
        jobTitle: null,
        linkedInUrl: null,
        websiteUrl: null,
        location: null,
        githubUrl: null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Commit batch
      await batch.commit();

      // Delete from Firebase Auth
      try {
        await ctx.auth.deleteUser(userId);
      } catch (error) {
        logger.error({ error, uid: userId }, 'Failed to delete user from Firebase Auth');
        // Continue even if Auth deletion fails
      }

      // Create audit log
      await ctx.db.collection('auditLogs').add({
        userId,
        userName: null,
        action: 'USER_DELETED_ACCOUNT',
        details: {
          originalEmail: ctx.user.email,
        },
        ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      logger.info({ uid: userId }, 'Account deleted');

      return { success: true, message: 'Account deleted successfully' };
    } catch (error) {
      logger.error({ error, uid: ctx.user?.id }, 'Failed to delete account');
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete account',
      });
    }
  }),

  /**
   * Create user from Google OAuth
   *
   * Called after Google OAuth sign-in to create/update user document
   */
  handleOAuthUser: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        email: z.string().email(),
        name: z.string(),
        image: z.string().url().optional(),
        provider: z.string(),
        providerAccountId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userRef = ctx.db.collection('users').doc(input.uid);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
          // User exists, update last login
          await userRef.update({
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          // Check if this OAuth provider is already linked
          const accountsSnapshot = await userRef
            .collection('accounts')
            .where('provider', '==', input.provider)
            .where('providerAccountId', '==', input.providerAccountId)
            .get();

          if (accountsSnapshot.empty) {
            // Link new OAuth provider
            await userRef.collection('accounts').add({
              type: 'oauth',
              provider: input.provider,
              providerAccountId: input.providerAccountId,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          }

          return {
            success: true,
            isNewUser: false,
          };
        } else {
          // Create new user
          await userRef.set({
            id: input.uid,
            name: input.name,
            email: input.email,
            emailVerified: true, // OAuth users have verified emails
            image: input.image || null,
            role: 'USER',
            modePreference: 'PLAIN',
            bio: null,
            company: null,
            jobTitle: null,
            linkedInUrl: null,
            websiteUrl: null,
            location: null,
            githubUrl: null,
            techPreferences: null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          // Link OAuth provider
          await userRef.collection('accounts').add({
            type: 'oauth',
            provider: input.provider,
            providerAccountId: input.providerAccountId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          // Create audit log
          await ctx.db.collection('auditLogs').add({
            userId: input.uid,
            userName: input.name,
            action: 'USER_SIGNED_UP_OAUTH',
            details: {
              email: input.email,
              provider: input.provider,
            },
            ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          logger.info({ uid: input.uid, email: input.email, provider: input.provider }, 'OAuth user created');

          return {
            success: true,
            isNewUser: true,
          };
        }
      } catch (error) {
        logger.error({ error, uid: input.uid }, 'Failed to handle OAuth user');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to process OAuth user',
        });
      }
    }),
});
