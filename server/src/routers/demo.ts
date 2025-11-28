/**
 * Demo Request Router (Firestore)
 *
 * Handles demo scheduling requests from the landing page.
 * Stores requests in database and sends notification emails to admin.
 */

import { router, publicProcedure } from '../lib/trpc/trpc.js';
import { scheduleDemoSchema } from '../lib/validations/demo.js';
import { sendDemoNotificationEmail } from '../lib/email.js';
import { admin, getFirestore } from '../lib/firebase.js';
import { TRPCError } from '@trpc/server';
import { logger } from '../lib/logger.js';

export const demoRouter = router({
  /**
   * Schedule a demo call
   * Public endpoint - no authentication required
   */
  scheduleDemo: publicProcedure.input(scheduleDemoSchema).mutation(async ({ input }) => {
    try {
      const db = getFirestore();

      // Create demo request in database
      const demoRequestRef = db.collection('demoRequests').doc();
      const demoRequestData = {
        id: demoRequestRef.id,
        inquiryType: 'DEMO',
        name: input.name,
        email: input.email,
        company: input.company || null,
        message: input.message || null,
        status: 'PENDING',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await demoRequestRef.set(demoRequestData);

      // Get the document to get actual createdAt for email
      const createdDoc = await demoRequestRef.get();
      const createdData = createdDoc.data();

      // Send notification email to admin
      try {
        await sendDemoNotificationEmail({
          name: demoRequestData.name,
          email: demoRequestData.email,
          company: demoRequestData.company || undefined,
          message: demoRequestData.message || undefined,
          createdAt: createdData?.createdAt?.toDate() || new Date(),
        });
      } catch (emailError) {
        // Log error but don't fail the request if email fails
        logger.error({ error: emailError }, 'Failed to send demo notification email');
      }

      logger.info({ id: demoRequestRef.id, email: input.email }, 'Demo request submitted');

      return {
        success: true,
        message: 'Demo request submitted successfully',
        id: demoRequestRef.id,
      };
    } catch (error) {
      logger.error({ error }, 'Error scheduling demo');
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to submit demo request. Please try again later.',
      });
    }
  }),
});
