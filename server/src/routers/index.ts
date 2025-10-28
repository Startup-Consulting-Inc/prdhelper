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
});

/**
 * Export type definition for client
 */
export type AppRouter = typeof appRouter;

