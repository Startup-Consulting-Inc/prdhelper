/**
 * Blog Page
 *
 * Public page listing blog posts and articles
 */

import { PublicLayout } from '../../components/layout/PublicLayout';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlogPage() {
  // Sample blog posts - in a real app, these would come from a CMS or API
  const blogPosts = [
    {
      id: 1,
      slug: 'why-every-ai-project-needs-prd',
      title: 'Why Every AI Project Needs a PRD',
      excerpt: 'Learn why clear requirements are more important than ever in the age of AI-assisted development.',
      author: 'Sarah Chen',
      date: '2024-01-15',
      readTime: '5 min read',
      category: 'Best Practices',
    },
    {
      id: 2,
      slug: 'complete-guide-to-writing-brds',
      title: 'The Complete Guide to Writing BRDs',
      excerpt: 'Everything you need to know about creating effective Business Requirements Documents.',
      author: 'Michael Rodriguez',
      date: '2024-01-10',
      readTime: '8 min read',
      category: 'Guides',
    },
    {
      id: 3,
      slug: 'translate-user-needs-to-requirements',
      title: 'How to Translate User Needs into Technical Requirements',
      excerpt: 'Bridge the gap between business stakeholders and development teams with these proven techniques.',
      author: 'Alex Kumar',
      date: '2024-01-05',
      readTime: '6 min read',
      category: 'Best Practices',
    },
  ];

  return (
    <PublicLayout>
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
                  The Future of Requirements: AI-Assisted Documentation
                </h2>
                <p className="text-lg mb-6 opacity-90">
                  Discover how AI is transforming the way we create and maintain requirements
                  documents, and what it means for the future of software development.
                </p>
                <div className="flex items-center gap-6 text-sm mb-6 opacity-80">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Clearly Team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>January 20, 2024</span>
                  </div>
                  <span>10 min read</span>
                </div>
                <Link
                  to="/blog/ai-assisted-documentation"
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

        {/* Coming Soon Section */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            More articles coming soon!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We're working on creating more helpful content about requirements documentation,
            AI-assisted development, and software best practices.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Want to contribute? Have a topic suggestion?{' '}
            <a href="/schedule-demo" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
