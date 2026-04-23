/**
 * PRD Guide Page
 *
 * Comprehensive guide to Product Requirements Documents in the age of rapid development
 */

import { Link } from 'react-router-dom';
import { PublicLayout } from '../../../components/layout/PublicLayout';
import { SEO } from '../../../components/SEO';
import { Helmet } from 'react-helmet-async';
import {
  Zap,
  FileText,
  AlertTriangle,
  CheckCircle,
  Users,
  Target,
  TrendingUp,
  Briefcase,
  Code,
  Lightbulb,
  Clock,
  Layers,
  GitBranch,
  Eye,
  Settings,
  BookOpen,
  Shield,
  RefreshCw,
  ArrowRight,
  Workflow,
  MessageSquare,
  BarChart3,
} from 'lucide-react';

export default function PRDGuidePage() {
  return (
    <PublicLayout>
      <SEO
        title="How to Write a PRD: Guide, Examples & Template (2026)"
        description="Step-by-step PRD guide: sections to include, real examples, and best practices for PMs—so engineering (and AI tools) get a spec they can build from. Free generator linked inside."
        path="/docs/prd-guide"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is a Product Requirements Document (PRD)?',
              acceptedAnswer: { '@type': 'Answer', text: 'A Product Requirements Document (PRD) is a document that defines the features, functionality, and behavior of a product or feature. It describes what the product should do, who it is for, and how success will be measured. PRDs are written by product managers and used by engineers, designers, and QA teams to build the right product.' },
            },
            {
              '@type': 'Question',
              name: 'What should a PRD include?',
              acceptedAnswer: { '@type': 'Answer', text: 'A PRD should include: a problem statement, product goals and success metrics, target users and personas, user stories with acceptance criteria, functional requirements, non-functional requirements (performance, security, scalability), technical constraints, out-of-scope items, dependencies, and a timeline. Clearly generates all of these sections automatically.' },
            },
            {
              '@type': 'Question',
              name: 'How long should a PRD be?',
              acceptedAnswer: { '@type': 'Answer', text: 'A PRD length depends on the complexity of the feature or product. A single-feature PRD may be 2-5 pages; a full product PRD may be 10-30 pages. The goal is completeness, not length — every critical section should be covered without unnecessary padding.' },
            },
            {
              '@type': 'Question',
              name: "What is the difference between a PRD and a BRD?",
              acceptedAnswer: { '@type': 'Answer', text: 'A BRD (Business Requirements Document) focuses on business objectives and stakeholder needs — the "why" behind a project. A PRD (Product Requirements Document) focuses on the product features and technical requirements — the "what" and "how." BRDs are written first; PRDs are written before development begins.' },
            },
            {
              '@type': 'Question',
              name: 'Do PRDs still matter in agile development?',
              acceptedAnswer: { '@type': 'Answer', text: 'Yes. PRDs adapt to agile as living documents rather than up-front specifications. In agile teams, PRDs define the scope and goals of an initiative, while user stories and sprint tasks capture the tactical details. A PRD provides the strategic context that keeps the team aligned as requirements evolve.' },
            },
          ],
        })}</script>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center py-12 mb-8 bg-white dark:bg-gray-800 shadow-xl rounded-xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-purple-700 to-blue-500 bg-clip-text text-transparent">
            Product Requirement Documents:
          </h1>
          <h2 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-700 dark:text-gray-300">
            The Essential Blueprint in an Age of Rapid Development
          </h2>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
            Structure, Clarity, and Direction in the Era of Speed
          </p>
        </header>

        <div className="not-prose max-w-3xl mx-auto mb-10 text-center sm:text-left border border-dashed border-gray-300/90 dark:border-gray-600 rounded-xl px-4 py-4 sm:px-6 sm:py-5 bg-slate-50/80 dark:bg-gray-800/30">
          <p className="m-0 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
            Related: BRD and requirements
          </p>
          <p className="m-0 text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
            <Link to="/blog/brd-vs-prd" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
              BRD vs PRD
            </Link>
            {' · '}
            <Link
              to="/blog/complete-guide-to-writing-brds"
              className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Complete guide to writing BRDs
            </Link>
            {' · '}
            <Link
              to="/blog/how-to-write-a-brd-2026"
              className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              How to write a BRD (2026)
            </Link>
            {' · '}
            <Link to="/docs/prd" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
              What is a PRD? (short overview)
            </Link>
          </p>
        </div>

        {/* Main Content Grid */}
        <main className="grid lg:grid-cols-3 gap-8">
          {/* Primary Content Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-12">
            {/* 1. Introduction */}
            <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border-l-4 border-purple-500">
              <h3 className="text-2xl font-bold mb-4 flex items-center text-purple-800 dark:text-purple-400">
                <Zap className="w-6 h-6 mr-3 text-purple-500" />
                Introduction: Structure in the Era of Speed
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                In today's software development landscape, where AI coding assistants can generate functional prototypes
                in minutes and developers can spin up applications faster than ever before, you might wonder whether
                traditional documentation still matters. This is especially true in what many call the era of{' '}
                <strong>"vibe coding,"</strong> where developers can quickly translate ideas into working code through
                conversational prompts and AI assistance.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Yet paradoxically, as development becomes faster and more fluid, the need for clear product requirement
                documents has become <strong>more critical, not less</strong>. A Product Requirement Document (PRD)
                serves as the foundational blueprint that transforms abstract ideas into concrete specifications.
              </p>
            </section>

            {/* 2. Understanding PRDs - Enhanced with Visual Elements */}
            <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold mb-6 flex items-center text-blue-800 dark:text-blue-400">
                <FileText className="w-6 h-6 mr-3 text-blue-500" />
                Understanding Product Requirement Documents
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                At its heart, a Product Requirement Document is a comprehensive written description of what a product
                should do and why it should exist. Think of it as the architectural plans for a building—you wouldn't
                construct a skyscraper based solely on a sketch and good intentions.
              </p>

              {/* Key Dimensions Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Problem Definition</h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Articulates the problem being solved, grounded in real user needs
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">User Definition</h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Captures behaviors, pain points, and contexts of use beyond demographics
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Features & Functionality</h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Outlines what the product will do and why each capability matters
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Success Criteria</h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Provides measurable ways to determine if the product solves the problem
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-gray-800 dark:text-gray-200 font-semibold mb-2">
                  <Lightbulb className="w-5 h-5 inline mr-2 text-blue-600 dark:text-blue-400" />
                  Key Insight
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  The format and depth of PRDs can vary significantly depending on organizational culture and product
                  complexity. What remains constant is the fundamental purpose of creating{' '}
                  <strong>shared understanding and alignment</strong> among everyone involved.
                </p>
              </div>
            </section>

            {/* 3. Vibe Coding Era - Enhanced */}
            <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border-l-4 border-red-500">
              <h3 className="text-2xl font-bold mb-4 flex items-center text-red-800 dark:text-red-400">
                <AlertTriangle className="w-6 h-6 mr-3 text-red-500" />
                The Persistent Necessity of PRDs in the Vibe Coding Era
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                The term "vibe coding" captures something real about modern development. AI-powered tools allow
                developers to rapidly prototype ideas, translating conversational descriptions into functional code with
                remarkable speed. This capability can create an intoxicating sense of progress, where applications
                materialize almost as fast as you can describe them.
              </p>

              {/* Problems Without Clear Requirements */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Problems When Teams Rely Purely on Rapid Prototyping
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">Inconsistent Assumptions</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Different team members make conflicting assumptions about features
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">Edge Case Cascade</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Unconsidered scenarios create cascading bugs through the system
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">Product Drift</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Chasing technical possibilities instead of solving user needs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">Expensive Rework</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Discovering misalignments after months of development
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Speed vs Direction Chart */}
              <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-900 dark:to-red-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-3 text-center text-gray-900 dark:text-white flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
                  Development Speed Without Direction
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-6">
                  Fast coding without clear requirements leads to building the wrong thing efficiently
                </p>
                <div className="flex items-end justify-around h-64 border-b-2 border-l-2 border-gray-400 dark:border-gray-600 pb-2 pl-2">
                  {/* With PRD */}
                  <div className="flex flex-col items-center w-1/3">
                    <div
                      className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all hover:shadow-lg"
                      style={{ height: '80%' }}
                    ></div>
                    <div className="text-center mt-3">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">✓</p>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">With Clear PRD</span>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Right product</p>
                    </div>
                  </div>

                  {/* Without PRD - Fast but Wrong */}
                  <div className="flex flex-col items-center w-1/3">
                    <div
                      className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all hover:shadow-lg"
                      style={{ height: '90%' }}
                    ></div>
                    <div className="text-center mt-3">
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">⚠</p>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Fast but Wrong</span>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Wasted effort</p>
                    </div>
                  </div>

                  {/* Multiple Wrong Things */}
                  <div className="flex flex-col items-center w-1/3">
                    <div
                      className="w-full bg-gradient-to-t from-red-600 to-red-500 rounded-t-lg transition-all hover:shadow-lg"
                      style={{ height: '100%' }}
                    ></div>
                    <div className="text-center mt-3">
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">✗</p>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">No Direction</span>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Maximum waste</p>
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4 font-medium">
                  Outcome Quality →
                </div>
              </div>
            </section>

            {/* 4. The Audience for PRDs */}
            <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border-l-4 border-indigo-500">
              <h3 className="text-2xl font-bold mb-6 text-indigo-800 dark:text-indigo-400">
                The Audience for PRDs: Building Bridges Across Disciplines
              </h3>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Product Requirement Documents don't exist for a single audience. They function as a communication bridge
                connecting diverse stakeholders who all need to understand the product but approach it from different
                perspectives.
              </p>

              {/* Stakeholder Cards */}
              <div className="space-y-4">
                {/* Engineers */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-5 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                      <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Engineers & Developers
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Rely on PRDs to understand what they're building and why it matters. When AI suggests multiple
                        implementation approaches, PRDs help evaluate which best serves documented user needs.
                      </p>
                      <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                        Context for Technical Decisions
                      </span>
                    </div>
                  </div>
                </div>

                {/* Designers */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-5 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                      <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Designers</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Ground their work in concrete user problems and constraints. PRDs articulating user workflows
                        and pain points enable experiences that solve real problems, not just look attractive.
                      </p>
                      <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                        User-Centered Design Foundation
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Managers */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-lg">
                      <Briefcase className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Product Managers</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Use PRDs as thinking tools. Writing comprehensive requirements forces clarification, identifies
                        gaps, and confronts difficult prioritization decisions before development begins.
                      </p>
                      <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs rounded-full">
                        Strategic Thinking Catalyst
                      </span>
                    </div>
                  </div>
                </div>

                {/* Business Stakeholders */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-5 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Business Stakeholders & Executives
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Need to understand what they're funding and why the investment makes sense. PRDs communicate
                        strategic context and enable informed resource allocation decisions.
                      </p>
                      <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs rounded-full">
                        Investment Justification
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Evolution of PRDs */}
            <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border-l-4 border-teal-500">
              <h3 className="text-2xl font-bold mb-6 text-teal-800 dark:text-teal-400">
                The Evolution of PRDs: Adapting for Modern Reality
              </h3>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Understanding that PRDs remain essential doesn't mean they should stay frozen in traditional formats.
                Modern product development benefits from evolved approaches that maintain core strengths while adapting
                to contemporary workflows.
              </p>

              <div className="space-y-6">
                {/* Living Documents */}
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-5 rounded-lg border border-teal-200 dark:border-teal-800">
                  <div className="flex items-center gap-3 mb-3">
                    <RefreshCw className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Living Documents</h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Progressive organizations treat PRDs as living documents that evolve as teams learn from user
                    feedback, technical discoveries, and market changes, rather than static specifications set in stone.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-teal-700 dark:text-teal-300">
                    <CheckCircle className="w-4 h-4" />
                    <span>Maintains shared understanding while acknowledging complexity</span>
                  </div>
                </div>

                {/* Tool Integration */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-3">
                    <Workflow className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Tool Integration</h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Modern PRDs integrate directly with development tools where teams track work, discuss approaches,
                    and measure progress, ensuring documentation stays relevant and gets referenced consistently.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs rounded">
                      JIRA
                    </span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs rounded">
                      Linear
                    </span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs rounded">
                      Notion
                    </span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs rounded">
                      Confluence
                    </span>
                  </div>
                </div>

                {/* Modular Requirements */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-5 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3 mb-3">
                    <Layers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Modular Requirements</h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Instead of monolithic documents, teams develop focused specifications for individual features or
                    user journeys. This modularity makes documentation more manageable and aligns with agile workflows.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Easier to maintain</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Aligns with sprints</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. When PRDs Matter Most */}
            <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border-l-4 border-green-500">
              <h3 className="text-2xl font-bold mb-6 text-green-800 dark:text-green-400 flex items-center">
                <BarChart3 className="w-6 h-6 mr-3 text-green-500" />
                Practical Application: When PRDs Matter Most
              </h3>

              <div className="space-y-5">
                {/* Complex Products */}
                <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg border-l-4 border-green-400">
                  <div className="flex items-start gap-3 mb-3">
                    <Settings className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">Complex Products</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Products with multiple interdependent features, spanning user workflows, or far-reaching
                        technical architecture decisions benefit enormously from comprehensive PRDs.
                      </p>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border border-green-200 dark:border-green-800">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          <strong>Impact:</strong> The cost of creating thorough documentation becomes trivial compared
                          to rebuilding incorrectly integrated systems.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Critical Functions */}
                <div className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-lg border-l-4 border-amber-400">
                  <div className="flex items-start gap-3 mb-3">
                    <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                        Critical Business Functions & Regulated Industries
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        When errors could result in financial losses, security breaches, or compliance violations,
                        detailed requirements and review processes provide essential risk management.
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded">
                          Finance
                        </span>
                        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded">
                          Healthcare
                        </span>
                        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded">
                          Government
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Early Stage */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-start gap-3 mb-3">
                    <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">Early-Stage Explorations</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Rapid experiments and early-stage explorations often work better with lightweight
                        specifications. When the goal is learning rather than building, lean problem statements suffice.
                      </p>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          <strong>Approach:</strong> Lean problem statements and hypothesis documentation instead of
                          traditional PRDs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Secondary Content Column (1/3 width) */}
          <div className="lg:col-span-1 space-y-8">
            {/* Who Benefits? */}
            <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-t-4 border-purple-400">
              <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800 dark:text-gray-200">
                <Users className="w-5 h-5 mr-3 text-purple-500" />
                Who Benefits from PRDs?
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">Engineers</p>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">Context for technical decisions</p>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">Designers</p>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">User-centered design foundation</p>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">Product Managers</p>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">Strategic thinking catalyst</p>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">QA Teams</p>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">Test strategy foundation</p>
                </div>

                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">Executives</p>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">Investment justification</p>
                </div>

                <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">Marketing & Sales</p>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">Go-to-market strategy</p>
                </div>
              </div>
            </section>

            {/* PRD Formats */}
            <section className="bg-gradient-to-br from-purple-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <GitBranch className="w-5 h-5 mr-2" />
                PRD Format Spectrum
              </h3>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-sm font-semibold mb-1">Lean PRDs</p>
                  <p className="text-xs opacity-90">2-5 pages, essential elements only</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-sm font-semibold mb-1">Standard PRDs</p>
                  <p className="text-xs opacity-90">10-20 pages, comprehensive coverage</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-sm font-semibold mb-1">Detailed PRDs</p>
                  <p className="text-xs opacity-90">30+ pages, every interaction specified</p>
                </div>
              </div>
            </section>

            {/* Key Takeaways */}
            <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
                Key Takeaways
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">PRDs transform ideas into concrete specs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Speed without direction = building wrong things fast
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    PRDs bridge diverse stakeholder perspectives
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Evolve PRDs as living documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Match documentation depth to product complexity
                  </span>
                </li>
              </ul>
            </section>
          </div>
        </main>

        {/* Conclusion */}
        <section className="mt-16 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-8 rounded-xl shadow-xl border border-purple-200 dark:border-purple-800">
          <h3 className="text-3xl font-extrabold mb-4 text-purple-900 dark:text-purple-300">
            Conclusion: Documentation as Strategic Asset
          </h3>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg mb-4">
            In an era when AI can help developers code faster than ever, when prototypes emerge in hours rather than
            weeks, and when technical implementation feels increasingly accessible, the role of Product Requirement
            Documents has paradoxically become <strong>more important rather than less</strong>.
          </p>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
            Speed without direction leads to efficiently building the wrong things. Powerful tools without clear
            objectives create impressive demonstrations that fail to solve real problems. PRDs endure because they
            address fundamentally human challenges rather than technical ones.
          </p>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-6">
            The most successful product teams recognize that requirements documentation isn't about satisfying
            bureaucratic processes or creating paperwork for its own sake. Well-crafted PRDs are{' '}
            <strong>strategic assets</strong> that improve decision-making, reduce waste, and increase the likelihood of
            building products that truly matter to users.
          </p>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-purple-500">
            <p className="text-purple-700 dark:text-purple-300 font-medium text-lg italic">
              "In the vibe coding era, where the constraint has shifted from 'can we build this?' to 'should we build
              this and exactly what should it do?' Product Requirement Documents provide the{' '}
              <strong>clarity that transforms possibility into purposeful action</strong>."
            </p>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
