import crypto from 'crypto';

/**
 * Generate a secure random verification token
 * @returns A 32-byte hex string (64 characters)
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Get token expiration time (24 hours from now)
 * @returns Date object representing expiration time
 */
export function getTokenExpiration(): Date {
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 24);
  return expiration;
}

/**
 * Check if a token has expired
 * @param expirationDate - The expiration date to check
 * @returns true if expired, false otherwise
 */
export function isTokenExpired(expirationDate: Date): boolean {
  return new Date() > expirationDate;
}
