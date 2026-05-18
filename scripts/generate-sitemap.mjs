/**
 * Sitemap Generator
 *
 * Generates client/dist/sitemap.xml from the SSR bundle's PUBLIC_ROUTES +
 * blogPosts registry (single source of truth). Run after `vite build` and
 * `vite build --ssr` so the dist directory and SSR bundle exist.
 *
 * Usage:
 *   node scripts/generate-sitemap.mjs
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CLIENT_DIST = join(ROOT, 'client', 'dist');
const SSR_BUNDLE = join(ROOT, 'client', 'dist-ssr', 'entry-server.js');

const BASE_URL = 'https://www.clearlyreqs.com';
const TODAY = new Date().toISOString().slice(0, 10);

/** Pages that exist for users/Google but are not in the SSR prerender list. */
const EXTRA_STATIC = [
  { path: '/', priority: '1.0' },
  { path: '/contact', priority: '0.5' },
  { path: '/schedule-demo', priority: '0.5' },
];

function priorityFor(path) {
  if (path === '/blog') return '0.8';
  if (path.startsWith('/blog/')) return '0.7';
  if (path.startsWith('/docs/')) return '0.7';
  if (path.startsWith('/clearly-vs-')) return '0.7';
  if (path === '/brd-generator' || path === '/prd-generator') return '0.9';
  if (path === '/privacy' || path === '/terms') return '0.3';
  if (path.startsWith('/authors/')) return '0.5';
  return '0.6';
}

async function generate() {
  const { PUBLIC_ROUTES, blogPosts } = await import(SSR_BUNDLE);

  // path -> lastmod (blog posts use their published/modified date)
  const blogLastmod = new Map(
    blogPosts.map((p) => [`/blog/${p.slug}`, p.dateModified || p.date])
  );

  const entries = [
    ...EXTRA_STATIC.map((e) => ({
      loc: `${BASE_URL}${e.path}`,
      lastmod: TODAY,
      priority: e.priority,
    })),
    ...PUBLIC_ROUTES.map((path) => ({
      loc: `${BASE_URL}${path}`,
      lastmod: blogLastmod.get(path) || TODAY,
      priority: priorityFor(path),
    })),
  ];

  // De-duplicate by loc (keep first occurrence)
  const seen = new Set();
  const unique = entries.filter((e) =>
    seen.has(e.loc) ? false : (seen.add(e.loc), true)
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique
  .map(
    (e) =>
      `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <priority>${e.priority}</priority>\n  </url>`
  )
  .join('\n')}
</urlset>
`;

  const outPath = join(CLIENT_DIST, 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf-8');
  console.log(`🗺️   Sitemap written: ${unique.length} URLs → client/dist/sitemap.xml`);
}

generate().catch((err) => {
  console.error('Sitemap generation failed:', err);
  process.exit(1);
});
