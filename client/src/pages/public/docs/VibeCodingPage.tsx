/**
 * Vibe Coding Documentation Page
 *
 * Public page explaining what "vibe coding" is and how it relates to the platform
 */

import { PublicLayout } from '../../../components/layout/PublicLayout';
import { SEO } from '../../../components/SEO';
import { MessageSquare, Zap, Code, Brain, AlertTriangle, CheckCircle, ArrowRight, Lightbulb, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VibeCodingPage() {
  return (
    <PublicLayout>
      <SEO
        title="Vibe Coding & AI Requirements – How to Ship Better with Clear Specs"
        description="Learn how vibe coding with AI tools like Cursor and Claude benefits from clear requirements. Clearly generates AI-ready context files for faster, higher-quality development."
        path="/docs/vibe-coding"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Vibe Coding: A New Development Paradigm
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Translating vision into code through AI-powered conversations
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-l-4 border-indigo-500">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <MessageSquare className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-400" />
                What is Vibe Coding?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Vibe coding represents a fundamental shift in software development methodology. Rather than writing code
                line-by-line, developers communicate their vision to AI coding partners through clear, articulate prompts.
                The quality of the outcome depends entirely on how effectively you can articulate your intent.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Instead of manually implementing every detail, you describe <strong>what</strong> you want to build,
                focusing on the desired outcomes and user experience—the "vibe"—and let AI handle the technical
                implementation details.
              </p>
            </div>
          </section>

          {/* Core Principle */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-8 rounded-xl border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 m-0">
                  The Core Principle
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg m-0">
                The foundation of vibe coding centers on <strong>translating your vision into precise, actionable
                prompts</strong> that AI systems can interpret and execute effectively. Your role shifts from code
                writer to architect and communicator.
              </p>
            </div>
          </section>

          {/* Three Complexity Tiers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Three Complexity Tiers
            </h2>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                    <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white m-0">1. Simple Tasks</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Self-contained outputs like websites, images, or scripts. Perfect for quick prototypes and
                  proof-of-concepts.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-sm rounded-full">
                    ChatGPT
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-sm rounded-full">
                    Gemini
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-sm rounded-full">
                    Claude
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white m-0">2. Interactive & Frontend-Heavy</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Dynamic user interfaces and interactive experiences through no-code platforms, without traditional coding.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-sm rounded-full">
                    V0.dev
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-sm rounded-full">
                    Loveable
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-sm rounded-full">
                    Bolt.new
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                    <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white m-0">3. Complete Services</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Full-stack development combining frontend and backend for production-ready applications.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-sm rounded-full">
                    Replit
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-sm rounded-full">
                    Cursor
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-sm rounded-full">
                    GitHub Copilot Workspace
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Development Workflow */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              The Vibe Coding Workflow
            </h2>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center mb-2">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">1</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 text-center">Intent</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mx-2" />
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center mb-2">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">2</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 text-center">Prompt Translation</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mx-2" />
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center mb-2">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">3</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 text-center">AI Planning</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mx-2" />
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center mb-2">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">4</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 text-center">Code Generation</span>
                </div>
                <RefreshCw className="w-5 h-5 text-gray-400 flex-shrink-0 mx-2" />
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center mb-2">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">5</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 text-center">Feedback & Refinement</span>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-center">
                An iterative process where your vision flows from concept to code through continuous refinement
              </p>
            </div>
          </section>

          {/* Human Expertise Still Critical */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              The Critical Role of Human Expertise
            </h2>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-8 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-4 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    AI Generates Fast, Humans Ensure Quality
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    While AI can generate code rapidly, human knowledge remains indispensable for:
                  </p>
                </div>
              </div>

              <ul className="space-y-3 ml-10">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">System Architecture:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Designing scalable, maintainable system structures that grow with your needs
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Algorithm Efficiency:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Selecting optimal approaches for performance and resource utilization
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Security Considerations:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Identifying vulnerabilities and implementing proper safeguards
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Industry Best Practices:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Applying proven patterns and avoiding common pitfalls
                    </span>
                  </div>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  You function as the <strong>architectural guide</strong>, not merely a participant in the
                  development loop. Your expertise directs the AI toward solutions that are not just functional,
                  but robust, secure, and maintainable.
                </p>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Best Practices for Effective Vibe Coding
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Start with Outcomes
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Describe desired results rather than implementation details. Focus on what users will experience.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Iterate Relentlessly
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Refine your prompts continuously. Each iteration brings you closer to your vision.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Know Your Tools
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Understand each AI tool's strengths. Choose the right tool for your specific task complexity.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Maintain Fundamentals
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Keep your coding knowledge sharp. Understanding fundamentals helps you guide AI effectively.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Document Success
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Save effective prompts and patterns. Build a library of what works for future projects.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Version Control Everything
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track all generated code and prompts. This enables rollback and learning from history.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Know When to Restart
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sometimes starting fresh is faster than debugging. Recognize when to pivot your approach.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Test Rigorously
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-generated code still needs validation. Implement comprehensive testing from the start.
                </p>
              </div>
            </div>
          </section>

          {/* How Clearly Fits In */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              How Clearly Enhances Vibe Coding
            </h2>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Clearly helps you capture and articulate the "vibe" of your project by guiding you through professional
                requirements documentation. This provides the foundation for effective AI collaboration by ensuring:
              </p>

              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Your Vision is Clearly Articulated:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Well-defined requirements translate into better AI prompts
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">All Stakeholders are Aligned:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Shared understanding prevents costly misalignments during development
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Developers Understand Exactly What to Build:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Whether human or AI, clear requirements lead to better outcomes
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">The Final Product Matches Your Original Intent:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Documentation provides a reference point throughout the development process
                    </span>
                  </div>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                  Start Documenting Your Vision
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  to="/docs/brd"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors"
                >
                  Learn About Requirements Docs
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
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Business Requirements Document (BRD)
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Define the business needs that AI will help you implement
                </p>
              </Link>

              <Link
                to="/docs/prd"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Product Requirements Document (PRD)
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Translate business needs into detailed specifications for AI coding
                </p>
              </Link>

              <Link
                to="/docs/software-development-process"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Software Development Process
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Understand how vibe coding fits into the broader development lifecycle
                </p>
              </Link>

              <Link
                to="/docs/how-to-use"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  How to Use Clearly
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get started with AI-powered requirements documentation
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
