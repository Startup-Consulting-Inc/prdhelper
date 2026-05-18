/**
 * SSR Entry Point — used by scripts/prerender.mjs at build time
 *
 * Renders public routes to HTML using React's renderToString.
 * No browser APIs, Firebase, or tRPC dependencies allowed here.
 */

import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import { PublicRoutes, PUBLIC_ROUTES } from './public-routes';
import { blogPosts } from './data/blogPosts';

/** Consumed by scripts/prerender.mjs and scripts/generate-sitemap.mjs so the
 *  route list and sitemap can never drift from the registry. */
export { PUBLIC_ROUTES, blogPosts };

export interface RenderResult {
  html: string;
  helmetContext: { helmet?: HelmetServerState };
}

export function render(url: string): RenderResult {
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <PublicRoutes />
      </StaticRouter>
    </HelmetProvider>
  );

  return { html, helmetContext };
}
