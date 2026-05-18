/**
 * SEO Component
 *
 * Reusable component for per-page meta tags, canonical URLs, Open Graph,
 * and JSON-LD structured data.
 *
 * Every page rendered through this component emits sitewide Organization +
 * WebSite schema. Pass `schema` for page-specific structured data (FAQPage,
 * SoftwareApplication, etc.) — accepts a single object or an array.
 */

import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  type?: string;
  image?: string;
  /** Page-specific JSON-LD (object or array of objects). */
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

const BASE_URL = 'https://www.clearlyreqs.com';

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Clearly',
  url: BASE_URL,
  logo: `${BASE_URL}/og-image.png`,
  description:
    'Clearly is an AI-powered BRD and PRD generator that helps product and business teams write requirements documents in minutes.',
};

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Clearly',
  url: BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/blog?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

/** SoftwareApplication schema for the product/tool pages (free app). */
export const SOFTWARE_APPLICATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Clearly',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: BASE_URL,
  description:
    'AI-powered BRD and PRD generator. Create structured, export-ready requirements documents in minutes.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
} satisfies Record<string, unknown>;

export function SEO({
  title,
  description,
  path,
  type = 'website',
  image = '/og-image.png',
  schema,
}: SEOProps) {
  const canonicalUrl = `${BASE_URL}${path}`;
  const fullTitle = `${title} | Clearly`;
  const pageSchemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={`${BASE_URL}${image}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${BASE_URL}${image}`} />

      {/* Structured data */}
      <script type="application/ld+json">{JSON.stringify(ORGANIZATION_SCHEMA)}</script>
      <script type="application/ld+json">{JSON.stringify(WEBSITE_SCHEMA)}</script>
      {pageSchemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
