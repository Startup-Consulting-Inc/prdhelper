/**
 * Comparison Page: Clearly vs Confluence
 * Target keyword: "clearly vs confluence", "confluence alternative for requirements"
 */

import { useNavigate } from 'react-router-dom';
import { SEO } from '../../components/SEO';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { CheckCircle, XCircle, ArrowRight, Minus } from 'lucide-react';

const rows = [
  { aspect: 'Purpose-built for requirements', clearly: '✅ Yes', confluence: '❌ General wiki' },
  { aspect: 'AI-guided document creation', clearly: '✅ Full wizard', confluence: '❌ No AI guidance' },
  { aspect: 'BRD generation', clearly: '✅ Automated', confluence: '❌ Blank page' },
  { aspect: 'PRD generation', clearly: '✅ Automated', confluence: '❌ Blank page' },
  { aspect: 'Requirements structure', clearly: '✅ Enforced automatically', confluence: '❌ No enforcement' },
  { aspect: 'Non-technical user friendly', clearly: '✅ Yes (Plain Mode)', confluence: '⚠️ Steep learning curve' },
  { aspect: 'Export PDF + Word', clearly: '✅ One click', confluence: '⚠️ Requires plugin/paid plan' },
  { aspect: 'AI coding prompts', clearly: '✅ Built-in', confluence: '❌ No' },
  { aspect: 'Version control', clearly: '✅ Built-in, automatic', confluence: '✅ Yes (page history)' },
  { aspect: 'Team collaboration', clearly: '✅ Real-time', confluence: '✅ Full collaboration suite' },
  { aspect: 'Integration with Jira', clearly: '⚠️ Roadmap', confluence: '✅ Native integration' },
  { aspect: 'Pricing (small team)', clearly: 'Low cost / free trial', confluence: '$5.75+/user/month' },
];

export default function ClearlyVsConfluencePage() {
  const navigate = useNavigate();
  return (
    <PublicLayout>
      <SEO
        title="Clearly vs Confluence for Requirements Documentation – Which Is Better?"
        description="Comparing Clearly and Confluence for BRD and PRD creation. Clearly is purpose-built for requirements; Confluence is a general wiki. See which fits your team."
        path="/clearly-vs-confluence"
      />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-4 uppercase tracking-wide">Comparison</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Clearly vs Confluence
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Confluence is a powerful team wiki. Clearly is purpose-built for requirements documents. They solve different problems — here's how to choose.
          </p>
        </div>
      </section>

      {/* TL;DR */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
            <p className="text-gray-800 dark:text-gray-200 font-medium text-lg">
              <strong>TL;DR:</strong> Use Clearly to <em>create</em> your BRDs and PRDs. Store them in Confluence if your team already lives there. They're not mutually exclusive.
            </p>
          </div>
        </div>
      </section>

      {/* Quick picks */}
      <section className="py-8 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Choose Clearly if:</h2>
              <ul className="space-y-2">
                {[
                  'You need BRDs or PRDs created quickly',
                  'Your team struggles with blank-page documents',
                  'Non-technical stakeholders need to contribute',
                  "You're using AI coding tools (Cursor, Claude)",
                  'You want guaranteed document completeness',
                ].map(i => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-primary-500 flex-shrink-0" />{i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Confluence fits better if:</h2>
              <ul className="space-y-2">
                {[
                  'Your primary need is a company-wide wiki',
                  "You're already in the Atlassian ecosystem (Jira)",
                  'You want meeting notes, runbooks, and docs in one place',
                  'You have dedicated BAs who know your exact format',
                ].map(i => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
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
                  <th className="text-center p-4 text-gray-500 dark:text-gray-400 font-semibold">Confluence</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.aspect} className={i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}>
                    <td className="p-4 text-gray-700 dark:text-gray-300 font-medium text-sm">{row.aspect}</td>
                    <td className="p-4 text-center text-primary-700 dark:text-primary-300 text-sm font-medium">{row.clearly}</td>
                    <td className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">{row.confluence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">Based on publicly available information. Features may change — verify on each vendor's site.</p>
        </div>
      </section>

      {/* Why the difference matters */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Why Purpose-Built Matters for Requirements</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Confluence is excellent for storing documents — but it gives you a blank page and no guidance on what to write. This is why Confluence BRDs and PRDs are notoriously inconsistent: every author writes them differently, and critical sections (like non-functional requirements and out-of-scope definitions) are routinely skipped.</p>
            <p>Clearly's AI wizard asks the right questions in the right order — so nothing gets missed. The output is structured, complete, and consistent every time, regardless of who fills it out.</p>
            <p><strong>Best of both worlds:</strong> Use Clearly to generate the BRD or PRD, then paste or embed it in Confluence for long-term storage alongside your other team documentation.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600 dark:bg-primary-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Generate Your First BRD Free</h2>
          <p className="text-primary-100 mb-8">No credit card. 15–30 minutes. Then store it wherever your team works.</p>
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
