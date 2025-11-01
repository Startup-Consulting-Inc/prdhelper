/**
 * Demo Request Router
 *
 * Handles demo scheduling requests from the landing page.
 * Stores requests in database and sends notification emails to admin.
 */

import { router, publicProcedure } from '../lib/trpc/trpc.js';
import { scheduleDemoSchema } from '../lib/validations/demo.js';
import { sendDemoNotificationEmail } from '../lib/email.js';
import { prisma } from '../lib/db.js';
import { TRPCError } from '@trpc/server';

export const demoRouter = router({
  /**
   * Schedule a demo call
   * Public endpoint - no authentication required
   */
  scheduleDemo: publicProcedure.input(scheduleDemoSchema).mutation(async ({ input }) => {
    try {
      // Create demo request in database
      const demoRequest = await prisma.demoRequest.create({
        data: {
          name: input.name,
          email: input.email,
          company: input.company || null,
          message: input.message || null,
          status: 'PENDING',
        },
      });

      // Send notification email to admin
      try {
        await sendDemoNotificationEmail({
          name: demoRequest.name,
          email: demoRequest.email,
          company: demoRequest.company || undefined,
          message: demoRequest.message || undefined,
          createdAt: demoRequest.createdAt,
        });
      } catch (emailError) {
        // Log error but don't fail the request if email fails
        console.error('Failed to send demo notification email:', emailError);
        // You might want to update the database to mark that the email failed
        // Or implement a retry mechanism
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
