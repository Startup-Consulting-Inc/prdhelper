/**
 * Shared configuration constants
 *
 * Centralizes environment-variable-backed config to avoid inconsistencies
 * across modules (e.g., different default bucket names).
 */

export const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME || 'prd-helper-uploads';
