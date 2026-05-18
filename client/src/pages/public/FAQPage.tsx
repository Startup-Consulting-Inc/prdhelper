/**
 * FAQ Page
 *
 * Public FAQ with FAQPage structured data for rich-result eligibility.
 * Answers are kept concise and self-contained so they are extractable by
 * search engines and AI assistants.
 */

import { PublicLayout } from '../../components/layout/PublicLayout';
import { SEO } from '../../components/SEO';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface QA {
  question: string;
  answer: string;
}

const FAQS: QA[] = [
  {
    question: 'What is a BRD (Business Requirements Document)?',
    answer:
      'A Business Requirements Document (BRD) describes the business need, objectives, scope, and success criteria for a project. It explains what the business wants to achieve and why, in language stakeholders can agree on, before any solution is designed or built.',
  },
  {
    question: 'What is a PRD (Product Requirements Document)?',
    answer:
      'A Product Requirements Document (PRD) defines what a product or feature should do — its users, problems, requirements, user flows, and acceptance criteria. Where a BRD captures the business case, a PRD specifies what to build.',
  },
  {
    question: 'What is the difference between a BRD and a PRD?',
    answer:
      'A BRD focuses on the business problem and objectives ("why" and "what outcome"). A PRD focuses on the product solution ("what to build"). The BRD usually comes first and informs the PRD. Many teams need both for larger initiatives.',
  },
  {
    question: 'Is Clearly free to use?',
    answer:
      'Yes. Clearly is free to use — you can generate complete BRDs and PRDs with AI guidance without a credit card. Sign in and start a document from the BRD or PRD generator.',
  },
  {
    question: 'How long does it take to create a requirements document with Clearly?',
    answer:
      'Most users complete a structured BRD or PRD in about 15 to 30 minutes. Clearly guides you through each section with AI prompts, then produces an export-ready document.',
  },
  {
    question: 'Can I export documents from Clearly?',
    answer:
      'Yes. Documents generated in Clearly are export-ready so you can share them with stakeholders or move them into your existing tools and workflows.',
  },
  {
    question: 'Does Clearly work with AI coding tools like Cursor or Claude Code?',
    answer:
      'Yes. Clearly is designed to produce clear, structured requirements that give AI coding tools the context they need. A well-defined BRD or PRD significantly improves the quality of AI-generated code.',
  },
  {
    question: 'Who is Clearly for?',
    answer:
      'Clearly is built for product managers, business analysts, founders, and engineering teams who need to turn ideas into clear requirements quickly — whether for human teams or AI-assisted development.',
  },
];

export default function FAQPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };

  return (
    <PublicLayout>
      <SEO
        title="FAQ – BRDs, PRDs & How Clearly Works"
        description="Answers to common questions about Business Requirements Documents, Product Requirements Documents, and how to use Clearly's free AI generator."
        path="/faq"
        schema={faqSchema}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs items={[{ label: 'FAQ' }]} />

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Everything you need to know about BRDs, PRDs, and using Clearly.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 open:shadow-sm"
            >
              <summary className="cursor-pointer list-none text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                {faq.question}
                <span className="ml-4 text-primary-600 dark:text-primary-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-gray-900 dark:bg-gray-800 p-8 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Still have questions?
          </h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Try Clearly free — generate a complete BRD or PRD in 15 minutes.
          </p>
          <Link
            to="/brd-generator"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold transition-colors"
          >
            Start Free — No Credit Card
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
