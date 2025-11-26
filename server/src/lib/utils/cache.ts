/**
 * Cache Utility for Question Explanations
 *
 * Provides in-memory LRU caching for AI-generated explanations
 * to reduce API calls and improve response times.
 */

import { LRUCache } from 'lru-cache';
import crypto from 'crypto';

/**
 * Explanation response structure
 */
export interface ExplanationResponse {
  purpose: string;
  importance: string;
  tips: string[];
  recommendation?: string;
  examples?: string[];
  prosAndCons?: { option: string; pros: string[]; cons: string[] }[];
  answerAnalysis?: {
    option: string;
    explanation: string;
    pros: string[];
    cons: string[];
    recommendation: string;
  }[];
}

/**
 * LRU Cache for storing question explanations
 * - Max 500 entries
 * - 24-hour TTL (Time To Live)
 * - Automatic eviction of oldest entries when full
 */
export const explanationCache = new LRUCache<string, ExplanationResponse>({
  max: 500, // Maximum number of items in cache
  ttl: 1000 * 60 * 60 * 24, // 24 hours in milliseconds
  updateAgeOnGet: true, // Reset TTL when item is accessed
  updateAgeOnHas: false, // Don't reset TTL on existence check
});

/**
 * Generate a deterministic hash key for caching
 *
 * @param question - The AI question to explain
 * @param projectMode - PLAIN or TECHNICAL mode
 * @returns 16-character hash string
 */
export function hashExplanation(question: string, projectMode: string): string {
  const content = `${question}:${projectMode}`;
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
}

/**
 * Cache statistics for monitoring
 */
export function getCacheStats() {
  return {
    size: explanationCache.size,
    max: explanationCache.max,
    utilization: (explanationCache.size / (explanationCache.max || 1)) * 100,
  };
}

/**
 * Clear all cached explanations (useful for testing/development)
 */
export function clearExplanationCache() {
  explanationCache.clear();
}
