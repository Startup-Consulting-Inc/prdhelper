/**
 * PRD Generator Landing Page
 *
 * Keyword-targeted landing page for "PRD generator" searches.
 * Target: product managers, startup founders, development teams.
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
  Code,
} from 'lucide-react';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a PRD generator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A PRD generator is a tool that automates the creation of Product Requirements Documents. Instead of writing a PRD from scratch, you answer guided questions about your product or feature and the tool produces a complete, structured document. Clearly uses AI to generate professional PRDs in 15-30 minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should a PRD include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Product Requirements Document should include: product overview, problem statement, goals and success metrics, target users and personas, user stories, functional requirements, non-functional requirements, technical constraints, acceptance criteria, and out-of-scope items. Clearly generates all of these sections automatically.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to create a PRD with Clearly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most users complete their first PRD in 15-30 minutes. The AI wizard asks targeted questions about your feature or product, and once you\'ve answered them, Clearly generates a complete Product Requirements Document instantly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can Clearly generate PRDs for AI coding tools like Cursor or Claude?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Clearly has a Plain Mode that generates AI-ready context files and coding prompts specifically designed for AI coding tools like Cursor, Claude, and GitHub Copilot. Better PRDs produce better AI-generated code with fewer revisions.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between a PRD and a BRD?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A BRD (Business Requirements Document) focuses on business objectives and stakeholder needs — the "why" behind a project. A PRD (Product Requirements Document) focuses on the product features and technical requirements — the "what" and "how." BRDs are typically written before PRDs and read by business stakeholders; PRDs are read by product managers and developers.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the PRD generator free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Clearly offers a free trial with no credit card required. You can generate your first PRD immediately after signing up.',
      },
    },
  ],
};

export default function PRDGeneratorPage() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <SEO
        title="AI PRD Generator: Product Requirements in Minutes (Free Trial)"
        description="AI PRD tool with a guided wizard—turn an idea into a structured Product Requirements Document for engineering, QA, and AI coding tools. Export-ready PRDs. Try Clearly free, no card."
        path="/prd-generator"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/30 dark:to-gray-950 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            AI-Powered PRD Generator
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            PRD Generator
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-4">
            Create a professional Product Requirements Document in 15–30 minutes.
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-500 mb-10 max-w-2xl mx-auto">
            Answer guided questions about your product or feature. Clearly's AI writes a complete PRD — with user stories, acceptance criteria, and technical requirements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-lg transition-colors"
            >
              Generate My PRD Free
              <ArrowRight className="h-5 w-5" />
            </button>
            <Link
              to="/docs/prd-guide"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-lg hover:border-purple-500 transition-colors"
            >
              Read PRD Guide
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
            Why Most PRDs Fail Before Development Starts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: 'Takes Days to Write',
                description: 'A thorough PRD covering user stories, acceptance criteria, and edge cases takes 2-3 days minimum. Most teams skip sections due to time pressure.',
                color: 'text-red-500',
              },
              {
                icon: FileText,
                title: 'Missing Critical Sections',
                description: 'Without a structured process, PRDs commonly miss non-functional requirements, edge cases, and out-of-scope boundaries — causing scope creep and rework.',
                color: 'text-red-500',
              },
              {
                icon: Code,
                title: 'Poor AI Code Quality',
                description: 'Vague PRDs produce vague AI-generated code. When using Cursor, Claude, or Copilot, the quality of your requirements directly determines the quality of the output.',
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

      {/* How Clearly Works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4">
            How Clearly's PRD Generator Works
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            A guided AI wizard asks the right questions. You get a complete PRD — no blank page, no guesswork.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Sign up free', description: 'Create your account in 30 seconds. No credit card required.' },
              { step: '2', title: 'Start a PRD project', description: 'Select "Product Requirements Document" and describe your feature or product.' },
              { step: '3', title: 'Answer AI questions', description: 'Clearly asks targeted questions about users, goals, features, and technical requirements.' },
              { step: '4', title: 'Download your PRD', description: 'Export a complete, structured PRD in PDF or Word format — ready to share.' },
            ].map((item) => (
              <div key={item.step} className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 bg-purple-600 text-white font-bold text-lg rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                What Your PRD Will Include
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Clearly generates every section engineers and stakeholders expect — structured to the industry standard and ready for sprint planning.
              </p>
              <div className="space-y-3">
                {[
                  'Product Overview & Problem Statement',
                  'Goals, Success Metrics & KPIs',
                  'Target Users & Personas',
                  'User Stories (with acceptance criteria)',
                  'Functional Requirements',
                  'Non-Functional Requirements',
                  'Technical Constraints',
                  'Out-of-Scope Items',
                  'Dependencies & Risks',
                  'AI Coding Prompts (Plain Mode)',
                  'Sprint-Ready Task Lists (Technical Mode)',
                ].map((section) => (
                  <div key={section} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{section}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 rounded-2xl p-8 border border-purple-100 dark:border-purple-900">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">Two modes for every team</span>
              </div>
              <div className="space-y-6">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Plain Mode</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    For non-technical product managers and founders. Uses accessible language, generates AI coding prompts ready for Cursor or Claude.
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Technical Mode</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    For architects and dev leads. Captures technical specifications and generates sprint-ready task lists with dependencies and effort estimates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
            Clearly vs Manual PRD Writing
          </h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="text-left p-4 text-gray-700 dark:text-gray-300 font-semibold">Aspect</th>
                  <th className="text-center p-4 text-purple-600 dark:text-purple-400 font-semibold">Clearly</th>
                  <th className="text-center p-4 text-gray-500 dark:text-gray-400 font-semibold">Manual (Notion/Word)</th>
                  <th className="text-center p-4 text-gray-500 dark:text-gray-400 font-semibold">Generic ChatGPT</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { aspect: 'Time to complete', clearly: '15–30 min', manual: '2–3 days', gpt: '2–4 hours' },
                  { aspect: 'Guided questions', clearly: '✅ Yes', manual: '❌ No', gpt: '⚠️ Partial' },
                  { aspect: 'User stories + AC', clearly: '✅ Automatic', manual: '❌ Manual', gpt: '⚠️ Hit or miss' },
                  { aspect: 'AI coding prompts', clearly: '✅ Built-in', manual: '❌ No', gpt: '⚠️ Requires extra prompting' },
                  { aspect: 'Sprint task lists', clearly: '✅ Technical Mode', manual: '❌ No', gpt: '❌ No' },
                  { aspect: 'Version history', clearly: '✅ Built-in', manual: '❌ Manual', gpt: '❌ No' },
                ].map((row, i) => (
                  <tr key={row.aspect} className={i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}>
                    <td className="p-4 text-gray-700 dark:text-gray-300 font-medium">{row.aspect}</td>
                    <td className="p-4 text-center text-purple-700 dark:text-purple-300 font-medium">{row.clearly}</td>
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
            Who Uses Clearly's PRD Generator?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Product Managers',
                description: 'Write complete PRDs for every feature sprint. Get engineering alignment before development starts, not after.',
              },
              {
                icon: Code,
                title: 'Developers using AI tools',
                description: 'Cursor, Claude, Copilot — your AI coding output is only as good as your requirements. Clearly generates AI-ready specifications.',
              },
              {
                icon: Users,
                title: 'Startup Founders',
                description: 'Document exactly what you want built without a dedicated PM. Clearly guides you through every question so nothing gets missed.',
              },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <item.icon className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
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
            PRD Generator FAQ
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
      <section className="py-20 bg-purple-600 dark:bg-purple-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Generate Your PRD in Minutes
          </h2>
          <p className="text-purple-100 text-lg mb-8">
            Stop writing PRDs from scratch. Let AI handle the structure so your team can ship faster.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl text-lg hover:bg-gray-100 transition-colors"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5" />
          </button>
          <p className="mt-4 text-purple-200 text-sm">No credit card required</p>
        </div>
      </section>
    </PublicLayout>
  );
}
