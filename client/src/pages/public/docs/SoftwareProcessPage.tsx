/**
 * Software Development Process Documentation Page
 *
 * Overview and introduction to software development process in the AI era
 */

import { PublicLayout } from '../../../components/layout/PublicLayout';
import { FileText, GitBranch, TestTube, Shield, Rocket, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../../../components/SEO';

export default function SoftwareProcessPage() {
  return (
    <PublicLayout>
      <SEO
        title="Software Development Process with AI – Overview"
        description="Understand the modern software development process in the AI era. From requirements to deployment — how AI-assisted coding changes each phase of building software."
        path="/docs/software-development-process"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Software Development Process
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            From prototype to production in the age of AI-assisted coding
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-l-4 border-emerald-500">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-emerald-600 dark:text-emerald-400" />
                What is the Software Development Process?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                The software development process is a structured approach to building software that transforms initial
                ideas into production-ready applications. In the age of AI-assisted coding, while prototypes can be
                created rapidly, the journey from prototype to production still requires careful planning, documentation,
                and systematic execution.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Modern development processes balance the speed of AI-powered tools with the rigor needed for reliable,
                maintainable, and secure software systems.
              </p>
            </div>
          </section>

          {/* Key Stages */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Key Stages of Development
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Requirements & Planning</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Define business needs (BRD), product specifications (PRD), and create a clear development roadmap.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                    <GitBranch className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Design & Architecture</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Plan system architecture, data models, APIs, and user interfaces before writing code.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                    <Rocket className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Implementation</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Write code following best practices, leveraging AI tools for rapid development while maintaining quality.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                    <TestTube className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Testing & Quality</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Comprehensive testing including unit tests, integration tests, and end-to-end validation.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                    <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security & Compliance</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Implement security measures, vulnerability assessments, and ensure regulatory compliance.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
                    <Rocket className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Deployment & Maintenance</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Deploy to production, monitor performance, and maintain the system with ongoing updates.
                </p>
              </div>
            </div>
          </section>

          {/* Why It Matters */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Why a Structured Process Still Matters
            </h2>

            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 p-8 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Quality at Scale:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      While AI can generate code quickly, a structured process ensures quality, reliability, and maintainability at scale.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Team Alignment:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Clear processes and documentation keep teams aligned on goals, architecture, and implementation details.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Risk Mitigation:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Systematic testing, security reviews, and validation prevent costly production issues.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Long-term Success:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Proper documentation and architecture decisions ensure your software remains maintainable and scalable.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Production Readiness:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Moving from prototype to production requires addressing error handling, security, performance, and maintainability—the 80% of work that determines real-world success.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Getting Started */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Getting Started with Structured Development
            </h2>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Clearly helps you follow a structured development process by guiding you through requirements gathering,
                documentation creation, and project planning. Start with a BRD to define business needs, create a PRD
                to specify product features, and follow proven development practices.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  to="/docs/software-development-process-guide"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors"
                >
                  Learn More About the Process
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
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Business Requirements Document (BRD)
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start with business needs and objectives
                </p>
              </Link>

              <Link
                to="/docs/prd"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Product Requirements Document (PRD)
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Define detailed product specifications
                </p>
              </Link>

              <Link
                to="/docs/vibe-coding"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Vibe Coding
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Understand AI-powered rapid development and its challenges
                </p>
              </Link>

              <Link
                to="/docs/how-to-use"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  How to Use Clearly
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Step-by-step guide to structured development with Clearly
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
