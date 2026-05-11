/**
 * Cache Utility for Question Explanations & Example Answers
 *
 * Provides in-memory LRU caching for AI-generated wizard helpers
 * (question explanations + example answers) to reduce API calls
 * and improve response times.
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
 * Example-answers response structure
 *
 * 2–3 concrete suggested answers an end-user can adapt before submitting
 * their own response to a wizard question.
 */
export interface ExampleAnswer {
  id: string;
  label: string;
  answer: string;
  rationale?: string;
}

export interface ExampleAnswersResponse {
  examples: ExampleAnswer[];
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
 * LRU Cache for storing example-answer suggestions.
 * Same TTL / size policy as the explanation cache.
 */
export const exampleAnswersCache = new LRUCache<string, ExampleAnswersResponse>({
  max: 500,
  ttl: 1000 * 60 * 60 * 24,
  updateAgeOnGet: true,
  updateAgeOnHas: false,
});

/**
 * Deterministic cache key for example-answer suggestions. Keyed off every
 * field that materially changes the prompt so different projects, modes,
 * or document types don't collide.
 */
export function hashExampleAnswers(
  question: string,
  projectMode: string,
  documentType: string,
  projectTitle: string,
  projectDescription: string
): string {
  const content = [question, projectMode, documentType, projectTitle, projectDescription].join('\u0001');
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
}

/**
 * Cache statistics for monitoring
 */
export function getCacheStats() {
  return {
    explanation: {
      size: explanationCache.size,
      max: explanationCache.max,
      utilization: (explanationCache.size / (explanationCache.max || 1)) * 100,
    },
    exampleAnswers: {
      size: exampleAnswersCache.size,
      max: exampleAnswersCache.max,
      utilization: (exampleAnswersCache.size / (exampleAnswersCache.max || 1)) * 100,
    },
  };
}

/**
 * Clear all cached explanations (useful for testing/development)
 */
export function clearExplanationCache() {
  explanationCache.clear();
}

/**
 * Clear all cached example-answer suggestions (useful for testing/development)
 */
export function clearExampleAnswersCache() {
  exampleAnswersCache.clear();
}
