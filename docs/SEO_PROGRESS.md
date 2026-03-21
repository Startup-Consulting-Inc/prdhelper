# SEO Optimization Progress — Clearly (clearlyreqs.com)

**Last Updated**: March 20, 2026
**Status**: Phases 1–4 complete and deployed to production

---

## What Was Done

### Phase 1 — Domain & Indexing Fixes

**Problem**: All SEO-critical tags referenced the wrong domain (`clearly-711582759542.us-west1.run.app` instead of `www.clearlyreqs.com`), and the sitemap only contained 3 pages.

**Files changed**: `client/index.html`, `client/public/sitemap.xml`

- Fixed `og:url`, `og:image`, `twitter:url`, `twitter:image`, and JSON-LD `url` fields to use `www.clearlyreqs.com`
- Added `<link rel="canonical" href="https://www.clearlyreqs.com/" />` to `index.html`
- Added AI discovery link tags: `<link rel="alternate" type="text/plain" href="/llms.txt" />`
- Added resource hints: `<link rel="preconnect">` for Firebase and fonts
- Expanded `sitemap.xml` from 3 pages → 37+ pages; removed `/login` and `/signup` (auth pages should not be indexed)
- Enhanced JSON-LD in `index.html`:
  - `SoftwareApplication` schema: added `featureList`, `logo`, `screenshot`, `softwareVersion`
  - Added `Organization` schema
  - Added `WebSite` schema with `SearchAction` (enables Google Sitelinks Search Box)
  - Changed `applicationCategory` from `"Productivity"` → `"BusinessApplication"`

---

### Phase 2 — Technical SEO Foundation

**Problem**: React SPA renders zero content for crawlers. Every page shared identical `<title>` and `<meta description>` tags.

**Files created/changed**: `client/src/components/SEO.tsx`, `client/src/main.tsx`, `client/src/components/blog/BlogPostLayout.tsx`, `server/src/index.ts`, `client/public/llms.txt`, `client/public/ai-llm.txt`

#### Per-Page Meta Tags (`react-helmet-async`)
- Installed `react-helmet-async`
- Wrapped app with `<HelmetProvider>` in `client/src/main.tsx`
- Created reusable `SEO` component (`client/src/components/SEO.tsx`) that injects per-page:
  - `<title>`, `<meta name="description">`, `<link rel="canonical">`
  - `og:title`, `og:description`, `og:url`, `og:image`, `og:type`
  - `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- Added `SEO` to: `LandingPage`, `BlogPage`, `BRDGuidePage`, `PRDGuidePage`, `HowToUsePage`, `VibeCodingPage`, `AboutPage`, `CaseStudiesPage`, `ScheduleDemoPage`, `ContactUsPage`

#### Structured Data (JSON-LD)
- Added `FAQPage` schema to: `LandingPage` (6 questions), `PRDGuidePage` (5 questions), `BRDGuidePage` (5 questions), `BRDGeneratorPage` (6 questions), `PRDGeneratorPage` (6 questions)
- Added `Article` schema to `BlogPostLayout` (per-post, using `slug` prop for canonical URL)
- Added `BreadcrumbList` schema via the `Breadcrumbs` component

#### AI Bot Discovery Files
- `client/public/llms.txt` — standard format; entity description, features, target users, key URLs
- `client/public/ai-llm.txt` — extended format; comparison table, citation guidance for Perplexity/ChatGPT/Gemini

#### Server Performance
- Added `compression` middleware (Gzip) to Express server (`server/src/index.ts`)
- Added `Cache-Control: public, max-age=31536000, immutable` for static assets (`/assets/`)

---

### Phase 3 — Content & Landing Pages

**Problem**: No pages targeting high-commercial-intent keywords like "BRD generator" or "PRD generator".

**Files created**: `BRDGeneratorPage.tsx`, `PRDGeneratorPage.tsx`, 16 blog post components

#### Keyword Landing Pages
- `/brd-generator` — targets "BRD generator"; includes how-it-works, what's included, comparison table (Clearly vs Manual vs ChatGPT), FAQ with `FAQPage` JSON-LD
- `/prd-generator` — targets "PRD generator"; includes Plain Mode vs Technical Mode explainer, AI coding tools angle, FAQ with `FAQPage` JSON-LD

#### Homepage Optimization (`LandingPage.tsx`)
- Updated H1 to keyword-targeted text
- Added "What is a PRD?", "What is a BRD?", "BRD vs PRD" H2 sections with comparison table
- These sections directly answer what AI search bots cite for definitional queries

#### Blog — 20 Posts Total

| Slug | Title | Date |
|------|-------|------|
| `how-to-write-a-brd-2026` | How to Write a BRD in 2026: Complete Step-by-Step Guide | Mar 18, 2026 |
| `prd-template-guide` | PRD Template: The Ultimate Guide for Product Managers | Mar 15, 2026 |
| `brd-vs-prd` | BRD vs PRD: What's the Difference and When to Use Each | Mar 12, 2026 |
| `ai-requirements-gathering` | How to Use AI for Requirements Gathering | Mar 10, 2026 |
| `user-stories-vs-requirements` | User Stories vs Requirements: Which Does Your Team Need? | Mar 8, 2026 |
| `acceptance-criteria-examples` | 10 Acceptance Criteria Examples With Templates | Mar 5, 2026 |
| `requirements-management-tools-2026` | Best Requirements Management Tools in 2026 | Mar 3, 2026 |
| `how-to-write-user-stories` | How to Write User Stories Developers Actually Love | Mar 1, 2026 |
| `functional-vs-non-functional-requirements` | Functional vs Non-Functional Requirements | Mar 17, 2026 |
| `ai-coding-tools-requirements` | Why AI Coding Tools Need Better Requirements First | Mar 14, 2026 |
| `brd-templates-by-industry` | 5 BRD Templates by Industry | Mar 11, 2026 |
| `requirements-elicitation-guide` | Requirements Elicitation: 7 Proven Techniques | Mar 9, 2026 |
| `reduce-scope-creep-requirements` | How to Reduce Scope Creep with Better Requirements | Mar 7, 2026 |
| `brd-mistakes-to-avoid` | 7 Common BRD Mistakes (And How to Fix Them) | Mar 4, 2026 |
| `agile-requirements-documentation` | Agile Requirements Documentation Best Practices | Mar 2, 2026 |
| `how-to-write-srs-document` | How to Write an SRS Document Engineers Actually Read | Feb 28, 2026 |
| `why-every-ai-project-needs-prd` | Why Every AI Project Needs a PRD | Jan 15, 2024 |
| `complete-guide-to-writing-brds` | The Complete Guide to Writing BRDs | Jan 10, 2024 |
| `translate-user-needs-to-requirements` | How to Translate User Needs into Technical Requirements | Jan 5, 2024 |
| `ai-assisted-documentation` | The Future of Requirements: AI-Assisted Documentation | Jan 20, 2024 |

---

### Phase 4 — Authority & Structural Features

**Files created**: `Breadcrumbs.tsx`, `SitemapPage.tsx`, `ClearlyVsChatPRDPage.tsx`, `ClearlyVsManualPage.tsx`, `ClearlyVsConfluencePage.tsx`

#### Breadcrumb Navigation
- `Breadcrumbs` component (`client/src/components/Breadcrumbs.tsx`)
- Renders accessible `<nav>` + injects `BreadcrumbList` JSON-LD schema via Helmet
- Usage: `<Breadcrumbs items={[{ label: 'Blog', path: '/blog' }, { label: 'Post Title' }]} />`

#### HTML Sitemap
- `/sitemap` page listing all public pages organized by section (Tools, Docs, Blog, Company)
- Helps crawlers discover all pages; useful for users too

#### Comparison Pages
- `/clearly-vs-chatprd` — feature table, quick verdict, core difference section
- `/clearly-vs-manual` — time cost stats (2–5 days vs 15–30 min), feature table, hidden cost analysis
- `/clearly-vs-confluence` — TL;DR callout ("use both"), feature table, purpose-built vs general wiki explanation

---

## Remaining Tasks

### 1. Google Search Console Setup ⚡ High Priority

Google Search Console (GSC) is free and essential — without it you cannot see which pages are indexed, which queries drive traffic, or fix crawl errors.

**Steps:**
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Click **Add property** → choose **URL prefix** → enter `https://www.clearlyreqs.com`
3. Choose verification method: **HTML tag** (easiest for this setup)
   - Copy the `<meta name="google-site-verification" content="..." />` tag
   - Add it to `client/index.html` inside `<head>` (place before other meta tags)
   - Deploy to production
   - Click **Verify** in GSC
4. Once verified, go to **Sitemaps** (left sidebar) → enter `sitemap.xml` → click **Submit**
5. Go to **URL Inspection** → paste `https://www.clearlyreqs.com/` → click **Request Indexing**
6. Repeat URL Inspection for high-priority pages:
   - `https://www.clearlyreqs.com/brd-generator`
   - `https://www.clearlyreqs.com/prd-generator`
   - `https://www.clearlyreqs.com/docs/brd-guide`
   - `https://www.clearlyreqs.com/docs/prd-guide`
   - `https://www.clearlyreqs.com/blog/how-to-write-a-brd-2026`

**What to check weekly:**
- **Coverage** → make sure pages move from "Discovered" → "Crawled" → "Indexed"
- **Core Web Vitals** → flag any pages with poor LCP/CLS scores
- **Search results** → which queries Clearly appears for and at what position

---

### 2. GA4 Analytics Setup ⚡ High Priority

Without analytics you cannot measure whether the SEO work is driving traffic or signups.

**Steps:**
1. Go to [analytics.google.com](https://analytics.google.com) → create a new **GA4 property** for `clearlyreqs.com`
2. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)
3. Add to `client/index.html` inside `<head>`:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```
4. Deploy to production
5. In GA4, go to **Admin → Data Streams** → verify data is flowing (can take 24–48 hours)

**Key events to configure in GA4:**
- **Conversion event**: mark `sign_up` as a conversion (tracks free trial signups)
- **Custom event**: track CTA button clicks on `/brd-generator` and `/prd-generator`
- **Engagement**: track scroll depth on blog posts (built-in with GA4)

**Connect GA4 to GSC:**
- In GA4 → **Admin → Search Console Links** → link your GSC property
- This lets you see which search queries lead to which pages in GA4

---

### 3. Apply Breadcrumbs to Blog Posts and Docs Pages — Medium Priority

The `Breadcrumbs` component was created but not yet added to individual blog post pages or docs pages. This adds `BreadcrumbList` JSON-LD schema (eligible for Google Rich Results) and improves UX.

**How to add to a blog post:**

```tsx
// In any BlogPostLayout usage or directly in a post component:
import { Breadcrumbs } from '../../../components/Breadcrumbs';

// Inside the component, above the post content:
<Breadcrumbs items={[
  { label: 'Blog', path: '/blog' },
  { label: 'How to Write a BRD in 2026' }, // no path = current page
]} />
```

**Pages to update:**
- All 20 blog post components in `client/src/pages/public/blog/`
- `BRDGuidePage.tsx` → `[{ label: 'Docs', path: '/docs' }, { label: 'BRD Guide' }]`
- `PRDGuidePage.tsx` → `[{ label: 'Docs', path: '/docs' }, { label: 'PRD Guide' }]`
- `HowToUsePage.tsx` → `[{ label: 'Docs', path: '/docs' }, { label: 'How to Use Clearly' }]`
- `VibeCodingPage.tsx` → `[{ label: 'Docs', path: '/docs' }, { label: 'Vibe Coding & AI Requirements' }]`

**Placement**: Inside `<PublicLayout>` or `<BlogPostLayout>`, at the top of the content section, before the `<h1>`.

---

### 4. RSS Feed — Medium Priority

An RSS feed at `/blog/rss.xml` lets aggregators and AI bots discover new posts automatically. Some backlink sources (RSS directories) also pick up new content from feeds.

**Implementation**: Add a server-side endpoint (or generate a static file) that returns valid RSS XML.

**Option A — Static file** (simplest):
1. Create `client/public/blog/rss.xml` manually and update it when new posts are published
2. Add to `client/index.html`: `<link rel="alternate" type="application/rss+xml" title="Clearly Blog" href="/blog/rss.xml" />`

**Option B — Server endpoint** (auto-updating):
1. Add a route in `server/src/routes/` or directly in `server/src/index.ts`:
   ```ts
   app.get('/blog/rss.xml', (req, res) => {
     const posts = [...]; // array of { title, slug, excerpt, date, author }
     const rss = `<?xml version="1.0" encoding="UTF-8"?>
   <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
     <channel>
       <title>Clearly Blog</title>
       <link>https://www.clearlyreqs.com/blog</link>
       <description>Requirements documentation and AI development insights</description>
       <language>en-us</language>
       <atom:link href="https://www.clearlyreqs.com/blog/rss.xml" rel="self" type="application/rss+xml" />
       ${posts.map(p => `
       <item>
         <title>${p.title}</title>
         <link>https://www.clearlyreqs.com/blog/${p.slug}</link>
         <description>${p.excerpt}</description>
         <pubDate>${new Date(p.date).toUTCString()}</pubDate>
         <guid>https://www.clearlyreqs.com/blog/${p.slug}</guid>
       </item>`).join('')}
     </channel>
   </rss>`;
     res.set('Content-Type', 'application/rss+xml');
     res.send(rss);
   });
   ```
2. Add `<link rel="alternate" type="application/rss+xml" href="/blog/rss.xml" />` to `client/index.html`

---

### 5. Directory Submissions — Medium Priority (Month 2)

Listings on software directories create backlinks and drive discovery from buyers actively searching for tools.

**Target directories (free or freemium):**

| Directory | URL | Notes |
|-----------|-----|-------|
| Product Hunt | producthunt.com | Launch with full product page; schedule for a Tuesday–Thursday |
| G2 | g2.com | Requires company profile; category: "Business Requirements Tools" |
| Capterra | capterra.com | Free listing; category: "Requirements Management" |
| AlternativeTo | alternativeto.net | Add as alternative to Confluence, Jira, ChatPRD |
| SaaSHub | saashub.com | Easy self-submission |
| GetApp | getapp.com | Gartner-owned, same profile as Capterra |
| TrustRadius | trustradius.com | Free vendor profile |
| Slant | slant.co | Community-driven; add to "best requirements tools" lists |

**For each listing include:**
- Product description (200–300 words, keyword-rich but natural)
- Screenshots (at least 3: wizard, generated BRD, export screen)
- Pricing: "Free trial, then paid"
- Category: Requirements Management, Business Analysis, Product Management

---

### 6. Bing Webmaster Tools — Low Priority

Similar to Google Search Console but for Bing (which also powers DuckDuckGo).

**Steps:**
1. Go to [bing.com/webmasters](https://bing.com/webmasters)
2. Add site → verify via XML file or meta tag
3. Submit sitemap: `https://www.clearlyreqs.com/sitemap.xml`
4. Bing has an **Import from Google Search Console** button — use this once GSC is set up to copy all settings instantly

---

### 7. Server-Side Rendering (SSR) or Pre-rendering — Low Priority (Long Term)

The root cause of crawlability issues is that Clearly is a client-side SPA — crawlers fetch raw HTML that contains no content. While `react-helmet-async` fixes meta tags, the body content of blog posts and landing pages is still JavaScript-rendered.

**Impact**: Google's crawler handles JS reasonably well but with a crawl budget delay. AI bots (Perplexity, ChatGPT Browse) often skip JS-heavy pages entirely.

**Options (in order of effort):**

1. **Prerendering service** (lowest effort): Use [Prerender.io](https://prerender.io) or [Rendertron](https://github.com/GoogleChrome/rendertron) as a proxy. Detects bot user agents and serves pre-rendered HTML. Configure in Cloud Run or as a Cloud Function.

2. **Vite SSG** (medium effort): Use `vite-plugin-ssg` or `vite-ssg` to statically generate HTML for all public routes at build time. No server changes needed — generates static HTML files that get served directly.
   ```bash
   npm install vite-ssg
   ```
   Then update `client/vite.config.ts` and replace `ReactDOM.render` with the SSG entry point. All public routes (blog, docs, landing pages) get pre-rendered HTML.

3. **Migrate to Next.js** (highest effort): Full SSR/SSG with App Router. Best long-term SEO outcome but requires significant refactoring.

**Recommended path**: Start with Vite SSG for the public pages only. The authenticated app (`/dashboard`, `/projects`) can remain client-rendered.

---

## Summary Metrics

| Metric | Before | After |
|--------|--------|-------|
| Indexed pages (sitemap) | 3 | 37+ |
| Pages with unique meta tags | 0 | 30+ |
| Structured data schemas | 1 (basic SoftwareApp) | 6 types |
| Blog posts | 4 | 20 |
| Keyword landing pages | 0 | 2 |
| Comparison pages | 0 | 3 |
| AI bot discovery files | 0 | 2 |
| Server compression | None | Gzip |
| Correct domain in SEO tags | ❌ | ✅ |
