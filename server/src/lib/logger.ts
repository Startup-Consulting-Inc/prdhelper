/**
 * Structured Logging with Pino
 *
 * Provides production-ready logging with:
 * - JSON format for log aggregation
 * - Correlation IDs for request tracing
 * - Pretty printing in development
 * - Configurable log levels
 */
import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';
const logLevel = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug');

export const logger = pino({
  level: logLevel,
  // Pretty print in development, JSON in production
  transport: !isProduction
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  // Base fields included in all logs
  base: {
    env: process.env.NODE_ENV || 'development',
  },
  // Timestamp format
  timestamp: pino.stdTimeFunctions.isoTime,
  // Format errors properly
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
});

/**
 * Create a child logger with additional context
 * Usage: const log = logger.child({ userId: 123, requestId: 'abc' })
 */
export const createLogger = (context: Record<string, any>) => {
  return logger.child(context);
};

/**
 * Log levels:
 * - trace: Very detailed, disabled in production
 * - debug: Debug information, disabled in production
 * - info: Informational messages
 * - warn: Warning messages
 * - error: Error messages
 * - fatal: Fatal errors that cause app termination
 */
