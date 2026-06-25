/**
 * Blog Page
 *
 * Public page listing blog posts and articles.
 * Features: category filter tabs, redesigned cards with category icons,
 * improved featured post with icon grid.
 */

import { PublicLayout } from '../../components/layout/PublicLayout';
import { SEO } from '../../components/SEO';
import {
  Calendar,
  User,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Zap,
  Wrench,
  FileText,
  Star,
  GraduationCap,
  Database,
  Search,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const CATEGORY_STYLES: Record<string, { bg: string; text: string; icon: LucideIcon }> = {
  Guides:               { bg: 'bg-blue-500',    text: 'text-blue-50',    icon: BookOpen },
  'Best Practices':     { bg: 'bg-purple-500',  text: 'text-purple-50',  icon: CheckCircle },
  'AI & Development':   { bg: 'bg-emerald-500', text: 'text-emerald-50', icon: Zap },
  Tools:                { bg: 'bg-orange-500',  text: 'text-orange-50',  icon: Wrench },
  Templates:            { bg: 'bg-rose-500',    text: 'text-rose-50',    icon: FileText },
  Featured:             { bg: 'bg-pink-500',    text: 'text-pink-50',    icon: Star },
  'AI & Education':          { bg: 'bg-indigo-500',  text: 'text-indigo-50',  icon: GraduationCap },
  'AI & Data Infrastructure': { bg: 'bg-violet-600',  text: 'text-violet-50',  icon: Database },
};

const DEFAULT_STYLE: { bg: string; text: string; icon: LucideIcon } = {
  bg: 'bg-gray-500',
  text: 'text-gray-50',
  icon: BookOpen,
};

function isNew(dateStr: string): boolean {
  const postDate = new Date(dateStr);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 14);
  return postDate >= cutoff;
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');

  const blogPosts = [
    {
      id: 47,
      slug: 'best-brd-generator-ai-projects-2026',
      title: 'Best BRD Generator for AI Projects (2026): Free Tools Compared',
      excerpt:
        'Compare the best free BRD generators for AI projects in 2026. See why structured requirements beat vibe coding, plus a downloadable BRD template for Cursor, Claude, and Lovable.',
      author: 'ClearlyReqs Team',
      date: '2026-06-26',
      readTime: '12 min read',
      category: 'AI & Development',
    },
    {
      id: 46,
      slug: 'agentic-coding-requirements-2026',
      title: 'Why Agentic Coding Needs Better Requirements — Not Faster Vibes',
      excerpt:
        "Builder.io proved 270 people can build from a PRD in 60 minutes—but how many rebuilt it the next week? The dirty secret of agentic development: bad requirements don't slow you down anymore. They just create garbage faster.",
      author: 'ClearlyReqs Team',
      date: '2026-05-21',
      readTime: '7 min read',
      category: 'AI & Development',
    },
    {
      id: 45,
      slug: 'hermes-agent-team-gateway-best-practices',
      title: 'Hermes Agent: Practical Best Practices for Team Gateway Deployments',
      excerpt:
        'Gateway architecture, layered security (pairing, approvals, Docker), profiles and skill libraries, Mem0 vs built-in memory, MCP governance, terminal backends, cron, observability with Langfuse, and maintenance cadence.',
      author: 'Jaehee Song',
      date: '2026-05-15',
      readTime: '24 min read',
      category: 'AI & Development',
    },
    {
      id: 44,
      slug: 'openclaw-team-operations-guide',
      title: 'OpenClaw Team Operations: Security, Memory, and Maintenance at Scale',
      excerpt:
        'Self-hosted OpenClaw for ~5 developers on shared VMs: three security tiers, memory/compaction, session isolation, credential hygiene, skills auditing, backups, cron, complete starter openclaw.json, incident response.',
      author: 'Jaehee Song',
      date: '2026-05-15',
      readTime: '22 min read',
      category: 'AI & Development',
    },
    {
      id: 43,
      slug: 'openclaw-vs-hermes-agent',
      title: 'OpenClaw vs Hermes Agent: The 2026 Comparison',
      excerpt:
        'Ecosystem platform vs learning runtime—stars, timelines, architecture, security (245+ vs 1 CVE cited), ecosystem scale, and a decision matrix. When to pick each or both.',
      author: 'Jaehee Song',
      date: '2026-05-15',
      readTime: '18 min read',
      category: 'AI & Development',
    },
    {
      id: 42,
      slug: 'clearly-openclaw-attendance-case-study',
      title: 'From Idea to a Live Web Service in Under an Hour: Clearly + OpenClaw',
      excerpt:
        'Case study: attendance app from one sentence—BRD/PRD and wizard helpers in Clearly, OpenClaw AGENTS.md stack export, one build prompt, smoke-tested full stack, then Caddy and DNS to go live.',
      author: 'Jaehee Song',
      date: '2026-05-14',
      readTime: '12 min read',
      category: 'AI & Development',
    },
    {
      id: 41,
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
      id: 40,
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
      id: 39,
      slug: 'stop-losing-architectural-decisions',
      title: 'Stop Losing Your Architectural Decisions to Your AI Agent',
      excerpt:
        "ADRs are the receipts that keep agents from \"correcting\" deliberate choices back to defaults. How to write ADRs that prevent silent refactors—and when reversal cost matters most.",
      author: 'Jaehee Song',
      date: '2026-05-08',
      readTime: '16 min read',
      category: 'AI & Development',
    },
    {
      id: 38,
      slug: 'two-docs-before-2am-crisis',
      title: 'The Two Docs That Stand Between Your App and a 2am Crisis',
      excerpt:
        'A one-page threat model and a practical deployment runbook move security and ops from \"after the incident\" to \"in the build.\" Examples and prompts you can reuse.',
      author: 'Jaehee Song',
      date: '2026-05-08',
      readTime: '20 min read',
      category: 'AI & Development',
    },
    {
      id: 37,
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
      id: 35,
      slug: 'engineer-caregiver-identity-collapse',
      title: 'The Engineer Who Got Hired to Wipe Bodies: A Field Report on Identity Collapse',
      excerpt:
        "A laid-off engineer takes a near-minimum-wage caregiving job — and discovers what hiring filters can't measure: patience, ethical work that doesn't scale, and the ability to sit with ambiguity when identity collapses.",
      author: 'Jaehee Song',
      date: '2026-05-05',
      readTime: '9 min read',
      category: 'Featured',
    },
    {
      id: 34,
      slug: 'skills-vs-agents',
      title: 'Agents vs Skills: The Full Picture',
      excerpt:
        'The \"stop building agents\" line is about duplicate scaffolding, not deleting your runtime. Skills, progressive disclosure, and MCP in one readable layout — same story as the Medium post, with the old-vs-new diagram.',
      author: 'Jaehee Song',
      date: '2026-04-23',
      readTime: '12 min read',
      category: 'AI & Development',
    },
    {
      id: 33,
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
      id: 32,
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
      id: 31,
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
      id: 30,
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
      id: 29,
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
      id: 28,
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
      id: 27,
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
      id: 26,
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
      id: 25,
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
      id: 24,
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
      id: 23,
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
      id: 22,
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
      id: 21,
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
      id: 1,
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
      id: 2,
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
      id: 3,
      slug: 'brd-vs-prd',
      title: "BRD vs PRD: What's the Difference? (2026 Guide)",
      excerpt:
        'BRD = business case; PRD = what to build. When to use each, which comes first, and outline-style sections you can copy—plain English for product and BA teams in 2026.',
      author: 'Alex Kumar',
      date: '2026-03-12',
      readTime: '8 min read',
      category: 'Guides',
    },
    {
      id: 4,
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
      id: 5,
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
      id: 6,
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
      id: 7,
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
      id: 8,
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
      id: 9,
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
      id: 10,
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
      id: 11,
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
      id: 12,
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
      id: 13,
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
      id: 14,
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
      id: 15,
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
      id: 16,
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
      id: 17,
      slug: 'why-every-ai-project-needs-prd',
      title: 'Why Every AI Project Needs a PRD',
      excerpt: 'Learn why clear requirements are more important than ever in the age of AI-assisted development.',
      author: 'Sarah Chen',
      date: '2024-01-15',
      readTime: '5 min read',
      category: 'Best Practices',
    },
    {
      id: 18,
      slug: 'complete-guide-to-writing-brds',
      title: 'The Complete Guide to Writing BRDs',
      excerpt: 'Everything you need to know about creating effective Business Requirements Documents.',
      author: 'Michael Rodriguez',
      date: '2024-01-10',
      readTime: '8 min read',
      category: 'Guides',
    },
    {
      id: 19,
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
      id: 20,
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