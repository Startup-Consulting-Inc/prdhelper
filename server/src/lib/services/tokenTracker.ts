/**
 * Token Usage Tracking Service
 *
 * Tracks AI API token usage and costs for analytics and billing.
 */

import { getFirestore } from '../firebase.js';
import admin from 'firebase-admin';

// Model pricing (cost per 1M tokens in USD).
// Primary provider is Moonshot (Kimi). OpenRouter prices kept for legacy
// usage records that still reference those model slugs.
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  // Moonshot Kimi (official prices from platform.moonshot.ai)
  'kimi-k2.6': { input: 0.95, output: 4.0 },
  'kimi-k2.5': { input: 0.6, output: 2.5 },
  'kimi-k2-thinking': { input: 0.6, output: 2.5 },
  'kimi-k2-thinking-turbo': { input: 1.0, output: 4.0 },
  'kimi-k2-0905-preview': { input: 0.6, output: 2.5 },
  'kimi-k2-0711-preview': { input: 0.6, output: 2.5 },
  'kimi-k2-turbo-preview': { input: 1.0, output: 4.0 },
  'moonshot-v1-8k': { input: 0.15, output: 1.5 },
  'moonshot-v1-32k': { input: 0.3, output: 3.0 },
  'moonshot-v1-128k': { input: 0.6, output: 6.0 },

  // Legacy OpenRouter slugs (fallback rollout window)
  'google/gemini-2.0-flash-exp:free': { input: 0, output: 0 },
  'google/gemini-2.5-flash': { input: 0.15, output: 0.6 },
  'google/gemini-pro': { input: 0.5, output: 1.5 },
  'anthropic/claude-3-5-sonnet': { input: 3.0, output: 15.0 },
  'anthropic/claude-3-opus': { input: 15.0, output: 75.0 },
  'openai/gpt-4-turbo': { input: 10.0, output: 30.0 },
  'openai/gpt-4': { input: 30.0, output: 60.0 },
  'openai/gpt-3.5-turbo': { input: 0.5, output: 1.5 },
};

/**
 * Calculate estimated cost based on token usage and model
 */
export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = MODEL_PRICING[model] || MODEL_PRICING['kimi-k2.6'];

  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;

  return inputCost + outputCost;
}

/**
 * Track token usage for an AI operation
 */
export async function trackTokenUsage(data: {
  userId: string;
  projectId?: string;
  operation: string;
  model: string;
  tokensUsed: number;
  inputTokens?: number;
  outputTokens?: number;
}): Promise<void> {
  const { userId, projectId, operation, model, tokensUsed, inputTokens = 0, outputTokens = tokensUsed } = data;

  // Calculate cost
  const cost = calculateCost(model, inputTokens, outputTokens);

  // Store in database
  const db = getFirestore();
  await db.collection('tokenUsage').add({
    userId,
    projectId: projectId || null,
    operation,
    model,
    tokensUsed,
    inputTokens,
    outputTokens,
    cost,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Estimate token count from text (rough approximation)
 * Average: 1 token ≈ 4 characters
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
