/**
 * Author Registry — single source of truth for author identity & E-E-A-T.
 *
 * Drives author bio pages (/authors/:slug), the Person schema on blog posts,
 * and author links. `name` must match the `author` string used in
 * blogPosts.ts exactly so posts can be grouped by author.
 */

export interface Author {
  slug: string;
  /** Must match blogPosts.ts `author` exactly. */
  name: string;
  role: string;
  bio: string;
  /** Authoritative external profiles for schema `sameAs` (E-E-A-T). */
  sameAs?: string[];
}

export const authors: Author[] = [
  {
    slug: 'jaehee-song',
    name: 'Jaehee Song',
    role: 'Founder & Principal Engineer, Clearly',
    bio: 'Jaehee Song builds Clearly and writes about applied AI engineering — agents, requirements practice, and shipping software with AI coding tools. Most of the technical deep-dives on this blog come from systems he has built and run in production.',
    sameAs: ['https://www.linkedin.com/in/jaehee-song/'],
  },
  {
    slug: 'sarah-chen',
    name: 'Sarah Chen',
    role: 'Product Contributor',
    bio: 'Sarah Chen writes about product requirements, PRDs, and the product manager workflow — translating product strategy into specs engineering teams can build from.',
  },
  {
    slug: 'michael-rodriguez',
    name: 'Michael Rodriguez',
    role: 'Business Analysis Contributor',
    bio: 'Michael Rodriguez focuses on business requirements documents, stakeholder alignment, and the practices that keep BRDs accurate and actionable.',
  },
  {
    slug: 'alex-kumar',
    name: 'Alex Kumar',
    role: 'Best Practices Contributor',
    bio: 'Alex Kumar writes about requirements best practices — elicitation, scope control, and the tooling decisions that help delivery teams move faster.',
  },
  {
    slug: 'clearly-team',
    name: 'Clearly Team',
    role: 'Clearly Editorial',
    bio: 'Collaborative posts from the Clearly team covering product updates, how-to guidance, and AI-assisted requirements practice.',
  },
];

const bySlug = new Map(authors.map((a) => [a.slug, a]));
const byName = new Map(authors.map((a) => [a.name, a]));

export function getAuthorBySlug(slug: string): Author | undefined {
  return bySlug.get(slug);
}

export function getAuthorByName(name: string): Author | undefined {
  return byName.get(name);
}
