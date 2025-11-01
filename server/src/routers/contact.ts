/**
 * Contact/Inquiry Router
 *
 * Handles contact form submissions including demos, questions, bug reports, and general inquiries.
 * Stores requests in database and sends notification emails to admin.
 */

import { router, publicProcedure } from '../lib/trpc/trpc.js';
import { submitContactSchema, scheduleDemoSchema } from '../lib/validations/contact.js';
import { sendContactNotificationEmail } from '../lib/email.js';
import { prisma } from '../lib/db.js';
import { TRPCError } from '@trpc/server';

export const contactRouter = router({
  /**
   * Submit a contact/inquiry form
   * Public endpoint - no authentication required
   */
  submitContact: publicProcedure.input(submitContactSchema).mutation(async ({ input }) => {
    try {
      // Create contact request in database
      const contactRequest = await prisma.demoRequest.create({
        data: {
          inquiryType: input.inquiryType || 'GENERAL',
          name: input.name,
          email: input.email,
          company: input.company || null,
          role: input.role || null,
          teamSize: input.teamSize || null,
          subject: input.subject || null,
          message: input.message || null,
          status: 'PENDING',
        },
      });

      // Send notification email to admin
      try {
        await sendContactNotificationEmail({
          inquiryType: contactRequest.inquiryType as any,
          name: contactRequest.name,
          email: contactRequest.email,
          company: contactRequest.company || undefined,
          role: contactRequest.role || undefined,
          teamSize: contactRequest.teamSize || undefined,
          subject: contactRequest.subject || undefined,
          message: contactRequest.message || undefined,
          createdAt: contactRequest.createdAt,
        });
      } catch (emailError) {
        // Log error but don't fail the request if email fails
        console.error('Failed to send contact notification email:', emailError);
      }

      return {
        success: true,
        message: 'Contact request submitted successfully',
        id: contactRequest.id,
      };
    } catch (error) {
      console.error('Error submitting contact:', error);
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
      // Create demo request in database with DEMO inquiry type
      const demoRequest = await prisma.demoRequest.create({
        data: {
          inquiryType: 'DEMO',
          name: input.name,
          email: input.email,
          company: input.company || null,
          role: input.role || null,
          teamSize: input.teamSize || null,
          message: input.message || null,
          status: 'PENDING',
        },
      });

      // Send notification email to admin
      try {
        await sendContactNotificationEmail({
          inquiryType: 'DEMO',
          name: demoRequest.name,
          email: demoRequest.email,
          company: demoRequest.company || undefined,
          role: demoRequest.role || undefined,
          teamSize: demoRequest.teamSize || undefined,
          message: demoRequest.message || undefined,
          createdAt: demoRequest.createdAt,
        });
      } catch (emailError) {
        // Log error but don't fail the request if email fails
        console.error('Failed to send demo notification email:', emailError);
      }

      return {
        success: true,
        message: 'Demo request submitted successfully',
        id: demoRequest.id,
      };
    } catch (error) {
      console.error('Error scheduling demo:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to submit demo request. Please try again later.',
      });
    }
  }),
});
