/**
 * Blog post: OpenClaw vs Hermes Agent — 2026 comparison
 * Source: docs/openclaw-vs-hermes.html
 */

import { Link } from 'react-router-dom';
import { BlogPostLayout, type FaqItem } from '../../../components/blog/BlogPostLayout';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is the main difference between OpenClaw and Hermes Agent?',
    answer:
      'OpenClaw is built as an ecosystem platform: a Gateway that connects agents to 50+ messaging channels and a marketplace of 44,000+ installable skills. Hermes Agent is built as a learning runtime: it runs tasks, reflects on them, and writes reusable skills so performance compounds over time. Breadth vs depth.',
  },
  {
    question: 'Which is more secure, OpenClaw or Hermes?',
    answer:
      'As of May 2026, public reporting shows a large gap: OpenClaw accumulated 245+ CVEs in a few months, critical flaws including sandbox escapes, thousands of exposed instances, and malicious skills in ClawHub. Hermes reported one medium-severity CVE and security-first defaults (auth on, Docker sandboxing, prompt-injection scanning). For security-first deployments, Hermes is the stronger default; OpenClaw requires hardening and careful marketplace hygiene.',
  },
  {
    question: 'Can I use OpenClaw and Hermes together?',
    answer:
      'Yes for sophisticated setups: OpenClaw can orchestrate across channels and sub-agents while Hermes executes long-horizon work and accumulates learned skills. The comparison doc recommends “both” when you need orchestration breadth plus execution that improves over months.',
  },
  {
    question: 'When should I pick OpenClaw?',
    answer:
      'Choose OpenClaw when you need maximum channel coverage, the largest ready-made skill marketplace, multi-agent orchestration, enterprise integrations, or quick task automation without a training period.',
  },
  {
    question: 'When should I pick Hermes Agent?',
    answer:
      'Choose Hermes when you need a closed learning loop, deep multi-layer memory, security-first defaults, low-cost or serverless deployment, terminal-first developer UX, or workflows that improve over weeks and months.',
  },
];

function StatsRow({ items }: { items: { value: string; label: string; tone?: 'oc' | 'hm' }[] }) {
  const cols =
    items.length >= 6
      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
      : items.length === 4
        ? 'grid-cols-2 sm:grid-cols-4'
        : 'grid-cols-2 sm:grid-cols-3';
  return (
    <div
      className={`not-prose grid ${cols} gap-px bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 my-8`}
    >
      {items.map((s) => (
        <div
          key={s.label}
          className={`bg-white dark:bg-gray-900 p-4 sm:p-5 ${
            s.tone === 'oc'
              ? ''
              : s.tone === 'hm'
                ? ''
                : ''
          }`}
        >
          <div
            className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${
              s.tone === 'oc'
                ? 'text-blue-600 dark:text-blue-400'
                : s.tone === 'hm'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-gray-900 dark:text-white'
            }`}
          >
            {s.value}
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1 font-mono">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function CompareTable({
  headers,
  rows,
}: {
  headers: [string, string, string];
  rows: { dim: string; oc: string; hm: string; ocDanger?: boolean; hmSafe?: boolean }[];
}) {
  return (
    <div className="not-prose overflow-x-auto my-8 rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm border-collapse min-w-[560px]">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/80 text-left">
            <th className="p-3 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
              {headers[0]}
            </th>
            <th className="p-3 font-semibold text-blue-700 dark:text-blue-300 border-b border-gray-200 dark:border-gray-600">
              {headers[1]}
            </th>
            <th className="p-3 font-semibold text-amber-700 dark:text-amber-300 border-b border-gray-200 dark:border-gray-600">
              {headers[2]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.dim} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
              <td className="p-3 font-medium text-gray-900 dark:text-white">{r.dim}</td>
              <td
                className={`p-3 ${
                  r.ocDanger ? 'text-red-600 dark:text-red-400' : 'text-blue-700 dark:text-blue-300'
                }`}
              >
                {r.oc}
              </td>
              <td
                className={`p-3 ${
                  r.hmSafe ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-800 dark:text-amber-300'
                }`}
              >
                {r.hm}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TimelineCol({
  title,
  tone,
  items,
}: {
  title: string;
  tone: 'oc' | 'hm';
  items: { date: string; title: string; body: string; alert?: boolean }[];
}) {
  const dot =
    tone === 'oc'
      ? 'bg-blue-500 ring-blue-200 dark:ring-blue-900'
      : 'bg-amber-500 ring-amber-200 dark:ring-amber-900';
  return (
    <div className="not-prose">
      <h3
        className={`text-lg font-bold mb-4 ${
          tone === 'oc' ? 'text-blue-700 dark:text-blue-300' : 'text-amber-700 dark:text-amber-300'
        }`}
      >
        {title}
      </h3>
      <ul className="space-y-5">
        {items.map((item) => (
          <li key={`${item.date}-${item.title}`} className="flex gap-3">
            <span className="font-mono text-[11px] text-gray-500 dark:text-gray-400 w-16 flex-shrink-0 pt-0.5">
              {item.date}
            </span>
            <span
              className={`mt-1.5 h-2.5 w-2.5 rounded-full flex-shrink-0 ring-4 ${
                item.alert ? 'bg-red-500 ring-red-200 dark:ring-red-900' : dot
              }`}
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArchStack({
  title,
  tone,
  steps,
}: {
  title: string;
  tone: 'oc' | 'hm';
  steps: { name: string; note: string }[];
}) {
  const header =
    tone === 'oc'
      ? 'bg-blue-600 text-white'
      : 'bg-amber-600 text-white';
  return (
    <div className="not-prose rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className={`px-4 py-3 text-sm font-semibold font-mono ${header}`}>{title}</div>
      <ol className="p-4 space-y-3 bg-gray-50 dark:bg-gray-900/40">
        {steps.map((s, i) => (
          <li key={s.name} className="flex gap-3 text-sm">
            <span className="font-mono text-gray-400 w-6">{i === 0 ? '01' : '↓'}</span>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{s.name}</p>
              <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">{s.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function DecisionTable({
  rows,
}: {
  rows: { priority: string; pick: 'OpenClaw' | 'Hermes' | 'Both'; why: string }[];
}) {
  return (
    <div className="not-prose overflow-x-auto my-8 rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm border-collapse min-w-[640px]">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-left">
            <th className="p-3 font-semibold border-b border-gray-200 dark:border-gray-600">
              Your top priority
            </th>
            <th className="p-3 font-semibold border-b border-gray-200 dark:border-gray-600 w-32">
              Pick this
            </th>
            <th className="p-3 font-semibold border-b border-gray-200 dark:border-gray-600">Why</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.priority} className="border-b border-gray-100 dark:border-gray-700">
              <td className="p-3 text-gray-800 dark:text-gray-200">{r.priority}</td>
              <td className="p-3">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                    r.pick === 'OpenClaw'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'
                      : r.pick === 'Hermes'
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200'
                        : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {r.pick}
                </span>
              </td>
              <td className="p-3 text-gray-600 dark:text-gray-400">{r.why}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const DECISION_ROWS: {
  priority: string;
  pick: 'OpenClaw' | 'Hermes' | 'Both';
  why: string;
}[] = [
  {
    priority: 'Maximum platform coverage (50+ chat apps)',
    pick: 'OpenClaw',
    why: 'Nothing else connects to as many channels',
  },
  {
    priority: 'Agent that learns and improves over time',
    pick: 'Hermes',
    why: 'Closed learning loop — skills compound after complex tasks',
  },
  {
    priority: 'Security-first deployment',
    pick: 'Hermes',
    why: 'Zero critical CVEs in public reporting; safer defaults',
  },
  {
    priority: 'Largest skill marketplace',
    pick: 'OpenClaw',
    why: '44,000+ skills on ClawHub ready to install',
  },
  {
    priority: 'Easiest setup right now',
    pick: 'OpenClaw',
    why: 'Consumer-grade defaults, large install base, more docs',
  },
  {
    priority: 'Deep memory across sessions',
    pick: 'Hermes',
    why: 'Four-layer memory architecture',
  },
  {
    priority: 'Multi-agent orchestration',
    pick: 'OpenClaw',
    why: 'Native sub-agent support and ACP protocol',
  },
  {
    priority: 'Low-cost or serverless deployment',
    pick: 'Hermes',
    why: '$5 VPS; Modal/Daytona backends; hibernates when idle',
  },
  {
    priority: 'Terminal-first developer experience',
    pick: 'Hermes',
    why: 'Full TUI with autocomplete, slash commands, streaming output',
  },
  {
    priority: 'Quick task automation that works today',
    pick: 'OpenClaw',
    why: 'ClawHub skills install without a training period',
  },
  {
    priority: 'Workflows that get better over months',
    pick: 'Hermes',
    why: 'Day-30 performance can exceed day-one on repeated work',
  },
  {
    priority: 'Enterprise partnerships (NVIDIA, Baidu, Alibaba)',
    pick: 'OpenClaw',
    why: 'Established integrations with major platforms',
  },
  {
    priority: 'Sophisticated multi-layer system',
    pick: 'Both',
    why: 'OpenClaw to orchestrate; Hermes to execute and learn',
  },
];

export default function OpenClawVsHermesPost() {
  return (
    <BlogPostLayout
      title="OpenClaw vs Hermes Agent: The 2026 Comparison"
      author="Jaehee Song"
      date="2026-05-15"
      readTime="18 min read"
      category="AI & Development"
      excerpt="Two open-source agent frameworks with opposite philosophies—ecosystem breadth vs learning depth. Stars, security, architecture, timelines, and a decision matrix to pick the right stack (or both)."
      slug="openclaw-vs-hermes-agent"
      coverImage="OC"
      coverGradient="from-blue-600 via-slate-700 to-amber-500"
      faqItems={FAQ_ITEMS}
      relatedPosts={[
        {
          slug: 'clearly-openclaw-attendance-case-study',
          title: 'From Idea to a Live Web Service in Under an Hour: Clearly + OpenClaw',
          category: 'AI & Development',
          date: '2026-05-14',
        },
        {
          slug: 'skills-vs-agents',
          title: 'Agents vs Skills: The Full Picture',
          category: 'AI & Development',
          date: '2026-04-23',
        },
        {
          slug: 'hermes-agent-cost-saving',
          title: 'The $30 Bill That Should Have Been $7: Cost-Saving Moves for a Real AI Agent',
          category: 'AI & Development',
          date: '2026-04-22',
        },
      ]}
    >
      <div className="not-prose bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-xl p-6 my-8">
        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2">
          TL;DR · May 2026
        </p>
        <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <strong className="text-blue-600 dark:text-blue-400">OpenClaw</strong> is the ecosystem
          platform—50+ channels, ClawHub skills, Gateway orchestration.{' '}
          <strong className="text-amber-600 dark:text-amber-400">Hermes Agent</strong> is the learning
          runtime—memory, reflection, and skills that compound. Pick breadth and marketplace velocity
          vs depth, security defaults, and improvement over months—or combine both.
        </p>
      </div>

      <StatsRow
        items={[
          { value: '373K+', label: 'OpenClaw stars', tone: 'oc' },
          { value: '156K+', label: 'Hermes stars', tone: 'hm' },
          { value: '2026.5.12', label: 'OpenClaw version', tone: 'oc' },
          { value: 'v0.13.0', label: 'Hermes version', tone: 'hm' },
          { value: '77.3K', label: 'OpenClaw forks', tone: 'oc' },
          { value: '25K', label: 'Hermes forks', tone: 'hm' },
        ]}
      />

      <h2>Two very different ideas</h2>
      <p>
        Both are open-source agent frameworks, but they solve the problem in opposite ways. OpenClaw
        treats the agent as a <strong>system to connect</strong>. Hermes treats the agent as a{' '}
        <strong>mind to grow</strong>.
      </p>

      <div className="not-prose grid md:grid-cols-2 gap-6 my-10">
        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 p-6">
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            OpenClaw
          </span>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2 mb-3">
            The ecosystem platform
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Connects your agent to 50+ messaging apps—WhatsApp, Telegram, Slack, Discord, iMessage,
            and more—with a marketplace of 44,000+ ready-made skills on ClawHub.
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5 list-disc list-inside">
            <li>Gateway server on port 18789</li>
            <li>Bring your own LLM (20+ providers)</li>
            <li>44,000+ ClawHub skills</li>
            <li>iOS, Android, macOS companion apps</li>
          </ul>
        </div>
        <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-6">
          <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            Hermes Agent
          </span>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2 mb-3">
            The learning runtime
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Watches what you do and learns from it—after complex tasks it writes skills so the next
            run is faster. Built around memory, skills, soul, crons, and a closed learning loop.
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5 list-disc list-inside">
            <li>Auto-writes skills after multi-step tasks</li>
            <li>$5 VPS up to GPU cluster</li>
            <li>Seven terminal backends + serverless</li>
            <li>200+ models via OpenRouter, Nous, NIM</li>
          </ul>
        </div>
      </div>

      <CompareTable
        headers={['Dimension', 'OpenClaw', 'Hermes Agent']}
        rows={[
          { dim: 'Core idea', oc: 'Agent as orchestration system', hm: 'Agent as mind that develops' },
          { dim: 'Main language', oc: 'TypeScript / Node.js', hm: 'Python' },
          { dim: 'GitHub stars (May 2026)', oc: '373,000+', hm: '156,000+' },
          { dim: 'Current release', oc: '2026.5.12', hm: 'v0.13.0' },
          { dim: 'Forks', oc: '77,300+', hm: '25,000+' },
          { dim: 'Contributors', oc: '1,600+', hm: '346+' },
          {
            dim: 'LLM providers',
            oc: '20+ (OpenRouter, OpenAI, Anthropic, Ollama)',
            hm: '200+ via OpenRouter, Nous Portal, NVIDIA NIM',
          },
          {
            dim: 'Messaging platforms',
            oc: '50+ (WhatsApp, Telegram, Discord, Slack…)',
            hm: '6+ plus Matrix',
          },
          { dim: 'Self-learning', oc: 'No — skills are static', hm: 'Yes — closed learning loop' },
          {
            dim: 'Skill library',
            oc: 'ClawHub marketplace (44,000+)',
            hm: '91 bundled + 520+ community',
          },
        ]}
      />

      <h2>How fast did they grow?</h2>
      <p>
        OpenClaw went from zero to 373K stars in roughly six months—among the fastest-growing GitHub
        projects on record. Hermes is newer but accelerating, with a higher ratio of contributors to
        stars.
      </p>

      <div className="not-prose grid lg:grid-cols-2 gap-10 my-10">
        <TimelineCol
          title="OpenClaw"
          tone="oc"
          items={[
            {
              date: 'Nov 25',
              title: 'Launched as Clawd',
              body: 'Peter Steinberger starts it as a weekend project in Vienna.',
            },
            {
              date: 'Jan 26',
              title: 'Rebranded OpenClaw',
              body: '9K stars on day one after the final rename.',
            },
            {
              date: 'Feb 26',
              title: '60K stars in 72 hours',
              body: 'Viral growth across developer communities.',
            },
            {
              date: 'Feb 14',
              title: 'Founder joins OpenAI',
              body: 'Project moves to an independent foundation ($116M deal reported).',
            },
            {
              date: 'Mar 26',
              title: 'Surpasses React at 250K stars',
              body: 'React took over 10 years to reach the same milestone.',
            },
            {
              date: 'Mar 18',
              title: '9 CVEs in 4 days',
              body: 'Security issues emerge fast, including a CVSS 9.9 critical flaw.',
              alert: true,
            },
            {
              date: 'May 26',
              title: '373K stars, 3.2M MAU',
              body: '77.3K forks, 1,600+ contributors, release 2026.5.12.',
            },
          ]}
        />
        <TimelineCol
          title="Hermes Agent"
          tone="hm"
          items={[
            {
              date: 'Feb 26',
              title: 'v0.1.0 launched',
              body: 'Nous Research announces with a single tweet.',
            },
            {
              date: 'Mar 26',
              title: '22K stars, 242 contributors',
              body: 'Contributor-to-star ratio far higher than OpenClaw at comparable scale.',
            },
            {
              date: 'Mar 23',
              title: 'v0.4.0 — Platform expansion',
              body: '300 PRs in 5 days; six messaging adapters; MCP OAuth 2.1.',
            },
            {
              date: 'Apr 3',
              title: 'Migration tool goes viral',
              body: 'After Anthropic blocks OpenClaw, Hermes migration tool gets 813 likes.',
            },
            {
              date: 'Apr 8',
              title: 'v0.8.0 — Live model switching',
              body: '64K stars; switch LLMs mid-session.',
            },
            {
              date: 'Apr 27',
              title: 'v0.9.0 — Curator release',
              body: '110K stars; agent maintains its own skill library.',
            },
            {
              date: 'May 13',
              title: '156K stars, v0.13.0, #1 on OpenRouter',
              body: '25K forks; most-used agent on OpenRouter globally (NVIDIA cited).',
            },
          ]}
        />
      </div>

      <h2>How do they work?</h2>
      <p>
        OpenClaw uses a hub-and-spoke model—a central Gateway routes messages to agents and skills.
        Hermes uses a learning loop: run tasks, reflect, write better instructions for next time.
      </p>

      <div className="not-prose grid lg:grid-cols-2 gap-6 my-10">
        <ArchStack
          title="OpenClaw · Gateway-Node-Host"
          tone="oc"
          steps={[
            { name: 'Channel system', note: 'WhatsApp, Telegram, Slack, iMessage, and 46 more' },
            {
              name: 'Gateway',
              note: 'HTTP/WebSocket on port 18789; sessions and approvals',
            },
            { name: 'Plugins & skills', note: '44,000+ skills from ClawHub' },
            { name: 'Agent runtime', note: 'Reasoning loop with tool interception' },
            { name: 'LLM provider', note: 'OpenAI, Anthropic, Ollama, OpenRouter, etc.' },
          ]}
        />
        <ArchStack
          title="Hermes · Learning loop"
          tone="hm"
          steps={[
            { name: 'Agent core', note: 'Preflight compression; SQLite session storage' },
            { name: 'Tool interface', note: 'Slash commands; seven terminal backends' },
            { name: 'Four-layer memory', note: 'Core facts → session → episodic → working notes' },
            {
              name: 'Learning loop',
              note: 'After 5+ tool calls: writes a skill; every 15 tasks: reflects on skills',
            },
            { name: 'Serverless backends', note: 'Modal, Daytona, Vercel — wake on demand' },
          ]}
        />
      </div>

      <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-6 my-10 italic text-gray-700 dark:text-gray-300">
        The question is which philosophy—ecosystem breadth or learning depth—better serves the
        agents of 2027 and beyond.
      </blockquote>

      <h3>What each does best</h3>
      <div className="not-prose grid md:grid-cols-2 gap-6 my-6">
        <div>
          <p className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-2">
            OpenClaw works best for
          </p>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5 list-disc list-inside">
            <li>DevOps automation and internal tools</li>
            <li>Sales workflows and CRM sync</li>
            <li>Content operations and publishing</li>
            <li>Personal productivity (email, calendar)</li>
            <li>Enterprise reports across teams</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold text-amber-700 dark:text-amber-300 mb-2">
            Hermes works best for
          </p>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5 list-disc list-inside">
            <li>Long-horizon research (multi-hour tasks)</li>
            <li>Recurring maintenance that improves with practice</li>
            <li>Content intelligence and competitive monitoring</li>
            <li>Scheduled operations (nightly backups, audits)</li>
            <li>Lead qualification with structured output</li>
          </ul>
        </div>
      </div>

      <h2>This is the biggest difference: security</h2>
      <p>
        OpenClaw grew extremely fast; security reporting did not keep pace. Hermes was designed with
        safer defaults from the start. Treat public CVE counts, marketplace risk, and exposed
        instances as deployment constraints—not footnotes.
      </p>

      <div className="not-prose grid md:grid-cols-2 gap-6 my-8">
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20 p-5">
          <h3 className="font-bold text-red-800 dark:text-red-300 mb-4">OpenClaw — security record</h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">245+</dt>
              <dd className="text-gray-600 dark:text-gray-400">CVEs since February 2026 (reported)</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">7</dt>
              <dd className="text-gray-600 dark:text-gray-400">Critical (CVSS 9.0+)</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">40K+</dt>
              <dd className="text-gray-600 dark:text-gray-400">
                Exposed instances on Shodan — 63% without auth (reported)
              </dd>
            </div>
            <div>
              <dt className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">1,467</dt>
              <dd className="text-gray-600 dark:text-gray-400">
                Malicious ClawHub skills (Snyk “ClawHavoc” audit)
              </dd>
            </div>
          </dl>
        </div>
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/20 p-5">
          <h3 className="font-bold text-emerald-800 dark:text-emerald-300 mb-4">
            Hermes — security record
          </h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">1</dt>
              <dd className="text-gray-600 dark:text-gray-400">
                CVE — medium severity (CVSS 5.6)
              </dd>
            </div>
            <div>
              <dt className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">0</dt>
              <dd className="text-gray-600 dark:text-gray-400">Critical CVEs</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">0</dt>
              <dd className="text-gray-600 dark:text-gray-400">Reported exposed public instances</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">0</dt>
              <dd className="text-gray-600 dark:text-gray-400">
                Malicious marketplace skills — skills are agent-generated
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <CompareTable
        headers={['Security metric', 'OpenClaw', 'Hermes Agent']}
        rows={[
          {
            dim: 'Total CVEs (Feb–May 2026)',
            oc: '245+',
            hm: '1 (CVE-2026-7113, CVSS 5.6)',
            ocDanger: true,
            hmSafe: true,
          },
          { dim: 'Critical CVEs (CVSS 9.0+)', oc: '7', hm: '0', ocDanger: true, hmSafe: true },
          {
            dim: 'Exposed instances (Shodan)',
            oc: '40,000+',
            hm: '0 reported',
            ocDanger: true,
            hmSafe: true,
          },
          {
            dim: 'Malicious skills',
            oc: '1,467 (Snyk audit)',
            hm: '0 (agent-generated)',
            ocDanger: true,
            hmSafe: true,
          },
          {
            dim: 'Zero-click RCE',
            oc: 'Yes (CVE-2026-25253)',
            hm: 'No',
            ocDanger: true,
            hmSafe: true,
          },
          {
            dim: 'Sandbox escapes',
            oc: 'Yes (CVSS 9.9 reported)',
            hm: 'None reported',
            ocDanger: true,
            hmSafe: true,
          },
          {
            dim: 'Default gateway auth',
            oc: 'Off by default',
            hm: 'On — role allowlists',
            ocDanger: true,
            hmSafe: true,
          },
          {
            dim: 'Skill execution sandbox',
            oc: 'No isolation by default',
            hm: 'Docker — read-only root FS',
            ocDanger: true,
            hmSafe: true,
          },
          {
            dim: 'Prompt injection scanning',
            oc: 'Confirmed attacks reported',
            hm: 'Built-in scanner',
            ocDanger: true,
            hmSafe: true,
          },
        ]}
      />

      <h2>Community and scale</h2>
      <p>
        OpenClaw has the larger community today. Hermes is growing quickly with a high share of
        active contributors. Both are accelerating; star counts alone do not tell the whole story.
      </p>

      <StatsRow
        items={[
          { value: '373K+', label: 'OC stars', tone: 'oc' },
          { value: '77.3K', label: 'OC forks', tone: 'oc' },
          { value: '156K+', label: 'Hermes stars', tone: 'hm' },
          { value: '25K', label: 'Hermes forks', tone: 'hm' },
        ]}
      />

      <CompareTable
        headers={['Ecosystem metric', 'OpenClaw', 'Hermes Agent']}
        rows={[
          { dim: 'GitHub stars', oc: '373,000+', hm: '156,000+' },
          { dim: 'Current release', oc: '2026.5.12', hm: 'v0.13.0' },
          { dim: 'Star growth rate', oc: '~50K/month (slowing)', hm: '~47K/month (accelerating)' },
          { dim: 'Forks', oc: '77,300+', hm: '25,000+' },
          { dim: 'Contributors', oc: '1,600+', hm: '346+' },
          { dim: 'Total releases', oc: '136', hm: '13' },
          { dim: 'Skills / plugins', oc: '44,000+ (ClawHub)', hm: '91 bundled + 520+ community' },
          { dim: 'Monthly active users', oc: '3.2M (92% retention cited)', hm: 'Not disclosed' },
          { dim: 'Startups built on it', oc: '180', hm: 'Growing' },
          {
            dim: 'Enterprise partners',
            oc: 'NVIDIA, Tencent, Baidu, Alibaba',
            hm: 'NVIDIA',
          },
          { dim: 'Ecosystem revenue', oc: '$320K+/month cited', hm: 'Not disclosed' },
        ]}
      />

      <h2>Which one should you use?</h2>
      <p>
        There is no universal winner. Match your top priority to the framework—or use OpenClaw to
        orchestrate and Hermes to execute and learn.
      </p>

      <DecisionTable rows={DECISION_ROWS} />

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-10">
        Data and security figures are as cited in the source comparison for May 2026. Verify before
        production decisions; neither Clearly nor this post is affiliated with OpenClaw or Nous
        Research.{' '}
        <a
          href="https://github.com/openclaw/openclaw"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          OpenClaw on GitHub
        </a>
        {' · '}
        <a
          href="https://github.com/NousResearch/hermes-agent"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-700 dark:text-amber-400 hover:underline"
        >
          Hermes Agent on GitHub
        </a>
      </p>

      <p className="mt-6">
        If you are shipping agent instructions from requirements, Clearly exports stacks for{' '}
        <strong>OpenClaw</strong> (AGENTS.md, SOUL.md, TOOLS.md, and related files) and other coding
        tools—see the{' '}
        <Link to="/blog/clearly-openclaw-attendance-case-study" className="font-medium text-primary-600 dark:text-primary-400 hover:underline">
          Clearly + OpenClaw case study
        </Link>{' '}
        for a full walkthrough.
      </p>
    </BlogPostLayout>
  );
}
