/**
 * Authentication Middleware
 *
 * Middleware to verify JWT tokens and authenticate requests
 */
import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, TokenPayload } from '../auth.js';
import { logger } from '../logger.js';

// Extend Express Request to include both Passport user and our token payload
declare global {
  namespace Express {
    interface Request {
      tokenPayload?: TokenPayload;
    }
  }
}

/**
 * Middleware to authenticate requests using JWT
 * Requires valid Bearer token in Authorization header
 */
export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = extractTokenFromHeader(req.headers.authorization);

  if (!token) {
    logger.warn({
      correlationId: req.correlationId,
      path: req.path,
      ip: req.ip,
    }, 'Authentication failed: No token provided');

    return res.status(401).json({
      error: 'Authentication required. Please provide a valid token.',
    });
  }

  const payload = verifyToken(token);

  if (!payload) {
    logger.warn({
      correlationId: req.correlationId,
      path: req.path,
      ip: req.ip,
    }, 'Authentication failed: Invalid token');

    return res.status(401).json({
      error: 'Invalid or expired token. Please login again.',
    });
  }

  // Attach token payload to request for use in route handlers
  req.tokenPayload = payload;

  logger.debug({
    userId: payload.userId,
    correlationId: req.correlationId,
    path: req.path,
  }, 'User authenticated');

  next();
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't fail if missing
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = extractTokenFromHeader(req.headers.authorization);

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.tokenPayload = payload;
    }
  }

  next();
};
