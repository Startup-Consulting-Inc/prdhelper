/**
 * Blog Post: I Built a Web-Based Wiki Through Telegram
 * Source: docs/graphify.html + docs/llm-wiki-graphify.md
 */

import { BlogPostLayout, type FaqItem } from '../../../components/blog/BlogPostLayout';
import systemArchitectImg from '../../../assets/system-archtect.png';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is the difference between LLM Wiki and standard RAG?',
    answer:
      'Standard RAG (NotebookLM, ChatGPT uploads) re-derives answers from scratch every session — nothing accumulates. LLM Wiki compiles knowledge into discrete, cross-linked Markdown pages. When you add a new source, the LLM reads your existing wiki and updates related pages rather than creating isolated documents. Knowledge compounds instead of resetting.',
  },
  {
    question: 'What is Graphify and how does it differ from LLM-based linking?',
    answer:
      'Graphify is an open-source Python library that transforms documents into a queryable knowledge graph using a hybrid approach: Tree-sitter AST for code (deterministic, zero LLM tokens, 25 languages), LLMs for document semantics, and local Whisper transcription for audio/video. Unlike an LLM that infers "A relates to B," Graphify assigns typed, confidence-scored edges — EXTRACTED (100% certain), INFERRED (scored), or AMBIGUOUS (flagged for review). It also uses the Leiden algorithm for community detection.',
  },
  {
    question: 'What is a "God Node" in the knowledge graph?',
    answer:
      'A God Node is any node whose degree (number of connections) exceeds mean_degree + 2×std_dev across the full graph. These are concepts that appear referenced across many different articles and act as bridges between knowledge clusters. In practice, they reveal unexpected structural importance — a shared utility function connecting an OAuth2 module and a PaymentGateway that no human noticed, for example.',
  },
  {
    question: 'What is confidence scoring (EXTRACTED / INFERRED / AMBIGUOUS)?',
    answer:
      'Graphify tags every relationship with a confidence type. EXTRACTED means the relationship is structurally certain — Code A directly imports Code B. INFERRED means the relationship is semantically likely but not guaranteed, scored with a confidence value (e.g., 0.87). AMBIGUOUS means the relationship is unclear and is flagged for human review. This replaces the LLM\'s all-or-nothing linking with a trust gradient.',
  },
  {
    question: 'What does this cost to run per month?',
    answer:
      'The Hetzner CX23 VPS (4GB RAM, 40GB SSD, ARM64) costs approximately €4–5/month. Caddy and Let\'s Encrypt are free. LLM API calls via OpenRouter cost $0.01–0.03 per ingestion with Kimi K2.5. For typical personal use — 10–20 ingestions per week — total monthly cost stays under $10. The SHA256 cache in Graphify means unchanged files are never re-processed, keeping token costs low as the wiki grows.',
  },
  {
    question: 'Did you write any of the code yourself?',
    answer:
      'Zero lines. The entire codebase — FastAPI backend, Vanilla JS SPA, Caddy configuration, Graphify integration, systemd service file — was written by Hermes Agent via Telegram. The human role was diagnosis and direction: reading logs when the Graphify worker hung, describing error traces, and asking better questions when things broke. The agent handled implementation; I handled clarity.',
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
      title="From Scattered Notes to a Living Knowledge Graph: Building LLM Wiki + Graphify"
      author="Jaehee Song"
      date="2026-04-21"
      readTime="10 min read"
      category="AI & Development"
      excerpt="My digital life was fragmented across Google Drive, OneNote, Apple Notes, Slack, and Brunch. I built a self-hosted wiki where an AI agent ingests anything and Graphify maps the connections — $5/month, zero lines of human code."
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

      <p>
        We live in an age of infinite information, but our tools for managing it are fundamentally
        broken.
      </p>

      <p>
        My digital life is a fragmented mess. Documents are scattered across Google Drive, emails,
        Microsoft OneNote, Apple Notes, Samsung Notes, Slack threads, Medium articles, and Brunch
        posts. When I need to find a specific concept, I don't know where to look. Information
        duplicates itself, goes outdated, or simply gets lost in the noise.
      </p>

      <p>
        I needed a solution. I found it in Andrej Karpathy's{' '}
        <a
          href="https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 underline"
        >
          LLM Wiki
        </a>{' '}
        concept. I implemented it locally using Obsidian, and it worked beautifully. But there was
        a catch: <strong>it was trapped on my laptop.</strong>
      </p>

      <p>
        The easiest fix was Obsidian Sync at $5/month. But without stable income right now, a
        recurring subscription is a luxury I can't justify.
      </p>

      <p>
        So I built a web version. I provisioned a cheap Linux server (Hetzner CX23), set up Hermes
        agents via Telegram, and iteratively instructed the AI to build a web-based LLM Wiki. It
        worked — I had a FastAPI + vanilla JS SPA to ingest data and read my wiki. But something was
        missing:{' '}
        <strong>there were no visual connections between the documents.</strong> It was just a fancy
        text database.
      </p>

      <p>
        Then I discovered <strong>Graphify</strong>. By integrating it into my LLM Wiki, I didn't
        just add a feature — I evolved scattered notes into a connected, visual, living knowledge
        network.
      </p>

      <h2>What Is LLM Wiki?</h2>

      <p>
        LLM Wiki is a paradigm shift from "saving files" to "compiling knowledge."
      </p>

      <p>
        Traditional note-taking apps treat a document as a bucket of text. LLM Wiki treats a
        document as raw material to be distilled into atomic concepts. When you feed a URL, PDF, or
        text file into the system, it follows a strict three-layer architecture:
      </p>

      <div className="not-prose overflow-x-auto my-8 border border-gray-200 dark:border-gray-700 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
              {['Layer', 'Purpose', 'What Lives Here'].map((h) => (
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
              ['raw/ (Immutable)', 'Original source material saved exactly as it was. You never edit this.', 'PDFs, scraped HTML, uploaded files'],
              ['wiki/ (Entities & Concepts)', 'The LLM reads raw files and breaks them into discrete markdown files.', 'entities/, concepts/, comparisons/'],
              ['SCHEMA.md', 'The organizational logic that ties it all together.', 'Ontology rules, naming conventions'],
            ].map(([layer, purpose, what]) => (
              <tr key={layer} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className="px-4 py-3 font-mono text-xs text-blue-500 dark:text-blue-400">{layer}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{purpose}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{what}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        Instead of reading a 10-page PDF to find one concept, the LLM has already extracted that
        concept into its own standalone wiki page, cross-referenced with everything else. It is an
        Obsidian-compatible vault running on a cheap web server, accessible from any device.
      </p>

      <div className="not-prose bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5 my-6">
        <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">The limitation</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          LLM Wiki is brilliant at text synthesis, but it relies solely on the LLM to guess how
          concepts relate. It's linear. It lacks structural certainty and visual context.
        </p>
      </div>

      <h2>What Is Graphify?</h2>

      <p>
        Graphify is an open-source Python library that transforms unstructured data — documents,
        code, images, audio — into a queryable <strong>knowledge graph</strong>: a network of Nodes
        (concepts) and Edges (relationships).
      </p>

      <p>
        While LLM Wiki uses an AI to "read and summarize," Graphify uses a hybrid approach to "map
        and connect":
      </p>

      <ul>
        <li>
          <strong>For Code:</strong> Tree-sitter AST (Abstract Syntax Trees) extracts functions,
          classes, and imports across 25 languages. This is <em>deterministic</em> — no LLM tokens
          wasted, zero hallucinations.
        </li>
        <li>
          <strong>For Docs/Images/Videos:</strong> LLMs and local transcription (faster-whisper)
          extract semantic relationships.
        </li>
        <li>
          <strong>Confidence Scoring:</strong> Relationships are typed —{' '}
          <code>EXTRACTED</code> (100% certain), <code>INFERRED</code> (scored by confidence), or{' '}
          <code>AMBIGUOUS</code> (flagged for human review).
        </li>
        <li>
          <strong>Community Detection:</strong> The Leiden algorithm automatically clusters related
          nodes into "neighborhoods" of knowledge.
        </li>
      </ul>

      <div className="not-prose overflow-x-auto my-8 border border-gray-200 dark:border-gray-700 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
              {['Feature', 'Standard LLM (Basic Wiki)', 'Graphify Enhancement'].map((h) => (
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
              ['Code Parsing', 'Reads it like English text. Costly, prone to missing structural links.', 'Tree-sitter AST: Extracts exact call graphs, imports, classes (25 languages). Zero LLM tokens.'],
              ['Relationships', 'Implicit wikilinks based on text similarity.', 'Explicit, typed edges (calls, depends_on, contradicts) with confidence scores.'],
              ['Multimodal', 'Text and basic PDF only.', 'Images (Vision AI), Audio/Video (Local Whisper transcription).'],
              ['Update Efficiency', 'Re-processes everything on each rebuild.', 'SHA256 Cache: Only processes new or changed files. 71.5× fewer tokens per query.'],
            ].map(([feat, llm, graph]) => (
              <tr key={feat} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">{feat}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{llm}</td>
                <td className="px-4 py-3 text-emerald-700 dark:text-emerald-300">{graph}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>What Does the Integration Bring?</h2>

      <p>
        The core philosophy: <strong>don't replace the wiki — augment it with a graph layer.</strong>{' '}
        The LLM Wiki remains the human-readable frontend. Graphify becomes the structural, analytical
        backend.
      </p>

      <h3>1. Multimodal Ingestion on Steroids</h3>

      <p>
        The wiki used to only handle URLs and text. Now I can drop a GitHub repo URL, three UI
        screenshots, and a YouTube conference talk into the web portal simultaneously.
      </p>
      <ul>
        <li>Graphify clones the repo and maps the code architecture via AST.</li>
        <li>It transcribes the YouTube video locally with faster-whisper.</li>
        <li>
          It passes all of this to the LLM Wiki to generate highly specific, code-aware wiki pages.
        </li>
      </ul>

      <h3>2. God Nodes and Surprising Connections</h3>

      <p>
        Graphify maps the mathematical centrality of the network, identifying{' '}
        <strong>God Nodes</strong> — concepts that connect to the highest number of other concepts
        (threshold: mean_degree + 2×std_dev). It also detects{' '}
        <strong>Surprising Connections</strong> — two distant concepts linked through an unexpected
        path.
      </p>

      <div className="not-prose bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 my-4">
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">Example</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Graphify discovered that an <code>OAuth2</code> module and a{' '}
          <code>PaymentGateway</code> module were tightly coupled through a shared utility function
          that no human had noticed. That connection never would have appeared in the wiki's
          manually-written wikilinks.
        </p>
      </div>

      <h3>3. Graph-Powered Cross-Referencing</h3>

      <p>
        When I open a wiki page now, a new section is auto-injected at the bottom — pulling hard,
        structured data from the graph rather than relying on the LLM's memory:
      </p>

      <div className="not-prose bg-gray-900 dark:bg-gray-950 rounded-xl p-6 my-4 font-mono text-xs overflow-x-auto">
        <pre className="text-gray-300 leading-relaxed">{`## Related (from Graphify)
- [[UserManager Class]] — \`EXTRACTED\` — imports_from
- [[Auth Best Practices]] — \`INFERRED\` (0.87) — semantically_similar_to
- Part of community: **Authentication Cluster** (Cluster #3)`}</pre>
      </div>

      <h3>4. Interactive Graph Explorer</h3>

      <p>
        A "Graph" tab in the web UI renders an interactive, force-directed network map of the entire
        knowledge base.
      </p>
      <ul>
        <li>Nodes are color-coded by community.</li>
        <li>Edges are colored by confidence (Green = Extracted, Yellow = Inferred).</li>
        <li>Click a node to jump to its wiki page.</li>
        <li>
          Type <em>"Show me the path from [Concept A] to [Concept B]"</em> to see the exact chain
          of connections.
        </li>
      </ul>

      <h2>System Architecture</h2>

      <p>
        Here is how data flows from a scattered piece of information into a connected knowledge node:
      </p>

      <div className="not-prose my-8">
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md bg-white dark:bg-gray-900">
          <img
            src={systemArchitectImg}
            alt="LLM Wiki + Graphify system architecture — showing the SPA web UI, FastAPI backend with Extractor → Graphify Pipeline → LLM Synthesis flow, graph.json knowledge graph, and the Wiki Markdown Vault with raw/, wiki/, and graphify-out/ directories"
            className="w-full"
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-3 italic">
          Three layers: the SPA web UI, the FastAPI engine (Extractor → Graphify → LLM Synthesis), and the Markdown vault.
        </p>
      </div>

      {/* Architecture layer boxes */}
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
        <strong>10s for queries, 30s for pathfinding, 300s for full rebuilds.</strong>
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
        complexity. It's not enterprise security — it's <em>appropriate</em> security.
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
        a cluster — a God Node bridging infrastructure notes and API design philosophy. I hadn't
        linked those manually. Graphify found the bridge through structural analysis alone.
      </p>

      <p>
        I typed: <em>"Show me the path from OAuth2 to PaymentGateway."</em> The graph traced it
        through a shared utility function that neither module's documentation mentioned. That
        connection existed structurally — in the code — but was invisible in text.
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

      <h2>Implementation Roadmap</h2>

      <p>
        Building this isn't a massive monolithic task — it breaks down into highly valuable phases:
      </p>

      <div className="not-prose overflow-x-auto my-8 border border-gray-200 dark:border-gray-700 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
              {['Phase', 'Goal', 'Effort', 'Key Deliverable'].map((h) => (
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
              ['1. Foundation', 'Wire Graphify into the backend worker', '2–3 hrs', 'Auto-generates graph.json and GRAPH_REPORT.md on every ingest'],
              ['2. Cross-Reference', 'Sync Graph data ↔ Wiki text', '3–4 hrs', 'Wiki pages dynamically show "Related from Graph" sections'],
              ['3. Visualization', 'Web UI Graph Tab', '4–6 hrs', 'Interactive vis.js network map in the browser'],
              ['4. Multimodal', 'Expand upload types', '3–4 hrs', 'Enable ingestion of code repos, images, and video/audio'],
              ['5. Agent Query', 'Hermes/Telegram integration', '2–3 hrs', 'Ask the Telegram bot "How does X connect to Y?" and it queries the graph'],
            ] as const).map(([phase, goal, effort, deliverable]) => (
              <tr key={phase} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">{phase}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{goal}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{effort}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{deliverable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>The Result</h2>

      <p>
        For the cost of a cheap Linux server ($5/month total, replacing multiple SaaS
        subscriptions), I have turned my fragmented digital life into a unified, searchable,
        visually connected brain.
      </p>

      <p>
        The LLM Wiki solves the problem of <em>understanding</em> scattered documents. Graphify
        solves the problem of <em>connecting</em> them. Together, they form a Personal Knowledge
        Management system that actually works.
      </p>

      <p>
        If your notes feel like a graveyard of forgotten ideas, the problem is not that you are bad
        at organizing. The problem is that your tools treat documents as{' '}
        <strong>files</strong> instead of <strong>nodes in a network</strong>. Build the network.
        The knowledge will find its own way home.
      </p>

      <div className="not-prose bg-gray-50 dark:bg-gray-800/60 border-l-4 border-emerald-400 dark:border-emerald-500 rounded-r-xl px-6 py-5 my-8">
        <p className="text-gray-800 dark:text-gray-100 italic text-lg font-light leading-relaxed">
          "Your notes deserve a nervous system, not a filing cabinet. And building one might just be
          a matter of sending the right message."
        </p>
        <p className="font-mono text-xs text-gray-400 dark:text-gray-500 mt-3">— The takeaway</p>
      </div>

      {/* Tag list */}
      <div className="not-prose flex flex-wrap gap-2 my-6">
        {['FastAPI', 'Vanilla JS', 'D3.js', 'Graphify', 'Kimi K2.5', 'OpenRouter', 'Caddy',
          'Self-Hosted', 'Hermes Agent', 'Telegram', 'Tree-sitter', 'Knowledge Graph'].map((tag) => (
          <span
            key={tag}
            className="font-mono text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </BlogPostLayout>
  );
}
