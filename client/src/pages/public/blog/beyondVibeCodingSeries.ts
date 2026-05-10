/**
 * “Beyond Vibe Coding” series — ordered posts for prev/next and TOC.
 */

export const BEYOND_VIBE_CODING_SERIES_TITLE = 'Beyond Vibe Coding';

export interface BeyondVibeCodingSeriesPost {
  part: number;
  slug: string;
  title: string;
}

export const BEYOND_VIBE_CODING_SERIES_POSTS: readonly BeyondVibeCodingSeriesPost[] = [
  {
    part: 1,
    slug: 'vibe-coded-app-why-it-breaks',
    title: "Your Vibe-Coded App Works. Here's Why It's About to Break.",
  },
  {
    part: 2,
    slug: 'the-one-file-every-ai-developer-needs',
    title: 'The One File Every AI Developer Needs (And Almost Nobody Has)',
  },
  {
    part: 3,
    slug: 'stop-losing-architectural-decisions',
    title: 'Stop Losing Your Architectural Decisions to Your AI Agent',
  },
  {
    part: 4,
    slug: 'two-docs-before-2am-crisis',
    title: 'The Two Docs That Stand Between Your App and a 2am Crisis',
  },
  {
    part: 5,
    slug: 'retrofit-engineering-discipline-in-a-day',
    title:
      "You Already Have the Codebase. Here's How to Retrofit Engineering Discipline in a Day.",
  },
] as const;

export type BeyondVibeCodingSeriesPart = 1 | 2 | 3 | 4 | 5;
