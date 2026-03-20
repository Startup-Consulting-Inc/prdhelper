/**
 * Comparison Page: Clearly vs Manual BRD/PRD Writing
 * Target keyword: "BRD generator vs manual", "AI requirements vs manual"
 */

import { useNavigate } from 'react-router-dom';
import { SEO } from '../../components/SEO';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { CheckCircle, XCircle, ArrowRight, Clock, FileText, Users, Zap } from 'lucide-react';

const rows = [
  { aspect: 'Time to complete', clearly: '15–30 minutes', manual: '2–5 days' },
  { aspect: 'Guided process', clearly: '✅ AI wizard', manual: '❌ Blank page' },
  { aspect: 'Section completeness', clearly: '✅ Always complete', manual: '❌ Easy to miss sections' },
  { aspect: 'Consistent structure', clearly: '✅ Every time', manual: '❌ Varies by author' },
  { aspect: 'Non-functional requirements', clearly: '✅ Automatically captured', manual: '❌ Frequently skipped' },
  { aspect: 'Stakeholder review', clearly: '✅ Shareable link', manual: '⚠️ Email attachment' },
  { aspect: 'Version control', clearly: '✅ Built-in history', manual: '❌ Manual (v1, v2, FINAL…)' },
  { aspect: 'Export PDF + Word', clearly: '✅ One click', manual: '✅ Yes (but formatting is manual)' },
  { aspect: 'AI coding prompts', clearly: '✅ Auto-generated', manual: '❌ Manual extra work' },
  { aspect: 'Cost', clearly: 'Free trial, then paid', manual: 'Free (just your time)' },
];

export default function ClearlyVsManualPage() {
  const navigate = useNavigate();
  return (
    <PublicLayout>
      <SEO
        title="AI BRD Generator vs Manual Writing – Is Clearly Worth It?"
        description="Comparing AI-generated BRDs and PRDs (Clearly) vs writing them manually in Word or Notion. Time savings, quality differences, and when each approach makes sense."
        path="/clearly-vs-manual"
      />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-4 uppercase tracking-wide">Comparison</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            AI BRD Generator vs Manual Writing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Is writing BRDs and PRDs manually still the right choice? We break down the real tradeoffs — time, quality, and cost.
          </p>
        </div>
      </section>

      {/* Time cost callout */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { icon: Clock, stat: '2–5 days', label: 'Average time to write a BRD manually', color: 'text-red-500' },
              { icon: Zap, stat: '15–30 min', label: 'Time to generate a BRD with Clearly', color: 'text-green-500' },
              { icon: FileText, stat: '90%', label: 'Faster with AI-assisted generation', color: 'text-primary-500' },
            ].map(({ icon: Icon, stat, label, color }) => (
              <div key={stat} className="p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <Icon className={`h-8 w-8 ${color} mx-auto mb-3`} />
                <div className={`text-3xl font-bold ${color} mb-2`}>{stat}</div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature table */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">Side-by-Side Comparison</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="text-left p-4 text-gray-700 dark:text-gray-300 font-semibold">Aspect</th>
                  <th className="text-center p-4 text-primary-600 dark:text-primary-400 font-semibold">Clearly (AI)</th>
                  <th className="text-center p-4 text-gray-500 dark:text-gray-400 font-semibold">Manual (Word/Notion)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.aspect} className={i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}>
                    <td className="p-4 text-gray-700 dark:text-gray-300 font-medium text-sm">{row.aspect}</td>
                    <td className="p-4 text-center text-primary-700 dark:text-primary-300 text-sm font-medium">{row.clearly}</td>
                    <td className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">{row.manual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* When manual wins / when AI wins */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">When Each Approach Makes Sense</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950/20">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Use Clearly when:</h3>
              <ul className="space-y-2">
                {[
                  'You need a complete BRD or PRD quickly',
                  'Your team lacks a dedicated BA or PM',
                  'You want consistent structure across all projects',
                  "You're building with AI coding tools",
                  'Non-technical stakeholders need to contribute',
                  'You want version history without managing files',
                ].map(i => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-primary-500 flex-shrink-0 mt-0.5" />{i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Manual writing still works when:</h3>
              <ul className="space-y-2">
                {[
                  'You have a skilled BA with lots of time',
                  'Your organization has rigid document templates',
                  'The project is trivially simple (1-page spec)',
                  'Compliance requires a specific proprietary format',
                ].map(i => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <XCircle className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />{i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The hidden cost */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">The Hidden Cost of Manual Requirements</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Manual writing looks "free" because you're not paying for a tool. But the real costs are:</p>
            <ul>
              <li><strong>Senior time</strong>: A senior PM or BA spending 3 days on a BRD costs $1,500–$3,000 in loaded salary.</li>
              <li><strong>Missed sections</strong>: Manual BRDs frequently omit non-functional requirements, out-of-scope definitions, and success criteria — gaps that cause expensive rework later.</li>
              <li><strong>Inconsistency</strong>: Every author has a different style. New team members struggle to work with unfamiliar document structures.</li>
              <li><strong>Rework</strong>: IBM research found that requirements defects discovered after development cost 30–100× more to fix than requirements defects caught before development starts.</li>
            </ul>
            <p>Clearly pays for itself after one project if it prevents even a single day of engineering rework caused by unclear requirements.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600 dark:bg-primary-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">See What Clearly Generates</h2>
          <p className="text-primary-100 mb-8">Try it free. No credit card. Your first BRD or PRD in 15–30 minutes.</p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Start Free Trial <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </PublicLayout>
  );
}
