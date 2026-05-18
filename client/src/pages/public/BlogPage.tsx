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
import { blogPosts } from '../../data/blogPosts';

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
                key={post.slug}
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
