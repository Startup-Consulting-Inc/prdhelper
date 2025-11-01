/**
 * About Page
 *
 * Public page with company information and mission
 */

import { PublicLayout } from '../../components/layout/PublicLayout';
import { Sparkles, Target, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-12 w-12 text-primary-600" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              About Clearly
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We're on a mission to make professional requirements documentation accessible to everyone,
            bridging the gap between ideas and implementation.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Our Mission
          </h2>
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl p-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 text-center max-w-4xl mx-auto leading-relaxed">
              In the age of AI-assisted development, the gap between idea and implementation is closing rapidly.
              However, clear requirements remain the foundation of successful projects. Clearly empowers teams
              to articulate their vision with professional BRDs and PRDs, ensuring AI tools and human developers
              alike understand exactly what needs to be built.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Target className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Clarity First
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                We believe that clear communication is the foundation of successful projects.
                Every feature we build prioritizes clarity and ease of understanding.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                  <Users className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Accessible to All
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Professional documentation shouldn't require years of experience. We make it easy
                for anyone to create high-quality requirements documents.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Zap className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI-Enhanced
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                We leverage AI to guide, suggest, and improve - but always keep humans in control.
                AI assists, humans decide.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Why We Built Clearly
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                As developers, we've experienced the pain of unclear requirements countless times. Projects
                stall, features get built wrong, and teams waste time on rework - all because requirements
                weren't clearly documented from the start.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                With the rise of AI coding assistants, this problem became even more critical. AI tools can
                build software incredibly fast, but they need clear instructions. "Garbage in, garbage out"
                has never been more true.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                We realized that the bottleneck wasn't coding anymore - it was requirements. Many teams skip
                formal BRDs and PRDs because they seem too time-consuming or complicated. But without them,
                even the best AI tools will build the wrong thing.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                That's why we built Clearly: to make creating professional requirements documents as easy
                as having a conversation. Now anyone can articulate their vision clearly, ensuring successful
                projects whether they're built by humans, AI, or both.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join teams who are building better software with clear requirements.
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
