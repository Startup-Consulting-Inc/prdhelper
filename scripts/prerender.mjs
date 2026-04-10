/**
 * Static Prerender Script
 *
 * Generates prerendered HTML for all public routes using the SSR bundle.
 * Run after `vite build` and `vite build --ssr` to produce static HTML files
 * that AI crawlers and search bots can read.
 *
 * Usage:
 *   node scripts/prerender.mjs
 *
 * Output:
 *   client/dist/prerendered/<route>.html
 *   client/dist/prerendered/_manifest.json  (list of all prerendered routes)
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CLIENT_DIST = join(ROOT, 'client', 'dist');
const SSR_BUNDLE = join(ROOT, 'client', 'dist-ssr', 'entry-server.js');
const PRERENDER_DIR = join(CLIENT_DIST, 'prerendered');

/** All public routes that should be prerendered */
const ROUTES = [
  // Public pages
  '/about',
  '/case-studies',
  '/blog',
  '/sitemap',
  // Blog posts
  '/blog/brd-vs-prd',
  '/blog/how-to-write-a-brd-2026',
  '/blog/prd-template-guide',
  '/blog/ai-requirements-gathering',
  '/blog/user-stories-vs-requirements',
  '/blog/acceptance-criteria-examples',
  '/blog/requirements-management-tools-2026',
  '/blog/how-to-write-user-stories',
  '/blog/functional-vs-non-functional-requirements',
  '/blog/ai-coding-tools-requirements',
  '/blog/brd-templates-by-industry',
  '/blog/requirements-elicitation-guide',
  '/blog/reduce-scope-creep-requirements',
  '/blog/brd-mistakes-to-avoid',
  '/blog/agile-requirements-documentation',
  '/blog/how-to-write-srs-document',
  '/blog/ai-assisted-documentation',
  '/blog/why-every-ai-project-needs-prd',
  '/blog/complete-guide-to-writing-brds',
  '/blog/translate-user-needs-to-requirements',
  '/blog/defining-the-right-problem-ai-era',
  // Tool pages
  '/brd-generator',
  '/prd-generator',
  // Comparison pages
  '/clearly-vs-chatprd',
  '/clearly-vs-manual',
  '/clearly-vs-confluence',
  // Docs pages
  '/docs/brd',
  '/docs/prd',
  '/docs/brd-guide',
  '/docs/prd-guide',
  '/docs/vibe-coding',
  '/docs/how-to-use',
  '/docs/software-development-process',
  '/docs/software-development-process-guide',
];

async function prerender() {
  // Load the base index.html from the client build
  const indexHtml = readFileSync(join(CLIENT_DIST, 'index.html'), 'utf-8');

  // Import the SSR bundle
  const { render } = await import(SSR_BUNDLE);

  // Ensure output directory exists
  mkdirSync(PRERENDER_DIR, { recursive: true });

  const manifest = [];

  for (const url of ROUTES) {
    try {
      const { html, helmetContext } = render(url);
      const { helmet } = helmetContext;

      // Build the prerendered HTML by injecting into index.html
      let output = indexHtml;

      // Strip any existing canonical (prevents duplicates if index.html ever gets one re-added)
      output = output.replace(/<link rel="canonical"[^>]*\/?>/gi, '');

      // Inject rendered app HTML into #root
      output = output.replace(
        '<div id="root"></div>',
        `<div id="root">${html}</div>`
      );

      // Override <title> from Helmet
      if (helmet?.title?.toString()) {
        const helmetTitle = helmet.title.toString();
        output = output.replace(
          /<title>[^<]*<\/title>/,
          helmetTitle
        );
      }

      // Inject Helmet meta tags before closing </head>
      const helmetMeta = [
        helmet?.meta?.toString() ?? '',
        helmet?.link?.toString() ?? '',
        helmet?.script?.toString() ?? '',
      ].filter(Boolean).join('\n    ');

      if (helmetMeta) {
        output = output.replace('</head>', `    ${helmetMeta}\n  </head>`);
      }

      // Save to prerendered/<slug>.html  (e.g. /blog/brd-vs-prd → blog-brd-vs-prd.html)
      const filename = url.slice(1).replace(/\//g, '-') + '.html';
      const outputPath = join(PRERENDER_DIR, filename);
      writeFileSync(outputPath, output, 'utf-8');

      manifest.push({ url, file: filename });
      console.log(`✅  ${url}`);
    } catch (err) {
      console.error(`❌  ${url}:`, err.message);
    }
  }

  // Write manifest so the server knows which routes are prerendered
  writeFileSync(
    join(PRERENDER_DIR, '_manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );

  console.log(`\n🎉  Prerendered ${manifest.length}/${ROUTES.length} routes → client/dist/prerendered/`);
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
