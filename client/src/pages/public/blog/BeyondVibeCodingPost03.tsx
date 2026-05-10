/**
 * Blog Post: Stop Losing Your Architectural Decisions to Your AI Agent
 *
 * Source: docs/agentic_docs/post_03.md
 */

import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { BlogPostLayout, type FaqItem } from '../../../components/blog/BlogPostLayout';
import {
  BeyondVibeCodingSeriesBanner,
  BeyondVibeCodingSeriesFooter,
} from './BeyondVibeCodingSeriesNav';
import { AgenticDocPre } from './AgenticDocPre';

const ADR_003_BILLING = `# ADR-003: Stripe one-time payments instead of subscriptions

## Status
Accepted, 2025-08-22

## Context
We needed a billing model. The obvious choices were a monthly subscription
(e.g., $9.99/mo unlimited) or one-time credit packs ($4.99 for HD download,
$9.99 for bundle).

## Decision
Use Stripe one-time checkout sessions for credit packs.
No subscriptions. Credits never expire.

## Consequences
- Pro: Lower friction. Users pay when they want output, not monthly.
  Converts much better for an occasional-use tool.
- Pro: No churn metrics. No cancellation flow. No proration logic.
- Pro: Webhooks are simple — checkout.session.completed, done.
- Con: Lower LTV than a healthy subscription would yield.
- Con: Re-engagement requires active marketing; no recurring charge.

## Alternatives rejected
- Monthly subscription: Wrong fit for occasional use. Would suppress
  signups from people who just want to try it once.
- Pay-per-generation: Too granular. Nasty edge case if Gemini fails
  after we charge.
- Free with ads: Doesn't match the premium positioning.

## Reversal cost
Medium. Adding subscriptions later is possible — Stripe supports both.
The hard part would be migrating existing credit balances into a
subscription model, which we'd handle by grandfathering.`;

const ADR_011_SKILLS = `# ADR-011: Skills over specialized agents

## Status
Accepted, 2025-09

## Context
Hermes runs a growing set of automations across five properties.
The natural design was one specialized agent per task type —
a research agent, a monitoring agent, a writing agent.

After building the first three, the problems were clear:
- Each agent duplicated boilerplate (LLM client, retry logic,
  Telegram dispatch, file I/O)
- Cross-agent workflows required fragile handoffs
- Adding a new automation meant building new infrastructure
- Each agent's prompt drifted independently

## Decision
Replace specialized agents with a single runtime that loads
modular Skills. A Skill is a folder with a SKILL.md describing
what it does, when to invoke it, and the procedures it follows.
The runtime picks skills based on the task.

## Consequences
- Pro: Adding capability = writing a new SKILL.md, not building infra
- Pro: Cross-skill workflows are natural (one agent, multiple skills)
- Pro: All boilerplate lives once in the runtime
- Pro: Skills are independently testable and versionable
- Con: The runtime must be flexible enough for every skill's needs
- Con: A bad SKILL.md description can mislead the agent

## Alternatives rejected
- Specialized agents: Tried it. Too much duplication, too brittle.
- Single monolithic prompt: Hits context limits. Unmaintainable.
- LangGraph / CrewAI: Overkill. Heavy framework lock-in.

## Reversal cost
High. The skills model is now load-bearing across all five properties.
Reverting means rebuilding each skill as a standalone agent —
weeks of work. We accepted this lock-in deliberately.`;

const CLAUDE_ADR_REFS = `## Read before making architectural changes
- docs/adrs/ADR-003-billing-model.md
- docs/adrs/ADR-007-auth-pattern.md
- docs/adrs/ADR-011-skills-architecture.md`;

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is an ADR?',
    answer:
      'An Architecture Decision Record is a short doc capturing one decision: what you chose, why, what you rejected, and what it would cost to reverse later.',
  },
  {
    question: 'Why do ADRs matter more with agents?',
    answer:
      'Because every new session is a new teammate. Agents default to common patterns; ADRs are the receipts that tell them the “unusual” choice was deliberate.',
  },
  {
    question: 'What’s the most valuable ADR section?',
    answer:
      'Alternatives rejected (so you don’t re-argue weekly) and reversal cost (so agents pause before “improving” load-bearing decisions).',
  },
  {
    question: 'When should I write ADRs?',
    answer:
      'Whenever you choose between viable options, reject a “natural” addition, or make a high-reversal-cost decision.',
  },
];

const RELATED_POSTS = [
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

export default function BeyondVibeCodingPost03() {
  return (
    <BlogPostLayout
      title="Stop Losing Your Architectural Decisions to Your AI Agent"
      author="Jaehee Song"
      date="2026-05-08"
      readTime="16 min read"
      category="AI & Development"
      excerpt="You made the decision for a reason. Without ADRs, a future session will “correct” it back to the default pattern. ADRs are the receipts that keep agentic development consistent."
      slug="stop-losing-architectural-decisions"
      coverImage="AI"
      coverGradient="from-slate-900 via-emerald-800 to-gray-900"
      faqItems={FAQ_ITEMS}
      relatedPosts={RELATED_POSTS}
    >
      <Helmet>
        <meta
          name="keywords"
          content="architecture decision records, ADR, agentic development, vibe coding, AI coding, architectural drift, engineering decisions, reversal cost"
        />
        <meta property="article:published_time" content="2026-05-08" />
        <meta property="article:section" content="AI & Development" />
        <meta property="article:tag" content="architecture" />
        <meta property="article:tag" content="agents" />
      </Helmet>

      <ArticleShell>
        <BeyondVibeCodingSeriesBanner currentPart={3} />

        <P>
          Here’s a scenario that happens more than anyone admits. You spend a careful afternoon
          deciding how authentication should work. You pick server-side sessions over JWTs — revocation
          is simpler, cookie security is better for browser clients, and you don’t need stateless JWT
          benefits at your scale. You implement it. It works.
        </P>

        <P>
          Three days later you open a new session to build a related feature. The agent looks at the
          codebase, decides your auth approach is unusual, and refactors toward JWTs because that’s the
          more common pattern in its training data. You don’t notice until something breaks.
        </P>

        <KeyLine>
          You just lost an architectural decision — not because JWTs are wrong, but because nobody told
          the agent your choice was deliberate.
        </KeyLine>

        <P>
          This is the specific problem Architecture Decision Records solve — decision continuity, not
          documentation theater.
        </P>

        <SectionRule />

        <SectionTitle>What an ADR actually is</SectionTitle>

        <P>
          An ADR is usually a single page that captures one architectural decision — not all of them at
          once. One decision per document.
        </P>

        <div className="my-10 rounded-2xl border border-gray-200/80 dark:border-gray-600/50 bg-white dark:bg-gray-900/40 p-7 shadow-sm">
          <p className="m-0 text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
            The four fields
          </p>
          <ul className="m-0 list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <strong>What you decided</strong>
            </li>
            <li>
              <strong>Why</strong> — context and constraints at the time
            </li>
            <li>
              <strong>What you rejected</strong> and why
            </li>
            <li>
              <strong>What it would cost to reverse</strong> later
            </li>
          </ul>
        </div>

        <P>
          That last part is the one most people skip — and the most valuable. Writing reversal cost
          forces you to ask whether a decision is a real commitment or a tentative default. It also
          signals to future agents how carefully they should think before changing something.
        </P>

        <P>
          ADRs live in your repo — usually <code className="font-mono text-sm">docs/adrs/</code> —
          and get referenced from your <code className="font-mono text-sm">CLAUDE.md</code>. When an
          agent loads your project, it sees the reasoning behind the rules, not just the rules.
        </P>

        <KeyLine>
          Reversal cost is the line that makes agents pause before “improving” something load-bearing.
        </KeyLine>

        <SectionRule />

        <SectionTitle>Why AI development makes ADRs more important</SectionTitle>

        <P>
          Traditional teams use ADRs to communicate across human teammates over time: “How does the
          person who joins in six months understand why we built it this way?”
        </P>

        <P>
          In agentic development, that problem arrives in six hours, not six months. Every new session
          is a fresh teammate who doesn’t know the history. Every parallel agent on another feature is a
          colleague who might be making incompatible assumptions right now.
        </P>

        <P>
          Without ADRs, agents default to patterns — and patterns conflict with deliberate choices. The
          more opinionated your architecture, the more likely an agent is to “correct” it toward
          something conventional.
        </P>

        <P>
          ADRs are the receipts: this was intentional; here’s why; don’t change it without understanding
          what you’re undoing.
        </P>

        <SectionRule />

        <SectionTitle>A real ADR: billing architecture</SectionTitle>

        <P>
          From{' '}
          <a
            href="https://portrait.ai-biz.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            ProPortrait AI
          </a>{' '}
          — billing was a genuine trade-off, not a default:
        </P>

        <AgenticDocPre caption="ADR-003 — Stripe one-time payments">{ADR_003_BILLING}</AgenticDocPre>

        <P>
          Any agent working on billing sees not just what exists, but why. It won’t suggest
          subscriptions as an “obvious improvement” — that choice was considered and rejected with
          reasoning.
        </P>

        <SectionRule />

        <SectionTitle>A real ADR: architecture that shapes everything</SectionTitle>

        <P>
          Some decisions are small. Others are load-bearing. From Hermes Agent — automations across five
          web properties — the skills-vs-agents call was structural:
        </P>

        <AgenticDocPre caption="ADR-011 — Skills over specialized agents">{ADR_011_SKILLS}</AgenticDocPre>

        <P>
          Notice the reversal cost is <em>high</em>, and the document says so. That single line is worth
          more than the rest combined — anyone who reads it will pause before touching the architecture.
        </P>

        <SectionRule />

        <SectionTitle>The most useful part nobody writes</SectionTitle>

        <Subhead>Alternatives rejected</Subhead>

        <P>
          This is where you document paths not taken — and the first thing people skip when they’re in a
          hurry. It answers “why don’t we just do X?” six times a week. If X is listed with a reason, the
          question answers itself. If not, you answer it verbally forever.
        </P>

        <P>
          Write alternatives even when the reasoning feels obvious — especially then. What’s obvious to
          you today isn’t obvious to an agent, a new collaborator, or you in three weeks.
        </P>

        <Subhead>When to write one</Subhead>

        <P>Write an ADR every time you:</P>

        <div className="my-10 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/30 px-6 sm:px-8 py-7 shadow-sm">
          <ul className="m-0 list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-200">
            <li>Choose between two genuinely viable technical options.</li>
            <li>Decide not to add something that would seem like a natural addition.</li>
            <li>Make a decision with high reversal cost.</li>
            <li>Reject a common industry pattern for something less conventional.</li>
            <li>End a conversation with “okay, we’ll do it this way.”</li>
          </ul>
        </div>

        <P>
          In vibe coding: if you debated an approach in your head before prompting — write the ADR. That
          debate is the content.
        </P>

        <P>
          The process takes about 15 minutes. The payoff is avoiding half a day untangling when an agent
          reverses a decision it didn’t know was deliberate.
        </P>

        <SectionRule />

        <SectionTitle>Getting started</SectionTitle>

        <P>
          You don’t need ten ADRs. You need three. What are the three decisions you’d be most frustrated
          to have reversed by an agent this afternoon? Write those first, keep them short, add them to{' '}
          <code className="font-mono text-sm">docs/adrs/</code>, and reference them from{' '}
          <code className="font-mono text-sm">CLAUDE.md</code>:
        </P>

        <AgenticDocPre caption="Snippet: reference ADRs from CLAUDE.md">{CLAUDE_ADR_REFS}</AgenticDocPre>

        <P>From your next session forward, every agent knows those decisions exist — and why.</P>

        <BeyondVibeCodingSeriesFooter currentPart={3} />
      </ArticleShell>
    </BlogPostLayout>
  );
}

