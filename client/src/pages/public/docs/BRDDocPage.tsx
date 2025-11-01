/**
 * BRD Documentation Page
 *
 * Overview and introduction to Business Requirements Documents
 */

import { PublicLayout } from '../../../components/layout/PublicLayout';
import { FileText, Target, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BRDDocPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Business Requirements Document (BRD)
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            The foundation for successful software projects
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-l-4 border-primary-500">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-primary-600 dark:text-primary-400" />
                What is a BRD?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                A Business Requirements Document (BRD) is a formal document that clearly defines what a software
                project must accomplish from a business perspective. It serves as the bridge between business needs
                and technical implementation, ensuring all stakeholders share a common understanding of the project's
                goals and requirements.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Unlike technical specifications, a BRD focuses on the <strong>what</strong> and <strong>why</strong>,
                leaving the <em>how</em> to subsequent technical planning and design phases.
              </p>
            </div>
          </section>

          {/* Key Components */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Key Components of a BRD
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Business Objectives</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Clear, measurable goals that define what success looks like for the project.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stakeholders</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Identification of all parties involved, their roles, and how they'll benefit from the solution.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Requirements</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Detailed functional and non-functional requirements that the solution must satisfy.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                    <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Scope & Constraints</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Boundaries of the project and limitations such as budget, timeline, and technology constraints.
                </p>
              </div>
            </div>
          </section>

          {/* Why BRDs Matter */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Why BRDs Matter
            </h2>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-xl border border-blue-200 dark:border-blue-800">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Alignment:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Ensures all stakeholders have a shared understanding of project goals and requirements.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Clarity:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Provides clear direction for development teams and reduces ambiguity.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Risk Mitigation:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Identifies potential issues early when they're cheaper and easier to address.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Accountability:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Creates a baseline for measuring progress and success.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Cost Savings:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Prevents expensive rework by catching issues during planning rather than development.
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
                Clearly makes it easy to create professional BRDs through an AI-powered conversational interface.
                Simply answer questions about your project, and Clearly generates a comprehensive, well-structured
                BRD that you can refine and export.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  to="/docs/brd-guide"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors"
                >
                  Learn More About BRDs
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
                to="/docs/prd"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Product Requirements Document (PRD)
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Learn about PRDs and how they differ from BRDs
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
                  Understand where BRDs fit in the development lifecycle
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
                  Explore AI-powered development and its relationship with BRDs
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
                  Step-by-step guide to creating BRDs with Clearly
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
