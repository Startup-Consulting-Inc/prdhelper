/**
 * Author Bio Page — /authors/:slug
 *
 * Strengthens E-E-A-T: a real bio, role, external profiles (Person schema),
 * and the author's published posts.
 */

import { useParams, Link, Navigate } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { SEO } from '../../components/SEO';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { getAuthorBySlug } from '../../data/authors';
import { blogPosts } from '../../data/blogPosts';
import { ArrowRight } from 'lucide-react';

const BASE_URL = 'https://www.clearlyreqs.com';

export default function AuthorPage() {
  const { slug } = useParams<{ slug: string }>();
  const author = slug ? getAuthorBySlug(slug) : undefined;

  if (!author) {
    return <Navigate to="/blog" replace />;
  }

  const posts = blogPosts
    .filter((p) => p.author === author.name)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    url: `${BASE_URL}/authors/${author.slug}`,
    ...(author.sameAs && author.sameAs.length > 0 ? { sameAs: author.sameAs } : {}),
    worksFor: { '@type': 'Organization', name: 'Clearly', url: BASE_URL },
  };

  const initials = author.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <PublicLayout>
      <SEO
        title={`${author.name} – ${author.role}`}
        description={author.bio}
        path={`/authors/${author.slug}`}
        type="profile"
        schema={personSchema}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs items={[{ label: 'Blog', path: '/blog' }, { label: author.name }]} />

        <div className="flex items-center gap-5 mb-8">
          <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-primary-700 dark:text-primary-300">
              {initials}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{author.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{author.role}</p>
          </div>
        </div>

        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          {author.bio}
        </p>

        {author.sameAs && author.sameAs.length > 0 && (
          <div className="flex gap-4 mb-12">
            {author.sameAs.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                {new URL(url).hostname.replace('www.', '')}
              </a>
            ))}
          </div>
        )}

        {posts.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Posts by {author.name}
            </h2>
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="block p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm transition-all"
                >
                  <span className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1 block">
                    {post.category}
                  </span>
                  <p className="font-semibold text-gray-900 dark:text-white">{post.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                    {post.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-16 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
          >
            Back to all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
