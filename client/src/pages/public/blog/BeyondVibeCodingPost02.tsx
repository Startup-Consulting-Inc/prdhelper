/**
 * Blog Post: The One File Every AI Developer Needs (And Almost Nobody Has)
 *
 * Source: docs/agentic_docs/post_02.md
 */

import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { BlogPostLayout, type FaqItem } from '../../../components/blog/BlogPostLayout';
import {
  BeyondVibeCodingSeriesBanner,
  BeyondVibeCodingSeriesFooter,
} from './BeyondVibeCodingSeriesNav';
import { AgenticDocPre } from './AgenticDocPre';

/** Excerpt from docs/agentic_docs/post_02.md — ProPortrait AI CLAUDE.md */
const PROPORTRAIT_CLAUDE_MD = `# Project: ProPortrait AI

## What this is
AI headshot generator (portrait.ai-biz.app). Upload any photo →
studio-quality professional portrait in 30 seconds via Gemini.
Identity-locked: skin tone, eye color, and hair preserved by design.
16 styles. Free to generate and edit; pay only to download
($4.99 single HD / $9.99 all platform sizes as ZIP).
Production stage: live, real users, paid product.

## Tech stack
- Frontend: React 19, Vite 6, Tailwind CSS 4, TypeScript 5.8
- Backend: Express + tsx (Node 22), deployed to Cloud Run
- Auth: Firebase Auth (email/password + Google OAuth)
- DB: Firestore
- Storage: Cloudflare R2 with signed URLs
- AI: Google Gemini (gemini-3.1-flash-image-preview)
- Payments: Stripe (one-time checkout, no subscriptions)

## Architectural rules (do not violate without an ADR)
- Frontend NEVER calls Gemini directly. All AI calls go through
  the backend at /api/portraits/*. The Gemini API key lives
  server-side only.
- All authenticated endpoints validate Firebase JWTs via
  authMiddleware. Anonymous users get a UUID cookie (pp_session).
- Credits are checked and decremented server-side only.
  Never trust the client's credit count.
- All Firestore writes go through server/lib/firestore.ts.
  No direct admin SDK calls from route handlers.

## What this service does NOT do
- No subscription billing. Stripe one-time payments only.
- No image processing on the frontend beyond basic compression.
- No custom email infrastructure. Use Resend for all outbound mail.
- No password reset flows we built. Firebase handles it.

## Required workflow
- Before considering anything done: npm run lint (tsc --noEmit)
  and npm run test
- New routes require auth middleware unless explicitly public
- Schema changes to Firestore require an ADR

## Known traps
- Vite proxies /api/* to localhost:3001 in dev only.
  In prod the frontend uses VITE_API_URL directly. Don't hardcode URLs.
- Session timeout is disabled during active generation — a long
  Gemini call takes 2-3 min and would log users out otherwise.
- Anonymous sessions and user accounts are separate Firestore docs
  until link-session is called on signup. Don't merge them early.`;

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is an “agent instruction file”?',
    answer:
      'A project-level document that loads at the start of every AI coding session and explains what the project is, the stack, constraints, and workflow rules so the agent doesn’t guess.',
  },
  {
    question: 'Which tools support it?',
    answer:
      'Claude Code uses CLAUDE.md; Cursor uses .cursor/rules/*.md; OpenAI Codex and many agentic tools use AGENTS.md; GitHub Copilot uses .github/copilot-instructions.md; OpenClaw distributes AGENTS.md plus SOUL.md, TOOLS.md, IDENTITY.md, and USER.md; Hermes uses modular Skills (each with SKILL.md) plus SOUL.md.',
  },
  {
    question: 'What should go inside?',
    answer:
      'Keep it tight: project purpose, stack, architectural rules (hard constraints), anti-requirements (boundaries), required workflow (tests/lint/build), and known traps.',
  },
  {
    question: 'Why are anti-requirements so important?',
    answer:
      'Agents are trained to “complete” systems. A clear “we do NOT do X” prevents the agent from building complexity you explicitly rejected.',
  },
  {
    question: 'How should I write it?',
    answer:
      'Write for agents: short declarative rules, explicit constraints, and concrete examples. Avoid vague “best practices” language.',
  },
];

const RELATED_POSTS = [
  {
    slug: 'vibe-coded-app-why-it-breaks',
    title: "Your Vibe-Coded App Works. Here's Why It's About to Break.",
    category: 'AI & Development',
    date: '2026-05-08',
  },
  {
    slug: 'stop-losing-architectural-decisions',
    title: 'Stop Losing Your Architectural Decisions to Your AI Agent',
    category: 'AI & Development',
    date: '2026-05-08',
  },
  {
    slug: 'retrofit-engineering-discipline-in-a-day',
    title: "You Already Have the Codebase. Here's How to Retrofit Engineering Discipline in a Day.",
    category: 'AI & Development',
    date: '2026-05-08',
  },
];

function P({ children }: { children: ReactNode }) {
  return (
    <p className="mb-7 last:mb-0 text-[1.05rem] sm:text-[1.125rem] leading-[1.78] text-gray-800 dark:text-gray-200">
      {children}
    </p>
  );
}

function KeyLine({ children }: { children: ReactNode }) {
  return (
    <p className="my-8 pl-5 border-l-[3px] border-emerald-600 dark:border-emerald-400 text-lg sm:text-xl font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-14 first:mt-0 mb-6 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
      {children}
    </h2>
  );
}

function Subhead({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-10 mb-4 text-base font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
      {children}
    </h3>
  );
}

function SectionRule() {
  return (
    <div
      className="my-12 h-px w-full bg-gradient-to-r from-transparent via-gray-300/90 dark:via-gray-600 to-transparent"
      aria-hidden
    />
  );
}

function ArticleShell({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose max-w-[680px] mx-auto w-full text-[1.05rem] sm:text-[1.125rem] leading-[1.78] text-gray-800 dark:text-gray-200">
      {children}
    </div>
  );
}

export default function BeyondVibeCodingPost02() {
  return (
    <BlogPostLayout
      title="The One File Every AI Developer Needs (And Almost Nobody Has)"
      author="Jaehee Song"
      date="2026-05-08"
      readTime="22 min read"
      category="AI & Development"
      excerpt="Every session starts cold. An agent instruction file fixes that: it tells your tools what this system is, what rules must not be violated, and what the service explicitly does not do."
      slug="the-one-file-every-ai-developer-needs"
      coverImage="AI"
      coverGradient="from-emerald-700 via-slate-800 to-gray-900"
      faqItems={FAQ_ITEMS}
      relatedPosts={RELATED_POSTS}
    >
      <Helmet>
        <meta
          name="keywords"
          content="CLAUDE.md, AGENTS.md, cursor rules, copilot instructions, agent instruction file, ai coding standards, vibe coding, AI developer workflow, documentation for agents"
        />
        <meta property="article:published_time" content="2026-05-08" />
        <meta property="article:section" content="AI & Development" />
        <meta property="article:tag" content="documentation" />
        <meta property="article:tag" content="agents" />
      </Helmet>

      <ArticleShell>
        <BeyondVibeCodingSeriesBanner currentPart={2} />

        <P>
          There’s a moment every vibe coder hits where they realize something is wrong with how they’re
          working. Not wrong with the code. Wrong with the sessions.
        </P>

        <P>
          You open a new Claude Code session on Monday and do good work. On Wednesday you open another
          session and ask it to add a feature — and it rewrites something from Monday in a subtly
          different way. Different naming convention. Different auth pattern. Different database access
          style. None of it is broken, exactly. But it’s inconsistent. And the inconsistency accumulates.
          Within two weeks you have a codebase that feels like it was written by five different
          developers who never talked to each other.
        </P>

        <P>That’s because it was. Each session is a fresh context. Each agent starts cold.</P>

        <KeyLine>The fix is a single file. And almost nobody uses it.</KeyLine>

        <SectionRule />

        <SectionTitle>What it is</SectionTitle>

        <P>
          Every major AI coding tool has a concept of a project-level instruction file — a document that
          loads automatically at the start of every session and tells the agent what it needs to know
          about this codebase before writing a single line.
        </P>

        <P>Different tools call it different things. The core idea is identical:</P>

        <div className="my-10 rounded-2xl border border-gray-200/80 dark:border-gray-600/50 bg-white dark:bg-gray-900/40 p-7 shadow-sm space-y-4 text-sm text-gray-700 dark:text-gray-200">
          <ul className="m-0 list-disc pl-5 space-y-3">
            <li>
              <a
                href="https://docs.anthropic.com/en/docs/claude-code"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                Claude Code
              </a>{' '}
              reads <code className="font-mono text-xs">CLAUDE.md</code> files, including nested and
              project-scoped variants like <code className="font-mono text-xs">.claude/CLAUDE.md</code>.
            </li>
            <li>
              <a
                href="https://cursor.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                Cursor
              </a>{' '}
              reads <code className="font-mono text-xs">.cursor/rules/*.md</code> with glob-based scoping
              — different rules for frontend vs backend, for example.
            </li>
            <li>
              <a
                href="https://openai.com/codex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                OpenAI Codex
              </a>{' '}
              and most other agentic coding tools use{' '}
              <code className="font-mono text-xs">AGENTS.md</code> as the conventional repo-level file.
            </li>
            <li>
              <a
                href="https://github.com/features/copilot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                GitHub Copilot
              </a>{' '}
              reads <code className="font-mono text-xs">.github/copilot-instructions.md</code>.
            </li>
            <li>
              <a
                href="https://openclaw.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                OpenClaw
              </a>{' '}
              uses <code className="font-mono text-xs">AGENTS.md</code> plus bootstrap files:{' '}
              <code className="font-mono text-xs">SOUL.md</code>,{' '}
              <code className="font-mono text-xs">TOOLS.md</code>,{' '}
              <code className="font-mono text-xs">IDENTITY.md</code>, and{' '}
              <code className="font-mono text-xs">USER.md</code> — distributed rather than one place.
            </li>
          </ul>
          <p className="m-0 mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
            <strong className="text-gray-900 dark:text-white">Hermes Agent</strong> takes a different
            approach: modular Skills — each folder has a <code className="font-mono text-xs">SKILL.md</code>{' '}
            describing what it does, when to invoke it, and procedures. A separate{' '}
            <code className="font-mono text-xs">SOUL.md</code> anchors tone and persona across skills and
            channels. The “instruction file” is a distributed skill registry with a unified personality
            layer.
          </p>
        </div>

        <P>
          Same fundamental idea: give the agent something to read before it touches anything. This file
          is the brief your agent reads first — the document that turns a cold-start session into one that
          already knows the rules.
        </P>

        <SectionRule />

        <SectionTitle>What goes in it</SectionTitle>

        <P>Six things. Keep it tight.</P>

        <div className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              {
                t: '1. What this project is',
                d: 'One short paragraph. What does it do? Who uses it? What stage is it at?',
              },
              {
                t: '2. The tech stack',
                d: 'Not a history lesson — current truth: framework, database, key services, deployment target.',
              },
              {
                t: '3. Architectural rules',
                d: 'Decisions that must not be reversed without a deliberate conversation. Load-bearing constraints — write as explicit prohibitions, not suggestions.',
              },
              {
                t: '4. Anti-requirements',
                d: 'What this service does not do. Boundaries. What another service handles. The most underused, powerful section — agents constantly try to “complete” things you left out on purpose.',
              },
              {
                t: '5. Required workflow',
                d: 'What “done” means: run tests, lint, don’t push without CI — your actual rules.',
              },
              {
                t: '6. Known traps',
                d: 'Things that look like good ideas but aren’t — non-obvious FKs, disabled timeouts, integrations that need a specific header.',
              },
            ] as const
          ).map((item) => (
            <div
              key={item.t}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 p-6 shadow-sm"
            >
              <p className="m-0 font-semibold text-gray-900 dark:text-gray-100">{item.t}</p>
              <p className="mt-2 mb-0 text-sm text-gray-600 dark:text-gray-300">{item.d}</p>
            </div>
          ))}
        </div>

        <SectionRule />

        <SectionTitle>A real example</SectionTitle>

        <P>
          Here’s the <code className="font-mono text-sm">CLAUDE.md</code> from{' '}
          <a
            href="https://portrait.ai-biz.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            ProPortrait AI
          </a>{' '}
          — an AI headshot generator that preserves identity while turning any photo into a
          studio-quality portrait (free to generate, pay only to download):
        </P>

        <AgenticDocPre caption="Example: CLAUDE.md (ProPortrait AI)">{PROPORTRAIT_CLAUDE_MD}</AgenticDocPre>

        <P>
          That’s about 50 lines. An agent in a new session will not call Gemini from the React frontend
          (which would expose the API key). It will not add subscription billing. It will not hardcode
          API URLs. It will not ship a custom password reset flow. It knows about the session timeout
          exception and won’t “fix” it blindly.
        </P>

        <P>
          Every one of those mistakes has been made by agents on codebases without this file. Here, the
          file prevents them before the first line of code is written.
        </P>

        <SectionRule />

        <SectionTitle>The most important section: anti-requirements</SectionTitle>

        <P>
          Most developers write down what their system does. Fewer write down what it doesn’t do. In
          agentic development, that’s backwards. Agents are trained on vast code and are extremely
          opinionated about “completing” things. They see Stripe and want subscriptions. They see Firebase
          Auth and want social login. They see an endpoint without rate limiting and want to add it.
        </P>

        <P>Sometimes that’s helpful. Often it introduces complexity you explicitly rejected.</P>

        <KeyLine>
          Anti-requirements are your defense. “No subscription billing” is one line that stops an agent
          from spending an hour on a feature you don’t want.
        </KeyLine>

        <P>Write them clearly. The more specific, the better.</P>

        <SectionRule />

        <SectionTitle>Write for agents, not humans</SectionTitle>

        <P>
          You’ve been trained to write for humans — flowing prose, narrative structure. Human readers
          infer and fill gaps. Agents act on what’s explicit; vague instructions get interpreted, and the
          interpretation won’t always match what you meant.
        </P>

        <Subhead>Vague vs concrete</Subhead>

        <div className="my-10 grid grid-cols-1 gap-4">
          <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/90 dark:bg-amber-950/20 px-6 py-6">
            <p className="m-0 text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-2">
              Vague
            </p>
            <p className="m-0 text-sm italic text-gray-800 dark:text-gray-200 leading-relaxed">
              Use standard authentication patterns and follow security best practices.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/30 px-6 py-6">
            <p className="m-0 text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-2">
              Concrete
            </p>
            <p className="m-0 text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
              Auth is handled by Firebase Auth on the client (email/password and Google OAuth). The
              frontend calls getIdToken() for a fresh JWT, sent as Authorization: Bearer &lt;token&gt; on
              every authenticated request. The server’s authMiddleware validates the JWT and attaches
              req.auth = &#123; mode: &apos;user&apos;, uid, email &#125; for handlers. If no token, fall
              back to anonymous session cookie (pp_session). Never log JWTs. Never return them in API
              responses.
            </p>
          </div>
        </div>

        <P>
          The first version sounds fine. The second actually works: short declarative sentences,
          explicit rules, no room for interpretation.
        </P>

        <Subhead>Your 15-minute challenge</Subhead>

        <P>
          Create <code className="font-mono">CLAUDE.md</code> (or <code className="font-mono">AGENTS.md</code>)
          and write:
        </P>

        <div className="my-10 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/30 px-6 sm:px-8 py-7 shadow-sm">
          <ol className="m-0 list-decimal pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-200">
            <li>Two sentences about what the project is.</li>
            <li>The current stack.</li>
            <li>Three rules that must not be broken.</li>
            <li>Two things the service explicitly doesn’t do.</li>
            <li>One known trap that bit you recently.</li>
          </ol>
        </div>

        <P>
          Commit it. From your next session forward, every agent reads it — and your code stops drifting
          session by session.
        </P>

        <P>
          The file will be wrong in places and incomplete. That’s fine: it’s better than nothing, and
          nothing is what most codebases have right now. Edit as you go. The best instruction files grow
          one painful lesson at a time.
        </P>

        <BeyondVibeCodingSeriesFooter currentPart={2} />
      </ArticleShell>
    </BlogPostLayout>
  );
}

