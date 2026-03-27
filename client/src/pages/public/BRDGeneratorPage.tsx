/**
 * BRD Generator Landing Page
 *
 * Keyword-targeted landing page for "BRD generator" searches.
 * Target: product managers, business analysts, startup founders.
 */

import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SEO } from '../../components/SEO';
import { PublicLayout } from '../../components/layout/PublicLayout';
import {
  CheckCircle,
  ArrowRight,
  Zap,
  FileText,
  Users,
  Clock,
  Target,
  Sparkles,
} from 'lucide-react';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a BRD generator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A BRD generator is a tool that automates the creation of Business Requirements Documents. Instead of writing a BRD from scratch, you answer guided questions and the tool produces a complete, structured document. Clearly uses AI to generate professional BRDs in 15-30 minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to generate a BRD with Clearly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most users complete their first BRD in 15-30 minutes. The AI wizard asks targeted questions about your project, and once you\'ve answered them, Clearly generates a complete Business Requirements Document instantly.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should a BRD include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Business Requirements Document should include: executive summary, project scope, business objectives, stakeholder list, functional requirements, non-functional requirements, constraints and assumptions, success criteria, and a glossary. Clearly automatically generates all of these sections.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Clearly free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Clearly offers a free trial with no credit card required. You can generate your first BRD immediately after signing up.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I export my BRD to Word or PDF?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Clearly supports export to PDF and Word (.docx) formats, making it easy to share your BRD with stakeholders and upload to your document management system.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is Clearly different from writing a BRD in Word or Google Docs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Writing a BRD manually in Word takes days and produces inconsistent results. Clearly uses AI to guide you through the process with smart questions, ensuring you don\'t miss critical sections. The output is structured, comprehensive, and ready to share — in 15-30 minutes instead of 2-3 days.',
      },
    },
  ],
};

export default function BRDGeneratorPage() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <SEO
        title="BRD Generator – Create Business Requirements Documents with AI"
        description="Generate professional Business Requirements Documents in 15-30 minutes with AI. Clearly's BRD generator guides you from idea to complete document. Free trial."
        path="/brd-generator"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-gray-950 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            AI-Powered BRD Generator
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            BRD Generator
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-4">
            Create a professional Business Requirements Document in 15–30 minutes — not 3 days.
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-500 mb-10 max-w-2xl mx-auto">
            Answer guided questions. Clearly's AI writes your BRD automatically — complete, structured, and ready to share with stakeholders.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-lg transition-colors"
            >
              Generate My BRD Free
              <ArrowRight className="h-5 w-5" />
            </button>
            <Link
              to="/docs/brd-guide"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-lg hover:border-emerald-500 transition-colors"
            >
              Read BRD Guide
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
            No credit card required · Free trial
          </p>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
            Why Writing BRDs Manually Fails
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: 'Takes 2–3 Days',
                description: 'Manually writing a BRD from a blank document requires hours of research, structuring, and writing. Most teams skip it or write a weak version.',
                color: 'text-red-500',
              },
              {
                icon: FileText,
                title: 'Inconsistent Quality',
                description: 'Without a systematic process, BRDs miss critical sections — constraints, assumptions, success criteria — leading to project failures later.',
                color: 'text-red-500',
              },
              {
                icon: Users,
                title: 'Stakeholder Misalignment',
                description: 'Vague requirements mean engineers build the wrong thing. Rework is expensive — 30× cheaper to fix in the requirements phase than after development.',
                color: 'text-red-500',
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-900">
                <item.icon className={`h-10 w-10 ${item.color} mx-auto mb-4`} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Clearly Fixes It */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4">
            How Clearly's BRD Generator Works
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            A guided AI wizard replaces the blank-page problem. Answer questions, get a complete BRD.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Sign up free', description: 'Create your account in 30 seconds. No credit card required.' },
              { step: '2', title: 'Start a BRD project', description: 'Select "Business Requirements Document" and name your project.' },
              { step: '3', title: 'Answer AI questions', description: 'Clearly asks smart questions about your goals, stakeholders, scope, and constraints.' },
              { step: '4', title: 'Get your BRD', description: 'Download a complete, structured BRD in PDF or Word format.' },
            ].map((item) => (
              <div key={item.step} className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 bg-emerald-600 text-white font-bold text-lg rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's in a Clearly BRD */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                What Your BRD Will Include
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Clearly generates every section that stakeholders and auditors expect to see — nothing missing, nothing padded.
              </p>
              <div className="space-y-3">
                {[
                  'Executive Summary',
                  'Business Objectives & Goals',
                  'Project Scope (in-scope and out-of-scope)',
                  'Stakeholder List & Roles',
                  'Functional Requirements',
                  'Non-Functional Requirements',
                  'Constraints & Assumptions',
                  'Success Criteria & KPIs',
                  'Risks & Mitigation Strategies',
                  'Glossary of Terms',
                ].map((section) => (
                  <div key={section} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{section}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-8 border border-emerald-100 dark:border-emerald-900">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">Why teams choose Clearly</span>
              </div>
              <div className="space-y-4">
                {[
                  { metric: '15–30 min', label: 'to create a complete BRD' },
                  { metric: '90%', label: 'faster than manual writing' },
                  { metric: '10×', label: 'more complete than average BRDs' },
                  { metric: '2 modes', label: 'Plain language or technical depth' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 w-24 flex-shrink-0">{item.metric}</span>
                    <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
            Clearly vs Manual BRD Writing
          </h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="text-left p-4 text-gray-700 dark:text-gray-300 font-semibold">Aspect</th>
                  <th className="text-center p-4 text-emerald-600 dark:text-emerald-400 font-semibold">Clearly</th>
                  <th className="text-center p-4 text-gray-500 dark:text-gray-400 font-semibold">Manual (Word/Docs)</th>
                  <th className="text-center p-4 text-gray-500 dark:text-gray-400 font-semibold">Generic ChatGPT</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { aspect: 'Time to complete', clearly: '15–30 min', manual: '2–3 days', gpt: '2–4 hours' },
                  { aspect: 'Guided process', clearly: '✅ Yes', manual: '❌ No', gpt: '⚠️ Partial' },
                  { aspect: 'Consistent structure', clearly: '✅ Always', manual: '❌ Varies', gpt: '⚠️ Varies' },
                  { aspect: 'All required sections', clearly: '✅ Automatic', manual: '❌ Easy to miss', gpt: '⚠️ Requires prompting' },
                  { aspect: 'Export PDF/Word', clearly: '✅ Yes', manual: '✅ Yes', gpt: '❌ No' },
                  { aspect: 'Version history', clearly: '✅ Built-in', manual: '❌ Manual', gpt: '❌ No' },
                ].map((row, i) => (
                  <tr key={row.aspect} className={i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}>
                    <td className="p-4 text-gray-700 dark:text-gray-300 font-medium">{row.aspect}</td>
                    <td className="p-4 text-center text-emerald-700 dark:text-emerald-300 font-medium">{row.clearly}</td>
                    <td className="p-4 text-center text-gray-500 dark:text-gray-400">{row.manual}</td>
                    <td className="p-4 text-center text-gray-500 dark:text-gray-400">{row.gpt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
            Who Uses Clearly's BRD Generator?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Product Managers',
                description: 'Create complete BRDs before sprint planning. Align engineering and business stakeholders on requirements before any code is written.',
              },
              {
                icon: FileText,
                title: 'Business Analysts',
                description: 'Automate the tedious parts of requirements elicitation. Spend time on analysis, not document formatting.',
              },
              {
                icon: Users,
                title: 'Startup Founders',
                description: 'Document your product vision professionally without a dedicated BA team. Investor-ready requirements in under an hour.',
              },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <item.icon className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
            BRD Generator FAQ
          </h2>
          <div className="space-y-6">
            {faqSchema.mainEntity.map((item) => (
              <div key={item.name} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{item.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-emerald-600 dark:bg-emerald-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Generate Your BRD in Minutes
          </h2>
          <p className="text-emerald-100 text-lg mb-8">
            Stop spending days on documents. Let AI handle the structure so you can focus on the strategy.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl text-lg hover:bg-gray-100 transition-colors"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5" />
          </button>
          <p className="mt-4 text-emerald-200 text-sm">No credit card required</p>
        </div>
      </section>
    </PublicLayout>
  );
}
