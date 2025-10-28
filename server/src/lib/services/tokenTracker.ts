/**
 * Token Usage Tracking Service
 *
 * Tracks AI API token usage and costs for analytics and billing.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Model pricing (cost per 1M tokens in USD)
// Based on typical OpenRouter pricing
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
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
  const pricing = MODEL_PRICING[model] || MODEL_PRICING['google/gemini-2.5-flash'];

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
  await prisma.tokenUsage.create({
    data: {
      userId,
      projectId,
      operation,
      model,
      tokensUsed,
      cost,
    },
  });
}

/**
 * Estimate token count from text (rough approximation)
 * Average: 1 token ≈ 4 characters
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
