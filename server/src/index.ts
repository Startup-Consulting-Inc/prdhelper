/**
 * Main Express Server for PRD Helper
 *
 * This file sets up and runs the Express server, which serves three main purposes:
 * 1. Serves the static frontend application build artifacts.
 * 2. Handles all tRPC API requests under the /api/trpc endpoint.
 * 3. Manages OAuth authentication routes.
 *
 * Key Behaviors:
 * - Middleware order is critical: static files are served first, then CORS, then API routes.
 * - A catch-all route `app.get('*', ...)` serves index.html for client-side routing.
 * - The server port is configured via the PORT environment variable, defaulting to 3000.
 *
 * Recent Changes:
 * - [2025-10-30] Reordered middleware to serve static files before CORS and API routes.
 * - [2025-10-30] Updated static file path to align with Docker build structure.
 * - [2025-10-30] Adjusted CORS policy to correctly handle same-origin requests in production.
 */
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './routers/index.js';
import { createContext } from './lib/trpc/context.js';
import { passport } from './lib/oauth.js';
import { generateToken } from './lib/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the React app *before* other middleware
const clientDistPath = path.join(__dirname, '../client');
app.use(express.static(clientDistPath, {
  setHeaders: (res, filePath) => {
    // Set proper MIME types for video files
    if (filePath.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
    }
  }
}));

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Security middleware - helmet with CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'", 'https://www.youtube.com', 'https://www.youtube-nocookie.com'], // Allow YouTube embeds
      },
    },
    crossOriginEmbedderPolicy: false, // Allow embedding for video playback
  })
);

// CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like same-origin requests from the browser,
      // mobile apps, Postman, or server-side redirects)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      // In development, be more permissive for convenience
      if (process.env.NODE_ENV === 'development') {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());

// Session middleware (required for passport)
app.use(
  session({
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth routes
app.get(
  '/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=oauth_failed' }),
  (req: Request, res: Response) => {
    // Generate JWT token for the authenticated user
    const user = req.user as any;
    if (!user) {
      return res.redirect('/login?error=oauth_failed');
    }

    const token = generateToken(user);

    // Clear the session after getting the user (we use JWT, not sessions for auth)
    req.logout((err) => {
      if (err) {
        console.error('Error logging out session:', err);
      }
    });

    // Redirect to frontend with token
    const clientUrl = allowedOrigins[0] || 'http://localhost:5173';
    res.redirect(`${clientUrl}/auth/callback?token=${token}`);
  }
);

// tRPC API endpoint
app.use(
  '/api/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(`❌ tRPC Error on [${path}]:`, error.message);
          }
        : undefined,
  })
);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// All remaining requests return the React app, so it can handle routing
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
