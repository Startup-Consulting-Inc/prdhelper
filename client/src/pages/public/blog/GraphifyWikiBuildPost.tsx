/**
 * Blog Post: I Built a Web-Based Wiki Through Telegram
 * Source: docs/graphify.html
 */

import { BlogPostLayout, type FaqItem } from '../../../components/blog/BlogPostLayout';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is Graphify and what does it do in this system?',
    answer:
      'Graphify is an open-source Python library that parses a corpus of Markdown files, extracts named entities and relationships, detects communities, and generates a graph.json file suitable for D3.js rendering. In this wiki, it runs after every ingestion — rebuilding the full knowledge graph so that new pages immediately appear as nodes with edges to semantically related content. It also auto-injects "Related (from graph)" sections directly into wiki pages.',
  },
  {
    question: 'Why FastAPI and Vanilla JS instead of Next.js or a React SPA?',
    answer:
      'The goal was a system with no build step and minimal dependencies. Vanilla JS + the History API gives a functional SPA that still works in 2035 without npm audit nightmares. FastAPI handles async I/O without blocking during file parsing or LLM calls. The entire stack runs on a $5/month VPS with room to spare — a build pipeline would add complexity without adding value for a single-user tool.',
  },
  {
    question: 'What is a "God Node" in the knowledge graph?',
    answer:
      'A God Node is any node whose degree (number of connections) exceeds mean_degree + 2*std_dev across the entire graph. In practice, these are concepts that appear referenced in many different articles — they act as bridges between clusters of knowledge. FastAPI, for example, emerged as a God Node bridging infrastructure notes and API design philosophy pages, a connection that was never manually tagged.',
  },
  {
    question: 'What does this cost to run per month?',
    answer:
      'The Hetzner CX23 VPS (4GB RAM, 40GB SSD, ARM64) runs approximately €4–5/month. Caddy and Let\'s Encrypt are free. LLM costs via OpenRouter run $0.01–0.03 per ingestion using Kimi K2.5. For typical personal use — ingesting 10–20 items per week — monthly LLM spend stays under $5. Total: ~$5–10/month depending on usage.',
  },
  {
    question: 'Why use a JSONL file for the job queue instead of Redis?',
    answer:
      'A JSON-lines file requires no separate process, no configuration, and survives server restarts without data loss. For a single-user wiki processing a few jobs per day, it is more than sufficient. The queue file is also human-readable — you can cat it, grep for stuck jobs, or manually clear bad entries with a text editor. Redis would add operational overhead for zero measurable benefit at this scale.',
  },
  {
    question: 'Did you write any of the code yourself?',
    answer:
      'Zero lines. The entire codebase — FastAPI backend, Vanilla JS frontend, Caddy configuration, Graphify integration, systemd service file — was written by Hermes Agent via Telegram. The human role was diagnosis and direction: reading logs when things hung, describing symptoms, and asking better questions. That division of labor — agent handles implementation, human handles clarity — is the real lesson of the build.',
  },
];

export default function GraphifyWikiBuildPost() {
  const statusBadge = (type: 'ok' | 'warn' | 'bad', label: string) => {
    const styles = {
      ok: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700',
      warn: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700',
      bad: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700',
    };
    return (
      <span className={`inline-block font-mono text-xs px-2 py-0.5 rounded ${styles[type]}`}>
        {label}
      </span>
    );
  };

  return (
    <BlogPostLayout
      title="I Built a Web-Based Wiki Through Telegram"
      author="Jaehee Song"
      date="2026-04-20"
      readTime="8 min read"
      category="AI & Development"
      excerpt="It took a few restarts, some log-diving, and an AI agent on the other end of a chat thread. But it works — and it replaced Obsidian. A case study: FastAPI + Graphify + D3.js, $5/month, zero lines of human code."
      slug="graphify-wiki-build"
      coverImage="GW"
      coverGradient="from-blue-700 via-cyan-600 to-teal-500"
      faqItems={FAQ_ITEMS}
    >
      {/* Meta bar */}
      <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
        {[
          { label: 'Domain', value: 'wiki.ai-biz.app' },
          { label: 'Stack', value: 'FastAPI + Vanilla JS + Graphify' },
          { label: 'Cost', value: '~$5 / month' },
          { label: 'Human Code', value: '0 lines' },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div className="font-mono text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
              {item.label}
            </div>
            <div className="font-semibold text-gray-900 dark:text-white text-sm">{item.value}</div>
          </div>
        ))}
      </div>

      <h2>The Starting Point: A Gist and a Chat Thread</h2>

      <p>I started with a gist and a Telegram chat.</p>

      <p>
        Andrej Karpathy published a simple pattern for an LLM wiki — a markdown-based knowledge base
        where you feed sources to an LLM and let it write structured notes. It resonated with me
        immediately. I've used Obsidian for years, but I was tired of the sync dance between
        devices, the plugin dependency, the feeling that my notes were locked in a desktop app that
        didn't quite fit how I work anymore.
      </p>

      <p>
        I wanted a web version. Something I could access from any browser. Something that lived on a
        server I controlled, not in a proprietary sync chain. But I didn't want to spend weekends
        writing CRUD endpoints and debugging CSS.
      </p>

      <p>
        So I <strong>installed Hermes agents on my local machine, set up a Telegram connection, and
        started asking.</strong>
      </p>

      <h2>System Architecture</h2>

      <p>
        What emerged after a few iterations was a three-layer architecture designed for minimal
        infrastructure and maximum longevity. No build tools. No managed databases. Just files,
        processes, and a reverse proxy.
      </p>

      {/* Architecture diagram */}
      <div className="not-prose my-8 space-y-0">
        {[
          {
            label: 'Client Layer',
            color: 'border-blue-400 dark:border-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            boxes: [
              { title: 'Browser', desc: 'Vanilla JS SPA' },
              { title: 'D3.js', desc: 'Graph Visualization' },
              { title: 'History API', desc: 'Client Routing' },
            ],
          },
          {
            label: 'Reverse Proxy Layer',
            color: 'border-emerald-400 dark:border-emerald-500',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            boxes: [
              { title: 'Caddy', desc: 'HTTPS + Basic Auth' },
              { title: "Let's Encrypt", desc: 'Auto TLS' },
            ],
          },
          {
            label: 'Application Layer (Port 8080)',
            color: 'border-gray-300 dark:border-gray-600',
            bg: 'bg-gray-50 dark:bg-gray-800/40',
            boxes: [
              { title: 'FastAPI', desc: 'Web Framework' },
              { title: 'Uvicorn', desc: 'ASGI Server' },
              { title: 'JSONL Queue', desc: 'Async Jobs' },
              { title: 'Graphify', desc: 'Knowledge Graph' },
            ],
          },
          {
            label: 'Data Layer (Filesystem)',
            color: 'border-gray-300 dark:border-gray-600',
            bg: 'bg-gray-50 dark:bg-gray-800/40',
            boxes: [
              { title: 'raw/', desc: 'Immutable Sources' },
              { title: 'wiki/', desc: 'Synthesized MD' },
              { title: 'graphify-out/', desc: 'Graph JSON' },
            ],
          },
        ].map((layer, i, arr) => (
          <div key={layer.label}>
            <div className={`${layer.bg} border ${layer.color} rounded-xl p-5`}>
              <div className="font-mono text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                {layer.label}
              </div>
              <div className="flex flex-wrap gap-3">
                {layer.boxes.map((box) => (
                  <div
                    key={box.title}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 min-w-[110px]"
                  >
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">
                      {box.title}
                    </div>
                    <div className="font-mono text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {box.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {i < arr.length - 1 && (
              <div className="flex justify-center py-1 text-gray-300 dark:text-gray-600 text-lg">
                ↓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tech stack table */}
      <div className="not-prose overflow-x-auto my-8 border border-gray-200 dark:border-gray-700 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
              {['Layer', 'Technology', 'Purpose', 'Why It Was Chosen'].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {[
              ['Frontend', 'Vanilla JS + D3.js v7', 'SPA + Graph Viz', 'No build step. Still works in 2035.'],
              ['Proxy', 'Caddy', 'HTTPS + Auth', 'Auto certs. 10-line config.'],
              ['Backend', 'FastAPI + Uvicorn', 'API + Async', 'Python-native. Handles I/O without blocking.'],
              ['Queue', 'JSON-lines file', 'Job processing', 'No Redis. Human-readable. Survives restarts.'],
              ['Storage', 'Local Filesystem', 'Markdown + Assets', 'Zero vendor lock-in. `cat` your notes.'],
              ['LLM', 'Kimi K2.5 (OpenRouter)', 'Content Synthesis', 'Structured JSON output. Cross-linking logic.'],
            ].map(([layer, tech, purpose, why]) => (
              <tr key={layer} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className="px-4 py-3 font-mono text-xs text-blue-500 dark:text-blue-400">{layer}</td>
                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{tech}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{purpose}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>The Ingestion Pipeline: From URL to Knowledge Graph</h2>

      <p>
        The system doesn't just store files — it understands them. Here's exactly what happens when
        you paste a URL into the wiki.
      </p>

      <div className="not-prose my-8 space-y-0">
        {[
          {
            n: '1',
            title: 'Input & Extraction',
            desc: 'URL fetched via httpx + BeautifulSoup. PDFs through PyMuPDF. DOCX via python-docx. Everything returns clean text within 30 seconds.',
            tag: 'Timeout: 30s',
          },
          {
            n: '2',
            title: 'Context Assembly',
            desc: 'Before calling the LLM, the system reads your existing wiki pages. It knows what you already know — preventing duplicate concepts and maintaining referential integrity.',
            tag: 'Reads: SCHEMA.md + index + existing pages',
          },
          {
            n: '3',
            title: 'LLM Synthesis',
            desc: 'Kimi K2.5 receives a structured prompt: schema conventions, existing pages for cross-linking, source text (first 80KB), and metadata. It acts as a librarian, not a search engine.',
            tag: 'Model: kimi-k2.5 via OpenRouter',
          },
          {
            n: '4',
            title: 'Structured Output',
            desc: 'The model returns JSON defining: source_page, entities[], concepts[], analyses[], plus log entries and index updates.',
            tag: 'Validated via Pydantic',
          },
          {
            n: '5',
            title: 'File Writing',
            desc: 'Markdown files land in wiki/sources/, wiki/entities/, wiki/concepts/ — all with [[WikiLinks]] and Obsidian-compatible structure.',
            tag: 'Updates: index.md + log.md + overview.md',
          },
          {
            n: '6',
            title: 'Graph Rebuild',
            desc: 'Graphify re-parses the entire corpus. Extracts entities, relationships, and communities. Generates graph.json for D3 rendering and auto-injects "Related (from graph)" sections into wiki pages.',
            tag: 'Timeout: 300s for full rebuild',
          },
          {
            n: '7',
            title: 'Interactive Visualization',
            desc: 'Open wiki.ai-biz.app/graph. D3.js force simulation renders nodes sized by degree, colored by community, with edges labeled by relationship type. God Nodes appear as bridges between distant clusters.',
            tag: 'God Node threshold: mean_degree + 2×std_dev',
          },
        ].map((step, i, arr) => (
          <div key={step.n} className="flex gap-0">
            <div className="flex flex-col items-center w-12 shrink-0">
              <div className="w-9 h-9 rounded-full border-2 border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-900 flex items-center justify-center font-mono font-bold text-sm text-blue-500 dark:text-blue-400 z-10">
                {step.n}
              </div>
              {i < arr.length - 1 && (
                <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 mt-1" />
              )}
            </div>
            <div className={`flex-1 pl-4 ${i < arr.length - 1 ? 'pb-7' : ''}`}>
              <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                {step.title}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{step.desc}</p>
              <span className="inline-block font-mono text-xs px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-emerald-600 dark:text-emerald-400">
                {step.tag}
              </span>
            </div>
          </div>
        ))}
      </div>

      <h2>The Build: From Telegram to Production</h2>

      <p>
        I sent Karpathy's gist through Telegram and told the agent:{' '}
        <em>"Build me a web version of this."</em> The agent asked clarifying questions. I answered
        from intuition — years of using note-taking apps, not years of building them.
      </p>

      <p>
        After a couple of iterations, I had a working version on my hosting server. I configured DNS
        so it answered at <strong>wiki.ai-biz.app</strong>. That part felt almost too easy.
      </p>

      <h3>What I Started With</h3>

      <div className="not-prose bg-gray-900 dark:bg-gray-950 rounded-xl p-6 my-4 font-mono text-xs overflow-x-auto">
        <pre className="text-gray-300 leading-relaxed">{`# The prompt, more or less
Build a FastAPI app for a web-based LLM Wiki.
- Ingest URLs and files (PDF, DOCX, TXT)
- Use Kimi K2.5 via OpenRouter for synthesis
- Store as markdown with [[WikiLinks]]
- Vanilla JS frontend, no build tools
- Deploy to my VPS with Caddy + HTTPS
- Cost target: $5/month infrastructure`}</pre>
      </div>

      <h3>The Integration That Fought Back</h3>

      <p>
        I wanted a replacement for Obsidian, not a companion. That meant the graph view. I found{' '}
        <a
          href="https://github.com/safishamsi/graphify"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 underline"
        >
          Graphify
        </a>{' '}
        and asked the agent to integrate it.
      </p>

      <p>
        This part took longer than expected. The integration looked straightforward — install{' '}
        <code>graphifyy</code>, add a service wrapper, trigger rebuilds. But the first few runs{' '}
        <strong>hung</strong>. The job queue showed <code>running</code> indefinitely. The graph JSON
        never appeared. The worker sat silent, eating memory.
      </p>

      <p>
        I had to jump into the terminal and read the logs myself. I'd tail the queue file, check
        worker status, grep for error traces. Sometimes the hang happened during corpus parsing —
        Graphify choking on malformed markdown. Sometimes it was a timeout mismatch. Sometimes the
        gateway itself needed a restart before the agent could see the updated state.
      </p>

      {/* Integration table */}
      <div className="not-prose overflow-x-auto my-8 border border-gray-200 dark:border-gray-700 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
              {['Integration Phase', 'What Happened', 'Resolution'].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {([
              ['Initial Setup', 'Installed graphifyy library via pip', 'ok', 'Clean'],
              ['First Rebuild', 'Worker hung at corpus parsing stage. No timeout handling.', 'warn', 'Log-diving'],
              ['Queue Recovery', 'Stuck jobs blocked new ingestions. Queue file grew with dead entries.', 'warn', 'Manual reset'],
              ['Gateway Sync', "Agent couldn't see updated state after config changes.", 'warn', 'Restart gateway'],
              ['Timeout Hardening', 'Default 10s too short for full wiki rebuilds.', 'ok', 'Segmented timeouts'],
              ['Final Integration', 'Graph rebuilds successfully after ingestion. Auto-injects related pages.', 'ok', 'Working'],
            ] as const).map(([phase, what, status, label]) => (
              <tr key={phase} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className="px-4 py-3 font-mono text-xs text-blue-500 dark:text-blue-400">{phase}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{what}</td>
                <td className="px-4 py-3">{statusBadge(status, label)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        I reset the session a couple of times. Restarted the gateway. Cleared stuck jobs manually.
        Each time, I'd paste the log snippet into Telegram, describe what I saw, and ask the agent
        to fix it. Slowly, the integration hardened. Timeouts got segmented:{' '}
        <strong>10s for queries, 30s for pathfinding, 300s for full rebuilds.</strong> Error
        handling improved. The worker learned to recover from partial failures.
      </p>

      <p>
        It wasn't seamless. It was messier. More human. I had to understand what was happening under
        the hood to unblock the agent. But that's also where I learned the most.
      </p>

      <h2>The $5 Infrastructure Reality</h2>

      <p>
        The system runs on a Hetzner CX23 in Helsinki. 4GB RAM. 40GB SSD. ARM64. Less than a
        streaming subscription.
      </p>

      <div className="not-prose overflow-x-auto my-8 border border-gray-200 dark:border-gray-700 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
              {['Component', 'Spec / Cost', 'Role'].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {[
              ['VPS', 'Hetzner CX23 ~$5/mo', 'Ubuntu 24.04, 4GB RAM, 40GB SSD'],
              ['Web Server', 'Caddy (Free)', 'HTTPS + Reverse Proxy + Basic Auth'],
              ['TLS', "Let's Encrypt (Free)", 'Auto-renewing certificates'],
              ['Firewall', 'UFW (Built-in)', 'Deny all incoming; allow 22, 80, 443'],
              ['Process Manager', 'Systemd (Built-in)', 'Auto-start on boot, restart on failure'],
              ['LLM API', 'OpenRouter (~$0.01–0.03/ingestion)', 'Kimi K2.5 synthesis'],
              ['Domain', 'Subdomain (Existing)', 'wiki.ai-biz.app → VPS IP'],
            ].map(([comp, cost, role]) => (
              <tr key={comp} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className="px-4 py-3 font-mono text-xs text-blue-500 dark:text-blue-400">{comp}</td>
                <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">{cost}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        Security is intentionally minimal for the use case: TLS 1.3 via Caddy, HTTP Basic Auth with
        bcrypt hashes, port 8080 restricted to admin IP only. No session management. No JWT
        complexity. No CORS because the SPA and API share the same origin. It's not enterprise
        security — it's <em>appropriate</em> security.
      </p>

      <h2>When the Graph Finally Worked</h2>

      <p>
        After those restarts and log-diving sessions, the integration completed. I ingested a
        technical article about agentic AI. The queue processed. The markdown synthesized. And then
        — almost as an afterthought — the graph rebuilt.
      </p>

      <p>
        I opened <strong>wiki.ai-biz.app/graph</strong>. The D3.js force simulation pulled nodes
        into view. "Agentic AI" connected to "LLM orchestration," which connected to a note I'd
        ingested weeks earlier about autonomous systems. The node for "FastAPI" sat in the center of
        a cluster, bridging infrastructure notes and API design philosophy. I hadn't linked those
        manually. The graph found the bridge.
      </p>

      <p>
        It wasn't just a visualization. It was a <strong>second opinion on my own thinking.</strong>
      </p>

      <div className="not-prose bg-gray-50 dark:bg-gray-800/60 border-l-4 border-emerald-400 dark:border-emerald-500 rounded-r-xl px-6 py-5 my-8">
        <p className="text-gray-800 dark:text-gray-100 italic text-lg font-light leading-relaxed">
          "Most AI-assisted knowledge tools treat the LLM as a search engine. This system treats it
          as a librarian. A librarian doesn't wait for you to ask — they organize, connect, and
          notice patterns you missed."
        </p>
        <p className="font-mono text-xs text-gray-400 dark:text-gray-500 mt-3">
          — On the synthesis pipeline
        </p>
      </div>

      <h2>What I Actually Built</h2>

      <p>
        Now I have a web-based LLM wiki with <strong>no Obsidian dependency</strong>. I can ingest a
        URL from my phone, let Kimi K2.5 synthesize it into structured markdown, and watch the
        knowledge graph update in real time. I can search across everything. I can follow
        connections I never would have tagged manually. And I can do it from any device with a
        browser, because the whole thing lives at <code>wiki.ai-biz.app</code> on a server I
        control.
      </p>

      {/* Feature status table */}
      <div className="not-prose overflow-x-auto my-8 border border-gray-200 dark:border-gray-700 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
              {['Feature', 'How It Works', 'Status'].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {([
              ['URL Ingestion', 'Fetch + extract + LLM synthesis in ~30s'],
              ['File Upload', 'PDF, DOCX, TXT → structured markdown'],
              ['Wiki Browser', 'SPA with sidebar tree, search, breadcrumbs'],
              ['Knowledge Graph', 'D3.js force graph with God Node detection'],
              ['Auto Cross-Linking', 'LLM injects [[WikiLinks]] during synthesis'],
              ['Graph Sync', 'Auto-injects "Related (from graph)" sections'],
              ['HTTPS Access', 'Caddy + Let\'s Encrypt at wiki.ai-biz.app'],
              ['Mobile Access', 'Responsive SPA, no app install required'],
            ] as const).map(([feature, how]) => (
              <tr key={feature} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{feature}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{how}</td>
                <td className="px-4 py-3">{statusBadge('ok', 'Active')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tag list */}
      <div className="not-prose flex flex-wrap gap-2 my-6">
        {['FastAPI', 'Vanilla JS', 'D3.js', 'Graphify', 'Kimi K2.5', 'OpenRouter', 'Caddy', 'Self-Hosted', 'Hermes Agent', 'Telegram'].map(
          (tag) => (
            <span
              key={tag}
              className="font-mono text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
            >
              {tag}
            </span>
          )
        )}
      </div>

      <h2>The Real Lesson</h2>

      <p>The agent built the code. I built the clarity.</p>

      <p>
        Every time the integration hung, I had to get specific. I couldn't say "it's broken." I had
        to paste the log, point to the line, describe the symptom. That specificity forced me to
        understand the system better than I would have if everything had worked on the first try.
        The agent handled the implementation. I handled the diagnosis. Together, we got to something
        solid.
      </p>

      <p>
        If you're hesitating on a project like this because you don't know FastAPI or you've never
        configured Caddy, consider this:{' '}
        <strong>I didn't either.</strong> I just knew what I wanted my wiki to do, and I kept asking
        better questions when it didn't.
      </p>

      <div className="not-prose bg-gray-50 dark:bg-gray-800/60 border-l-4 border-emerald-400 dark:border-emerald-500 rounded-r-xl px-6 py-5 my-8">
        <p className="text-gray-800 dark:text-gray-100 italic text-lg font-light leading-relaxed">
          "Your notes deserve a nervous system, not a filing cabinet. And building one might just be
          a matter of sending the right message."
        </p>
        <p className="font-mono text-xs text-gray-400 dark:text-gray-500 mt-3">— The takeaway</p>
      </div>
    </BlogPostLayout>
  );
}
