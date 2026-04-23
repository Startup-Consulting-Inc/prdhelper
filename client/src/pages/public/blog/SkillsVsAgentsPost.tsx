/**
 * Blog Post: Agents vs Skills — skills, MCP, progressive disclosure
 * Source: docs/skills-vs-agents.md + docs/skills-vs-agents.png
 * Display: Medium-style sections, pull quotes, and visual hierarchy (not a single prose block)
 */

import type { ReactNode } from 'react';
import { BlogPostLayout, type FaqItem } from '../../../components/blog/BlogPostLayout';
import { Cpu, Layers, Package } from 'lucide-react';
import skillsVsAgentsImg from '../../../assets/skills-vs-agents.png';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is an Anthropic Skill, mechanically?',
    answer:
      'A Skill is a folder containing a SKILL.md file. The file has YAML frontmatter (name and one-line description) and a body of instructions. It can bundle reference docs, scripts, and templates. There is no new API, no framework, and no central registry required. At session start, only metadata loads; the full body and referenced files load when the task needs them (progressive disclosure).',
  },
  {
    question: 'What does "stop building agents" really mean?',
    answer:
      'The phrase from Anthropic’s messaging is rhetorically loud but technically softer than it sounds. The point is not "never build an agent again." It is: stop building a different specialized agent scaffold for every domain (legal, finance, HR, etc.) when one general-purpose agent with a filesystem, runtime, and a library of Skills can cover those jobs. Rebuild the expertise as Skills, not as duplicate agent chassis.',
  },
  {
    question: 'Are Skills replacing MCP?',
    answer:
      'No — they solve different problems. MCP provides capabilities (live APIs, auth, tools like Gmail or Playwright). Skills provide technique (how to do a job well: checklists, failure handling, definition of done). MCP tool definitions can consume a large fraction of the context window at session start; Skills only load full content when relevant. Production setups often use both: Skills for workflow playbooks, MCP for live access to services.',
  },
  {
    question: 'What is progressive disclosure for Skills?',
    answer:
      'Level 1: metadata (name + description, ~100 tokens per skill) loads at startup so the model knows what exists. Level 2: the full SKILL.md loads when the agent decides the skill applies (~thousands of tokens, bounded). Level 3: referenced files and scripts load on demand. That means you can keep hundreds of skills installed without paying the full token cost for all of them upfront.',
  },
  {
    question: 'When should I build a Skill vs an MCP server?',
    answer:
      'Build a Skill when you are repeating the same instructions, when procedural knowledge lives in someone’s head, or when you need consistent quality and a clear definition of done. Build or use MCP when you need live data, authentication, real-time state, or centralized governance — when the problem is access, not know-how.',
  },
  {
    question: 'Can non-developers write Skills?',
    answer:
      'Yes. Anthropic has described accounting, legal, and recruiting professionals already writing Skills because a Skill is mostly structured instructions in Markdown plus optional assets — closer to documenting a playbook than shipping a microservice.',
  },
  {
    question: 'What architecture should I aim for?',
    answer:
      'The convergent pattern is: one general-purpose agent runtime, a library of Skills for domain expertise loaded lazily, and MCP servers (or equivalent tools) for external systems. The expensive part to maintain is expertise; package it once, load it when needed, and avoid rebuilding identical agent shells per vertical.',
  },
];

/** Body copy: Medium-like size and line height */
function P({ children }: { children: ReactNode }) {
  return (
    <p className="mb-7 last:mb-0 text-[1.05rem] sm:text-[1.125rem] leading-[1.78] text-gray-800 dark:text-gray-200">
      {children}
    </p>
  );
}

/** Key line / “pull quote” — scan-friendly */
function KeyLine({ children }: { children: ReactNode }) {
  return (
    <p className="my-8 pl-5 border-l-[3px] border-violet-500 dark:border-violet-400 text-lg sm:text-xl font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
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
    <h3 className="mt-10 mb-4 text-base font-bold uppercase tracking-wide text-violet-700 dark:text-violet-400">
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

export default function SkillsVsAgentsPost() {
  return (
    <BlogPostLayout
      title="Agents vs Skills: The Full Picture"
      author="Jaehee Song"
      date="2026-04-23"
      readTime="12 min read"
      category="AI & Development"
      excerpt="The “stop building agents” line is about duplicate scaffolding, not deleting your runtime. How Skills, progressive disclosure, and MCP fit together — in the same shape as the Medium version, with a clear old-vs-new diagram."
      slug="skills-vs-agents"
      coverImage="SV"
      coverGradient="from-violet-700 via-fuchsia-600 to-amber-500"
      faqItems={FAQ_ITEMS}
      relatedPosts={[
        {
          slug: 'hermes-agent-cost-saving',
          title: 'The $30 Bill That Should Have Been $7: Cost-Saving Moves for a Real AI Agent',
          category: 'AI & Development',
          date: '2026-04-22',
        },
        {
          slug: 'graphify-wiki-build',
          title: 'From Scattered Notes to a Living Knowledge Graph: Building LLM Wiki + Graphify',
          category: 'AI & Development',
          date: '2026-04-21',
        },
        {
          slug: 'llm-wiki-hermes-agent',
          title: 'How I Built a Web-Based LLM Wiki with Hermes Agent (And Why I Skipped Obsidian)',
          category: 'AI & Development',
          date: '2026-04-16',
        },
      ]}
    >
      <ArticleShell>
        {/* Opening — matches Medium: hook first */}
        <p className="mb-8 text-[1.125rem] sm:text-[1.2rem] leading-[1.75] text-gray-800 dark:text-gray-200 first-letter:float-left first-letter:mr-2 first-letter:mt-0.5 first-letter:font-serif first-letter:text-[2.8rem] first-letter:font-bold first-letter:leading-[0.9] first-letter:text-violet-700 dark:first-letter:text-violet-400">
          The viral framing — <em>“Stop building agents”</em> — is rhetorically loud but technically
          softer than it sounds.{' '}
          <span className="whitespace-nowrap sm:whitespace-normal">Barry Zhang and Mahesh Murag’s 16-minute talk at the</span>{' '}
          AI Engineer Code Summit (on YouTube) is not saying “never build an agent again.”{' '}
          It is saying: <strong>stop building a different specialized agent for every domain</strong>.{' '}
          Build <strong>one general-purpose agent</strong> and give it a <strong>library of Skills</strong> instead.
        </p>

        <div className="mb-10 rounded-2xl border border-gray-200/80 dark:border-gray-600/50 bg-gradient-to-b from-violet-50/90 to-white dark:from-violet-950/40 dark:to-gray-900/30 px-6 sm:px-8 py-7 shadow-sm">
          <p className="m-0 text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">
            One diagram, two paradigms
          </p>
          <p className="m-0 text-base leading-8 text-gray-700 dark:text-gray-300">
            Old model: <strong>one custom agent per domain</strong> — code, legal, finance, each with
            duplicate scaffolding.             New model: <strong>one general agent</strong> (model + runtime + filesystem){' '}
            that <strong>pulls only the SKILL.md (and friends) a task needs</strong>.
          </p>
        </div>

        <P>
          To understand the rest, you separate <strong>the agent shell</strong> (model + runtime + tools +
          filesystem) from <strong>the expertise</strong> (how to do a job well). The claim is: the shell
          converges; the work moves into Skills — not into yet another one-off agent repo.
        </P>

        <figure className="my-10">
          <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/50 shadow-md">
            <img
              src={skillsVsAgentsImg}
              alt="Old paradigm: six siloed domain agents. New paradigm: one general agent plus a library of SKILL.md skills."
              className="w-full h-auto"
              loading="eager"
            />
          </div>
          <figcaption className="mt-4 text-sm leading-7 text-gray-500 dark:text-gray-400 text-center max-w-md mx-auto">
            Left: each agent built from scratch, no sharing. Right: one runtime; skills load
            on demand.
          </figcaption>
        </figure>

        <SectionRule />

        <SectionTitle>The real diagnosis</SectionTitle>
        <P>
          Anthropic’s view is that a lot of recent agent development chased the wrong variable. The
          line that stuck: we used to assume agents in different domains would look very different. In
          practice, the <em>agent underneath</em> is more universal than that. Once you have a model tied to
          a runtime with a filesystem and code execution (the Claude Code pattern), the scaffolding
          does not need rebuilding per use case.
        </P>
        <KeyLine>What actually varies is domain knowledge.</KeyLine>
        <P>
          The tax analogy is the memorable test: a 300-IQ system that has never read the tax code,
          or a 20-year accountant? Today’s models are strong in the abstract but still miss
          <strong>your</strong> context, cannot “learn the company” without you writing it down, and do not
          improve by magic. <strong>Skills are where you package that expertise</strong> — once, in a file tree, with
          progressive loading — instead of re-explaining every session or hard-coding six custom
          agents.
        </P>

        <SectionRule />

        <SectionTitle>What a Skill actually is (mechanically)</SectionTitle>
        <P>
          A Skill is a folder. At minimum, a <code className="text-[0.9em] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono">SKILL.md</code>. The markdown has <strong>YAML
          frontmatter</strong> (name + one-line description) and a body of instructions. It can bundle
          references, small scripts, and templates. <strong>No new public API, no required framework, no
          central registry</strong> — it is a packaging convention, not a new cloud product.
        </P>

        <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Example layout</p>
        <pre className="mb-8 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/60 p-4 sm:p-5 text-xs sm:text-sm leading-relaxed font-mono text-left text-gray-800 dark:text-gray-200 shadow-inner">
{`my-skill/
├── SKILL.md           # metadata + instructions
├── reference.md        # deep reference (optional)
├── forms.md            # sub-procedures (optional)
└── apply_template.py  # scripts (optional)`}
        </pre>

        <P>
          The part that changes cost curves is <strong>progressive disclosure</strong> — in three levels. Here
          is the honest read on <em>when</em> each layer hits the context window.
        </P>

        <div className="mb-8 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/20">
          <table className="w-full min-w-[520px] text-sm text-left">
            <thead>
              <tr className="bg-gray-100/90 dark:bg-gray-800/80 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="px-4 py-3 font-semibold">Level</th>
                <th className="px-4 py-3 font-semibold">Content</th>
                <th className="px-4 py-3 font-semibold">When</th>
                <th className="px-4 py-3 font-semibold">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {[
                ['1 · Meta', 'Name + one-line blurb', 'Startup', '~100 tok/skill'],
                ['2 · Body', 'Full SKILL.md', 'When skill fits', 'Up to ~5K'],
                ['3 · Extras', 'Docs, data, scripts', 'When referenced', 'On demand'],
              ].map((row) => (
                <tr key={row[0]} className="text-gray-800 dark:text-gray-200">
                  <td className="px-4 py-3 font-semibold text-violet-700 dark:text-violet-400 whitespace-nowrap">
                    {row[0]}
                  </td>
                  <td className="px-4 py-3 leading-relaxed">{row[1]}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{row[2]}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <P>
          At startup, the model only needs to know that a skill <em>exists</em> and <em>when to use it</em>. You
          can list <strong>hundreds of skills</strong> without that alone blowing the budget. When a task
          matches, it reads the full <code className="text-[0.9em] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono">SKILL.md</code> and, if needed, other files over bash — scripts can run
          without their full source living in the chat. Unused bundles stay <strong>at zero context cost</strong>.
        </P>
        <KeyLine>
          The practical upshot: huge docs and datasets in the folder do not cost tokens until
          something actually asks for them.
        </KeyLine>

        <SectionRule />

        <SectionTitle>The MCP comparison (they’re complementary, not competitors)</SectionTitle>
        <P>
          If you are already on MCP, this is the layer map — not a winner-take-all story.
        </P>

        <ul className="mb-8 space-y-3 pl-0 list-none">
          {[
            <>
              <strong className="text-indigo-700 dark:text-indigo-400">MCP</strong>
              {''} = <strong>Capabilities</strong> — what the agent can <em>do</em> (Gmail, GSC, Slack, a browser, …).
            </>,
            <>
              <strong className="text-emerald-700 dark:text-emerald-400">Skills</strong>
              {''} = <strong>Technique</strong> — how to do the job: order of checks, failure handling, what “done”
              looks like.
            </>,
          ].map((item, i) => (
            <li
              key={i}
              className="flex gap-3 pl-0 py-3 px-4 rounded-xl bg-gray-50/90 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 leading-relaxed"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300">
                {i + 1}
              </span>
              <span className="text-[1.02rem] sm:text-[1.05rem] text-gray-800 dark:text-gray-200">{item}</span>
            </li>
          ))}
        </ul>

        <P>
          A heavy MCP session can put a <strong>large</strong> share of the window into <strong>tool definitions</strong>
          {''} before the first user turn — in extreme setups, most of a 200K context. MCP loads those
          descriptions in full at session start, whether you call every tool or not. Skills sidestep
          that for <em>domain</em> knowledge: only light metadata is always on.
        </P>
        <P>
          Practitioners who run both: all Skills and no tools → great playbooks, nothing to call. All
          MCP and no Skills → sprawl and thin wrappers. <strong>Use both</strong> — skills for workflow, MCP for
          live pipes.
        </P>

        <SectionRule />

        <SectionTitle>The mental model that actually lands</SectionTitle>
        <p className="mb-6 text-[1.05rem] sm:text-[1.125rem] leading-[1.78] text-gray-800 dark:text-gray-200">
          Zhang and Murag’s <strong>processor / OS / apps</strong> analogy is the one to remember. Same stack, three
          roles:
        </p>

        <div className="mb-8 space-y-4">
          {[
            {
              icon: Cpu,
              title: 'Models ≈ Processors',
              text: 'Huge investment, huge potential — not much alone on a desk.',
              tone: 'from-slate-50 to-slate-100/80 dark:from-slate-900/50 dark:to-slate-800/30',
              border: 'border-slate-200 dark:border-slate-600',
            },
            {
              icon: Layers,
              title: 'Agent runtime ≈ Operating system',
              text: 'Schedules work, files, permissions — brings the job to the processor.',
              tone: 'from-violet-50/90 to-violet-100/50 dark:from-violet-950/30 dark:to-violet-900/20',
              border: 'border-violet-200 dark:border-violet-700/50',
            },
            {
              icon: Package,
              title: 'Skills ≈ Applications',
              text: 'Where expertise and taste live — built by people who are not writing kernels.',
              tone: 'from-amber-50/90 to-orange-50/50 dark:from-amber-950/25 dark:to-orange-950/20',
              border: 'border-amber-200 dark:border-amber-800/50',
            },
          ].map(({ icon: Icon, title, text, tone, border }) => (
            <div
              key={title}
              className={`flex gap-4 rounded-2xl border ${border} bg-gradient-to-br ${tone} p-5 sm:p-6`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/80 dark:bg-gray-800/80 shadow-sm text-violet-600 dark:text-violet-400">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <div>
                <p className="m-0 text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1.5">
                  {title}
                </p>
                <p className="m-0 text-[0.98rem] sm:text-[1.05rem] leading-relaxed text-gray-700 dark:text-gray-300">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <P>
          Only a few companies build chips. A modest number build OS-level agent runtimes. <strong>Millions</strong>
          {''} can ship “apps” if an app is a folder and a <code className="text-[0.9em] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono">SKILL.md</code> — and that is how the
          <em> expertise layer</em> can open to legal, finance, and ops without every author being a
          backend engineer.
        </P>

        <SectionRule />

        <SectionTitle>When to build a Skill vs. when not to</SectionTitle>

        <div className="mb-6 grid gap-5 sm:gap-6">
          <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-800/50 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 sm:p-6">
            <Subhead>Build a Skill when</Subhead>
            <ul className="m-0 pl-0 list-none space-y-3.5 text-[1.02rem] sm:text-[1.05rem] leading-relaxed text-gray-800 dark:text-gray-200">
              {[
                'You keep repeating the same multi-step instructions across chats.',
                'Procedural know-how only lives in a senior person’s head.',
                'There is a real “definition of done,” but it shifts with context.',
                'You need consistent style or quality on a recurring workflow.',
              ].map((t) => (
                <li key={t} className="flex gap-3 pl-0">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5" aria-hidden>
                    →
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-indigo-200/80 dark:border-indigo-800/50 bg-indigo-50/40 dark:bg-indigo-950/20 p-5 sm:p-6">
            <Subhead>Build or use MCP (or tools) when</Subhead>
            <ul className="m-0 pl-0 list-none space-y-3.5 text-[1.02rem] sm:text-[1.05rem] leading-relaxed text-gray-800 dark:text-gray-200">
              {[
                'You need live data, auth, real-time state, or org-wide governance.',
                'The hard part is access to systems, not a missing paragraph of how-to.',
              ].map((t) => (
                <li key={t} className="flex gap-3 pl-0">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold mt-0.5" aria-hidden>
                    →
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-rose-200/80 dark:border-rose-800/50 bg-rose-50/30 dark:bg-rose-950/15 p-5 sm:p-6">
            <Subhead>Don’t build a one-off “domain agent” from scratch when</Subhead>
            <P>
              A <strong>single general agent</strong> with the <strong>right Skills and tools</strong> is enough. The talk is
              aimed at teams that rebuild bespoke chassis per vertical when one shared runtime + domain
              Skills is faster and composes better.
            </P>
          </div>
        </div>

        <SectionTitle>One counter-point worth holding</SectionTitle>
        <div className="mb-8 rounded-2xl border-l-4 border-amber-400 dark:border-amber-600 bg-amber-50/50 dark:bg-amber-950/20 px-5 sm:px-6 py-5">
          <P>
            The “Skills killed MCP” story is thinner now. In coding setups, a documentation MCP
            alone is often enough to get correct code; Skills are not always the missing win. The
            takeaway is not <em>which label wins</em> — it is whether your pain is <strong>access</strong> (MCP) or
            {''} <strong>technique</strong> (Skills). In real systems, it is often both.
          </P>
        </div>

        <SectionTitle>What this means in practice (including multi-agent stacks)</SectionTitle>
        <P>
          If you run something like a Hermes-style stack — SEO, monitoring, reports — ask: what is
          a real <strong>isolation or runtime</strong> requirement vs what is just a <strong>different body of
          know-how</strong>? The second kind is a Skill on one agent. Multi-site SEO is a natural fit for
          per-site reference files and one <code className="text-[0.9em] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono">seo-audit</code> skill, not five duplicate agents.
        </P>

        <SectionRule />

        <div className="mt-2 rounded-2xl bg-gradient-to-br from-violet-600/95 to-indigo-800 text-white p-6 sm:p-8 shadow-lg">
          <p className="m-0 text-xs font-bold uppercase tracking-widest text-violet-200/90 mb-3">
            Bottom line
          </p>
          <p className="m-0 text-lg sm:text-xl font-medium leading-relaxed text-white">
            The pattern that is winning is: <strong>one general-purpose agent</strong>, a <strong>library of
            Skills</strong>, and <strong>MCP (or your tool layer) for the outside world</strong>. “Stop building
            agents” really means <em>stop rebuilding the same agent chassis for every domain</em>. The hard
            part is expertise — package it once, load it lazily, let the shared runtime do the rest.
          </p>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Also published on{' '}
          <a
            href="https://medium.com/@jsong_49820/agents-vs-skills-the-full-picture-f16422ec7f9b"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-violet-600 dark:text-violet-400 hover:underline"
          >
            Medium
          </a>
          .
        </p>
      </ArticleShell>
    </BlogPostLayout>
  );
}
