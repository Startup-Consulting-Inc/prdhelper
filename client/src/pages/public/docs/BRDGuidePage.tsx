/**
 * BRD Guide Page
 *
 * Comprehensive guide to Business Requirements Documents in the era of AI development
 */

import { PublicLayout } from '../../../components/layout/PublicLayout';
import {
  Zap,
  FileText,
  AlertTriangle,
  CheckCircle,
  Users,
  Shield,
  Target,
  TrendingUp,
  Briefcase,
  Code,
  TestTube,
  Settings,
  BookOpen,
  GitBranch,
  RefreshCw,
  XCircle,
  MessageSquare,
  Lightbulb,
  Clock,
  DollarSign,
} from 'lucide-react';

export default function BRDGuidePage() {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center py-12 mb-8 bg-white dark:bg-gray-800 shadow-xl rounded-xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
            Business Requirement Documents:
          </h1>
          <h2 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-700 dark:text-gray-300">
            The Essential Foundation in an Era of AI-Powered Development
          </h2>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
            Clarity, Governance, and Value in the Age of Vibe Coding.
          </p>
        </header>

        {/* Main Content Grid */}
        <main className="grid lg:grid-cols-3 gap-8">
          {/* Primary Content Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-12">
            {/* 1. Introduction */}
            <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border-l-4 border-blue-500">
              <h3 className="text-2xl font-bold mb-4 flex items-center text-blue-800 dark:text-blue-400">
                <Zap className="w-6 h-6 mr-3 text-blue-500" />
                Introduction: When Speed Meets Complexity
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                The landscape of software development has transformed dramatically with the emergence of AI-powered
                coding assistants. What once took teams weeks to prototype can now materialize in hours through
                natural language prompts and intelligent code generation. This phenomenon, often called{' '}
                <strong>"vibe coding,"</strong> has created an intoxicating sense of possibility where anyone can
                seemingly build sophisticated applications through conversation alone.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Yet beneath this surface excitement lies a critical truth that many organizations discover too late:
                the gap between a working prototype and a production-ready system remains vast, and crossing that gap
                requires something decidedly traditional—a Business Requirement Document.
              </p>
            </section>

            {/* 2. Understanding the BRD - Enhanced with Visual Elements */}
            <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold mb-6 flex items-center text-blue-800 dark:text-blue-400">
                <FileText className="w-6 h-6 mr-3 text-blue-500" />
                Understanding the Business Requirement Document
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                A Business Requirement Document, commonly abbreviated as <strong>BRD</strong>, serves as the formal
                foundation that defines what a software project must accomplish and why it matters to the organization.
                Think of it as the architectural blueprint for a building, but instead of specifying physical structures,
                it articulates the business problems to be solved, the objectives to be achieved, and the scope of work
                required to deliver value.
              </p>

              {/* Key Elements Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Problem Statement</h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Clear articulation of the business pain point being addressed
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Business Objectives</h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Specific, measurable goals that define success
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Stakeholder ID</h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Clarification of who will use and benefit from the solution
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Requirements</h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Functional and non-functional specifications
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Constraints</h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Real-world limitations of budget, time, and technology
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Success Metrics</h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Measurable criteria to evaluate outcomes
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-gray-800 dark:text-gray-200 font-semibold mb-2">
                  <Lightbulb className="w-5 h-5 inline mr-2 text-blue-600 dark:text-blue-400" />
                  Key Insight
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  A BRD focuses on the <strong>what</strong> and <strong>why</strong>, leaving the <em>how</em> to
                  subsequent technical planning. It translates business needs into a format that technical teams can
                  understand and act upon.
                </p>
              </div>
            </section>

            {/* 3. Vibe Coding Revolution - Enhanced */}
            <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border-l-4 border-red-500">
              <h3 className="text-2xl font-bold mb-4 flex items-center text-red-800 dark:text-red-400">
                <AlertTriangle className="w-6 h-6 mr-3 text-red-500" />
                The Vibe Coding Revolution and Its Hidden Pitfalls
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                The ability to describe an application in plain language and watch it materialize feels almost magical.
                A product manager can sketch out an idea during a morning meeting, and by afternoon, a developer can
                demonstrate a working prototype built with AI assistance. This speed creates tremendous enthusiasm and
                has genuinely democratized certain aspects of software creation.
              </p>

              {/* Common Gaps Table */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Common Gaps in AI-Generated Prototypes
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">Edge Cases</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Fails under real-world conditions and load
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">Accessibility</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Missing features required by law (WCAG)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <Shield className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">Security</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Critical oversights in authentication and data protection
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <FileText className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">Compliance</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Missed regulatory and industry requirements
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost of Change Chart */}
              <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-900 dark:to-red-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-3 text-center text-gray-900 dark:text-white flex items-center justify-center gap-2">
                  <DollarSign className="w-5 h-5 text-red-600 dark:text-red-400" />
                  The Cost of Change Over Time
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-6">
                  The later an issue is found, the more expensive it is to fix.
                </p>
                <div className="flex items-end justify-around h-64 border-b-2 border-l-2 border-gray-400 dark:border-gray-600 pb-2 pl-2">
                  {/* BRD Phase */}
                  <div className="flex flex-col items-center w-1/5">
                    <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:shadow-lg" style={{ height: '15%' }}></div>
                    <div className="text-center mt-3">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">$</p>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">BRD Phase</span>
                    </div>
                  </div>

                  {/* Testing Phase */}
                  <div className="flex flex-col items-center w-1/5">
                    <div className="w-full bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg transition-all hover:shadow-lg" style={{ height: '40%' }}></div>
                    <div className="text-center mt-3">
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-500">$$</p>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Testing</span>
                    </div>
                  </div>

                  {/* Development */}
                  <div className="flex flex-col items-center w-1/5">
                    <div className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all hover:shadow-lg" style={{ height: '65%' }}></div>
                    <div className="text-center mt-3">
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">$$$</p>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Development</span>
                    </div>
                  </div>

                  {/* Production */}
                  <div className="flex flex-col items-center w-1/5">
                    <div className="w-full bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg transition-all hover:shadow-lg" style={{ height: '85%' }}></div>
                    <div className="text-center mt-3">
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">$$$$</p>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Production</span>
                    </div>
                  </div>

                  {/* Post-Launch */}
                  <div className="flex flex-col items-center w-1/5">
                    <div className="w-full bg-gradient-to-t from-red-700 to-red-600 rounded-t-lg transition-all hover:shadow-lg" style={{ height: '100%' }}></div>
                    <div className="text-center mt-3">
                      <p className="text-2xl font-bold text-red-700 dark:text-red-500">$$$$$</p>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Post-Launch</span>
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4 font-medium">
                  Project Phase →
                </div>
              </div>
            </section>

            {/* 4. Why BRDs Matter - Enhanced with Icons */}
            <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border-l-4 border-blue-700">
              <h3 className="text-2xl font-bold mb-6 text-blue-800 dark:text-blue-400">
                Why Business Requirement Documents Matter More Than Ever
              </h3>

              <div className="space-y-6">
                {/* Shared Understanding */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Creating Shared Understanding Across Stakeholders
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        The BRD process forces essential conversations that prevent expensive mistakes. It aligns
                        marketing, engineering, and finance, ensuring everyone understands not just <em>what</em> is
                        being built, but <em>why</em> it matters.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                          Single Source of Truth
                        </span>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                          Early Alignment
                        </span>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                          Reveals Complexities
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Context */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                      <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Providing Context That AI Cannot Infer
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        AI coding assistants lack knowledge of your company's history, strategic initiatives, or
                        integration ecosystem. A well-crafted BRD captures this institutional knowledge.
                      </p>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border border-purple-200 dark:border-purple-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>Example:</strong> Your AI might suggest a third-party service for easy integration,
                          but your BRD documents a strategic partnership with a competing provider—making the
                          technically inferior option the business requirement.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accountability */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Establishing Accountability and Success Criteria
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        When requirements exist only in chat logs, accountability is nebulous. The BRD explicitly
                        defines measurable criteria against which progress and outcomes can be evaluated.
                      </p>
                      <div className="grid sm:grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                          <MessageSquare className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">What was promised?</p>
                        </div>
                        <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                          <Target className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">What is success?</p>
                        </div>
                        <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                          <CheckCircle className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">When are we done?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Management */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                      <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Enabling Systematic Risk Management
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        The BRD development process includes systematic risk identification and mitigation planning.
                        The speed of AI can encourage teams to move forward without proper consideration—the BRD
                        provides structured checkpoints.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                        <Clock className="w-4 h-4" />
                        <span>AI accelerates development—BRDs ensure we're building the right thing</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Modern Integration */}
            <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border-l-4 border-indigo-500">
              <h3 className="text-2xl font-bold mb-6 text-indigo-800 dark:text-indigo-400">
                Integrating BRDs with Modern Development Practices
              </h3>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Acknowledging the value of BRDs does not mean reverting to rigid waterfall methodologies that produce
                hundred-page documents requiring months to complete. Modern approaches recognize that requirements
                evolve through learning and that documentation should serve the project rather than becoming a
                bureaucratic burden.
              </p>

              <div className="space-y-6">
                {/* Agile BRDs */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-5 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center gap-3 mb-3">
                    <GitBranch className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Agile BRDs: Right-Sizing Documentation
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    In agile environments, create lightweight BRDs that capture essential business context and
                    high-level requirements while leaving detailed specifications to emerge through iterative
                    development.
                  </p>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white mb-2">✓ Document</p>
                        <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                          <li>• Business context</li>
                          <li>• Key success metrics</li>
                          <li>• Critical constraints</li>
                          <li>• High-level requirements</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white mb-2">✗ Leave Flexible</p>
                        <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                          <li>• Implementation details</li>
                          <li>• UI/UX specifics</li>
                          <li>• Technical architecture</li>
                          <li>• Sprint-level features</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Enhancement */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-5 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Using AI to Enhance BRD Creation
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    The same AI tools that have accelerated coding can also improve the BRD development process—but
                    human judgment remains irreplaceable for strategic alignment and trade-off decisions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700 text-xs">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">Draft sections</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700 text-xs">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">Identify gaps</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700 text-xs">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">Suggest edge cases</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700 text-xs">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">Clarify requirements</span>
                    </div>
                  </div>
                </div>

                {/* Living Documents */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-5 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-3">
                    <RefreshCw className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Living Documents That Evolve</h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Modern BRDs function as living documents that evolve alongside the project. When assumptions prove
                    incorrect or business conditions change, the BRD should be updated to reflect this new
                    understanding.
                  </p>
                  <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Key discipline:</strong> Ensure significant requirement changes are documented, discussed
                      with affected stakeholders, and reflected in updated project plans.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Common Pitfalls */}
            <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border-l-4 border-red-500">
              <h3 className="text-2xl font-bold mb-6 text-red-800 dark:text-red-400 flex items-center">
                <XCircle className="w-6 h-6 mr-3 text-red-500" />
                Common Pitfalls and How to Avoid Them
              </h3>

              <div className="space-y-5">
                {/* Over-Specification */}
                <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-lg border-l-4 border-red-400">
                  <div className="flex items-start gap-3 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">Over-Specification</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Creating a rigid document that attempts to answer every possible question before development
                        begins, leading to <strong>analysis paralysis</strong>.
                      </p>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border border-red-200 dark:border-red-800">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          <strong>Solution:</strong> Focus on decisions that are expensive to change later, while
                          deliberately leaving flexibility for details that can emerge through iterative development.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Under-Specification */}
                <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded-lg border-l-4 border-orange-400">
                  <div className="flex items-start gap-3 mb-3">
                    <MessageSquare className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">Under-Specification</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Capturing only vague aspirations (e.g., "better customer experience") without sufficient detail
                        to guide actual implementation.
                      </p>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border border-orange-200 dark:border-orange-800">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          <strong>Solution:</strong> Specify clear, measurable business objectives with sufficient
                          detail about functional requirements that technical teams can make informed design decisions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confusing Requirements with Solutions */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-start gap-3 mb-3">
                    <Code className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                        Confusing Requirements with Solutions
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Prescribing specific technical implementations (e.g., "use microservices") instead of
                        articulating the business need.
                      </p>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                        <div className="grid sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="font-semibold text-red-600 dark:text-red-400 mb-1">✗ Solution-Focused</p>
                            <p className="text-gray-600 dark:text-gray-400">
                              "The system shall use a microservices architecture with REST APIs"
                            </p>
                          </div>
                          <div>
                            <p className="font-semibold text-green-600 dark:text-green-400 mb-1">✓ Need-Focused</p>
                            <p className="text-gray-600 dark:text-gray-400">
                              "The system shall support independent scaling of catalog and checkout to handle varying
                              loads"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Secondary Content Column (1/3 width) */}
          <div className="lg:col-span-1 space-y-8">
            {/* Who Needs the BRD? */}
            <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-t-4 border-gray-400">
              <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800 dark:text-gray-200">
                <Users className="w-5 h-5 mr-3 text-gray-500" />
                Who Needs the BRD?
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">Business Leaders</p>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    Investment justification & strategic alignment
                  </p>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">Product/Analysts</p>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    Maintaining scope discipline & ensuring value delivery
                  </p>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">Technical Teams</p>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    Understanding business context for technical design
                  </p>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TestTube className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">QA/Testing</p>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    Developing test plans & validating acceptance criteria
                  </p>
                </div>

                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">Project Managers</p>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    Scheduling, resource allocation, expectation management
                  </p>
                </div>
              </div>
            </section>

            {/* Quick Stats */}
            <section className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                BRD Impact Stats
              </h3>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-3xl font-bold">60%</p>
                  <p className="text-sm opacity-90">Reduction in rework costs</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-3xl font-bold">5-10x</p>
                  <p className="text-sm opacity-90">Cost to fix issues post-launch vs. BRD phase</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-3xl font-bold">75%</p>
                  <p className="text-sm opacity-90">Reduction in stakeholder misalignment</p>
                </div>
              </div>
            </section>

            {/* Key Takeaways */}
            <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                Key Takeaways
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    BRDs remain critical in the AI era
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Focus on <strong>what</strong> and <strong>why</strong>, not <em>how</em>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    AI can assist but not replace human judgment
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Right-size documentation for agile workflows
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Treat BRDs as living, evolving documents
                  </span>
                </li>
              </ul>
            </section>
          </div>
        </main>

        {/* Conclusion */}
        <section className="mt-16 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-8 rounded-xl shadow-xl border border-blue-200 dark:border-blue-800">
          <h3 className="text-3xl font-extrabold mb-4 text-blue-900 dark:text-blue-300">
            Conclusion: The Enduring Value of Deliberate Planning
          </h3>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg mb-4">
            The era of AI-assisted development has not eliminated the need for thoughtful requirement documentation;
            rather, it has made such documentation <strong>more critical than ever</strong>. The speed with which code
            can be generated creates both opportunity and risk, and the <strong>BRD serves as the essential governance
            mechanism</strong> that ensures this velocity produces business value rather than merely producing code.
          </p>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
            Organizations that embrace this paradox—using AI tools to accelerate development while simultaneously
            investing in rigorous requirement documentation—position themselves to capture the benefits of both
            approaches. They move quickly, but they move toward clearly defined objectives with appropriate
            consideration of risks and constraints.
          </p>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-6">
            The future of software development is not a choice between the excitement of rapid AI-assisted prototyping
            and the discipline of traditional requirement documentation. Instead, it is the synthesis of both: using
            modern tools to build faster while maintaining the governance structures that ensure what is built actually
            serves genuine business needs.
          </p>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-blue-500">
            <p className="text-blue-700 dark:text-blue-300 font-medium text-lg italic">
              "The BRD's purpose has never been to create bureaucracy, but rather to create <strong>clarity</strong>—and
              in an era where technical implementation happens at unprecedented speed, clarity about what we are
              building and why has never been more valuable."
            </p>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
