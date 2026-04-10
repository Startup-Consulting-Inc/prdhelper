/**
 * PRD Documentation Page
 *
 * Overview and introduction to Product Requirements Documents
 */

import { PublicLayout } from '../../../components/layout/PublicLayout';
import { FileText, Layers, Users, CheckCircle, ArrowRight, Code, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../../../components/SEO';

export default function PRDDocPage() {
  return (
    <PublicLayout>
      <SEO
        title="Product Requirements Document (PRD) – Complete Guide"
        description="Learn what a PRD is, what it contains, and how to write one. A Product Requirements Document defines features, user stories, and technical specifications for your product."
        path="/docs/prd"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Product Requirements Document (PRD)
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Transforming business needs into detailed product specifications
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-l-4 border-primary-500">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-primary-600 dark:text-primary-400" />
                What is a PRD?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                A Product Requirements Document (PRD) is a detailed specification that translates business
                requirements into concrete product features and functionality. It serves as the bridge between
                business objectives and technical implementation, providing development teams with clear direction
                on what to build and how it should work.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Unlike a BRD which focuses on the <strong>why</strong>, a PRD focuses on the <strong>what</strong>{' '}
                and <strong>how</strong>, detailing every feature, interaction, and technical requirement needed
                to bring the product to life.
              </p>
            </div>
          </section>

          {/* BRD vs PRD Comparison */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              BRD vs PRD: Understanding the Difference
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">BRD</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Focuses on the "why"</p>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Business objectives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Stakeholder needs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>High-level requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Success metrics</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                    <Layers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">PRD</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Focuses on the "what" and "how"</p>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Detailed feature specs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>User interactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Technical requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Implementation details</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Key Components */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Key Components of a PRD
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Overview</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Description of the product, its purpose, and target users
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                    <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Feature Specifications</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Detailed descriptions of features, functionality, and behavior
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Stories</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Narrative descriptions from the user's perspective
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                    <Code className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Technical Requirements</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Architecture, tech stack, performance, and constraints
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Acceptance Criteria</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Measurable conditions for feature completion
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/40 rounded-lg">
                    <Target className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dependencies</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Integration requirements and external dependencies
                </p>
              </div>
            </div>
          </section>

          {/* Why PRDs Matter */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Why PRDs Matter
            </h2>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-8 rounded-xl border border-purple-200 dark:border-purple-800">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Clear Direction:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Provides development teams with unambiguous specifications
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Shared Understanding:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Ensures all stakeholders align on product details
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Reduced Rework:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Prevents miscommunication and costly rebuilds
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Accurate Planning:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Enables realistic estimation and resource allocation
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Quality Assurance:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Guides testing efforts and acceptance validation
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Getting Started */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Getting Started with Clearly
            </h2>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Clearly helps you create comprehensive PRDs by transforming your business requirements into detailed
                product specifications. Our AI-guided process breaks down high-level objectives into actionable
                features, generates user stories, and creates professional documentation ready for development teams.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                >
                  Create Your PRD
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  to="/docs/prd-guide"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors"
                >
                  Learn More About PRDs
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </section>

          {/* Related Resources */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Related Resources
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                to="/docs/brd"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Business Requirements Document (BRD)
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Learn about BRDs and how they inform PRDs
                </p>
              </Link>

              <Link
                to="/docs/software-development-process"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Software Development Process
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Understand where PRDs fit in the development lifecycle
                </p>
              </Link>

              <Link
                to="/docs/vibe-coding"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Vibe Coding
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Explore AI-powered development and the role of PRDs
                </p>
              </Link>

              <Link
                to="/docs/how-to-use"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  How to Use Clearly
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Step-by-step guide to creating PRDs with Clearly
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
