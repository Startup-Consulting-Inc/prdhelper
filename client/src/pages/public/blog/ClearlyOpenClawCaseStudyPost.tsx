/**
 * Blog post: From idea to live web service — Clearly + OpenClaw case study
 * Source: docs/clearly-openclaw-case-study.html
 */

import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BlogPostLayout, type FaqItem } from '../../../components/blog/BlogPostLayout';

const SITE = 'https://www.clearlyreqs.com';
const IMG = '/blog/clearly-openclaw-case-study';

function Figure({ file, alt, caption }: { file: string; alt: string; caption: string }) {
  return (
    <div className="not-prose my-8">
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-900/40">
        <img src={`${IMG}/${file}`} alt={alt} className="w-full" loading="lazy" decoding="async" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-3">{caption}</p>
    </div>
  );
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is spec-driven agent execution?',
    answer:
      'You invest time in structured requirements (BRD and PRD) before the agent writes code. The spec acts as a contract: auth flows, data models, deployment constraints, and edge cases are decided in the interview phase. The coding agent then implements against that contract instead of improvising from a vague prompt.',
  },
  {
    question: 'Why use Clearly before OpenClaw (or any AI coding agent)?',
    answer:
      'Clearly runs a guided interview that produces approve-gated BRD and PRD documents. That process surfaces decisions—like professor authentication without outbound email—that would otherwise surface as bugs or rework. You can also export tool-specific instruction stacks (including OpenClaw’s AGENTS.md, SOUL.md, TOOLS.md, IDENTITY.md, USER.md) aligned to those documents.',
  },
  {
    question: 'What files does Clearly generate for OpenClaw?',
    answer:
      'For OpenClaw, Clearly generates a distributed instruction stack: AGENTS.md (primary instructions), SOUL.md (persona and tone), TOOLS.md (tool inventory and when to use each), IDENTITY.md (project identity and values), USER.md (audience and interaction patterns), plus a reference document. You copy those files to the project root before running the agent.',
  },
  {
    question: 'Does this replace human code review?',
    answer:
      'No. The case study shows that a tight spec plus a capable agent can produce a working full-stack build and passing smoke tests quickly. You should still review security, threat modeling, and production hardening before treating the result as production-ready for sensitive domains.',
  },
];

export default function ClearlyOpenClawCaseStudyPost() {
  const ogImage = `${SITE}${IMG}/new_project.png`;

  return (
    <BlogPostLayout
      title="From Idea to a Live Web Service in Under an Hour: Clearly + OpenClaw"
      author="Jaehee Song"
      date="2026-05-14"
      readTime="12 min read"
      category="AI & Development"
      excerpt="A walkthrough of building a full-stack attendance app: structured BRD/PRD in Clearly, OpenClaw instruction stack export, one-sentence agent build, smoke tests, and ship—with screenshots from the real flow."
      slug="clearly-openclaw-attendance-case-study"
      coverImage="CR"
      coverGradient="from-indigo-600 via-violet-600 to-emerald-600"
      faqItems={FAQ_ITEMS}
      relatedPosts={[
        {
          slug: 'ai-coding-tools-requirements',
          title: 'Why AI Coding Tools Need Better Requirements First',
          category: 'AI & Development',
          date: '2026-03-14',
        },
        {
          slug: 'why-every-ai-project-needs-prd',
          title: 'Why Every AI Project Needs a PRD',
          category: 'Best Practices',
          date: '2024-01-15',
        },
        {
          slug: 'the-one-file-every-ai-developer-needs',
          title: 'The One File Every AI Developer Needs (And Almost Nobody Has)',
          category: 'AI & Development',
          date: '2026-05-08',
        },
      ]}
    >
      <Helmet>
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <div className="not-prose bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-7 my-10">
        <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest mb-3">
          TL;DR
        </p>
        <p className="text-base leading-8 text-gray-800 dark:text-gray-200">
          I went from a one-sentence idea to a deployed attendance web service in about an hour:{' '}
          <strong>Clearly</strong> for BRD/PRD and interview-driven specs, <strong>OpenClaw</strong> for
          execution against the exported instruction stack, then Caddy plus DNS for a public URL.
        </p>
      </div>

      <h2>The problem</h2>
      <p>
        University professors still pass around sign-in sheets or call out names. Sheets get lost,
        students forget to sign, and it burns the first few minutes of every class. I wanted
        something minimal: a professor opens a session, a QR code appears, students scan and check
        in—no app store, no campus IT project, no email verification for students.
      </p>

      <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 my-10">
        {[
          { v: '0', l: 'Lines of hand-written code' },
          { v: '1', l: 'Prompt to OpenClaw' },
          { v: '~60', l: 'Minutes end-to-end' },
          { v: '100%', l: 'Smoke tests passed' },
        ].map((s) => (
          <div
            key={s.l}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-4 text-center"
          >
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {s.v}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-snug">{s.l}</div>
          </div>
        ))}
      </div>

      <h2>Step 1 — Turn a paragraph into a rigorous spec</h2>
      <p>
        I started at{' '}
        <a href="https://www.clearlyreqs.com/" target="_blank" rel="noopener noreferrer">
          clearlyreqs.com
        </a>{' '}
        and created a new project. All I needed was a name and a short description.
      </p>

      <div className="not-prose rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-5 my-6 font-mono text-sm text-gray-800 dark:text-gray-200">
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">Project: Attendance Register</p>
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-3"># Initial idea</p>
        <p>
          Create an attendance app for university and college profs. Students come into class and
          scan a randomized QR code to register attendance.
        </p>
      </div>

      <Figure
        file="new_project.png"
        alt="Clearly Create New Project screen with project title and initial idea fields"
        caption="The new-project screen: a title plus enough context to start the interview."
      />

      <p>
        Clearly walks you through a structured flow—Problem Definition (optional), BRD, PRD, then tool
        output. The questions are specific and push you through edge cases you might skip if you
        jumped straight to code.
      </p>

      <Figure
        file="help.png"
        alt="PRD Wizard interview showing AI question and user answer about authentication"
        caption="PRD Wizard: targeted questions—for example, how professor accounts should work if you are not using email or SMS for students."
      />

      <p>If you get stuck, two helpers are built into the wizard:</p>

      <div className="not-prose grid md:grid-cols-2 gap-6 my-10">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-900/40">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Understanding this question
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            The question-mark control explains intent, stakes, and a sensible default architecture.
          </p>
          <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
            <img
              src={`${IMG}/explain.png`}
              alt="Understanding This Question modal with guidance on authentication choices"
              className="w-full"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-900/40">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Example answers</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            The lightbulb control offers copyable drafts you can edit before you submit.
          </p>
          <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
            <img
              src={`${IMG}/example.png`}
              alt="Example answers modal with two suggested responses and Use this buttons"
              className="w-full"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <h3>Approve BRD, then PRD</h3>
      <p>
        You approve the Business Requirements Document before the Product Requirements Document
        unlocks, and you approve the PRD before tool output. Skipping that review is tempting when
        you want to “just build”—but the quality of the final implementation tracks the quality of
        the spec.
      </p>

      <h2>Step 2 — Select OpenClaw and generate the instruction stack</h2>
      <p>
        With the PRD approved, I opened Tool Output and selected <strong>OpenClaw</strong> from the
        AI coding tools list. Clearly generated the file bundle described in the UI.
      </p>

      <Figure
        file="tooloutput.png"
        alt="Project progress dashboard showing approved BRD and PRD and multiple generated tool outputs"
        caption="Project dashboard with BRD and PRD approved and tool output generated (including OpenClaw and Cursor)."
      />
      
      <Figure
        file="openclaw.png"
        alt="Choose Your Output Tool screen with OpenClaw highlighted among vibe coding and AI coding tools"
        caption="Tool output: OpenClaw produces AGENTS.md, SOUL.md, TOOLS.md, IDENTITY.md, USER.md, and a reference document."
      />



      <Figure
        file="Openclaw_output.png"
        alt="OpenClaw output page with setup steps and AGENTS.md preview"
        caption="OpenClaw output page: setup copy list, recommended patterns, and file previews with copy or ZIP download."
      />

      <h2>Step 3 — One prompt, full stack</h2>
      <p>I started an OpenClaw session and used exactly one sentence as the build instruction:</p>

      <div className="not-prose rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-900 text-gray-100 p-5 my-6 font-mono text-sm overflow-x-auto">
        <span className="text-indigo-400">$</span> openclaw chat
        <br />
        <br />
        <span className="text-gray-500"># In the session</span>
        <br />
        create an web service for attendance check.
      </div>

      <p>
        OpenClaw read the instruction stack, planned the stack, implemented the app, and reported
        what shipped—including backend, frontend, schema, routes, and verification.
      </p>

      <Figure
        file="build.png"
        alt="OpenClaw terminal output summarizing delivered attendance web service and smoke test results"
        caption="Terminal handoff: stack summary, endpoints, smoke-test narrative, and how to run the build."
      />

      <div className="not-prose overflow-x-auto my-8 rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/80 text-left">
              <th className="p-3 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                Layer
              </th>
              <th className="p-3 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                Technology
              </th>
              <th className="p-3 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-300">
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <td className="p-3 font-medium text-gray-900 dark:text-white">Backend</td>
              <td className="p-3">Node.js + Express</td>
              <td className="p-3">Port 3001, SQLite WAL, bcrypt password hashing</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <td className="p-3 font-medium text-gray-900 dark:text-white">Database</td>
              <td className="p-3">SQLite</td>
              <td className="p-3">
                Professors, courses, students, sessions, attendance—foreign keys, indexes, uniqueness
                on check-ins
              </td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <td className="p-3 font-medium text-gray-900 dark:text-white">QR</td>
              <td className="p-3">qrcode (npm)</td>
              <td className="p-3">Server-side generation, rotated for active sessions</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <td className="p-3 font-medium text-gray-900 dark:text-white">CSV</td>
              <td className="p-3">csv-parse / csv-stringify</td>
              <td className="p-3">Roster import limits and attendance export</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <td className="p-3 font-medium text-gray-900 dark:text-white">Frontend</td>
              <td className="p-3">React 18 + Vite + Router</td>
              <td className="p-3">Professor flows, student check-in, responsive layout, polling</td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-gray-900 dark:text-white">Auth</td>
              <td className="p-3">express-session + connect-sqlite3</td>
              <td className="p-3">Session persistence in SQLite without extra infrastructure</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="not-prose rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-900/20 p-5 my-8">
        <p className="font-semibold text-emerald-900 dark:text-emerald-200 mb-2">Smoke test results</p>
        <p className="text-sm text-gray-800 dark:text-gray-200">
          Registration, login, course creation, adding students, starting a session, QR generation,
          student check-in, live dashboard updates, and CSV export were exercised end-to-end—all
          passed in the agent run described in the log.
        </p>
      </div>

      <h2>Step 4 — Deploy</h2>
      <p>
        The build ran on a Linux host with a local port. To put it on the public web I added a
        reverse proxy and DNS: Caddy terminated TLS and forwarded to the app, and an A record
        pointed the hostname at the server. Your hosting choices will differ; the point is that the
        application artifact was already complete before networking.
      </p>

      <div className="not-prose rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-center my-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/80 mb-2">Result</p>
        <p className="text-white text-lg font-semibold mb-4">
          A live attendance web service shipped from a one-sentence build prompt—after a real BRD
          and PRD.
        </p>
        <a
          href="https://attendance.ai-biz.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors"
        >
          Visit attendance.ai-biz.app
        </a>
      </div>

      <h2>Spec-driven agent execution</h2>
      <p>
        This is not open-ended “vibe coding,” where the model guesses what you meant. It is{' '}
        <strong>spec-driven agent execution</strong>: you pay the cost up front in requirements—auth,
        data, flows, constraints—so the agent can treat the PRD as a contract instead of a vibe.
      </p>

      <div className="not-prose overflow-x-auto my-8 rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm border-collapse min-w-[520px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/80 text-left">
              <th className="p-3 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                Phase
              </th>
              <th className="p-3 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                Tool
              </th>
              <th className="p-3 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                Time (approx.)
              </th>
              <th className="p-3 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                Your input
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-300">
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <td className="p-3">Requirements</td>
              <td className="p-3">Clearly</td>
              <td className="p-3">~20 min</td>
              <td className="p-3">Structured interview answers</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <td className="p-3">Spec approval</td>
              <td className="p-3">Clearly</td>
              <td className="p-3">~5 min</td>
              <td className="p-3">Review and approve BRD + PRD</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <td className="p-3">Tool output</td>
              <td className="p-3">Clearly</td>
              <td className="p-3">~2 min</td>
              <td className="p-3">Pick OpenClaw, download or copy files</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <td className="p-3">Build</td>
              <td className="p-3">OpenClaw</td>
              <td className="p-3">~30 min</td>
              <td className="p-3">One-sentence implementation prompt</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <td className="p-3">Deploy</td>
              <td className="p-3">Caddy + DNS</td>
              <td className="p-3">~7 min</td>
              <td className="p-3">Proxy and A record</td>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-800/50">
              <td className="p-3 font-semibold text-gray-900 dark:text-white">Total</td>
              <td className="p-3">—</td>
              <td className="p-3 font-semibold text-gray-900 dark:text-white">~64 min</td>
              <td className="p-3 font-semibold text-gray-900 dark:text-white">
                One idea plus one build sentence
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        If your AI coding sessions keep drifting, the failure mode is often the prompt—not the tool.
        A BRD and PRD produced through an interview that forces hard choices gives the agent the
        context it needs to stay on track.
      </p>

      <div className="not-prose rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-6 my-8">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">The playbook</p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>Clearly turns the idea into a rigorous spec.</li>
          <li>OpenClaw turns the spec into working code.</li>
          <li>You review, harden, and ship.</li>
        </ol>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          Want to run the same workflow? Start with the{' '}
          <Link to="/brd-generator" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            BRD generator
          </Link>{' '}
          or{' '}
          <Link to="/prd-generator" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            PRD generator
          </Link>
          , then export tool output for your agent stack.
        </p>
      </div>
    </BlogPostLayout>
  );
}
