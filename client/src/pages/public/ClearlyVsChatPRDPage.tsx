/**
 * Comparison Page: Clearly vs ChatPRD
 * Target keyword: "clearly vs chatprd", "chatprd alternative"
 */

import { useNavigate } from 'react-router-dom';
import { SEO } from '../../components/SEO';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { CheckCircle, XCircle, ArrowRight, Minus } from 'lucide-react';

const rows = [
  { aspect: 'Document types', clearly: 'BRD + PRD', other: 'PRD only' },
  { aspect: 'BRD generation', clearly: '✅ Full BRD', other: '❌ Not supported' },
  { aspect: 'Guided wizard', clearly: '✅ Full Q&A wizard', other: '⚠️ Template-based' },
  { aspect: 'Plain language mode', clearly: '✅ Yes', other: '⚠️ Limited' },
  { aspect: 'Technical mode', clearly: '✅ Sprint tasks + deps', other: '❌ No' },
  { aspect: 'AI coding prompts', clearly: '✅ Built-in', other: '❌ No' },
  { aspect: 'Real-time collaboration', clearly: '✅ Yes', other: '⚠️ Limited' },
  { aspect: 'Version history', clearly: '✅ Built-in', other: '⚠️ Manual' },
  { aspect: 'Export PDF + Word', clearly: '✅ Both', other: '⚠️ PDF only' },
  { aspect: 'Free trial', clearly: '✅ No CC required', other: '⚠️ Limited free tier' },
];

export default function ClearlyVsChatPRDPage() {
  const navigate = useNavigate();
  return (
    <PublicLayout>
      <SEO
        title="Clearly vs ChatPRD – Which AI Requirements Tool Is Better?"
        description="Comparing Clearly and ChatPRD: document types, features, pricing, and which tool is better for product managers and business analysts."
        path="/clearly-vs-chatprd"
      />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-4 uppercase tracking-wide">Comparison</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Clearly vs ChatPRD
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Both tools use AI to help with requirements documents — but they take very different approaches. Here's an honest comparison.
          </p>
        </div>
      </section>

      {/* Quick verdict */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Choose Clearly if you need:</h2>
              <ul className="space-y-2">
                {['Both BRDs and PRDs', 'Guided wizard (not a blank template)', 'AI coding prompts for Cursor/Claude', 'Sprint-ready technical task lists', 'Stakeholder collaboration'].map(i => (
                  <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary-500 flex-shrink-0" />{i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">ChatPRD may suit you if:</h2>
              <ul className="space-y-2">
                {['You only need PRDs, never BRDs', 'You prefer a template-fill approach', 'You want an established, older tool'].map(i => (
                  <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
                    <Minus className="h-4 w-4 text-gray-400 flex-shrink-0" />{i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature table */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">Feature Comparison</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="text-left p-4 text-gray-700 dark:text-gray-300 font-semibold">Feature</th>
                  <th className="text-center p-4 text-primary-600 dark:text-primary-400 font-semibold">Clearly</th>
                  <th className="text-center p-4 text-gray-500 dark:text-gray-400 font-semibold">ChatPRD</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.aspect} className={i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}>
                    <td className="p-4 text-gray-700 dark:text-gray-300 font-medium text-sm">{row.aspect}</td>
                    <td className="p-4 text-center text-primary-700 dark:text-primary-300 text-sm font-medium">{row.clearly}</td>
                    <td className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">{row.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">Based on publicly available information. Features may change — verify on each vendor's site.</p>
        </div>
      </section>

      {/* Key difference */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">The Core Difference</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>ChatPRD pioneered the AI-assisted PRD space and has a solid user base. It works well if you primarily need to fill in a PRD template quickly.</p>
            <p>Clearly takes a different approach: a conversational AI wizard that guides you through the requirements process from scratch — for both BRDs and PRDs. This matters because many teams need a BRD before they write a PRD, and skipping the BRD stage is one of the top causes of project failure.</p>
            <p>Clearly also generates AI-ready coding prompts — output specifically formatted for tools like Cursor, Claude Code, and GitHub Copilot — making it the better choice for teams using AI-assisted development.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600 dark:bg-primary-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Try Clearly Free</h2>
          <p className="text-primary-100 mb-8">No credit card required. Generate your first BRD or PRD in 15 minutes.</p>
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
