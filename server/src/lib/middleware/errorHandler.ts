/**
 * Secure Error Handler Middleware
 *
 * Handles errors securely by:
 * - Logging full error details server-side
 * - Returning safe error messages to clients
 * - Never exposing stack traces in production
 */
import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger.js';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Global error handler middleware
 * Must be registered after all routes
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Log full error details server-side
  logger.error({
    err,
    correlationId: req.correlationId,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    statusCode,
  }, 'Request error');

  // Prepare error response
  const errorResponse: any = {
    error: isProduction
      ? 'An error occurred. Please try again later.'
      : err.message,
    correlationId: req.correlationId,
  };

  // Include stack trace only in development
  if (!isProduction && err.stack) {
    errorResponse.stack = err.stack;
  }

  // Send response
  res.status(statusCode).json(errorResponse);
};

/**
 * Handle 404 errors
 * Must be registered after all routes but before error handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.warn({
    correlationId: req.correlationId,
    path: req.path,
    method: req.method,
    ip: req.ip,
  }, 'Route not found');

  res.status(404).json({
    error: 'Route not found',
    correlationId: req.correlationId,
  });
};
