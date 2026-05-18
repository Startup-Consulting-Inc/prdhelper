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

async function prerender() {
  // Load the base index.html from the client build
  const indexHtml = readFileSync(join(CLIENT_DIST, 'index.html'), 'utf-8');

  // Import the SSR bundle. PUBLIC_ROUTES is derived from the blog/route
  // registry (single source of truth) so this list can never drift.
  const { render, PUBLIC_ROUTES } = await import(SSR_BUNDLE);
  const ROUTES = PUBLIC_ROUTES;

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
