/**
 * SSR Entry Point — used by scripts/prerender.mjs at build time
 *
 * Renders public routes to HTML using React's renderToString.
 * No browser APIs, Firebase, or tRPC dependencies allowed here.
 */

import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import { PublicRoutes } from './public-routes';

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
