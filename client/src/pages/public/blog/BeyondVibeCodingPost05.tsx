/**
 * Blog Post: You Already Have the Codebase. Here's How to Retrofit Engineering Discipline in a Day.
 *
 * Source: docs/agentic_docs/post_05.md
 */

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BlogPostLayout, type FaqItem } from '../../../components/blog/BlogPostLayout';
import {
  BeyondVibeCodingSeriesBanner,
  BeyondVibeCodingSeriesFooter,
} from './BeyondVibeCodingSeriesNav';
import { AgenticDocPre } from './AgenticDocPre';

const RETROFIT_PROMPT = `Analyze this codebase and produce three things:

1. A draft CLAUDE.md (or AGENTS.md) capturing the tech stack, apparent architectural rules, conventions used, and anything that seems like a deliberate constraint. Format it so it's useful as an agent instruction file.

2. A list of architectural decisions that appear to have been made, formatted as ADR stubs — just title, context, and decision. I'll fill in the consequences and alternatives.

3. A list of inconsistencies or contradictions you found in the codebase. Places where the same problem is solved two different ways, or where a pattern is followed everywhere except one place.`;

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What’s the fastest way to retrofit discipline into an agent-built codebase?',
    answer:
      'Use an agent to document the reality: generate a draft instruction file, stub ADRs, and identify inconsistencies directly from the code. Then edit, commit, and iterate.',
  },
  {
    question: 'Should I write docs from memory first?',
    answer:
      'No. It’s slow and inaccurate. Start with the retrofit prompt so the agent reads the actual codebase and produces a first draft you can refine.',
  },
  {
    question: 'What’s the minimum doc set for a small product with users?',
    answer:
      'A solid instruction file, 2–3 ADRs for scary decisions, a one-page threat model, and a deployment runbook (happy path).',
  },
  {
    question: 'What common mistakes undo the retrofit?',
    answer:
      'Keeping docs outside the repo, writing for humans instead of agents, letting docs drift from code, and wasting context window on ceremonial content.',
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
    slug: 'the-one-file-every-ai-developer-needs',
    title: 'The One File Every AI Developer Needs (And Almost Nobody Has)',
    category: 'AI & Development',
    date: '2026-05-08',
  },
  {
    slug: 'two-docs-before-2am-crisis',
    title: 'The Two Docs That Stand Between Your App and a 2am Crisis',
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

export default function BeyondVibeCodingPost05() {
  return (
    <BlogPostLayout
      title="You Already Have the Codebase. Here's How to Retrofit Engineering Discipline in a Day."
      author="Jaehee Song"
      date="2026-05-08"
      readTime="22 min read"
      category="AI & Development"
      excerpt="In the middle of a vibe-coded build? Use agents to document what’s actually true: draft your instruction file, stub ADRs, find inconsistencies, and ship guardrails without pausing feature work."
      slug="retrofit-engineering-discipline-in-a-day"
      coverImage="AI"
      coverGradient="from-slate-900 via-gray-900 to-emerald-800"
      faqItems={FAQ_ITEMS}
      relatedPosts={RELATED_POSTS}
    >
      <Helmet>
        <meta
          name="keywords"
          content="vibe coding, retrofit documentation, CLAUDE.md, AGENTS.md, ADR, threat model, deployment runbook, engineering discipline, agentic development"
        />
        <meta property="article:published_time" content="2026-05-08" />
        <meta property="article:section" content="AI & Development" />
        <meta property="article:tag" content="process" />
        <meta property="article:tag" content="documentation" />
      </Helmet>

      <ArticleShell>
        <BeyondVibeCodingSeriesBanner currentPart={5} />

        <P>
          Everything in this series so far assumed you could put the right documents in place before
          complexity arrives. Most readers aren’t there — they’re in the middle.
        </P>

        <P>
          You have a working app, built fast across a dozen sessions. It works, kind of. It’s fragile in
          ways you feel but can’t fully articulate. You’re not sure what every part does, or which
          decisions were deliberate vs defaults. Adding features feels increasingly risky.
        </P>

        <KeyLine>
          This post is about getting from “working but fragile” to “working and maintainable” — without
          a 40-page spec or pausing feature work for a week.
        </KeyLine>

        <SectionRule />

        <SectionTitle>The wrong way to start</SectionTitle>

        <P>
          The instinct is to write documentation from memory — reconstruct the PRD, describe every
          late-night decision. Don’t. It’s slow, inaccurate, and demoralizing: you’ll forget things, get
          details wrong, and stare at a blank page wondering what the real schema is.
        </P>

        <P>Use the same tools that built the codebase to document it.</P>

        <SectionRule />

        <SectionTitle>The retrofit prompt</SectionTitle>

        <P>Give an agent access to your full codebase and send this prompt:</P>

        <AgenticDocPre caption="Prompt (copy/paste)">{RETROFIT_PROMPT}</AgenticDocPre>

        <P>
          What comes back won’t be perfect — but it’ll be faster and more accurate than memory, because
          the agent reads the actual code.
        </P>

        <P>
          Edit ruthlessly: cut what’s wrong, add what it missed, commit. That first session — generate
          and edit — is roughly two hours. After that, every session starts with accurate context instead
          of guessing.
        </P>

        <SectionRule />

        <SectionTitle>A realistic timeline</SectionTitle>

        <P>
          The full retrofit isn’t a calendar week off — it’s about a day of focused work spread across
          normal shipping.
        </P>

        <div className="my-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(
            [
              {
                t: 'This afternoon',
                d: 'Run the retrofit prompt. Edit the CLAUDE.md draft ruthlessly. Commit it — your next agent session is already better than the last one.',
              },
              {
                t: 'Tomorrow (30 min)',
                d: 'Review ADR stubs from the agent. Pick three that represent decisions you’d hate to see reversed. Fill them in — especially “alternatives rejected.” Reference them from CLAUDE.md.',
              },
              {
                t: 'Day after (1 hour)',
                d: 'Write the deployment runbook happy path: how production happens, env vars, rollback. Skip documenting every failure mode — add those as you hit them.',
              },
            ] as const
          ).map((step) => (
            <div
              key={step.t}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 p-6 shadow-sm"
            >
              <p className="m-0 font-semibold text-gray-900 dark:text-gray-100">{step.t}</p>
              <p className="mt-2 mb-0 text-sm text-gray-600 dark:text-gray-300">{step.d}</p>
            </div>
          ))}
        </div>

        <P>
          <strong className="text-gray-900 dark:text-white">Ongoing (10–15 minutes per incident):</strong>{' '}
          When you fix something painful, log it. When you make a real architectural choice, ADR it.
          When you patch a security hole, update the threat model. Same day — sometimes same hour —
          while context is fresh.
        </P>

        <P>
          Total cost: about a day elapsed and a few hours writing. Payoff starts with the very next agent
          session.
        </P>

        <SectionRule />

        <SectionTitle>What docs you actually need (by where you are)</SectionTitle>

        <Subhead>Shipped this week, no real users yet</Subhead>
        <P>
          A <code className="font-mono text-sm">CLAUDE.md</code> with stack, three rules, two
          anti-requirements. Nothing else earns its time yet.
        </P>

        <Subhead>Small product, real users, cracks showing</Subhead>
        <ul className="my-6 list-disc pl-6 space-y-2 text-[1.05rem] leading-[1.78] text-gray-800 dark:text-gray-200">
          <li>
            <code className="font-mono text-sm">CLAUDE.md</code> with conventions + anti-requirements
          </li>
          <li>2–3 ADRs for your scariest decisions</li>
          <li>One-page threat model for real assets</li>
          <li>Deployment runbook, happy path only</li>
        </ul>

        <Subhead>Growing — multiple agents, contributors, daily shipping</Subhead>
        <ul className="my-6 list-disc pl-6 space-y-2 text-[1.05rem] leading-[1.78] text-gray-800 dark:text-gray-200">
          <li>Everything above, filled in</li>
          <li>ADRs for every real decision, not only the obvious ones</li>
          <li>Failure log after the first painful incident</li>
          <li>API docs for external surfaces</li>
          <li>QA notes per major feature</li>
        </ul>

        <P>
          ProPortrait AI, ClearlyReqs, and MyJob sit between “small product” and “growing” — shipping
          daily, real users, real money, different doc emphasis per product (payments/threat model vs AI
          proxy/serverless vs resume matching / isolation).
        </P>

        <Subhead>Complex multi-agent or compliance-required</Subhead>
        <ul className="my-6 list-disc pl-6 space-y-2 text-[1.05rem] leading-[1.78] text-gray-800 dark:text-gray-200">
          <li>Everything above, plus nested per-service instruction files where needed</li>
          <li>Data flow diagrams</li>
          <li>Agent behavior specs (touch / escalate rules)</li>
          <li>Security and compliance mapped to frameworks you owe</li>
        </ul>

        <P>Hermes Agent sits here — five properties, scheduled jobs, skills architecture locked by ADR.</P>

        <SectionRule />

        <SectionTitle>Mistakes that undo the work</SectionTitle>

        <div className="my-10 space-y-6 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/80 dark:bg-red-950/20 px-6 sm:px-8 py-7 shadow-sm">
          <div>
            <p className="m-0 font-semibold text-gray-900 dark:text-white">Writing docs agents never see</p>
            <p className="mt-2 mb-0 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
              Threat model in Notion, session starts without it — to the agent it doesn’t exist. Keep
              docs in-repo; reference them from <code className="font-mono text-xs">CLAUDE.md</code>.
            </p>
          </div>
          <div>
            <p className="m-0 font-semibold text-gray-900 dark:text-white">Treating the artifact as the goal</p>
            <p className="mt-2 mb-0 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
              Nobody cares if you have a “BRD.” They care whether agents behave consistently and you can
              debug quickly. A tight instruction file + three ADRs + runbook beats a 40-page PRD nobody
              feeds to sessions.
            </p>
          </div>
          <div>
            <p className="m-0 font-semibold text-gray-900 dark:text-white">Writing for humans, not agents</p>
            <p className="mt-2 mb-0 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
              Narrative prose belongs in blog posts. In instruction files, declarative rules win: “Never
              call Gemini from the frontend” beats vague “generally recommended to route AI via backend.”
            </p>
          </div>
          <div>
            <p className="m-0 font-semibold text-gray-900 dark:text-white">Letting docs drift from reality</p>
            <p className="mt-2 mb-0 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
              Docs that contradict code mislead every reader. On PRs that touch architecture, spend five
              minutes having an agent check conflicts with <code className="font-mono text-xs">CLAUDE.md</code>{' '}
              or ADRs.
            </p>
          </div>
          <div>
            <p className="m-0 font-semibold text-gray-900 dark:text-white">Ceremonial context burn</p>
            <p className="mt-2 mb-0 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
              Revision histories, stakeholder sign-off blocks, giant glossaries burn window without helping
              a session answer: what are the rules, and what must I not do?
            </p>
          </div>
        </div>

        <SectionRule />

        <SectionTitle>Where this genuinely doesn’t apply</SectionTitle>

        <P>
          Don’t cargo-cult. If specs change daily because you’re still discovering the product — use a
          20-line <code className="font-mono text-sm">CLAUDE.md</code> and a decision trail in commit
          messages. Throwaway prototype or one-off script — no docs. Must ship in four hours — ship,
          then tomorrow write what you cut and why. Match doc weight to complexity and lifespan.
        </P>

        <SectionRule />

        <SectionTitle>What changes when this works</SectionTitle>

        <P>
          New features stop breaking old ones as often — agents know what not to touch. Security issues
          surface at design time more than after user reports. A new contributor — human or agent — gets
          oriented in an hour instead of a day. Incidents have runbooks instead of pure panic.
          Contradictions stop accumulating as fast.
        </P>

        <P>
          And you move faster, not slower: friction without docs is invisible — bugs after ship, rewrites
          eating roadmap, fires instead of features. A small working doc set makes agent output better,
          breaks fewer things, and compounds speed.
        </P>

        <SectionRule />

        <SectionTitle>Start today</SectionTitle>

        <P>
          If you take one thing from this series: write the{' '}
          <code className="font-mono text-sm">CLAUDE.md</code> before your next session — about an hour
          including the retrofit prompt. Everything else builds on it.
        </P>

        <KeyLine>
          The developers who thrive in the agentic era aren’t the ones who prompt best. They’re the ones
          who give agents a shared understanding of what the system is, what it must do, and what it must
          never do.
        </KeyLine>

        <SectionRule />

        <SectionTitle>Resources &amp; series</SectionTitle>

        <Subhead>Official agent instruction docs</Subhead>
        <ul className="my-4 list-disc pl-6 space-y-2 text-sm text-gray-700 dark:text-gray-200">
          <li>
            <a
              href="https://docs.anthropic.com/en/docs/claude-code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Claude Code &amp; CLAUDE.md
            </a>
          </li>
          <li>
            <a href="https://agents.md" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
              AGENTS.md convention
            </a>
          </li>
          <li>
            <a
              href="https://docs.cursor.com/context/rules"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Cursor rules
            </a>
          </li>
          <li>
            <a
              href="https://docs.github.com/en/copilot/customizing-copilot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              GitHub Copilot instructions
            </a>
          </li>
        </ul>

        <Subhead>Architecture Decision Records</Subhead>
        <ul className="my-4 list-disc pl-6 space-y-2 text-sm text-gray-700 dark:text-gray-200">
          <li>
            <a
              href="https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Michael Nygard (2011) — documenting architecture decisions
            </a>
          </li>
          <li>
            <a
              href="https://github.com/joelparkerhenderson/architecture-decision-record"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              ADR templates &amp; tooling
            </a>
          </li>
        </ul>

        <Subhead>Engineering foundations</Subhead>
        <ul className="my-4 list-disc pl-6 space-y-2 text-sm text-gray-700 dark:text-gray-200">
          <li>
            <a href="https://12factor.net" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
              Twelve-Factor App
            </a>
          </li>
          <li>
            <a
              href="https://owasp.org/www-project-top-ten/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              OWASP Top 10
            </a>
          </li>
        </ul>

        <Subhead>Production systems referenced in this series</Subhead>
        <ul className="my-4 list-disc pl-6 space-y-2 text-sm text-gray-700 dark:text-gray-200">
          <li>
            <a
              href="https://portrait.ai-biz.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              ProPortrait AI
            </a>{' '}
            — auth, payments, threat model, CI/CD examples
          </li>
          <li>
            <a
              href="https://www.clearlyreqs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              ClearlyReqs
            </a>{' '}
            — serverless deployment &amp; runbook examples
          </li>
          <li>
            <a
              href="https://myjob.ai-biz.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              MyJob
            </a>{' '}
            — scale assumptions &amp; multi-user product examples
          </li>
          <li>Hermes Agent — multi-property VPS stack; skills architecture &amp; ADRs</li>
        </ul>

        <Subhead>This series (on this blog)</Subhead>
        <ul className="my-6 list-disc pl-6 space-y-2 text-sm text-gray-700 dark:text-gray-200">
          <li>
            <Link to="/blog/vibe-coded-app-why-it-breaks" className="text-primary-600 dark:text-primary-400 hover:underline">
              Post 1 — Your vibe-coded app works; here&apos;s why it&apos;s about to break
            </Link>
          </li>
          <li>
            <Link to="/blog/the-one-file-every-ai-developer-needs" className="text-primary-600 dark:text-primary-400 hover:underline">
              Post 2 — The one file every AI developer needs
            </Link>
          </li>
          <li>
            <Link to="/blog/stop-losing-architectural-decisions" className="text-primary-600 dark:text-primary-400 hover:underline">
              Post 3 — Stop losing architectural decisions to your agent
            </Link>
          </li>
          <li>
            <Link to="/blog/two-docs-before-2am-crisis" className="text-primary-600 dark:text-primary-400 hover:underline">
              Post 4 — The two docs before a 2am crisis
            </Link>
          </li>
        </ul>

        <P>
          More writing on shipping real AI products:{' '}
          <a
            href="https://ai-dev.clearlyreqs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            ai-dev.clearlyreqs.com
          </a>
          .{' '}
          <a href="https://clearlyreqs.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
            ClearlyReqs
          </a>{' '}
          helps generate specs and scaffolding files AI tools need.
        </P>

        <BeyondVibeCodingSeriesFooter currentPart={5} />
      </ArticleShell>
    </BlogPostLayout>
  );
}

