/**
 * Blog Post: How I Built a Web-Based LLM Wiki with Hermes Agent
 */

import { Link } from 'react-router-dom';
import { BlogPostLayout, type FaqItem } from '../../../components/blog/BlogPostLayout';

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is an LLM Wiki?',
    answer:
      'An LLM Wiki, as described by Andrej Karpathy, is a persistent, interlinked knowledge base maintained by an AI agent. Unlike standard RAG tools that re-derive answers from scratch each session, the wiki compiles knowledge into structured pages. When you add a new source, the agent updates existing pages, adds cross-references, and flags contradictions — so your knowledge compounds over time rather than resetting.',
  },
  {
    question: 'What is Hermes Agent?',
    answer:
      'Hermes Agent is an open-source AI agent framework built by Nous Research. It includes a built-in learning system where the agent creates and refines skill files over time, a persistent memory layer across sessions, support for scheduled tasks, and a messaging gateway so you can interact with it through Telegram rather than keeping a terminal session open.',
  },
  {
    question: 'Why not just use Obsidian Sync?',
    answer:
      "Obsidian Sync costs $8–10/month. For a personal project where I'm already paying for a VPS, adding another subscription just for cross-device access felt redundant — especially when I can build a proper web app accessible from any browser without installing anything. The self-hosted approach gives full control and costs less.",
  },
  {
    question: 'How is this different from NotebookLM or ChatGPT file uploads?',
    answer:
      'Standard RAG tools (NotebookLM, ChatGPT uploads) work fine for one-off questions, but they re-derive answers from scratch every session — nothing accumulates. The wiki model compiles knowledge into pages. Ask the same kind of question twice: the second time, the answer comes from a pre-synthesized page that may already incorporate five related sources. The system gets more useful the more you put into it.',
  },
  {
    question: 'What does this cost to run?',
    answer:
      'The Hetzner CX22 VPS (2 vCPUs, 4 GB RAM) runs €4–6/month. LLM API costs depend on usage — processing one article with Claude costs a few cents. For typical personal use (a dozen articles per week), total monthly cost stays well under $15 including the server.',
  },
  {
    question: 'Which LLM does the agent use?',
    answer:
      'Hermes supports over 200 models through OpenRouter, Nous Portal, OpenAI, and other providers. The author uses Claude for its structured writing and cross-referencing quality. You can switch models in the config — OpenRouter makes it easy to try different ones without changing your code.',
  },
];

export default function LLMWikiHermesAgentPost() {
  return (
    <BlogPostLayout
      title="How I Built a Web-Based LLM Wiki with Hermes Agent (And Why I Skipped Obsidian)"
      author="Jaehee Song"
      date="2026-04-16"
      readTime="9 min read"
      category="AI & Development"
      excerpt="Andrej Karpathy proposed a better way to use AI — a persistent wiki that compounds your knowledge instead of resetting each session. Here's how I built it as a web app on a $6/month VPS, without Obsidian or a sync subscription."
      slug="llm-wiki-hermes-agent"
      coverImage="LW"
      coverGradient="from-violet-700 via-purple-600 to-indigo-600"
      faqItems={FAQ_ITEMS}
    >
      <h2>The Problem with How Most People Use AI</h2>

      <p>Here's something that bothers me about the typical AI workflow.</p>

      <p>
        You ask ChatGPT or Claude a great question. It gives you a brilliant answer. You paste a few
        things into your notes app, or maybe you don't — you figure you'll remember it. The next
        week, you're back asking a very similar question. The AI has no memory of what you
        discussed. You're starting from zero again.
      </p>

      <p>
        This is what Andrej Karpathy, one of the most respected AI researchers in the world,
        recently called out in a now-viral GitHub Gist. His observation is sharp: most people treat
        AI like a search engine — ask, get answer, repeat. Nothing compounds. Nothing builds up.
      </p>

      <p>
        He proposed a different model. Instead of re-deriving answers every time, your AI agent
        should maintain a <strong>persistent wiki</strong> — a living, interlinked knowledge base
        that grows richer every time you add something new. When you feed it a new article, paper,
        or idea, the agent doesn't just retrieve it later. It reads it now, integrates it with what
        it already knows, updates related pages, and flags any contradictions.
      </p>

      <p>The wiki gets smarter. Your knowledge compounds.</p>

      <p>I read that gist and immediately wanted to build it.</p>

      <div className="not-prose my-6">
        <p className="m-0 text-sm sm:text-base text-gray-600 dark:text-gray-400 py-3 px-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-600/60">
          Building products too? Use Clearly to draft a structured{' '}
          <Link to="/prd-generator" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
            AI PRD
          </Link>{' '}
          or{' '}
          <Link to="/brd-generator" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
            AI BRD
          </Link>{' '}
          from guided prompts—separate from the wiki pattern above.
        </p>
      </div>

      <h2>Why I Didn't Use Obsidian</h2>

      <p>
        Karpathy's original setup uses Obsidian — a local markdown editor with a beautiful graph
        view. The pattern is: LLM on one side, Obsidian on the other, the LLM writes files, you
        browse them in real time.
      </p>

      <p>
        It's elegant. The problem for me? Obsidian's sync feature costs $8–10/month. That's the
        piece that makes it available across all your devices. Without sync, your wiki lives on one
        machine. When I'm working from different machines or want to check something from my phone,
        I'm stuck.
      </p>

      <p>
        I didn't want to pay a subscription for sync when I was already paying for a VPS. And
        honestly, I wanted the wiki to be a proper web app — something any browser can reach, from
        anywhere, with no app to install.
      </p>

      <p>
        So I went a different route: I built the LLM Wiki as a web-based site, running on my own
        server, accessible at a custom domain.
      </p>

      <p>Here's exactly how I did it.</p>

      <h2>My Stack at a Glance</h2>

      <div className="not-prose bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-6 my-6">
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          {[
            ['Server', 'Hetzner Cloud VPS — 2 vCPUs, 4 GB RAM (~€4–6/month)'],
            ['Agent', 'Hermes Agent by Nous Research'],
            ['Interface', 'Telegram (to talk to the agent)'],
            ['Wiki front-end', 'Web app with a custom domain'],
            ['Live URL', 'wiki.ai-biz.app'],
          ].map(([label, value]) => (
            <li key={label} className="flex gap-3">
              <span className="font-semibold text-gray-900 dark:text-white w-32 shrink-0">{label}</span>
              <span>{value}</span>
            </li>
          ))}
        </ul>
      </div>

      <p>Let me walk through each step.</p>

      <h2>Step 1: Provision a Linux Server on Hetzner</h2>

      <p>
        The first decision is where to host this. I chose Hetzner Cloud for two reasons: it's
        affordable and it's reliable. The CX22 plan (2 vCPUs, 4 GB RAM) is more than enough for a
        personal AI agent and a web server running side by side.
      </p>

      <p>
        I provisioned a fresh Ubuntu 24.04 instance. The setup took about five minutes — create an
        account, pick a datacenter (I chose the US-East region), generate an SSH key, and you're
        in.
      </p>

      <p>
        Once connected via SSH, I ran the standard first-time setup: update packages, create a
        non-root user, set up a firewall to allow SSH, HTTP, and HTTPS traffic. Nothing exotic
        here. Any standard Linux VPS setup guide will cover this.
      </p>

      <p>
        The key thing is that you want <strong>a server that's always on</strong>. Your wiki agent
        needs to be reachable at any time — not just when your laptop is open.
      </p>

      <h2>Step 2: Install Hermes Agent</h2>

      <p>
        Hermes Agent is an open-source AI agent framework built by Nous Research. Their tagline is
        "the agent that grows with you" — and that's exactly what drew me to it. It has a built-in
        learning system where the agent creates and refines skill files over time, a persistent
        memory layer across sessions, and support for running scheduled tasks.
      </p>

      <p>
        Installation is straightforward. Hermes uses Python and <code>uv</code> for package
        management:
      </p>

      <div className="not-prose bg-gray-900 dark:bg-gray-950 rounded-xl p-6 my-4 font-mono text-sm overflow-x-auto">
        <pre className="text-gray-100 text-xs leading-relaxed">{`# Install uv (fast Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Clone the repo
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent

# Set up the environment
uv venv venv --python 3.11
source venv/bin/activate
uv pip install -e ".[all]"

# Run setup wizard
hermes setup`}</pre>
      </div>

      <p>
        The setup wizard walks you through choosing your LLM provider. Hermes supports over 200
        models through OpenRouter, Nous Portal, OpenAI, and others. I configured it to use Claude
        via the API — I already had a key, and Claude is excellent at the kind of structured writing
        and cross-referencing that a wiki maintenance task requires.
      </p>

      <h2>Step 3: Configure Telegram</h2>

      <p>
        One of Hermes's best features is its messaging gateway. Instead of keeping a terminal
        session open on your server, you talk to the agent through a messaging app. I chose
        Telegram.
      </p>

      <p>Setting this up involves two things:</p>

      <p>
        First, create a Telegram bot. You do this by messaging <code>@BotFather</code> in Telegram.
        Give the bot a name, get the API token, and that's it. Takes two minutes.
      </p>

      <p>Second, add the Telegram token to Hermes's configuration:</p>

      <div className="not-prose bg-gray-900 dark:bg-gray-950 rounded-xl p-6 my-4 font-mono text-sm overflow-x-auto">
        <pre className="text-gray-100 text-xs leading-relaxed">{`hermes config set telegram.token YOUR_BOT_TOKEN
hermes config set telegram.allowed_users YOUR_TELEGRAM_USER_ID`}</pre>
      </div>

      <p>Then start the gateway:</p>

      <div className="not-prose bg-gray-900 dark:bg-gray-950 rounded-xl p-6 my-4 font-mono text-sm overflow-x-auto">
        <pre className="text-gray-100 text-xs leading-relaxed">{`hermes gateway`}</pre>
      </div>

      <p>
        From this point, you can open Telegram on your phone, message your bot, and you're talking
        to a live AI agent running on your VPS. The agent can read and write files on the server,
        run terminal commands, and now — maintain your wiki.
      </p>

      <p>
        To keep the gateway running after you close your SSH session, run it as a systemd service
        or inside a <code>tmux</code> session. I use tmux for simplicity.
      </p>

      <h2>Step 4: Set Up a Telegram Profile for LLM Wiki</h2>

      <p>
        Hermes supports multiple "profiles" — different personas and instruction sets for different
        tasks. This is powerful because you can have one agent that behaves differently depending on
        what you need it to do.
      </p>

      <p>
        I created a dedicated LLM Wiki profile. A profile is essentially a system prompt that tells
        the agent its role, what it owns, and how it should behave. Mine looks something like this:
      </p>

      <div className="not-prose bg-gray-900 dark:bg-gray-950 rounded-xl p-6 my-4 font-mono text-sm overflow-x-auto">
        <pre className="text-gray-100 text-xs leading-relaxed">{`You are my LLM Wiki agent. Your job is to maintain a persistent,
interlinked knowledge base stored as structured web pages on this server.

When I give you a new source (article, notes, URL, document), you:
1. Read and understand the key ideas
2. Create or update a wiki page for the main topic
3. Update the index page
4. Add cross-references to related pages
5. Note any contradictions with existing pages
6. Append an entry to the log

The wiki lives at /home/claude/wiki/ and is served at wiki.ai-biz.app.
Always keep pages clean, well-linked, and readable by a human.`}</pre>
      </div>

      <p>
        You activate a profile before starting a session with the agent. This makes the agent
        context-aware and focused on the right job.
      </p>

      <h2>Step 5: Instruct the Agent to Build the Web Wiki</h2>

      <p>
        This is where it gets interesting. With the profile active, I gave the agent a clear
        instruction:
      </p>

      <div className="not-prose bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-400 dark:border-indigo-500 rounded-r-xl px-6 py-4 my-6">
        <p className="text-gray-800 dark:text-gray-200 italic text-sm">
          "Read the Karpathy LLM Wiki pattern at this GitHub Gist and build me a web-based wiki.
          The wiki should have an index page, support for entity pages and concept pages, an update
          log, and be browsable in any web browser. Use the existing server setup and set it up so
          it's accessible on the internet."
        </p>
      </div>

      <p>
        The agent read the Karpathy gist, understood the architecture (raw sources → wiki layer →
        schema), and then got to work. It:
      </p>

      <ul>
        <li>Created a directory structure for the wiki pages</li>
        <li>Built a simple static site generator so markdown pages render as HTML</li>
        <li>Set up a lightweight web server (Nginx) to serve the pages</li>
        <li>
          Created the initial <code>index.md</code>, <code>log.md</code>, and a few starter pages
        </li>
        <li>Wrote a schema file documenting the wiki's conventions</li>
      </ul>

      <p>
        I guided it along the way — reviewing what it built, pointing out what to adjust, suggesting
        which pages to create first. The agent did the mechanical work; I did the thinking about
        structure and content.
      </p>

      <p>
        This is the key distinction Karpathy makes in his gist: the human curates and directs, the
        LLM does the bookkeeping. That division held true throughout.
      </p>

      <h2>Step 6: Set Up DNS to Point to a Custom Domain</h2>

      <p>
        The last step was making the wiki accessible at a real URL instead of a raw IP address.
      </p>

      <p>
        I already owned the domain <code>ai-biz.app</code> and had a few services running on
        subdomains. Adding the wiki was just a DNS record:
      </p>

      <ol>
        <li>Go to your domain registrar's DNS settings</li>
        <li>
          Add an <code>A</code> record: <code>wiki.ai-biz.app</code> → your server's IP address
        </li>
        <li>Wait for DNS propagation (usually 5–30 minutes)</li>
      </ol>

      <p>
        Then on the server side, configure Nginx to serve the wiki for that domain and get a free
        SSL certificate from Let's Encrypt:
      </p>

      <div className="not-prose bg-gray-900 dark:bg-gray-950 rounded-xl p-6 my-4 font-mono text-sm overflow-x-auto">
        <pre className="text-gray-100 text-xs leading-relaxed">{`# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d wiki.ai-biz.app`}</pre>
      </div>

      <p>
        After that, <code>https://wiki.ai-biz.app</code> loads your wiki in any browser. No app.
        No subscription. No Obsidian sync.
      </p>

      <h2>How I Use It Day to Day</h2>

      <p>The actual workflow is simple.</p>

      <p>
        When I read something interesting — an article about AI agent design, a paper on SEO
        strategy, notes from a client call — I open Telegram, message my wiki bot, and paste the
        content or URL. The agent processes it and updates the wiki. I can immediately go to{' '}
        <code>wiki.ai-biz.app</code> in my browser and see the new page, check what other pages it
        linked to, and browse from there.
      </p>

      <p>
        When I need to recall something, I either search the wiki directly in the browser or ask the
        agent: "What do we have on Hermes Agent's memory system?" It reads the index, finds the
        relevant pages, and gives me a synthesized answer from what's already been compiled.
      </p>

      <p>The three core operations from Karpathy's design all work:</p>

      <p>
        <strong>Ingest</strong> — drop in a new source, agent updates the wiki. A single source
        might touch 5–10 pages.
      </p>

      <p>
        <strong>Query</strong> — ask a question, agent answers from the compiled wiki, not from
        scratch.
      </p>

      <p>
        <strong>Lint</strong> — periodically ask the agent to check for orphan pages, stale claims,
        or missing cross-references. This keeps the wiki clean as it grows.
      </p>

      <h2>Why This Beats Standard RAG for Personal Use</h2>

      <p>
        Standard RAG (Retrieval-Augmented Generation) — the kind used by NotebookLM, ChatGPT file
        uploads, and most document Q&amp;A tools — works fine for one-off questions. But it has a
        fundamental limitation: it re-derives the answer every single time.
      </p>

      <p>
        There's no accumulation. If you've asked a similar question six times before, the system
        doesn't get any better at answering it. It starts fresh every session.
      </p>

      <p>
        The wiki model is different. Once an idea is compiled into a page, that synthesis is
        available instantly on the next query. If you add a new source that relates to something
        already in the wiki, the agent updates the existing page rather than creating a disconnected
        document. Contradictions get flagged before they accumulate.
      </p>

      <p>The knowledge compounds. That's the whole point.</p>

      <h2>What's Next</h2>

      <p>The wiki is running well, but there are a few things I want to improve:</p>

      <ul>
        <li>
          <strong>Search</strong>: Right now I browse by navigation and ask the agent to find
          things. Adding a proper full-text search bar to the front-end would make the wiki much
          more useful as it grows.
        </li>
        <li>
          <strong>Automatic ingestion</strong>: I'd like to set up a scheduled task where the agent
          monitors a designated folder and ingests new files automatically — no manual prompting
          needed.
        </li>
        <li>
          <strong>Weekly summaries</strong>: Hermes supports cron-style scheduling. I plan to set
          up a weekly summary that reviews what was added to the wiki and delivers highlights via
          Telegram.
        </li>
      </ul>

      <h2>The Bigger Picture</h2>

      <p>
        Karpathy's insight is right: the expensive part of building a knowledge base has never been
        the reading. It's the bookkeeping — updating cross-references, keeping summaries current,
        flagging when new information contradicts old claims. That's the part that makes humans
        abandon wikis.
      </p>

      <p>
        An LLM agent doesn't get bored. It doesn't forget to update a cross-reference. It can touch
        15 files in one pass and do it consistently every time.
      </p>

      <p>
        My version of this doesn't need Obsidian. It doesn't need a desktop app at all. It just
        needs a browser.
      </p>

      <p>
        If you want to see what this looks like in practice, the wiki is live at{' '}
        <a href="https://wiki.ai-biz.app" target="_blank" rel="noopener noreferrer">
          wiki.ai-biz.app
        </a>
        . And for the full walkthrough on building AI tools like this without a software engineering
        background, check out the <em>AI Developer Guide</em> at{' '}
        <a href="https://ai-dev.clearlyreqs.com" target="_blank" rel="noopener noreferrer">
          ai-dev.clearlyreqs.com
        </a>
        .
      </p>
    </BlogPostLayout>
  );
}
