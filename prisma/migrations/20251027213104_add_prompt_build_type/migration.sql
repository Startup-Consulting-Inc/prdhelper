-- Migration: Add PROMPT_BUILD to PromptType Enum
-- 
-- Adds PROMPT_BUILD as a new prompt type for vibe coding tool prompts.
-- Enables system prompts for generating copy-paste ready prompts.
-- 
-- Recent Changes:
-- - [2025-10-27] FEAT: Added PROMPT_BUILD prompt type for vibe coding tools

-- AlterEnum
ALTER TYPE "PromptType" ADD VALUE 'PROMPT_BUILD';
