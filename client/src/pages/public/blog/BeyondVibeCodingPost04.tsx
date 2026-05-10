/**
 * Blog Post: The Two Docs That Stand Between Your App and a 2am Crisis
 *
 * Source: docs/agentic_docs/post_04.md
 */

import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { BlogPostLayout, type FaqItem } from '../../../components/blog/BlogPostLayout';
import {
  BeyondVibeCodingSeriesBanner,
  BeyondVibeCodingSeriesFooter,
} from './BeyondVibeCodingSeriesNav';
import { AgenticDocPre } from './AgenticDocPre';
import {
  CLEARLYREQS_RUNBOOK_DOC,
  PROTRAIT_RUNBOOK_DOC,
  PROTRAIT_THREAT_MODEL_DOC,
} from './agenticPost04Snippets';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is a threat model in this context?',
    answer:
      'A one-page document that names the assets you protect, top threats, and the controls you have in place. The goal is explicit security context agents can follow.',
  },
  {
    question: 'What is a deployment runbook?',
    answer:
      'A practical procedure for deploying to production and recovering when something breaks: environments, required variables, deploy steps, rollback, health checks, and a short “2am” decision tree.',
  },
  {
    question: 'Why do these matter more for vibe-coded apps?',
    answer:
      'Agents make security and operational decisions constantly, and they default to “works” rather than “secure.” These docs move decisions from implicit to explicit.',
  },
  {
    question: 'How do I use these with agents?',
    answer:
      'Treat them as prompt context. Attach the relevant sections when asking an agent to build anything security- or deployment-adjacent.',
  },
];

const RELATED_POSTS = [
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
  {
    slug: 'hermes-agent-cost-saving',
    title: 'The $30 Bill That Should Have Been $7: Cost-Saving Moves for a Real AI Agent',
    category: 'AI & Development',
    date: '2026-04-22',
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

export default function BeyondVibeCodingPost04() {
  return (
    <BlogPostLayout
      title="The Two Docs That Stand Between Your App and a 2am Crisis"
      author="Jaehee Song"
      date="2026-05-08"
      readTime="20 min read"
      category="AI & Development"
      excerpt="Agents default to “working,” not “secure.” A one-page threat model and a practical deployment runbook move security and ops decisions into the build—before the incident."
      slug="two-docs-before-2am-crisis"
      coverImage="AI"
      coverGradient="from-gray-900 via-emerald-900 to-slate-900"
      faqItems={FAQ_ITEMS}
      relatedPosts={RELATED_POSTS}
    >
      <Helmet>
        <meta
          name="keywords"
          content="threat model, deployment runbook, vibe coding, agentic development, AI security, prompt injection, rollback, incident response, production readiness"
        />
        <meta property="article:published_time" content="2026-05-08" />
        <meta property="article:section" content="AI & Development" />
        <meta property="article:tag" content="security" />
        <meta property="article:tag" content="operations" />
      </Helmet>

      <ArticleShell>
        <BeyondVibeCodingSeriesBanner currentPart={4} />

        <P>
          Security problems and deployment disasters have one thing in common: they’re always more
          expensive to fix after the fact than to prevent before.
        </P>

        <P>
          That’s true in general. It’s especially true in vibe-coded systems — agents make security
          decisions constantly (every route handler, auth check, place data is stored or logged) — and
          they do it without knowledge of your risk profile. They default to “working,” not “secure.”
        </P>

        <P>
          The threat model and deployment runbook change that: they don’t eliminate risk, but they move
          security from “after something breaks” to “considered while building the feature.”
        </P>

        <KeyLine>
          They don’t eliminate risk — they make your security and ops decisions explicit enough for
          agents to follow.
        </KeyLine>

        <SectionRule />

        <SectionTitle>Document one: the threat model</SectionTitle>

        <P>
          A threat model sounds more intimidating than it is. You’re not writing a formal audit —
          you’re writing a one-page document that answers three questions:{' '}
          <strong className="text-gray-900 dark:text-white">What are we protecting?</strong> What could
          go wrong? What do we have in place to prevent it? Short, specific, honest.
        </P>

        <div className="my-10 rounded-2xl border border-gray-200/80 dark:border-gray-600/50 bg-white dark:bg-gray-900/40 p-7 shadow-sm">
          <p className="m-0 text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
            The three questions
          </p>
          <ul className="m-0 list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <strong>Assets</strong> — what’s sensitive or expensive?
            </li>
            <li>
              <strong>Threats</strong> — how can it go wrong?
            </li>
            <li>
              <strong>Controls</strong> — what prevents or limits damage?
            </li>
          </ul>
        </div>

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
          — users upload real photos, pay for downloads, identity preservation matters. High-sensitivity
          assets, real money, biometric-adjacent data:
        </P>

        <AgenticDocPre caption="Example threat model — ProPortrait AI">{PROTRAIT_THREAT_MODEL_DOC}</AgenticDocPre>

        <P>
          Notice what it does: names the API key at risk and its cost; documents a deliberate exception
          (timeout disabled during generation) that would look like a hole without context; marks what’s
          out of scope so agents don’t duplicate safeguards handled elsewhere.
        </P>

        <SectionRule />

        <Subhead>Using the threat model as agent context</Subhead>

        <P>
          The threat model isn’t write-once shelfware — it’s prompt input. When you build anything
          security-adjacent, attach the relevant section:
        </P>

        <blockquote className="my-8 pl-5 border-l-[3px] border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 italic leading-relaxed">
          Here&apos;s our current threat model. I need to add a file export feature. Review the
          implementation for anything that might conflict with our existing controls, especially around
          PII in logs and the R2 access pattern.
        </blockquote>

        <P>
          That shifts the agent from “build what was asked” to “build while respecting the existing
          security model.” The difference in output quality is significant.
        </P>

        <SectionRule />

        <SectionTitle>Document two: the deployment runbook</SectionTitle>

        <P>
          Most vibe-coded apps deploy like this: it looks good, you push, you watch for errors, you hope.
          Fine when you’re the only user and rollback is Ctrl+Z. Not fine when people depend on the app —
          especially with money, data, or real UX on the line.
        </P>

        <P>
          A runbook answers two questions per environment:{' '}
          <strong className="text-gray-900 dark:text-white">How does it get to production?</strong> (
          happy path, step by step.){' '}
          <strong className="text-gray-900 dark:text-white">What do you do when it breaks?</strong>{' '}
          (recovery before the 2am panic.)
        </P>

        <Subhead>Example: ProPortrait AI (Cloud Run + Firebase Hosting)</Subhead>

        <AgenticDocPre caption="Deployment runbook — ProPortrait AI">{PROTRAIT_RUNBOOK_DOC}</AgenticDocPre>

        <P>
          The 2am section is short, numbered, ordered by how often causes show up — not every scenario,
          but the decision tree you’ll want when you’re half-asleep and your phone won’t stop buzzing.
        </P>

        <SectionRule />

        <SectionTitle>Different deployment models, different runbooks</SectionTitle>

        <P>
          Shape changes with how you deploy. A Cloud Run SaaS with a persistent backend breaks
          differently than a serverless doc-generation tool.
        </P>

        <P>
          <a
            href="https://www.clearlyreqs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
          >
            ClearlyReqs
          </a>{' '}
          — AI BRD/PRD generator, serverless on Vercel, AI proxy layer, Redis rate limiting — looks unlike
          ProPortrait on paper:
        </P>

        <AgenticDocPre caption="Deployment runbook — ClearlyReqs">{CLEARLYREQS_RUNBOOK_DOC}</AgenticDocPre>

        <P>
          ProPortrait’s runbook is Cloud Run revisions, Stripe webhook secrets, Gemini failures.
          ClearlyReqs’ is Vercel atomic deploys, AI proxy, Redis limits. Same structure — different
          operational reality.
        </P>

        <P>
          There’s no universal template. The questions stay the same — how deploy, how recover — but
          the answers must match how your system actually breaks.
        </P>

        <SectionRule />

        <SectionTitle>Write these before you need them</SectionTitle>

        <P>
          Same timing for both: write when calm so they exist when you’re not. Threat model: about an
          hour. Runbook: about two. Together they cover the two loudest “everything is on fire and I don’t
          know where to start” modes — security incident and broken deploy.
        </P>

        <P>
          Once they exist, double duty: your reference and prompt context for anything security-sensitive
          or deployment-adjacent, so the agent knows the rules before line one.
        </P>

        <KeyLine>
          Write these documents when things are calm, so they exist when things aren’t.
        </KeyLine>

        <BeyondVibeCodingSeriesFooter currentPart={4} />
      </ArticleShell>
    </BlogPostLayout>
  );
}

