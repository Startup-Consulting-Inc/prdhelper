/**
 * Blog Post: Your Vibe-Coded App Works. Here's Why It's About to Break.
 *
 * Source: docs/agentic_docs/post_01.md
 */

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BlogPostLayout, type FaqItem } from '../../../components/blog/BlogPostLayout';
import {
  BeyondVibeCodingSeriesBanner,
  BeyondVibeCodingSeriesFooter,
} from './BeyondVibeCodingSeriesNav';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is the “wall” in vibe coding?',
    answer:
      'It’s the point where the codebase grows faster than shared understanding. The system outgrows what any single session (human or agent) can reliably remember, and inconsistencies, security gaps, and operational debt show up all at once.',
  },
  {
    question: 'Why does AI-assisted development hit this sooner?',
    answer:
      'Because AI dramatically accelerates construction but not understanding. Every prompt can ship code, but the “why” (decisions, constraints, boundaries) doesn’t get written down unless you do it deliberately.',
  },
  {
    question: 'What breaks first in production?',
    answer:
      'Security defaults, scalability assumptions, missing CI/CD rigor, and manageability (inconsistent patterns across sessions).',
  },
  {
    question: 'Do I need heavy enterprise process to fix it?',
    answer:
      'No. The fix is lighter: a small set of agent-readable docs, basic engineering rigor, and bounded agents with clear guardrails.',
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
    slug: 'stop-losing-architectural-decisions',
    title: 'Stop Losing Your Architectural Decisions to Your AI Agent',
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

export default function BeyondVibeCodingPost01() {
  return (
    <BlogPostLayout
      title="Your Vibe-Coded App Works. Here's Why It's About to Break."
      author="Jaehee Song"
      date="2026-05-08"
      readTime="14 min read"
      category="AI & Development"
      excerpt="Vibe coding ships fast—but it grows shared understanding slower than it grows code. The wall is predictable: security, scalability, CI/CD, and manageability break once real users arrive."
      slug="vibe-coded-app-why-it-breaks"
      coverImage="AI"
      coverGradient="from-gray-900 via-slate-800 to-emerald-700"
      faqItems={FAQ_ITEMS}
      relatedPosts={RELATED_POSTS}
    >
      <Helmet>
        <meta
          name="keywords"
          content="vibe coding, AI coding, cursor, claude code, maintainability, engineering discipline, agentic development, software architecture, technical debt, guardrails"
        />
        <meta property="article:published_time" content="2026-05-08" />
        <meta property="article:section" content="AI & Development" />
        <meta property="article:tag" content="vibe-coding" />
        <meta property="article:tag" content="agents" />
      </Helmet>

      <ArticleShell>
        <BeyondVibeCodingSeriesBanner currentPart={1} />

        <P>
          You shipped something this week. Probably more than one thing. You opened Cursor or Claude
          Code, described what you wanted, and watched it appear. Fast. Clean enough. Working.
        </P>

        <P>
          The feeling is real. The speed is real. The productivity is genuinely not what it used to
          be — it’s better, and there’s no going back.
        </P>

        <KeyLine>
          But there’s a conversation nobody is having loudly enough about what happens next — not at
          the prototype stage, but after it. When real users show up. When the codebase grows past what
          fits in one session’s context. When two agents touch the same module on the same afternoon
          and one quietly undoes what the other just built.
        </KeyLine>

        <P>That’s when the wall appears.</P>

        <SectionRule />

        <SectionTitle>What the wall actually is</SectionTitle>

        <P>
          The wall isn’t a single event. It’s a slow accumulation of invisible debt that hits all at
          once. It starts small: a security researcher emails about an exposed endpoint. Your database
          slows down on a Wednesday for no obvious reason. You add a feature and something else breaks —
          something you didn’t touch, in a part of the app you barely remember writing. A new contractor
          asks you to explain the codebase, and you realize you can’t, not fully — because you didn’t
          write it so much as prompt it into existence.
        </P>

        <KeyLine>
          Each of those is a symptom. The disease underneath them all is the same:{' '}
          <strong className="font-semibold text-gray-900 dark:text-white">
            your system has outgrown the amount of shared understanding that exists about it.
          </strong>
        </KeyLine>

        <SectionRule />

        <SectionTitle>Why vibe coding creates this problem specifically</SectionTitle>

        <P>
          When you prompt an agent to “build me a checkout flow” or “add authentication to this API,”
          it does exactly that — from training data and whatever context you gave it in the prompt.
        </P>

        <P>Here’s what it doesn’t know:</P>

        <P>
          Your security requirements. That your database is already under load and can’t handle an
          N+1 query pattern in this new feature. That another agent, in a different session last
          Thursday, made a decision about how auth tokens should be handled — and that this new code
          contradicts it.
        </P>

        <P>
          So it guesses. It picks the most common patterns from its training. Most of those patterns
          are fine for a prototype. They’re not fine for a production system that handles real users,
          real money, or real data.
        </P>

        <Subhead>Four predictable breakpoints</Subhead>

        <div className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              {
                title: 'Security',
                desc: 'Agents write code that works, not code that’s secure by default. They’ll leave CORS wide open, skip input validation, trust the client’s reported state, and handle secrets in ways that would make a security engineer wince — not because they’re careless, but because you didn’t tell them not to, and “not told otherwise” means “path of least resistance.”',
              },
              {
                title: 'Scalability',
                desc: 'Defaults are optimized for “working on my machine with 10 test records,” not concurrent users or large datasets — or the moment your app gets picked up by a newsletter with 50,000 subscribers. N+1 queries, no caching, in-memory session state — all fine until suddenly they’re not.',
              },
              {
                title: 'CI/CD',
                desc: 'Most vibe-coded apps are deployed by hand from a laptop after a quick check that it seems to work. No automated test suite. No staging. No rollback plan. The first serious production bug isn’t caught by a process — it’s reported by a user.',
              },
              {
                title: 'Manageability',
                desc: 'Two weeks into daily shipping, three agent sessions may have made three different decisions about the same pattern — nobody wrote down why — and the next agent has no idea which one to follow. It picks one, probably the wrong one. You spend an afternoon untangling it.',
              },
            ] as const
          ).map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 p-6 shadow-sm"
            >
              <p className="m-0 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Breakpoint
              </p>
              <p className="mt-2 mb-0 font-semibold text-gray-900 dark:text-gray-100">{card.title}</p>
              <p className="mt-2 mb-0 text-sm text-gray-600 dark:text-gray-300">{card.desc}</p>
            </div>
          ))}
        </div>

        <SectionRule />

        <SectionTitle>The asymmetry that explains everything</SectionTitle>

        <KeyLine>
          AI accelerates code construction faster than it accelerates code understanding.
        </KeyLine>

        <P>
          Construction races ahead. Every prompt ships something. Every session adds lines. Every day
          the codebase grows. But understanding — of why things are built the way they are, what
          decisions were made and why, what the system is supposed to do and what it’s explicitly{' '}
          <em>not</em> supposed to do — doesn’t grow automatically. It has to be written down
          deliberately. In the speed of vibe coding, it almost never is.
        </P>

        <P>
          Every day you ship without writing down a single decision, the gap between construction and
          understanding widens. Until it breaks.
        </P>

        <P>
          This is not a failure of vibe coding as a tool. It’s a failure of the surrounding practices
          that haven’t caught up to the tool’s speed.
        </P>

        <SectionRule />

        <SectionTitle>The fix isn’t enterprise process</SectionTitle>

        <P>
          The instinct is to reach for heavyweight solutions: Jira boards, sprints, 40-page PRDs.
          That stack is too slow and culturally wrong for AI-assisted development.
        </P>

        <P>
          The answer is lighter than enterprise paperwork, and more targeted. It comes down to three
          things working together:
        </P>

        <div className="my-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(
            [
              {
                title: 'Documentation',
                desc: 'Not enterprise paperwork — specific, structured docs agents can read as context: a root-level file that tells every session what this system is, what rules it must follow, and what it’s not supposed to do; ADRs that capture why choices were made; a threat model so security isn’t an afterthought.',
              },
              {
                title: 'Engineering rigor',
                desc: 'Tests. Code review on security-sensitive paths. Types and linting. Observability so you know when something breaks before your users tell you.',
              },
              {
                title: 'Bounded agents',
                desc: 'Guardrails on what agents can touch, how far they can reach, and what they must escalate. Agents are powerful because they act autonomously — that power needs a shape.',
              },
            ] as const
          ).map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 p-6 shadow-sm"
            >
              <p className="m-0 font-semibold text-gray-900 dark:text-gray-100">{item.title}</p>
              <p className="mt-2 mb-0 text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>

        <P>
          None of these are heavy. The version that works in AI-native development is lighter than a
          2015 enterprise playbook. But they have to exist.
        </P>

        <SectionRule />

        <SectionTitle>This series</SectionTitle>

        <P>
          Over the next posts, we’ll build this out concretely — with real examples from four
          production systems running daily: ProPortrait AI, Hermes Agent, ClearlyReqs, and MyJob. Each
          one hit these walls and dealt with them differently.
        </P>

        <P>
          The first move, and the highest-leverage single thing you can do today, is something most
          vibe coders have never heard of:{' '}
          <strong className="font-semibold text-gray-900 dark:text-white">
            the agent instruction file.
          </strong>{' '}
          It takes about an hour to write and immediately changes how every AI session in your project
          behaves.
        </P>

        <P>
          <Link
            to="/blog/the-one-file-every-ai-developer-needs"
            className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
          >
            Next in the series → The one file every AI developer needs (and almost nobody has)
          </Link>
        </P>

        <BeyondVibeCodingSeriesFooter currentPart={1} />
      </ArticleShell>
    </BlogPostLayout>
  );
}

