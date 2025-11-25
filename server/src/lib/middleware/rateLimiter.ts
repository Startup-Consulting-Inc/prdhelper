/**
 * Rate Limiting Middleware
 *
 * Protects endpoints from abuse by limiting request rates.
 * Different limits for different endpoint types:
 * - Authentication: 5 requests per 15 minutes
 * - File uploads: 10 requests per hour
 * - General API: 100 requests per 15 minutes
 */
import rateLimit from 'express-rate-limit';
import { logger } from '../logger.js';

/**
 * Rate limit for authentication endpoints
 * Prevents brute force attacks on login/signup
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    error: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count all requests
  handler: (req, res) => {
    logger.warn({
      ip: req.ip,
      path: req.path,
      type: 'auth_rate_limit',
    }, 'Authentication rate limit exceeded');

    res.status(429).json({
      error: 'Too many authentication attempts. Please try again in 15 minutes.',
    });
  },
});

/**
 * Rate limit for file upload endpoints
 * Prevents storage abuse
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: {
    error: 'Too many file uploads. Please try again in an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn({
      ip: req.ip,
      path: req.path,
      type: 'upload_rate_limit',
    }, 'Upload rate limit exceeded');

    res.status(429).json({
      error: 'Too many file uploads. Please try again in an hour.',
    });
  },
});

/**
 * General API rate limiter
 * Applied to all API routes
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    error: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
  handler: (req, res) => {
    logger.warn({
      ip: req.ip,
      path: req.path,
      type: 'api_rate_limit',
    }, 'API rate limit exceeded');

    res.status(429).json({
      error: 'Too many requests. Please try again later.',
    });
  },
});

/**
 * Strict rate limiter for sensitive operations
 * Use for password reset, account deletion, etc.
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: {
    error: 'Too many attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn({
      ip: req.ip,
      path: req.path,
      type: 'strict_rate_limit',
    }, 'Strict rate limit exceeded');

    res.status(429).json({
      error: 'Too many attempts. Please try again in an hour.',
    });
  },
});
