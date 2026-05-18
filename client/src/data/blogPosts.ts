/**
 * Blog Post Registry — single source of truth
 *
 * Every published blog post is listed here exactly once. This array drives:
 *   - the blog index listing (BlogPage.tsx)
 *   - the SSR route tree (public-routes.tsx)
 *   - the build-time prerender list (scripts/prerender.mjs, via entry-server)
 *   - the generated sitemap.xml (scripts/generate-sitemap.mjs, via entry-server)
 *
 * Add a new post here (and wire its component in public-routes.tsx) and it
 * automatically appears in the listing, gets prerendered, and lands in the
 * sitemap. Keep newest-first ordering.
 */

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  /** ISO date (YYYY-MM-DD) the post was published */
  date: string;
  /** ISO date the post was last substantively updated, if different */
  dateModified?: string;
  readTime: string;
  category: string;
}

export const blogPosts: BlogPostMeta[] = [
  {
    slug: 'vibe-coded-app-why-it-breaks',
    title: "Your Vibe-Coded App Works. Here's Why It's About to Break.",
    excerpt:
      'Vibe coding ships fast—but it grows shared understanding slower than it grows code. The wall is predictable: security, scalability, CI/CD, and manageability break once real users arrive.',
    author: 'Jaehee Song',
    date: '2026-05-08',
    readTime: '14 min read',
    category: 'AI & Development',
  },
  {
    slug: 'the-one-file-every-ai-developer-needs',
    title: 'The One File Every AI Developer Needs (And Almost Nobody Has)',
    excerpt:
      'Project-level agent instruction files (CLAUDE.md, Cursor rules, AGENTS.md) turn cold-start sessions into consistent teammates. What to put in them—and the 15-minute challenge to write yours.',
    author: 'Jaehee Song',
    date: '2026-05-08',
    readTime: '22 min read',
    category: 'AI & Development',
  },
  {
    slug: 'stop-losing-architectural-decisions',
    title: 'Stop Losing Your Architectural Decisions to Your AI Agent',
    excerpt:
      'ADRs are the receipts that keep agents from “correcting” deliberate choices back to defaults. How to write ADRs that prevent silent refactors—and when reversal cost matters most.',
    author: 'Jaehee Song',
    date: '2026-05-08',
    readTime: '16 min read',
    category: 'AI & Development',
  },
  {
    slug: 'two-docs-before-2am-crisis',
    title: 'The Two Docs That Stand Between Your App and a 2am Crisis',
    excerpt:
      'A one-page threat model and a practical deployment runbook move security and ops from “after the incident” to “in the build.” Examples and prompts you can reuse.',
    author: 'Jaehee Song',
    date: '2026-05-08',
    readTime: '20 min read',
    category: 'AI & Development',
  },
  {
    slug: 'retrofit-engineering-discipline-in-a-day',
    title: "You Already Have the Codebase. Here's How to Retrofit Engineering Discipline in a Day.",
    excerpt:
      'In the middle of a vibe-coded build? Use agents to document the reality: generate a CLAUDE.md, stub ADRs, find inconsistencies, and ship guardrails without pausing feature work.',
    author: 'Jaehee Song',
    date: '2026-05-08',
    readTime: '22 min read',
    category: 'AI & Development',
  },
  {
    slug: 'engineer-caregiver-identity-collapse',
    title: 'The Engineer Who Got Hired to Wipe Bodies: A Field Report on Identity Collapse',
    excerpt:
      "A laid-off engineer takes a near-minimum-wage caregiving job — and discovers what hiring filters can’t measure: patience, ethical work that doesn’t scale, and the ability to sit with ambiguity when identity collapses.",
    author: 'Jaehee Song',
    date: '2026-05-05',
    readTime: '9 min read',
    category: 'Featured',
  },
  {
    slug: 'skills-vs-agents',
    title: 'Agents vs Skills: The Full Picture',
    excerpt:
      'The “stop building agents” line is about duplicate scaffolding, not deleting your runtime. Skills, progressive disclosure, and MCP in one readable layout — same story as the Medium post, with the old-vs-new diagram.',
    author: 'Jaehee Song',
    date: '2026-04-23',
    readTime: '12 min read',
    category: 'AI & Development',
  },
  {
    slug: 'hermes-agent-cost-saving',
    title: 'The $30 Bill That Should Have Been $7: Cost-Saving Moves for a Real AI Agent',
    excerpt:
      "A forensic audit of 936 OpenRouter calls over 20 days. Where the money leaked, how to plug it, and what your production AI agent is probably doing wrong too — three config-only moves that cut the bill by 78%.",
    author: 'Jaehee Song',
    date: '2026-04-22',
    readTime: '15 min read',
    category: 'AI & Development',
  },
  {
    slug: 'anthropic-vs-openrouter-opus',
    title: 'Anthropic API or OpenRouter for Claude Opus: An Honest Trade-off',
    excerpt:
      "Both paths reach the same model — the token prices line up to the penny. So why did one afternoon on Opus cost me $19.81? A deep dive into caching, Batch API, Fast Mode, and where the real money actually hides.",
    author: 'Jaehee Song',
    date: '2026-04-22',
    readTime: '13 min read',
    category: 'AI & Development',
  },
  {
    slug: 'graphify-wiki-build',
    title: 'From Scattered Notes to a Living Knowledge Graph: Building LLM Wiki + Graphify',
    excerpt:
      'My digital life was fragmented across Google Drive, OneNote, Apple Notes, Slack, and Brunch. I built a self-hosted wiki where an AI agent ingests anything and Graphify maps the connections — $5/month, zero lines of human code.',
    author: 'Jaehee Song',
    date: '2026-04-21',
    readTime: '10 min read',
    category: 'AI & Development',
  },
  {
    slug: 'llm-wiki-hermes-agent',
    title: 'How I Built a Web-Based LLM Wiki with Hermes Agent (And Why I Skipped Obsidian)',
    excerpt:
      "Andrej Karpathy proposed a better way to use AI — a persistent wiki that compounds your knowledge instead of resetting each session. Here's how I built it as a web app on a $6/month VPS, without Obsidian or a sync subscription.",
    author: 'Jaehee Song',
    date: '2026-04-16',
    readTime: '9 min read',
    category: 'AI & Development',
  },
  {
    slug: 'hermes-llm-wiki',
    title: 'Hermes LLM Wiki: Building a Self-Hosted AI Knowledge Base',
    excerpt:
      "I built Andrej Karpathy's LLM Wiki with Claude Code and Obsidian — but it only ran locally. Rather than pay for Obsidian Sync, I built Hermes: a web-based LLM Wiki where three AI agents turn any URL into connected Markdown, accessible from any browser.",
    author: 'Jaehee Song',
    date: '2026-04-16',
    readTime: '10 min read',
    category: 'AI & Development',
  },
  {
    slug: 'ai-interview-transformation-2026',
    title: 'The AI-Driven Interview: How Tech Hiring Was Rebuilt from Scratch',
    excerpt:
      '70% of companies now use AI in hiring. 80% of candidates use LLMs despite prohibitions. From NLP resume parsing to permissive AI coding rounds, every stage of the tech interview has been transformed.',
    author: 'Jaehee Song',
    date: '2026-04-15',
    readTime: '14 min read',
    category: 'AI & Education',
  },
  {
    slug: 'entry-level-tech-2026',
    title: 'The New Rules of Entry-Level Tech: What Changed Between 2018 and 2026',
    excerpt:
      'In 2018, knowing algorithms was enough. In 2026, that knowledge is table stakes — with 73% fewer entry-level jobs and AI rewriting every role. A comprehensive analysis of how AI disruption transformed junior developer hiring.',
    author: 'Jaehee Song',
    date: '2026-04-15',
    readTime: '12 min read',
    category: 'AI & Education',
  },
  {
    slug: 'responsible-ai-guide',
    title: 'Responsible AI: The Complete Guide to Ethical AI Development and Governance in 2026',
    excerpt:
      'From principles to practice — a comprehensive guide to building AI systems that are ethical, transparent, and aligned with human values, covering global governance frameworks, industry use cases, tools, and implementation roadmaps.',
    author: 'Jaehee Song',
    date: '2026-04-15',
    readTime: '16 min read',
    category: 'AI & Development',
  },
  {
    slug: 'data-governance-ai-era',
    title: 'Data Governance in the AI Era: A Practical Guide for 2026',
    excerpt:
      "AI makes the case for data governance impossible to ignore. Here's what good governance actually looks like, why programs fail, and where AI is taking it next.",
    author: 'Jaehee Song',
    date: '2026-04-14',
    readTime: '12 min read',
    category: 'AI & Data Infrastructure',
  },
  {
    slug: 'agentic-ai-guide',
    title: 'Agentic AI: The Complete Guide to Autonomous AI Systems in 2026',
    excerpt:
      'From chatbots that answer to agents that act — how agentic AI works, which industries are deploying it first, the tools driving adoption, and the risks you cannot ignore.',
    author: 'Jaehee Song',
    date: '2026-04-14',
    readTime: '14 min read',
    category: 'AI & Development',
  },
  {
    slug: 'database-landscape-ai-era',
    title: 'The Database World Just Got Flipped Upside Down',
    excerpt:
      'How AI agents, MCP, and the rise of semantic layers are rewriting every rule about databases — and what it means for your team.',
    author: 'Jaehee Song',
    date: '2026-04-15',
    readTime: '14 min read',
    category: 'AI & Data Infrastructure',
  },
  {
    slug: 'cs-degree-ai-era',
    title: 'Do We Still Need CS Degrees in the Age of AI?',
    excerpt:
      "The golden ticket to tech is being questioned. Here's what the evidence actually says about CS degrees, vibe coding, skills-first hiring, and which path makes sense for you.",
    author: 'Jaehee Song',
    date: '2026-06-14',
    readTime: '10 min read',
    category: 'AI & Education',
  },
  {
    slug: 'defining-the-right-problem-ai-era',
    title: 'The Most Valuable Skill in the AI Era: Defining the Right Problem',
    excerpt:
      'When everyone can build with AI, the advantage is no longer technical—it is the clarity to identify a problem worth solving. Includes 5 Whys, job-to-done framing, problem statement formula, and good vs bad examples.',
    author: 'Jaehee Song',
    date: '2026-03-25',
    readTime: '14 min read',
    category: 'AI & Development',
  },
  {
    slug: 'how-to-write-a-brd-2026',
    title: 'How to Write a BRD in 2026: The Complete Step-by-Step Guide',
    excerpt:
      'A complete guide to writing Business Requirements Documents in 2026. Covers all sections, best practices, AI-assisted writing, and common pitfalls to avoid.',
    author: 'Michael Rodriguez',
    date: '2026-03-18',
    readTime: '12 min read',
    category: 'Guides',
  },
  {
    slug: 'prd-template-guide',
    title: 'PRD Template: The Ultimate Guide for Product Managers in 2026',
    excerpt:
      'Everything product managers need to know about PRD templates — what to include, how to structure them, and how AI can write them 10x faster.',
    author: 'Sarah Chen',
    date: '2026-03-15',
    readTime: '14 min read',
    category: 'Guides',
  },
  {
    slug: 'brd-vs-prd',
    title: 'BRD vs PRD: What’s the Difference? (2026 Guide)',
    excerpt:
      'BRD = business case; PRD = what to build. When to use each, which comes first, and outline-style sections you can copy—plain English for product and BA teams in 2026.',
    author: 'Alex Kumar',
    date: '2026-03-12',
    readTime: '8 min read',
    category: 'Guides',
  },
  {
    slug: 'ai-requirements-gathering',
    title: "How to Use AI for Requirements Gathering: A PM's Practical Guide",
    excerpt:
      'AI is transforming requirements gathering. Learn how to use AI tools to elicit better requirements, structure interviews, and generate complete BRDs and PRDs faster.',
    author: 'Clearly Team',
    date: '2026-03-10',
    readTime: '9 min read',
    category: 'AI & Development',
  },
  {
    slug: 'user-stories-vs-requirements',
    title: 'User Stories vs Requirements: Which Does Your Team Need?',
    excerpt:
      'User stories and requirements documents serve different purposes. Learn when to use each, how they complement each other, and when teams get this wrong.',
    author: 'Sarah Chen',
    date: '2026-03-08',
    readTime: '7 min read',
    category: 'Best Practices',
  },
  {
    slug: 'acceptance-criteria-examples',
    title: '10 Acceptance Criteria Examples (With Templates) for Product Teams',
    excerpt:
      'Acceptance criteria make or break software delivery. Here are 10 real-world examples with templates, covering different feature types and formats.',
    author: 'Michael Rodriguez',
    date: '2026-03-05',
    readTime: '10 min read',
    category: 'Best Practices',
  },
  {
    slug: 'requirements-management-tools-2026',
    title: '7 Best Requirements Management Tools in 2026 — Compared',
    excerpt:
      'Compare 7 leading stacks—Jira, Jama, Confluence, Azure DevOps, Valispace, AI spec tools, and spreadsheets—for 2026. Honest picks for team size, budget, and AI-ready requirements.',
    author: 'Alex Kumar',
    date: '2026-03-03',
    readTime: '11 min read',
    category: 'Tools',
  },
  {
    slug: 'how-to-write-user-stories',
    title: 'How to Write User Stories Developers Actually Love',
    excerpt:
      "Most user stories are too vague to build from. Here's the complete guide to writing user stories with acceptance criteria that developers understand and QA can test.",
    author: 'Clearly Team',
    date: '2026-03-01',
    readTime: '8 min read',
    category: 'Best Practices',
  },
  {
    slug: 'functional-vs-non-functional-requirements',
    title: 'Functional vs Non-Functional Requirements: Complete Guide with Examples',
    excerpt:
      'The difference between functional and non-functional requirements — and why missing the latter is one of the top causes of software project failure.',
    author: 'Alex Kumar',
    date: '2026-03-17',
    readTime: '10 min read',
    category: 'Guides',
  },
  {
    slug: 'ai-coding-tools-requirements',
    title: 'Why AI Coding Tools Need Better Requirements First',
    excerpt:
      "Cursor, Claude Code, and GitHub Copilot are only as good as the requirements you give them. Here's how to write specs that make AI development actually work.",
    author: 'Sarah Chen',
    date: '2026-03-14',
    readTime: '8 min read',
    category: 'AI & Development',
  },
  {
    slug: 'brd-templates-by-industry',
    title: '5 BRD Templates by Industry: SaaS, Healthcare, Finance, and More',
    excerpt:
      'Not all Business Requirements Documents are created equal. Here are 5 industry-specific BRD templates with examples and what makes each one different.',
    author: 'Michael Rodriguez',
    date: '2026-03-11',
    readTime: '11 min read',
    category: 'Templates',
  },
  {
    slug: 'requirements-elicitation-guide',
    title: 'Requirements Elicitation: 7 Proven Techniques for Product Teams',
    excerpt:
      'Requirements elicitation is where most projects win or lose. Here are 7 proven techniques — from user interviews to workshops — and when to use each.',
    author: 'Clearly Team',
    date: '2026-03-09',
    readTime: '9 min read',
    category: 'Best Practices',
  },
  {
    slug: 'reduce-scope-creep-requirements',
    title: '7 Ways to Cut Scope Creep with Better Requirements (2026)',
    excerpt:
      "Stop 'just one more feature' with 7 methods: tighter requirements, change control, and acceptance criteria so scope matches what you agreed to ship—before dev burns the budget.",
    author: 'Alex Kumar',
    date: '2026-03-07',
    readTime: '8 min read',
    category: 'Best Practices',
  },
  {
    slug: 'brd-mistakes-to-avoid',
    title: '7 Common BRD Mistakes (And Exactly How to Fix Them)',
    excerpt:
      'After reviewing hundreds of BRDs, these are the 7 mistakes that appear most often — and the specific fixes that turn a bad BRD into one developers can actually build from.',
    author: 'Sarah Chen',
    date: '2026-03-04',
    readTime: '9 min read',
    category: 'Guides',
  },
  {
    slug: 'agile-requirements-documentation',
    title: 'Agile Requirements Documentation: Best Practices for 2026',
    excerpt:
      "Agile doesn't mean no documentation — it means the right documentation. Here's how to balance lightweight agile requirements with the completeness teams need.",
    author: 'Michael Rodriguez',
    date: '2026-03-02',
    readTime: '10 min read',
    category: 'Best Practices',
  },
  {
    slug: 'how-to-write-srs-document',
    title: 'How to Write an SRS Document Engineers Actually Read',
    excerpt:
      "Software Requirements Specification documents don't have to be ignored. Here's how to write an SRS that developers reference, QA tests against, and stakeholders understand.",
    author: 'Clearly Team',
    date: '2026-02-28',
    readTime: '11 min read',
    category: 'Guides',
  },
  {
    slug: 'why-every-ai-project-needs-prd',
    title: 'Why Every AI Project Needs a PRD',
    excerpt: 'Learn why clear requirements are more important than ever in the age of AI-assisted development.',
    author: 'Sarah Chen',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Best Practices',
  },
  {
    slug: 'complete-guide-to-writing-brds',
    title: 'The Complete Guide to Writing BRDs',
    excerpt: 'Everything you need to know about creating effective Business Requirements Documents.',
    author: 'Michael Rodriguez',
    date: '2024-01-10',
    readTime: '8 min read',
    category: 'Guides',
  },
  {
    slug: 'translate-user-needs-to-requirements',
    title: 'How to Translate User Needs into Technical Requirements',
    excerpt:
      'Bridge the gap between business stakeholders and development teams with these proven techniques.',
    author: 'Alex Kumar',
    date: '2024-01-05',
    readTime: '6 min read',
    category: 'Best Practices',
  },
  {
    slug: 'ai-assisted-documentation',
    title: 'The Future of Requirements: AI-Assisted Documentation',
    excerpt:
      'Discover how AI is transforming the way we create and maintain requirements documents, and what it means for the future of software development.',
    author: 'Clearly Team',
    date: '2024-01-20',
    readTime: '10 min read',
    category: 'Featured',
  },
];

/** All blog post URL paths, derived from the registry. */
export const blogRoutePaths: string[] = blogPosts.map((p) => `/blog/${p.slug}`);
