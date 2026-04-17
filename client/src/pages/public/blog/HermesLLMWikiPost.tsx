/**
 * Blog Post: Hermes LLM Wiki — Building a Self-Hosted AI Knowledge Base
 */

import { BlogPostLayout, type FaqItem } from '../../../components/blog/BlogPostLayout';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is Hermes LLM Wiki?',
    answer:
      'Hermes LLM Wiki is a self-hosted knowledge management system that automatically ingests web content, generates AI summaries, and creates semantic links between pages — all stored as plain Markdown files in a Git repository. It combines a Go web server, a SQLite job queue, and three specialized AI agents to turn any URL into a connected, searchable wiki entry.',
  },
  {
    question: 'What LLM providers does Hermes support?',
    answer:
      'Hermes currently supports Kimi (Moonshot AI) and OpenRouter, which acts as a unified gateway to dozens of models including GPT-4o, Claude, Gemini, and open-source alternatives. OpenRouter makes it easy to switch models or A/B test summarization quality without changing your application code.',
  },
  {
    question: 'Why store wiki content as Markdown files in Git?',
    answer:
      'Markdown + Git gives you everything a database cannot: full history and diffs of every page, branch-based experimentation, easy export to any static site generator, and no vendor lock-in. You can review exactly what the AI wrote, revert a bad summary, or merge contributions from multiple machines — using tools you already know.',
  },
  {
    question: 'How does the Link Agent connect pages?',
    answer:
      'After a page is ingested and summarized, the Link Agent reads its summary and queries the LLM API to identify related concepts already present in the wiki. It then writes wiki-style internal links into the Markdown — similar to how Obsidian or Roam Research create backlinks, but fully automated. The result is a knowledge graph that grows richer with every new page added.',
  },
  {
    question: 'Why use Caddy instead of Nginx?',
    answer:
      'Caddy automatically provisions and renews TLS certificates via Let\'s Encrypt with zero configuration. For a self-hosted wiki accessible over HTTPS, that eliminates an entire category of operational work. Caddy also has a clean, readable config format and first-class reverse proxy support, making it ideal for single-service deployments.',
  },
  {
    question: 'Can Hermes be used as a team knowledge base?',
    answer:
      'Yes. Because the wiki content is stored in Git, multi-user workflows are natural: team members can clone the repo, submit PRs to add pages, or push directly if they have access. Caddy\'s basic auth layer secures the web interface. For larger teams, replacing basic auth with an SSO provider is straightforward since Caddy supports forward auth middleware.',
  },
];

export default function HermesLLMWikiPost() {
  return (
    <BlogPostLayout
      title="Hermes LLM Wiki: Building a Self-Hosted AI Knowledge Base"
      author="Jaehee Song"
      date="2026-04-16"
      readTime="10 min read"
      category="AI & Development"
      excerpt="A deep dive into Hermes — a self-hosted wiki where three specialized AI agents (Ingest, Summarize, Link) automatically transform any URL into connected, searchable Markdown pages stored in Git."
      slug="hermes-llm-wiki"
      coverImage="HW"
      coverGradient="from-slate-700 via-cyan-700 to-teal-600"
      faqItems={FAQ_ITEMS}
    >
      <p>
        Every developer I know has the same problem: knowledge is everywhere and connected nowhere.
        Browser bookmarks you'll never revisit. Notion pages that go stale. Slack threads that
        disappear into the archive. The research you did six months ago that you have to redo because
        you can't find it.
      </p>

      <p>
        I wanted a wiki that would do the filing for me — one where I could paste a URL and get back
        a summarized, linked page that slots into everything else I've read. So I built Hermes.
      </p>

      <p>
        Hermes is a self-hosted knowledge base backed by three specialized AI agents. It ingests
        URLs, summarizes their content with an LLM, and automatically links new pages to related
        entries already in the wiki. Everything is stored as plain Markdown files in a Git
        repository. No proprietary database. No SaaS subscriptions. Full ownership.
      </p>

      <h2>The Architecture</h2>

      <p>
        The system is built around a simple traffic flow: your browser hits a{' '}
        <strong>Caddy</strong> reverse proxy (HTTPS + basic auth), which forwards requests to the{' '}
        <strong>Hermes Web Server</strong> — a Go application that handles both the web UI and a
        SQLite-backed job queue. When you submit a URL, it becomes a job. Three agents drain the
        queue.
      </p>

      <div className="not-prose my-8">
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
          <img
            src="/hermes-llm-wiki.jpg"
            alt="Hermes LLM Wiki Architecture — showing traffic flow from user through Caddy and the Hermes Web Server to three agents: Ingest, Summarize, and Link"
            className="w-full"
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-3 italic">
          Hermes LLM Wiki Architecture: three specialized agents drain a SQLite job queue, writing to a Git-backed Markdown store and calling LLM APIs.
        </p>
      </div>

      <p>
        The three agents — Ingest, Summarize, and Link — each have a single responsibility. They
        communicate only through the job queue and the shared file system. This loose coupling means
        any agent can fail, retry, or be upgraded independently without bringing down the others.
      </p>

      <h2>The Three Agents</h2>

      <h3>Ingest Agent: URL → Markdown</h3>

      <p>
        The Ingest Agent picks up a job containing a URL, fetches the page, strips navigation and
        boilerplate, and writes a clean <code>.md</code> file into the <code>wiki/</code> folder.
        The output is a raw but readable Markdown representation of the source — headings preserved,
        code blocks intact, images stripped to alt text.
      </p>

      <div className="not-prose bg-gray-900 dark:bg-gray-950 rounded-xl p-6 my-6 font-mono text-sm overflow-x-auto">
        <div className="text-gray-400 mb-3 text-xs uppercase tracking-wide">Job lifecycle</div>
        <div className="space-y-1">
          <div><span className="text-cyan-400">Queue</span><span className="text-gray-400"> → </span><span className="text-yellow-300">Ingest Agent</span></div>
          <div className="pl-4 text-gray-400">fetch URL → strip HTML → extract content</div>
          <div className="pl-4 text-gray-400">write <span className="text-green-400">wiki/slug.md</span></div>
          <div className="pl-4 text-gray-400">git commit "ingest: {'{'}slug{'}'}"</div>
          <div className="pl-4 text-gray-400">enqueue → <span className="text-purple-400">Summarize Agent</span></div>
        </div>
      </div>

      <p>
        Once the <code>.md</code> file is written and committed to Git, the Ingest Agent enqueues a
        new job for the Summarize Agent. The Git commit happens immediately so the raw content is
        preserved even if summarization fails — you never lose the ingested page.
      </p>

      <h3>Summarize Agent: Content → Summary</h3>

      <p>
        The Summarize Agent reads the raw Markdown file written by the Ingest Agent and calls the
        LLM API (Kimi or OpenRouter) with a prompt asking for a structured summary: key concepts,
        one-paragraph TL;DR, and a list of extracted entities (people, tools, technologies, dates).
      </p>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
        <div className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
          <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Input</div>
          <div className="font-mono text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <div>wiki/slug.md</div>
            <div className="text-gray-400 text-xs">Raw Markdown from Ingest</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
          <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Output</div>
          <div className="font-mono text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <div>wiki/slug.md (updated)</div>
            <div className="text-gray-400 text-xs">+ YAML frontmatter with summary,</div>
            <div className="text-gray-400 text-xs">  tags, entities, TL;DR</div>
          </div>
        </div>
      </div>

      <p>
        The summary is written back into the same <code>.md</code> file as YAML frontmatter — a
        deliberate choice. The frontmatter schema is stable and machine-readable, so the Link Agent
        can query it without another LLM call. It also renders cleanly in any Markdown viewer that
        supports frontmatter (Obsidian, VS Code, Jekyll, Hugo).
      </p>

      <h3>Link Agent: Connect Pages</h3>

      <p>
        The Link Agent is where Hermes starts to feel like a real knowledge graph rather than a
        folder of documents. It reads the newly summarized page's entities and tags, queries the LLM
        with the list of existing wiki titles and their summaries, and asks: "Which of these pages
        are semantically related to this one?"
      </p>

      <p>
        The LLM returns a ranked list of related pages. The Link Agent appends a{' '}
        <strong>Related Pages</strong> section to the Markdown with wiki-style internal links. Over
        time, as the wiki grows, every new page automatically weaves itself into the existing web of
        knowledge.
      </p>

      <div className="not-prose bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6 my-6">
        <div className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide mb-3">
          Why an LLM for linking instead of embeddings?
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Embedding-based similarity finds lexically close pages. An LLM finds conceptually related
          pages — the difference between matching "transformer architecture" to another page about
          transformers vs. recognizing that a page about attention mechanisms is the prerequisite
          reading. For a personal knowledge base where the index fits in a prompt, the LLM approach
          produces dramatically better links.
        </p>
      </div>

      <h2>The Tech Stack</h2>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
        {[
          {
            name: 'Go',
            role: 'Web Server + Agents',
            why: 'Low memory footprint, easy deployment as a single binary, excellent stdlib for HTTP and concurrency',
            color: 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800',
            badge: 'bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200',
          },
          {
            name: 'Caddy',
            role: 'Reverse Proxy + TLS',
            why: 'Automatic HTTPS via Let\'s Encrypt, basic auth built-in, zero-config TLS renewal',
            color: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800',
            badge: 'bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-200',
          },
          {
            name: 'SQLite',
            role: 'Job Queue',
            why: 'No separate database server, durable on disk, sufficient throughput for a personal wiki',
            color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
            badge: 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200',
          },
          {
            name: 'Git',
            role: 'Wiki Storage',
            why: 'Full history, diffs per page, branching for experiments, easy export, zero vendor lock-in',
            color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
            badge: 'bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-200',
          },
          {
            name: 'Kimi / OpenRouter',
            role: 'LLM APIs',
            why: 'Kimi for cost-efficient summarization; OpenRouter for model flexibility without per-provider SDKs',
            color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
            badge: 'bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200',
          },
          {
            name: 'Markdown',
            role: 'Storage Format',
            why: 'Human-readable, diffable, portable, renders in VS Code/Obsidian/any static site generator',
            color: 'bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700',
            badge: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200',
          },
        ].map((item) => (
          <div key={item.name} className={`${item.color} border rounded-xl p-5`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.badge}`}>
                {item.name}
              </span>
            </div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">{item.role}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{item.why}</p>
          </div>
        ))}
      </div>

      <h2>Why Git as the Storage Layer?</h2>

      <p>
        This is the decision I'm most happy with. Storing the wiki in a Git repository gives you
        capabilities that no purpose-built wiki database can match:
      </p>

      <ul>
        <li>
          <strong>Full audit trail</strong> — every page edit, every AI-generated summary, every
          link the agent added is a commit. You can see exactly what changed and when.
        </li>
        <li>
          <strong>Diffable AI output</strong> — when the Summarize Agent rewrites a summary with a
          better model, the Git diff shows precisely what changed. You can revert any AI edit with a
          single command.
        </li>
        <li>
          <strong>Portable export</strong> — your entire knowledge base is a folder of Markdown
          files. Clone it, zip it, publish it as a static site (Hugo, Docusaurus, Jekyll). No export
          button needed.
        </li>
        <li>
          <strong>Multi-machine sync</strong> — push to GitHub or a self-hosted Gitea instance. The
          wiki follows you across machines like any other repo.
        </li>
      </ul>

      <h2>LLM Provider Strategy</h2>

      <p>
        Hermes uses two LLM providers, each for a different reason.
      </p>

      <p>
        <strong>Kimi (Moonshot AI)</strong> is the default for summarization. Its long-context
        window handles dense technical articles without chunking, and its cost per token is
        competitive for high-volume ingestion workflows where you're summarizing dozens of pages per
        session.
      </p>

      <p>
        <strong>OpenRouter</strong> is the escape hatch. When you want to experiment — try
        Claude for nuanced summaries, use a local Ollama model for offline mode, or route sensitive
        content to a private deployment — OpenRouter handles the API unification. One endpoint, one
        API key, access to every major model.
      </p>

      <div className="not-prose bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 my-6">
        <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-3">
          Cost in practice
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Summarizing a 3,000-word article with Kimi costs approximately $0.002–0.005. Running the
          Link Agent over a wiki with 200 pages costs roughly $0.01–0.02 per new page added. For a
          personal knowledge base growing at 10–20 pages per day, monthly LLM costs stay well under
          $5.
        </p>
      </div>

      <h2>The Job Queue: Why SQLite?</h2>

      <p>
        A common instinct for a job queue is to reach for Redis, RabbitMQ, or a cloud queue service.
        For Hermes, SQLite is the right answer and it's worth explaining why.
      </p>

      <p>
        The wiki is a single-user, self-hosted application. At peak load, you're queuing a few dozen
        ingestion jobs. SQLite handles millions of writes per second on modern hardware — orders of
        magnitude more than needed. More importantly, SQLite means zero additional infrastructure:
        no Redis process to manage, no message broker to secure, no cloud service to depend on. The
        entire queue state lives in a single file that backs up with everything else.
      </p>

      <p>
        The queue schema is trivially simple: job ID, type (ingest/summarize/link), payload (URL or
        file path), status (pending/running/done/failed), retry count, and timestamps. The Go
        scheduler polls for pending jobs, claims them with an atomic status update, and dispatches
        to the appropriate agent goroutine.
      </p>

      <h2>Deployment</h2>

      <p>
        The recommended deployment is a single VPS (a $6/month Hetzner instance is more than
        sufficient) running Docker Compose with three containers: Caddy, the Hermes server (which
        embeds the agents as goroutines), and a volume mount for the wiki Git repo.
      </p>

      <div className="not-prose bg-gray-900 dark:bg-gray-950 rounded-xl p-6 my-6 font-mono text-sm overflow-x-auto">
        <div className="text-gray-400 mb-3 text-xs uppercase tracking-wide">docker-compose.yml (simplified)</div>
        <pre className="text-gray-100 text-xs leading-relaxed">{`services:
  caddy:
    image: caddy:alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data

  hermes:
    build: .
    environment:
      - LLM_PROVIDER=kimi
      - LLM_API_KEY=\${KIMI_API_KEY}
      - WIKI_DIR=/wiki
    volumes:
      - wiki_repo:/wiki

volumes:
  caddy_data:
  wiki_repo:`}</pre>
      </div>

      <p>
        The Caddyfile is five lines: domain, reverse proxy to hermes:8080, and basic auth. TLS is
        handled automatically. Total setup time from a fresh VPS to a running wiki is under 20
        minutes.
      </p>

      <h2>Use Cases</h2>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
        {[
          {
            title: 'Personal Research Archive',
            desc: 'Feed it every paper, article, and documentation page you read. Build a knowledge base that remembers everything and connects the dots across topics.',
            icon: '📚',
          },
          {
            title: 'Team Runbook Wiki',
            desc: 'Ingest internal docs, postmortems, and architecture ADRs. The Link Agent surfaces related runbooks automatically when writing new incident documentation.',
            icon: '⚙️',
          },
          {
            title: 'Competitive Intelligence',
            desc: 'Pipe competitor blog posts, release notes, and job listings through the Ingest Agent. The Summarize Agent extracts key signals; the Link Agent tracks narrative arcs over time.',
            icon: '🔍',
          },
          {
            title: 'Learning Journal',
            desc: 'Save tutorials, course notes, and Stack Overflow answers. Hermes creates a connected study guide from your browser history — the textbook you actually read.',
            icon: '🎓',
          },
        ].map((item) => (
          <div key={item.title} className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <div className="text-2xl mb-3">{item.icon}</div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">{item.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>

      <h2>What's Next</h2>

      <p>
        The current architecture handles the core ingestion loop well. The planned improvements fall
        into three categories:
      </p>

      <ul>
        <li>
          <strong>Semantic search</strong> — adding a local embedding index (sqlite-vec or pgvector
          on a small Postgres instance) so you can search the wiki by meaning rather than keywords.
        </li>
        <li>
          <strong>Browser extension</strong> — a one-click "send to Hermes" button that submits the
          current tab URL to the ingestion queue without opening the web UI.
        </li>
        <li>
          <strong>Scheduled re-ingestion</strong> — flagging pages for periodic re-ingestion when
          their source URLs publish updates, keeping the wiki fresh rather than a static archive.
        </li>
      </ul>

      <p>
        The design constraint I've held to throughout: every feature must keep the wiki as a folder
        of Markdown files in Git. The moment the system requires a proprietary database to function,
        you've traded ownership for convenience. Hermes is a tool that works for you, not one you're
        locked into.
      </p>
    </BlogPostLayout>
  );
}
