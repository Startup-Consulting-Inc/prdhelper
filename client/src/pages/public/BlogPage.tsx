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
        "ADRs are the receipts that keep agents from “correcting” deliberate choices back to defaults. How to write ADRs that prevent silent refactors—and when reversal cost matters most.",
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
        'A one-page threat model and a practical deployment runbook move security and ops from “after the incident” to “in the build.” Examples and prompts you can reuse.',
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
        "A laid-off engineer takes a near-minimum-wage caregiving job — and discovers what hiring filters can’t measure: patience, ethical work that doesn’t scale, and the ability to sit with ambiguity when identity collapses.",
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
        'The “stop building agents” line is about duplicate scaffolding, not deleting your runtime. Skills, progressive disclosure, and MCP in one readable layout — same story as the Medium post, with the old-vs-new diagram.',
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
        'AI makes the case for data governance impossible to ignore. Here\'s what good governance actually looks like, why programs fail, and where AI is taking it next.',
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
        'The golden ticket to tech is being questioned. Here\'s what the evidence actually says about CS degrees, vibe coding, skills-first hiring, and which path makes sense for you.',
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
      title: 'BRD vs PRD: What’s the Difference? (2026 Guide)',
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

  const categories = ['All', ...Array.from(new Set(blogPosts.map((p) => p.category)))];
  const trimmedQuery = query.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;

  const filtered = blogPosts.filter((p) => {
    if (isSearching) {
      return (
        p.title.toLowerCase().includes(trimmedQuery) ||
        p.excerpt.toLowerCase().includes(trimmedQuery) ||
        p.author.toLowerCase().includes(trimmedQuery)
      );
    }
    return activeCategory === 'All' || p.category === activeCategory;
  });

  return (
    <PublicLayout>
      <SEO
        title="Blog – Requirements Documentation & AI Development"
        description="Articles on product requirements, PRDs, BRDs, and AI-assisted development for product managers and teams. Expert guides and best practices."
        path="/blog"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Insights, best practices, and tips for creating better requirements documents and
            building successful software projects.
          </p>
        </div>

        {/* Featured Post */}
        {!isSearching && (
        <div className="mb-16">
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:w-1/2 p-12 text-white">
                <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                  Featured
                </div>
                <h2 className="text-4xl font-bold mb-4">
                  How to Write a BRD in 2026: The Complete Step-by-Step Guide
                </h2>
                <p className="text-lg mb-6 opacity-90">
                  A complete guide to writing Business Requirements Documents in 2026. Covers all
                  sections, best practices, AI-assisted writing, and common pitfalls to avoid.
                </p>
                <div className="flex items-center gap-6 text-sm mb-6 opacity-80">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Michael Rodriguez</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>March 18, 2026</span>
                  </div>
                  <span>12 min read</span>
                </div>
                <Link
                  to="/blog/how-to-write-a-brd-2026"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Read Article
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Editorial icon illustration */}
              <div className="md:w-1/2 bg-gradient-to-br from-primary-400/20 to-accent-400/20 flex items-center justify-center p-12">
                <div className="grid grid-cols-2 gap-8">
                  {[FileText, Zap, BookOpen, CheckCircle].map((Icon, i) => (
                    <div key={i} className="flex items-center justify-center">
                      <Icon className="h-10 w-10 text-white/40" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Search */}
        <div className="mb-6 w-full max-w-md">
          <label htmlFor="blog-search" className="sr-only">
            Search articles
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none"
              aria-hidden
            />
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, excerpt, or author..."
              autoComplete="off"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 py-3 pl-11 pr-11 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8 items-center">
          {categories.map((cat) => {
            const chipActive = isSearching ? cat === 'All' : activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setQuery('');
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  chipActive
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                {cat}
              </button>
            );
          })}
          <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            {filtered.length} article{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Blog Posts Grid */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-8 py-14 text-center mb-16">
            {isSearching ? (
              <>
                <p className="text-gray-700 dark:text-gray-200 font-medium mb-2">
                  No results for &quot;{query.trim()}&quot;
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Try different keywords or browse by category.
                </p>
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-700 dark:text-gray-200 font-medium mb-2">
                  No articles in this category.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveCategory('All')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                >
                  View all articles
                </button>
              </>
            )}
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filtered.map((post) => {
            const style = CATEGORY_STYLES[post.category] || DEFAULT_STYLE;
            const Icon = style.icon;
            const postIsNew = isNew(post.date);

            return (
              <article
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Category-color header with icon */}
                <div className={`h-36 ${style.bg} flex items-center justify-center relative`}>
                  <Icon className={`h-12 w-12 ${style.text} opacity-80`} />
                  {postIsNew && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-white/90 text-gray-800 text-xs font-semibold rounded-full">
                      New
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{post.readTime}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium inline-flex items-center gap-2"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl p-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Stop writing requirements from scratch</h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Clearly's AI wizard generates complete BRDs and PRDs in 15–30 minutes. Everything
            covered in these articles, automated.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Try Clearly Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
