/**
 * Blog Post Layout Component
 *
 * Reusable layout for individual blog posts
 */

import { PublicLayout } from '../layout/PublicLayout';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

export interface BlogPostLayoutProps {
  title: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  coverImage?: string;
  coverGradient?: string;
  children: ReactNode;
}

export function BlogPostLayout({
  title,
  author,
  date,
  readTime,
  category,
  excerpt,
  coverImage,
  coverGradient = 'from-primary-600 to-accent-600',
  children,
}: BlogPostLayoutProps) {
  return (
    <PublicLayout>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Blog */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Cover Image */}
        {coverImage && (
          <div className={`w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 bg-gradient-to-br ${coverGradient} flex items-center justify-center`}>
            <div className="text-white/10 text-9xl font-bold">{coverImage}</div>
          </div>
        )}

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
              {category}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {readTime}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {title}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {excerpt}
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {children}
        </div>

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to streamline your requirements process?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start generating professional BRDs and PRDs with AI assistance today.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </footer>
      </article>
    </PublicLayout>
  );
}
