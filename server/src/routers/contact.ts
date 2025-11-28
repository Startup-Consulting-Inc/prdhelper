/**
 * Contact/Inquiry Router (Firestore)
 *
 * Handles contact form submissions including demos, questions, bug reports, and general inquiries.
 * Stores requests in database and sends notification emails to admin.
 */

import { router, publicProcedure } from '../lib/trpc/trpc.js';
import { submitContactSchema, scheduleDemoSchema } from '../lib/validations/contact.js';
import { sendContactNotificationEmail } from '../lib/email.js';
import { TRPCError } from '@trpc/server';
import { admin, getFirestore } from '../lib/firebase.js';
import { logger } from '../lib/logger.js';

export const contactRouter = router({
  /**
   * Submit a contact/inquiry form
   * Public endpoint - no authentication required
   */
  submitContact: publicProcedure.input(submitContactSchema).mutation(async ({ input }) => {
    try {
      const db = getFirestore();

      // Create contact request in database
      const contactRequestRef = db.collection('demoRequests').doc();
      const contactRequestData = {
        id: contactRequestRef.id,
        inquiryType: input.inquiryType || 'GENERAL',
        name: input.name,
        email: input.email,
        company: input.company || null,
        role: input.role || null,
        teamSize: input.teamSize || null,
        subject: input.subject || null,
        message: input.message || null,
        attachments: input.attachments || null,
        status: 'PENDING',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await contactRequestRef.set(contactRequestData);

      // Get the document to get actual createdAt for email
      const createdDoc = await contactRequestRef.get();
      const createdData = createdDoc.data();

      // Send notification email to admin
      try {
        await sendContactNotificationEmail({
          inquiryType: contactRequestData.inquiryType as any,
          name: contactRequestData.name,
          email: contactRequestData.email,
          company: contactRequestData.company || undefined,
          role: contactRequestData.role || undefined,
          teamSize: contactRequestData.teamSize || undefined,
          subject: contactRequestData.subject || undefined,
          message: contactRequestData.message || undefined,
          attachments: input.attachments,
          createdAt: createdData?.createdAt?.toDate() || new Date(),
        });
      } catch (emailError) {
        // Log error but don't fail the request if email fails
        logger.error({ error: emailError }, 'Failed to send contact notification email');
      }

      logger.info({ id: contactRequestRef.id, email: input.email }, 'Contact request submitted');

      return {
        success: true,
        message: 'Contact request submitted successfully',
        id: contactRequestRef.id,
      };
    } catch (error) {
      logger.error({ error }, 'Error submitting contact');
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to submit contact request. Please try again later.',
      });
    }
  }),

  /**
   * Schedule a demo call (legacy endpoint - maps to DEMO inquiry type)
   * Public endpoint - no authentication required
   * @deprecated Use submitContact with inquiryType: 'DEMO' instead
   */
  scheduleDemo: publicProcedure.input(scheduleDemoSchema).mutation(async ({ input }) => {
    try {
      const db = getFirestore();

      // Create demo request in database with DEMO inquiry type
      const demoRequestRef = db.collection('demoRequests').doc();
      const demoRequestData = {
        id: demoRequestRef.id,
        inquiryType: 'DEMO',
        name: input.name,
        email: input.email,
        company: input.company || null,
        role: input.role || null,
        teamSize: input.teamSize || null,
        subject: null,
        message: input.message || null,
        attachments: null,
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
        await sendContactNotificationEmail({
          inquiryType: 'DEMO',
          name: demoRequestData.name,
          email: demoRequestData.email,
          company: demoRequestData.company || undefined,
          role: demoRequestData.role || undefined,
          teamSize: demoRequestData.teamSize || undefined,
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
