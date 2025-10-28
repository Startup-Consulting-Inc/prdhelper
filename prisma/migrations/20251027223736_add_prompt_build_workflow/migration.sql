-- Migration: Add Prompt Build Workflow Support
-- 
-- Adds PROMPT_BUILD document type and related project phases for vibe coding tools.
-- Enables generation of copy-paste ready prompts for Loveable, V0, Bolt, etc.
-- 
-- Recent Changes:
-- - [2025-10-27] FEAT: Added PROMPT_BUILD document type and workflow phases

-- AlterEnum
ALTER TYPE "DocumentType" ADD VALUE 'PROMPT_BUILD';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProjectPhase" ADD VALUE 'PROMPT_BUILD_GENERATING';
ALTER TYPE "ProjectPhase" ADD VALUE 'PROMPT_BUILD_READY';
