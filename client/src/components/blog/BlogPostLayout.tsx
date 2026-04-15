/**
 * Blog Post Layout Component
 *
 * Reusable layout for individual blog posts.
 * Features: reading progress bar, sticky ToC sidebar, author card,
 * share buttons, breadcrumbs, improved hero cover, and CTA footer.
 */

import { PublicLayout } from '../layout/PublicLayout';
import { Calendar, Clock, ArrowLeft, ArrowRight, Link2, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReactNode, useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '../Breadcrumbs';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BlogPostLayoutProps {
  title: string;
  author: string;
  date: string;
  dateModified?: string;
  readTime: string;
  category: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  coverGradient?: string;
  children: ReactNode;
  relatedPosts?: Array<{ slug: string; title: string; category: string; date: string }>;
  faqItems?: FaqItem[];
}

const BASE_URL = 'https://www.clearlyreqs.com';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function TwitterXIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.213 5.567L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function ShareButtons({ title, url, compact = false }: { title: string; url: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on X / Twitter"
          className="p-1.5 rounded-md text-gray-400 hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <TwitterXIcon className="h-4 w-4" />
        </a>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on LinkedIn"
          className="p-1.5 rounded-md text-gray-400 hover:text-blue-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <LinkedInIcon className="h-4 w-4" />
        </a>
        <button
          onClick={copyLink}
          title="Copy link"
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
        Share
      </p>
      <div className="space-y-2">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-400 transition-colors"
        >
          <TwitterXIcon className="h-4 w-4" />
          X / Twitter
        </a>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
        >
          <LinkedInIcon className="h-4 w-4" />
          LinkedIn
        </a>
        <button
          onClick={copyLink}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}

export function BlogPostLayout({
  title,
  author,
  date,
  dateModified,
  readTime,
  category,
  excerpt,
  slug,
  coverImage,
  coverGradient = 'from-primary-600 to-accent-600',
  children,
  relatedPosts,
  faqItems,
}: BlogPostLayoutProps) {
  const canonicalUrl = `${BASE_URL}/blog/${slug}`;
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const [progress, setProgress] = useState(0);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [tocOpen, setTocOpen] = useState(false);
  const articleRef = useRef<HTMLElement>(null);

  // Reading progress bar
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setProgress(Math.min(scrolled * 100, 100));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Build ToC from rendered headings
  useEffect(() => {
    if (!articleRef.current) return;
    const headings = articleRef.current.querySelectorAll('h2, h3');
    const items: TocItem[] = [];
    headings.forEach((el) => {
      const text = el.textContent || '';
      const id = slugify(text) || `heading-${items.length}`;
      el.id = id;
      items.push({ id, text, level: el.tagName === 'H2' ? 2 : 3 });
    });
    setToc(items);
  }, []); // runs once after mount when children are in DOM

  // Intersection Observer for active heading highlight
  useEffect(() => {
    if (toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    author: { '@type': 'Person', name: author },
    datePublished: date,
    ...(dateModified ? { dateModified } : {}),
    url: canonicalUrl,
    publisher: { '@type': 'Organization', name: 'Clearly', url: BASE_URL },
  };

  const faqSchema = faqItems && faqItems.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      }
    : null;

  const authorInitials = author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <PublicLayout>
      <Helmet>
        <title>{title} | Clearly</title>
        <meta name="description" content={excerpt} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={excerpt} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        {faqSchema && (
          <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        )}
      </Helmet>

      {/* Reading progress bar — fixed above everything */}
      <div
        className="fixed top-0 left-0 z-50 h-[3px] bg-primary-600 transition-all duration-100"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Blog', path: '/blog' }, { label: title }]} />

        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Two-column layout on xl+ */}
        <div className="xl:grid xl:grid-cols-[1fr_260px] xl:gap-12">
          {/* ── Main article ── */}
          <article ref={articleRef} className="min-w-0">
            {/* Hero cover */}
            {coverImage && (
              <div
                className={`w-full h-48 md:h-72 rounded-2xl overflow-hidden mb-8 bg-gradient-to-br ${coverGradient} flex items-center justify-center relative`}
              >
                <span className="text-white/20 font-black text-[8rem] md:text-[12rem] leading-none select-none">
                  {coverImage}
                </span>
                <span className="absolute bottom-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30">
                  {category}
                </span>
              </div>
            )}

            {/* Mobile / tablet ToC — collapsible */}
            {toc.length > 0 && (
              <div className="xl:hidden mb-8 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => setTocOpen(!tocOpen)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 text-left"
                  aria-expanded={tocOpen}
                >
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    On this page
                  </span>
                  {tocOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </button>
                {tocOpen && (
                  <ul className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
                    {toc.map((item) => (
                      <li key={item.id} style={{ paddingLeft: item.level === 3 ? '12px' : '0' }}>
                        <a
                          href={`#${item.id}`}
                          onClick={() => setTocOpen(false)}
                          className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block py-0.5"
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Article header */}
            <header className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                  {category}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {title}
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{excerpt}</p>

              {/* Author card */}
              <div className="flex items-center gap-3 pb-8 border-b border-gray-200 dark:border-gray-700">
                {/* Initials avatar */}
                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary-700 dark:text-primary-300">
                    {authorInitials}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{author}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {readTime}
                    </span>
                  </div>
                </div>

                {/* Share buttons — shown inline on mobile, hidden on xl (sidebar handles it) */}
                <div className="ml-auto xl:hidden">
                  <ShareButtons title={title} url={canonicalUrl} compact />
                </div>
              </div>
            </header>

            {/* Article content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">{children}</div>

            {/* Related posts */}
            {relatedPosts && relatedPosts.length > 0 && (
              <section className="mt-16">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  More from the blog
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {relatedPosts.map((post) => (
                    <Link
                      key={post.slug}
                      to={`/blog/${post.slug}`}
                      className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm transition-all"
                    >
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1 block">
                        {post.category}
                      </span>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Footer CTA */}
            <div className="mt-16 rounded-2xl bg-gray-900 dark:bg-gray-800 p-8 md:p-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-3">
                Clearly
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Stop writing requirements from scratch
              </h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Generate a complete BRD or PRD in 15 minutes. AI-guided, structured, export-ready.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold transition-colors"
              >
                Start Free — No Credit Card
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>

          {/* ── Sticky sidebar — xl only ── */}
          <aside className="hidden xl:block">
            <div className="sticky top-24 space-y-6">
              {/* Table of contents */}
              {toc.length > 0 && (
                <nav
                  className="rounded-xl border border-gray-200 dark:border-gray-700 p-4"
                  aria-label="Table of contents"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                    On this page
                  </p>
                  <ul className="space-y-1">
                    {toc.map((item) => (
                      <li key={item.id} style={{ paddingLeft: item.level === 3 ? '12px' : '0' }}>
                        <a
                          href={`#${item.id}`}
                          className={`text-sm block py-0.5 transition-colors ${
                            activeId === item.id
                              ? 'text-primary-600 dark:text-primary-400 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {/* Share buttons */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <ShareButtons title={title} url={canonicalUrl} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PublicLayout>
  );
}
