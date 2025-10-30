/**
 * Landing Page
 *
 * Marketing/homepage for Clearly - the intelligent requirements platform.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  Target,
  RefreshCcw,
  Users,
  Rocket,
  Zap,
  CheckCircle,
  ArrowRight,
  X
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function LandingPage() {
  const navigate = useNavigate();
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Clearly</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                Sign In
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Requirements Made Clear
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8">
            Transform ideas into professional BRDs and PRDs in minutes with AI-guided conversations. No templates. No guesswork. Just clear requirements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" onClick={() => navigate('/')}>
              Start Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => setShowVideoModal(true)}>
              View Demo
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
            No credit card required • Get started in 30 seconds
          </p>
        </div>
      </section>

      {/* What is Clearly */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              What is Clearly?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Clearly is the intelligent requirements platform that makes documentation simple. Whether you're a business stakeholder with a vision or a technical team planning implementation, our AI adapts to your expertise and creates industry-standard documentation in a fraction of the time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: 'AI conversations that adapt', description: 'Adapts to your expertise level' },
              { icon: FileText, title: 'Automatic generation', description: 'Professional BRDs, PRDs, and plans' },
              { icon: Target, title: 'Dual modes', description: 'Plain language or technical depth' },
              { icon: RefreshCcw, title: 'Complete version control', description: 'One-click regeneration' },
              { icon: Rocket, title: 'Direct integration', description: 'AI coding tools (Loveable, V0, Bolt)' },
              { icon: Users, title: 'Bridge teams', description: 'Business and technical alignment' },
            ].map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="h-10 w-10 text-primary-600 dark:text-primary-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who is Clearly For */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
            Who is Clearly For?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Business Stakeholders & Product Owners
              </h3>
              <ul className="space-y-3 mb-6">
                {[
                  'Entrepreneurs articulating their vision',
                  'Product managers defining requirements quickly',
                  'Business analysts streamlining workflows',
                  'Startup founders preparing for development',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                <strong>Plain Mode</strong> guides you through business-focused questions in accessible language, then generates ready-to-use prompts for AI coding tools.
              </p>
            </Card>

            <Card className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Technical Teams & Developers
              </h3>
              <ul className="space-y-3 mb-6">
                {[
                  'Software architects designing specifications',
                  'Development teams planning implementation',
                  'Technical leads breaking down complex projects',
                  'Engineering managers coordinating initiatives',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                <strong>Technical Mode</strong> captures detailed requirements and generates sprint-ready task lists with dependencies, priorities, and effort estimates.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Problems Solved */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
            What Problems Does Clearly Solve?
          </h2>

          <div className="space-y-6">
            {[
              {
                problem: 'Time-Consuming Documentation',
                description: 'Writing comprehensive BRDs and PRDs manually takes days or weeks, delaying project kickoff.',
                solution: 'Generate professional documents in 15-30 minutes through guided conversations. 90% faster than traditional methods.',
              },
              {
                problem: 'Inconsistent Quality',
                description: 'Requirements documents vary widely in quality, completeness, and structure.',
                solution: 'Every document follows industry-standard formats with comprehensive coverage. Professional quality, every time.',
              },
              {
                problem: 'Communication Gaps',
                description: 'Business and technical teams struggle to align on requirements.',
                solution: 'Dual-mode approach captures both perspectives in the right language for each audience. Finally, everyone\'s on the same page.',
              },
              {
                problem: 'From Idea to Code Barrier',
                description: 'Translating business requirements into development tasks is complex and error-prone.',
                solution: 'Automatic generation of technical task lists or AI coding prompts bridges the gap seamlessly.',
              },
              {
                problem: 'Version Control Chaos',
                description: 'Tracking changes and managing document versions manually is messy.',
                solution: 'Built-in version history, one-click regeneration with feedback, and automatic versioning. Always know where you stand.',
              },
            ].map((item, index) => (
              <Card key={index} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {item.problem}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Problem:</strong> {item.description}
                    </p>
                  </div>
                  <div className="bg-success-50 dark:bg-success-950/50 rounded-lg p-4">
                    <p className="text-success-900 dark:text-success-100">
                      <strong>Solution:</strong> {item.solution}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
            Key Benefits
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: '10x Faster Documentation',
                description: 'What used to take 2-3 days now takes 15-30 minutes. Focus on your product, not document formatting.',
              },
              {
                icon: Target,
                title: 'Professional Quality, Every Time',
                description: 'Industry-standard formats ensure your documentation meets stakeholder expectations.',
              },
              {
                icon: Sparkles,
                title: 'AI That Understands Context',
                description: 'Our AI remembers your answers and asks intelligent follow-up questions.',
              },
              {
                icon: RefreshCcw,
                title: 'Iterate With Confidence',
                description: 'Don\'t like the output? Provide feedback and regenerate. Every version is saved.',
              },
              {
                icon: Users,
                title: 'Bridge Business and Technical Teams',
                description: 'Both teams get documentation in their preferred language and detail level.',
              },
              {
                icon: Rocket,
                title: 'From Requirements to Code Seamlessly',
                description: 'Plain Mode generates AI coding prompts. Technical Mode delivers sprint-ready tasks.',
              },
            ].map((benefit, index) => (
              <Card key={index} className="p-6">
                <benefit.icon className="h-10 w-10 text-primary-600 dark:text-primary-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 dark:bg-primary-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for Clear Requirements?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Start generating professional documentation today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/')}
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              Schedule Demo Call
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary-400" />
              <span className="text-lg font-bold text-white">Clearly</span>
            </div>
            <p className="text-sm text-center">
              Making Requirements Clear Since 2025
            </p>
            <p className="text-sm text-center mt-2">
              Questions? Visit our Help Center or Contact Sales
            </p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="relative w-full max-w-5xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close video"
            >
              <X className="h-8 w-8" />
            </button>
            <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
              <video
                controls
                autoPlay
                muted
                playsInline
                className="w-full"
                src="/videos/Clearly__Idea_to_Code.mp4"
                onError={(e) => {
                  console.error('Video error:', e);
                  console.error('Video source:', e.currentTarget.src);
                }}
                onLoadStart={() => console.log('Video loading started')}
                onCanPlay={() => console.log('Video can play')}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
