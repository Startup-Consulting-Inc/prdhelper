/**
 * Case Studies Page
 *
 * Public page showcasing customer success stories
 */

import { PublicLayout } from '../../components/layout/PublicLayout';
import { Building2, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function CaseStudiesPage() {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Case Studies
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See how teams are using Clearly to streamline their development process and
            deliver better products faster.
          </p>
        </div>

        {/* Case Study 1 */}
        <div className="mb-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-primary-500 to-accent-500 p-12 flex items-center justify-center">
              <Building2 className="h-24 w-24 text-white" />
            </div>
            <div className="md:w-2/3 p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                  SaaS Startup
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                TechStart: From Idea to MVP in 6 Weeks
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                A small startup team used Clearly to document their product requirements before building
                with AI coding assistants, reducing development time by 60%.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400 mt-1" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">60%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Time Saved</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-accent-600 dark:text-accent-400 mt-1" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">6 weeks</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">To MVP</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-1" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">Zero</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Major Rework</div>
                  </div>
                </div>
              </div>

              <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-700 dark:text-gray-300">
                "Clearly helped us articulate our vision before we wrote a single line of code. When we
                started building with AI assistants, they had perfect context and built exactly what we
                needed. No confusion, no rework."
                <footer className="text-sm text-gray-500 dark:text-gray-400 mt-2 not-italic">
                  - Sarah Chen, CTO at TechStart
                </footer>
              </blockquote>
            </div>
          </div>
        </div>

        {/* Case Study 2 */}
        <div className="mb-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-accent-500 to-primary-500 p-12 flex items-center justify-center md:order-2">
              <Building2 className="h-24 w-24 text-white" />
            </div>
            <div className="md:w-2/3 p-8 md:order-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full text-sm font-medium">
                  Enterprise
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                FinTech Corp: Aligning Stakeholders Across 3 Departments
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                A large financial technology company used Clearly to create consistent requirements
                documents, improving cross-team collaboration and reducing miscommunication.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400 mt-1" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">75%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Fewer Meetings</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-1" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">3</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Departments Aligned</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-accent-600 dark:text-accent-400 mt-1" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">2 days</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Doc Time</div>
                  </div>
                </div>
              </div>

              <blockquote className="border-l-4 border-accent-500 pl-4 italic text-gray-700 dark:text-gray-300">
                "Before Clearly, getting product, engineering, and business aligned was a nightmare of
                endless meetings. Now we have a single source of truth that everyone understands."
                <footer className="text-sm text-gray-500 dark:text-gray-400 mt-2 not-italic">
                  - Michael Rodriguez, VP of Engineering at FinTech Corp
                </footer>
              </blockquote>
            </div>
          </div>
        </div>

        {/* Case Study 3 */}
        <div className="mb-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-primary-500 to-accent-500 p-12 flex items-center justify-center">
              <Building2 className="h-24 w-24 text-white" />
            </div>
            <div className="md:w-2/3 p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                  Agency
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                DevShop: Scaling Client Projects with Consistency
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                A software development agency standardized their requirements process with Clearly,
                enabling them to take on 50% more clients without adding staff.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400 mt-1" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">50%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">More Projects</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-1" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">100%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Client Satisfaction</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-accent-600 dark:text-accent-400 mt-1" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">3 hours</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Saved per Project</div>
                  </div>
                </div>
              </div>

              <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-700 dark:text-gray-300">
                "Clearly transformed our business. We can onboard new clients faster, deliver more
                consistent results, and our team always knows exactly what needs to be built."
                <footer className="text-sm text-gray-500 dark:text-gray-400 mt-2 not-italic">
                  - Alex Kumar, Founder of DevShop
                </footer>
              </blockquote>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to write your success story?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join hundreds of teams building better software with clear requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="inline-block px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Free
            </a>
            <a
              href="/schedule-demo"
              className="inline-block px-8 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors border border-white/20"
            >
              Schedule Demo
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
