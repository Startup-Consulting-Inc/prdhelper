/**
 * HTML Sitemap Page
 *
 * Human-readable sitemap at /sitemap. Helps crawlers and users discover all pages.
 */

import { Link } from 'react-router-dom';
import { SEO } from '../../components/SEO';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { FileText, BookOpen, Wrench, Users, ArrowRight } from 'lucide-react';

const sections = [
  {
    icon: Wrench,
    title: 'Tools',
    links: [
      { label: 'BRD Generator', path: '/brd-generator', desc: 'Generate Business Requirements Documents with AI' },
      { label: 'PRD Generator', path: '/prd-generator', desc: 'Generate Product Requirements Documents with AI' },
    ],
  },
  {
    icon: BookOpen,
    title: 'Documentation & Guides',
    links: [
      { label: 'How to Write a BRD – Complete Guide', path: '/docs/brd-guide', desc: 'Comprehensive BRD writing guide with examples' },
      { label: 'How to Write a PRD – Complete Guide', path: '/docs/prd-guide', desc: 'Comprehensive PRD writing guide with examples' },
      { label: 'How to Use Clearly', path: '/docs/how-to-use', desc: 'Step-by-step guide to getting started' },
      { label: 'Vibe Coding & AI Requirements', path: '/docs/vibe-coding', desc: 'How Clearly works with AI coding tools' },
    ],
  },
  {
    icon: FileText,
    title: 'Blog',
    links: [
      { label: 'How to Write a BRD in 2026', path: '/blog/how-to-write-a-brd-2026', desc: 'Complete step-by-step BRD guide' },
      { label: 'PRD Template Guide', path: '/blog/prd-template-guide', desc: 'Ultimate PRD template for product managers' },
      { label: 'BRD vs PRD: Key Differences', path: '/blog/brd-vs-prd', desc: 'When to use each document type' },
      { label: 'AI Requirements Gathering', path: '/blog/ai-requirements-gathering', desc: "PM's guide to AI-assisted requirements" },
      { label: 'User Stories vs Requirements', path: '/blog/user-stories-vs-requirements', desc: 'Which does your team need?' },
      { label: '10 Acceptance Criteria Examples', path: '/blog/acceptance-criteria-examples', desc: 'Real examples with templates' },
      { label: 'Requirements Management Tools 2026', path: '/blog/requirements-management-tools-2026', desc: 'Honest comparison of top tools' },
      { label: 'How to Write User Stories', path: '/blog/how-to-write-user-stories', desc: 'User stories developers actually love' },
      { label: 'Functional vs Non-Functional Requirements', path: '/blog/functional-vs-non-functional-requirements', desc: 'Complete guide with examples' },
      { label: 'AI Coding Tools Need Better Requirements', path: '/blog/ai-coding-tools-requirements', desc: 'Why specs matter for Cursor & Claude' },
      { label: '5 BRD Templates by Industry', path: '/blog/brd-templates-by-industry', desc: 'SaaS, healthcare, finance, and more' },
      { label: 'Requirements Elicitation Guide', path: '/blog/requirements-elicitation-guide', desc: '7 proven elicitation techniques' },
      { label: 'How to Reduce Scope Creep', path: '/blog/reduce-scope-creep-requirements', desc: '7 methods with better requirements' },
      { label: '7 Common BRD Mistakes', path: '/blog/brd-mistakes-to-avoid', desc: 'And exactly how to fix them' },
      { label: 'Agile Requirements Documentation', path: '/blog/agile-requirements-documentation', desc: 'Best practices for 2026' },
      { label: 'How to Write an SRS Document', path: '/blog/how-to-write-srs-document', desc: 'SRS that engineers actually read' },
      { label: 'Why Every AI Project Needs a PRD', path: '/blog/why-every-ai-project-needs-prd', desc: 'Requirements in AI-driven development' },
      { label: 'The Complete Guide to Writing BRDs', path: '/blog/complete-guide-to-writing-brds', desc: 'Everything you need to know' },
      { label: 'How to Translate User Needs to Requirements', path: '/blog/translate-user-needs-to-requirements', desc: 'Bridge business and technical teams' },
      { label: 'The Future of AI-Assisted Documentation', path: '/blog/ai-assisted-documentation', desc: 'How AI is transforming requirements' },
    ],
  },
  {
    icon: Users,
    title: 'Company',
    links: [
      { label: 'About Clearly', path: '/about', desc: 'Our mission and team' },
      { label: 'Case Studies', path: '/case-studies', desc: 'How teams use Clearly' },
      { label: 'Schedule a Demo', path: '/schedule-demo', desc: 'See Clearly in action' },
      { label: 'Contact', path: '/contact', desc: 'Get in touch' },
    ],
  },
];

export default function SitemapPage() {
  return (
    <PublicLayout>
      <SEO
        title="Sitemap – All Pages on Clearly"
        description="Complete sitemap of all pages on clearlyreqs.com — BRD and PRD guides, blog posts, tools, and company pages."
        path="/sitemap"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Sitemap</h1>
          <p className="text-gray-600 dark:text-gray-400">
            All pages on <strong>clearlyreqs.com</strong> — the AI-powered BRD and PRD generator.
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.title}>
              <div className="flex items-center gap-3 mb-6">
                <section.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{section.title}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {section.links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors group"
                  >
                    <ArrowRight className="h-4 w-4 text-primary-500 flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">{link.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{link.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
