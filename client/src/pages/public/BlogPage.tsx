/**
 * Blog Page
 *
 * Public page listing blog posts and articles
 */

import { PublicLayout } from '../../components/layout/PublicLayout';
import { SEO } from '../../components/SEO';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      slug: 'how-to-write-a-brd-2026',
      title: 'How to Write a BRD in 2026: The Complete Step-by-Step Guide',
      excerpt: 'A complete guide to writing Business Requirements Documents in 2026. Covers all sections, best practices, AI-assisted writing, and common pitfalls to avoid.',
      author: 'Michael Rodriguez',
      date: '2026-03-18',
      readTime: '12 min read',
      category: 'Guides',
    },
    {
      id: 2,
      slug: 'prd-template-guide',
      title: 'PRD Template: The Ultimate Guide for Product Managers in 2026',
      excerpt: 'Everything product managers need to know about PRD templates — what to include, how to structure them, and how AI can write them 10x faster.',
      author: 'Sarah Chen',
      date: '2026-03-15',
      readTime: '14 min read',
      category: 'Guides',
    },
    {
      id: 3,
      slug: 'brd-vs-prd',
      title: "BRD vs PRD: What's the Difference and When to Use Each",
      excerpt: 'BRD vs PRD — two documents that every PM and BA needs, but few teams use correctly. Learn the differences, when each is needed, and how they work together.',
      author: 'Alex Kumar',
      date: '2026-03-12',
      readTime: '8 min read',
      category: 'Guides',
    },
    {
      id: 4,
      slug: 'ai-requirements-gathering',
      title: "How to Use AI for Requirements Gathering: A PM's Practical Guide",
      excerpt: 'AI is transforming requirements gathering. Learn how to use AI tools to elicit better requirements, structure interviews, and generate complete BRDs and PRDs faster.',
      author: 'Clearly Team',
      date: '2026-03-10',
      readTime: '9 min read',
      category: 'AI & Development',
    },
    {
      id: 5,
      slug: 'user-stories-vs-requirements',
      title: 'User Stories vs Requirements: Which Does Your Team Need?',
      excerpt: 'User stories and requirements documents serve different purposes. Learn when to use each, how they complement each other, and when teams get this wrong.',
      author: 'Sarah Chen',
      date: '2026-03-08',
      readTime: '7 min read',
      category: 'Best Practices',
    },
    {
      id: 6,
      slug: 'acceptance-criteria-examples',
      title: '10 Acceptance Criteria Examples (With Templates) for Product Teams',
      excerpt: 'Acceptance criteria make or break software delivery. Here are 10 real-world examples with templates, covering different feature types and formats.',
      author: 'Michael Rodriguez',
      date: '2026-03-05',
      readTime: '10 min read',
      category: 'Best Practices',
    },
    {
      id: 7,
      slug: 'requirements-management-tools-2026',
      title: 'Best Requirements Management Tools in 2026 (Honest Comparison)',
      excerpt: 'Comparing the top requirements management tools in 2026: from dedicated platforms to AI generators to manual methods. Find the right tool for your team.',
      author: 'Alex Kumar',
      date: '2026-03-03',
      readTime: '11 min read',
      category: 'Tools',
    },
    {
      id: 8,
      slug: 'how-to-write-user-stories',
      title: 'How to Write User Stories Developers Actually Love',
      excerpt: "Most user stories are too vague to build from. Here's the complete guide to writing user stories with acceptance criteria that developers understand and QA can test.",
      author: 'Clearly Team',
      date: '2026-03-01',
      readTime: '8 min read',
      category: 'Best Practices',
    },
    {
      id: 9,
      slug: 'functional-vs-non-functional-requirements',
      title: 'Functional vs Non-Functional Requirements: Complete Guide with Examples',
      excerpt: 'The difference between functional and non-functional requirements — and why missing the latter is one of the top causes of software project failure.',
      author: 'Alex Kumar',
      date: '2026-03-17',
      readTime: '10 min read',
      category: 'Guides',
    },
    {
      id: 10,
      slug: 'ai-coding-tools-requirements',
      title: 'Why AI Coding Tools Need Better Requirements First',
      excerpt: 'Cursor, Claude Code, and GitHub Copilot are only as good as the requirements you give them. Here\'s how to write specs that make AI development actually work.',
      author: 'Sarah Chen',
      date: '2026-03-14',
      readTime: '8 min read',
      category: 'AI & Development',
    },
    {
      id: 11,
      slug: 'brd-templates-by-industry',
      title: '5 BRD Templates by Industry: SaaS, Healthcare, Finance, and More',
      excerpt: 'Not all Business Requirements Documents are created equal. Here are 5 industry-specific BRD templates with examples and what makes each one different.',
      author: 'Michael Rodriguez',
      date: '2026-03-11',
      readTime: '11 min read',
      category: 'Templates',
    },
    {
      id: 12,
      slug: 'requirements-elicitation-guide',
      title: 'Requirements Elicitation: 7 Proven Techniques for Product Teams',
      excerpt: 'Requirements elicitation is where most projects win or lose. Here are 7 proven techniques — from user interviews to workshops — and when to use each.',
      author: 'Clearly Team',
      date: '2026-03-09',
      readTime: '9 min read',
      category: 'Best Practices',
    },
    {
      id: 13,
      slug: 'reduce-scope-creep-requirements',
      title: 'How to Reduce Scope Creep with Better Requirements (7 Methods)',
      excerpt: 'Scope creep kills projects. The root cause is almost always unclear requirements. Here are 7 methods to write requirements that prevent scope creep before it starts.',
      author: 'Alex Kumar',
      date: '2026-03-07',
      readTime: '8 min read',
      category: 'Best Practices',
    },
    {
      id: 14,
      slug: 'brd-mistakes-to-avoid',
      title: '7 Common BRD Mistakes (And Exactly How to Fix Them)',
      excerpt: 'After reviewing hundreds of BRDs, these are the 7 mistakes that appear most often — and the specific fixes that turn a bad BRD into one developers can actually build from.',
      author: 'Sarah Chen',
      date: '2026-03-04',
      readTime: '9 min read',
      category: 'Guides',
    },
    {
      id: 15,
      slug: 'agile-requirements-documentation',
      title: 'Agile Requirements Documentation: Best Practices for 2026',
      excerpt: 'Agile doesn\'t mean no documentation — it means the right documentation. Here\'s how to balance lightweight agile requirements with the completeness teams need.',
      author: 'Michael Rodriguez',
      date: '2026-03-02',
      readTime: '10 min read',
      category: 'Best Practices',
    },
    {
      id: 16,
      slug: 'how-to-write-srs-document',
      title: 'How to Write an SRS Document Engineers Actually Read',
      excerpt: 'Software Requirements Specification documents don\'t have to be ignored. Here\'s how to write an SRS that developers reference, QA tests against, and stakeholders understand.',
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
      excerpt: 'Bridge the gap between business stakeholders and development teams with these proven techniques.',
      author: 'Alex Kumar',
      date: '2024-01-05',
      readTime: '6 min read',
      category: 'Best Practices',
    },
    {
      id: 20,
      slug: 'ai-assisted-documentation',
      title: 'The Future of Requirements: AI-Assisted Documentation',
      excerpt: 'Discover how AI is transforming the way we create and maintain requirements documents, and what it means for the future of software development.',
      author: 'Clearly Team',
      date: '2024-01-20',
      readTime: '10 min read',
      category: 'Featured',
    },
  ];

  return (
    <PublicLayout>
      <SEO
        title="Blog – Requirements Documentation & AI Development"
        description="Articles on product requirements, PRDs, BRDs, and AI-assisted development for product managers and teams. Expert guides and best practices."
        path="/blog"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Insights, best practices, and tips for creating better requirements documents
            and building successful software projects.
          </p>
        </div>

        {/* Featured Post */}
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
                  A complete guide to writing Business Requirements Documents in 2026. Covers all sections, best practices, AI-assisted writing, and common pitfalls to avoid.
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
              <div className="md:w-1/2 bg-gradient-to-br from-primary-400/20 to-accent-400/20 flex items-center justify-center p-12">
                <div className="text-white/10 text-9xl font-bold">AI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center">
                <div className="text-primary-200 dark:text-primary-800 text-6xl font-bold">
                  {post.title.charAt(0)}
                </div>
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
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
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
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl p-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Stop writing requirements from scratch
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Clearly's AI wizard generates complete BRDs and PRDs in 15–30 minutes. Everything covered in these articles, automated.
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
