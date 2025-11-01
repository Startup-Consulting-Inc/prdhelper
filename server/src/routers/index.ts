/**
 * Root tRPC Router
 * 
 * Combines all routers into a single app router.
 */

import { router } from '../lib/trpc/trpc.js';
import { authRouter } from './auth.js';
import { projectsRouter } from './projects.js';
import { documentsRouter } from './documents.js';
import { conversationsRouter } from './conversations.js';
import { aiRouter } from './ai.js';
import { adminRouter } from './admin.js';
import { demoRouter } from './demo.js';
import { contactRouter } from './contact.js';

/**
 * App Router - combines all routers
 */
export const appRouter = router({
  auth: authRouter,
  projects: projectsRouter,
  documents: documentsRouter,
  conversations: conversationsRouter,
  ai: aiRouter,
  admin: adminRouter,
  demo: demoRouter, // Legacy - kept for backward compatibility
  contact: contactRouter, // New contact router with inquiry types
});

/**
 * Export type definition for client
 */
export type AppRouter = typeof appRouter;

