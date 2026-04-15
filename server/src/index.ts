/**
 * Main Express Server for PRD Helper
 *
 * This file sets up and runs the Express server, which serves three main purposes:
 * 1. Serves the static frontend application build artifacts.
 * 2. Handles all tRPC API requests under the /api/trpc endpoint.
 * 3. Manages OAuth authentication routes.
 *
 * Key Behaviors:
 * - Middleware order is critical: logging → security → auth → routes
 * - Rate limiting protects against abuse
 * - Structured logging for production observability
 * - Error tracking with Sentry
 * - Comprehensive health checks
 *
 * Recent Changes:
 * - [2025-01-XX] Added structured logging with Pino
 * - [2025-01-XX] Integrated Sentry error tracking
 * - [2025-01-XX] Added rate limiting middleware
 * - [2025-01-XX] Enhanced security with correlation IDs and secure error handling
 * - [2025-01-XX] Improved health checks with dependency verification
 */
import express, { Request, Response } from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomBytes } from 'crypto';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './routers/index.js';
import { createContext } from './lib/trpc/context.js';
import { passport } from './lib/oauth.js';
import { generateToken } from './lib/auth.js';
import { uploadRouter } from './routes/upload.js';
import { logger } from './lib/logger.js';
import { correlationIdMiddleware } from './lib/middleware/correlationId.js';
import { errorHandler, notFoundHandler } from './lib/middleware/errorHandler.js';
import { authLimiter, uploadLimiter, apiLimiter } from './lib/middleware/rateLimiter.js';
import { checkDatabaseHealth } from './lib/health/database.js';
import { checkStorageHealth } from './lib/health/storage.js';
import { checkEmailHealth } from './lib/health/email.js';

// Load environment variables FIRST
dotenv.config();

// Validate required environment variables — fail fast on startup
const requiredEnvVars = [
  'OPENROUTER_API_KEY',
  'FIREBASE_PROJECT_ID',
  'FIRESTORE_DATABASE_ID',
];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Log startup immediately to help debug
console.log('🚀 Starting server...');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PORT: ${process.env.PORT || '3000'}`);

// Initialize Firebase (must be early for auth and database)
// Don't throw on failure - let server start and log error
import { initializeFirebase } from './lib/firebase.js';
let firebaseInitialized = false;
try {
  console.log('🔥 Initializing Firebase...');
  initializeFirebase();
  firebaseInitialized = true;
  console.log('✅ Firebase initialized successfully');
  logger.info('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  logger.error({ error }, 'Failed to initialize Firebase Admin SDK - server will start but Firebase features may not work');
  // Don't throw - allow server to start for debugging
  // In production, this should be fatal, but for now let's see what the actual error is
  if (process.env.NODE_ENV === 'production' && process.env.FAIL_ON_FIREBASE_INIT === 'true') {
    logger.fatal({ error }, 'FIREBASE_INIT_FAILED - Exiting due to FAIL_ON_FIREBASE_INIT=true');
    process.exit(1);
  }
}

// Initialize Sentry for error tracking (must be first)
const SENTRY_DSN = process.env.SENTRY_DSN;
if (SENTRY_DSN && process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.1, // Sample 10% of transactions
    integrations: [
      Sentry.httpIntegration(),
      Sentry.expressIntegration(),
    ],
  });
  logger.info('Sentry error tracking initialized');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Respect proxy headers (required for correct protocol/host on Cloud Run & proxies)
app.set('trust proxy', 1);

// Sentry Express integration is already configured via expressIntegration() in Sentry.init()
// No need for separate request handler when using expressIntegration()

// Compression middleware (Gzip/Brotli for all responses)
app.use(compression());

// Correlation ID middleware (must be early for logging)
app.use(correlationIdMiddleware);

// Cookie parser (required for CSRF and sessions)
app.use(cookieParser());

// Serve static files from the React app (only in production or if built client exists)
const clientDistPath = path.join(__dirname, '../client');
const fs = await import('fs');
const clientDistExists = fs.existsSync(clientDistPath);

// Only serve static files if client dist exists (production mode)
if (clientDistExists) {
  logger.info({ clientDistPath }, 'Serving static client files');
  app.use(express.static(clientDistPath, {
    setHeaders: (res, filePath) => {
      // Cache immutable hashed assets for 1 year
      if (filePath.match(/\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|ico|webp)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
      // Set proper MIME types for video files
      if (filePath.endsWith('.mp4')) {
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Accept-Ranges', 'bytes');
      }
    }
  }));
} else {
  logger.info('Static file serving disabled - client runs separately in development');
}

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
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://apis.google.com', // Google OAuth API
          'https://www.gstatic.com', // Google static resources
          'https://www.googletagmanager.com', // Google Tag Manager
          'blob:', // Allow blobs for workers
        ],
        workerSrc: ["'self'", 'blob:'], // Explicitly allow workers from blobs
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: [
          "'self'",
          'https://*.googleapis.com', // Google APIs
          'https://*.firebaseio.com', // Firebase Realtime Database
          'https://*.firebaseapp.com', // Firebase Hosting
          'https://*.sentry.io', // Sentry error tracking
          'https://www.googletagmanager.com', // Google Tag Manager
          'https://www.google-analytics.com', // Google Analytics
          'https://region1.google-analytics.com', // GA4 regional endpoint
        ],
        fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: [
          "'self'",
          'https://*.firebaseapp.com', // Firebase Auth
          'https://clearly-478614.firebaseapp.com', // Explicit Auth Domain
          'https://www.youtube.com',
          'https://www.youtube-nocookie.com'
        ], // Allow YouTube embeds and Firebase Auth
      },
    },
    crossOriginEmbedderPolicy: false, // Allow embedding for video playback
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, // Allow Firebase Auth popups
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
app.use(express.json({ limit: '10mb' }));

// Apply general API rate limiting (skip for specific paths handled separately)
app.use('/api', apiLimiter);

// Session middleware (required for passport)
// SECURITY: Using dedicated SESSION_SECRET, SameSite cookies for CSRF protection
const SESSION_SECRET = process.env.SESSION_SECRET || process.env.JWT_SECRET;
if (!SESSION_SECRET) {
  logger.warn('SESSION_SECRET environment variable is not set - using random secret (sessions will not persist)');
}

app.use(
  session({
    secret: SESSION_SECRET || randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax', // CSRF protection via SameSite cookie
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth routes (with rate limiting)
app.get(
  '/api/auth/google',
  authLimiter, // Apply auth rate limit
  (req: Request, res: Response, next) => {
    // Check if prompt parameter is provided (e.g., for forcing account selection during signup)
    const prompt = req.query.prompt as string | undefined;
    const authOptions: any = { scope: ['profile', 'email'] };

    if (prompt) {
      authOptions.prompt = prompt;
    }

    passport.authenticate('google', authOptions)(req, res, next);
  }
);

app.get(
  '/api/auth/google/callback',
  authLimiter, // Apply auth rate limit
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
        logger.error({ err, correlationId: req.correlationId }, 'Error logging out session');
      }
    });

    // Determine redirect base from request host when allowed, fallback to first configured origin
    const forwardedHostHeader = req.headers['x-forwarded-host'];
    const requestHost = Array.isArray(forwardedHostHeader)
      ? forwardedHostHeader[0]
      : forwardedHostHeader?.split(',')[0]?.trim() || req.get('host');
    const requestProtocol =
      (req.headers['x-forwarded-proto'] as string | undefined)?.split(',')[0]?.trim() ||
      req.protocol ||
      'https';
    const requestOrigin =
      requestHost && requestProtocol ? `${requestProtocol}://${requestHost}` : null;

    const matchedOrigin =
      requestOrigin &&
      allowedOrigins.find((origin) => {
        try {
          return new URL(origin).host === requestHost;
        } catch {
          return false;
        }
      });

    const clientUrl = matchedOrigin ?? allowedOrigins[0] ?? 'http://localhost:5173';

    res.redirect(`${clientUrl.replace(/\/$/, '')}/auth/callback?token=${token}`);
  }
);

// Logout endpoint - clears session and cookies
app.post('/api/auth/logout', authLimiter, (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      logger.error({ err, correlationId: req.correlationId }, 'Error logging out');
      return res.status(500).json({ success: false, error: 'Logout failed' });
    }

    req.session.destroy((err) => {
      if (err) {
        logger.error({ err, correlationId: req.correlationId }, 'Error destroying session');
        return res.status(500).json({ success: false, error: 'Session destroy failed' });
      }

      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });
});

// File upload API endpoint (must come before tRPC)
// Rate limiting applied inside uploadRouter per endpoint
app.use('/api/upload', uploadLimiter, uploadRouter);

// tRPC API endpoint
app.use(
  '/api/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
    onError: ({ path, error, type, req }) => {
      logger.error({
        path,
        type,
        code: error.code,
        message: error.message,
        correlationId: (req as any)?.correlationId,
      }, 'tRPC error');

      // Log stack trace only in development
      if (process.env.NODE_ENV === 'development') {
        logger.debug({ stack: error.stack }, 'tRPC error stack trace');
      }
    },
  })
);

// Simple root endpoint for Cloud Run health checks
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'clearly-api',
    timestamp: new Date().toISOString(),
  });
});

// Comprehensive health check endpoint
app.get('/health', async (_req: Request, res: Response) => {
  try {
    // Check all dependencies in parallel
    const [database, storage, email] = await Promise.all([
      checkDatabaseHealth(),
      checkStorageHealth(),
      checkEmailHealth(),
    ]);

    // Determine overall health status
    const allHealthy = [database, storage, email].every((check) => check.status === 'ok');
    const anyDown = [database, storage, email].some((check) => check.status === 'down');
    const anyDegraded = [database, storage, email].some((check) => check.status === 'degraded');

    // In development, treat degraded services as acceptable
    // This allows running without all external dependencies (GCS, etc.)
    const isDevelopment = process.env.NODE_ENV === 'development';
    const overallStatus = anyDown ? 'down' :
                         (allHealthy || (isDevelopment && !anyDown)) ? 'ok' :
                         'degraded';

    const healthData = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database,
        storage,
        email,
      },
    };

    // Return 503 only if services are actually down
    // In development, degraded services are acceptable (return 200)
    const statusCode = anyDown ? 503 : 200;

    logger.debug({ health: healthData }, 'Health check performed');

    res.status(statusCode).json(healthData);
  } catch (error) {
    logger.error({ err: error }, 'Health check failed');

    res.status(503).json({
      status: 'down',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    });
  }
});

// All remaining requests return the React app (only if serving static files)
if (clientDistExists) {
  // Load prerender manifest if available
  const prerenderManifestPath = path.join(clientDistPath, 'prerendered', '_manifest.json');
  let prerenderedRoutes: Map<string, string> = new Map();
  try {
    const manifest = JSON.parse(fs.readFileSync(prerenderManifestPath, 'utf-8')) as Array<{ url: string; file: string }>;
    for (const entry of manifest) {
      prerenderedRoutes.set(entry.url, path.join(clientDistPath, 'prerendered', entry.file));
    }
    logger.info({ count: prerenderedRoutes.size }, 'Loaded prerender manifest');
  } catch {
    // No prerender manifest — serve SPA for all routes
  }

  // Regex matching known AI/search bot User-Agents
  const BOT_REGEX = /bot|crawler|spider|GPTBot|ChatGPT-User|PerplexityBot|ClaudeBot|anthropic-ai|Google-Extended|Googlebot|Bingbot|YandexBot|DuckDuckBot|Slurp|AhrefsBot|SemrushBot|MJ12bot/i;

  app.get('*', (req: Request, res: Response) => {
    const ua = req.headers['user-agent'] ?? '';
    const isBot = BOT_REGEX.test(ua);

    if (isBot && prerenderedRoutes.has(req.path)) {
      return res.sendFile(prerenderedRoutes.get(req.path)!);
    }

    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Sentry error handler (must be before other error handlers)
if (SENTRY_DSN && process.env.NODE_ENV === 'production') {
  app.use(Sentry.expressErrorHandler());
}

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server - listen on all interfaces (0.0.0.0) for Cloud Run
const portNumber = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;

console.log(`📡 Starting server on port ${portNumber}...`);

// Ensure we listen on the correct port and interface
const server = app.listen(portNumber, '0.0.0.0', () => {
  logger.info({
    port: portNumber,
    environment: process.env.NODE_ENV || 'development',
    staticPath: clientDistPath,
    firebaseInitialized,
  }, 'Server started successfully');

  console.log(`✅ Server running on port ${portNumber}`);
  console.log(`🌐 Listening on: 0.0.0.0:${portNumber}`);
  if (clientDistExists) {
    console.log(`📁 Serving static files from: ${clientDistPath}`);
  } else {
    console.log(`📁 Static files: Served separately (client on port 5173)`);
  }
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 tRPC endpoint: /api/trpc`);
  console.log(`💚 Health check: /health`);
  console.log(`📊 Logging: ${process.env.LOG_LEVEL || 'info'} level`);
  console.log(`🔥 Firebase: ${firebaseInitialized ? '✅ Initialized' : '❌ Failed to initialize'}`);
  if (SENTRY_DSN) {
    console.log(`🔍 Error tracking: Sentry enabled`);
  }
});

// Handle server errors
server.on('error', (error: NodeJS.ErrnoException) => {
  logger.error({ error }, 'Server error');
  if (error.code === 'EADDRINUSE') {
    logger.fatal({ port: portNumber }, 'Port already in use');
    process.exit(1);
  } else {
    logger.fatal({ error }, 'Unexpected server error');
    process.exit(1);
  }
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.fatal({ error }, 'Uncaught exception');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, 'Unhandled rejection');
});
