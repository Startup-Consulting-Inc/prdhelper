/**
 * How to Use Clearly Documentation Page
 *
 * Public page with step-by-step guide on using the platform
 */

import { PublicLayout } from '../../../components/layout/PublicLayout';
import { Link } from 'react-router-dom';
import {
  UserPlus,
  FolderPlus,
  MessageSquareText,
  FileCheck,
  CheckCircle,
  ArrowRight,
  Target,
  Users,
  TrendingUp,
  RefreshCw,
  FileText,
  Sparkles,
  Download,
  Share2,
  Edit3,
  Lightbulb,
  AlertCircle,
  BookOpen,
  Calendar,
  Zap
} from 'lucide-react';

export default function HowToUsePage() {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            How to Use Clearly
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Create professional requirements documents in minutes with AI-guided conversations.
            Follow this simple step-by-step guide to get started.
          </p>
        </div>

        {/* Main Content Layout: 2/3 content + 1/3 sidebar */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Column (2/3) */}
          <div className="lg:col-span-2 space-y-12">
            {/* Quick Start Process Flow */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Getting Started in 4 Steps
              </h2>

              <div className="relative">
                {/* Vertical connecting line */}
                <div className="absolute left-6 top-16 bottom-16 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 hidden sm:block"></div>

                {/* Step 1: Sign Up */}
                <div className="relative mb-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg relative z-10">
                        <UserPlus className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Step 1: Create Your Account
                        </h3>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                          30 seconds
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Get started with Clearly by creating your free account. Choose your preferred sign-up method:
                      </p>
                      <div className="grid sm:grid-cols-3 gap-3 mb-4">
                        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Email</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Google</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">GitHub</span>
                        </div>
                      </div>
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Sign Up Now
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Step 2: Create Project */}
                <div className="relative mb-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg relative z-10">
                        <FolderPlus className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Step 2: Create a Project
                        </h3>
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full">
                          1 minute
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Set up your first project from the dashboard:
                      </p>
                      <ol className="space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center text-sm font-semibold">
                            1
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            Click <strong>"New Project"</strong> button
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center text-sm font-semibold">
                            2
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            Enter project name and description
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center text-sm font-semibold">
                            3
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            Choose BRD or PRD as starting point
                          </span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Step 3: AI-Guided Wizard */}
                <div className="relative mb-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg relative z-10">
                        <MessageSquareText className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Step 3: Complete the AI Wizard
                        </h3>
                        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-medium rounded-full">
                          5-10 minutes
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Our AI guides you through creating comprehensive requirements:
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="flex items-start gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white text-sm">Project Goals</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Define objectives & success metrics</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                          <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white text-sm">Target Audience</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Describe your users & stakeholders</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                          <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white text-sm">Key Features</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Specify functionality & requirements</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                          <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white text-sm">Constraints</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Budget, timeline, & limitations</div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-start gap-2">
                        <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>Pro Tip:</strong> Don't worry about perfection—you can refine and edit everything later!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4: Review & Export */}
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg relative z-10">
                        <FileCheck className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Step 4: Review & Export
                        </h3>
                        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-medium rounded-full">
                          2-5 minutes
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Finalize your document and share it with your team:
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center">
                            <Edit3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white text-sm">Edit & Refine</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Make adjustments</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center">
                            <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white text-sm">Export</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">PDF or Markdown</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center">
                            <Share2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white text-sm">Share</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">With stakeholders</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center">
                            <RefreshCw className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white text-sm">Iterate</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Update as needed</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* BRD vs PRD Comparison Table */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                BRD vs PRD: Which Should You Start With?
              </h2>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Criteria
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700 dark:text-blue-400">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Start with BRD
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-purple-700 dark:text-purple-400">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Start with PRD
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          Project Stage
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          Early stages, concept validation
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          Business needs already defined
                        </td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-700/30">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          Primary Focus
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          Business objectives & ROI
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          Detailed feature specifications
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          Audience
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          Executives, stakeholders, investors
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          Product team, developers, designers
                        </td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-700/30">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          Best For
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          Securing buy-in & funding
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          Ready to start development
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          Time to Complete
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            5-10 minutes
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            10-15 minutes
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Recommended Approach
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      For best results, start with a <strong>BRD</strong> to define business needs, then create a{' '}
                      <strong>PRD</strong> to specify implementation details. This ensures alignment from strategy to execution.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Success Tips */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Tips for Creating Great Requirements Documents
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Be Specific
                    </h3>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    The more detail you provide about your requirements, constraints, and goals, the better your final
                    document will be. Avoid vague terms—use concrete examples and measurable criteria.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Think About Users
                    </h3>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Always center your requirements around the people who will use your product. What problems are you
                    solving? What value are you delivering? User-focused requirements lead to better products.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Define Success Metrics
                    </h3>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Include clear, measurable success criteria so you can objectively evaluate whether your project
                    achieved its goals. KPIs and metrics prevent scope creep and keep teams focused.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Iterate & Update
                    </h3>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Requirements documents are living documents that evolve with your project. Update them regularly as
                    your understanding grows and circumstances change. Version control is your friend.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar (1/3) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg text-white sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Why Clearly?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">10x</div>
                    <div className="text-sm text-indigo-100">Faster than manual</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">AI-Powered</div>
                    <div className="text-sm text-indigo-100">Smart suggestions</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">Professional</div>
                    <div className="text-sm text-indigo-100">Industry-standard</div>
                  </div>
                </div>
              </div>
              <Link
                to="/login"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Related Resources */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Learn More
              </h3>
              <div className="space-y-3">
                <Link
                  to="/docs/brd"
                  className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                    About BRDs
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Business Requirements Documents explained
                  </div>
                </Link>
                <Link
                  to="/docs/prd"
                  className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                    About PRDs
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Product Requirements Documents explained
                  </div>
                </Link>
                <Link
                  to="/docs/vibe-coding"
                  className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                    Vibe Coding
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    AI-powered development approach
                  </div>
                </Link>
                <Link
                  to="/docs/software-development-process"
                  className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                    Development Process
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    From prototype to production
                  </div>
                </Link>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                Need Help?
              </h3>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <Link
                  to="/schedule-demo"
                  className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
                >
                  <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Schedule a Demo</span>
                </Link>
                <Link
                  to="/blog"
                  className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
                >
                  <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Read Our Blog</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

// Missing Clock import - add to imports
function Clock({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      strokeWidth={2}
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
