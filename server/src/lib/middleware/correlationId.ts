/**
 * Request Correlation ID Middleware
 *
 * Generates or extracts a unique ID for each request.
 * This ID is used to trace requests across logs and services.
 */
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
    }
  }
}

/**
 * Middleware to add correlation ID to requests
 * Checks for existing ID in header, otherwise generates new one
 */
export const correlationIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if correlation ID exists in header (from upstream service/proxy)
  const existingId = req.headers['x-correlation-id'] as string;

  // Use existing ID or generate new one
  const correlationId = existingId || randomUUID();

  // Attach to request for use in handlers
  req.correlationId = correlationId;

  // Add to response headers for debugging
  res.setHeader('X-Correlation-ID', correlationId);

  next();
};
