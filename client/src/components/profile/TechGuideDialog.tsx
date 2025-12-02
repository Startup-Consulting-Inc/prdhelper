/**
 * Tech Guide Dialog Component
 *
 * Displays detailed guidance for tech stack categories including:
 * - Category overview
 * - Side-by-side comparison table
 * - Pros/cons analysis
 * - Best use cases
 * - External documentation links
 * - Recommendations
 */

import { ExternalLink, CheckCircle2, XCircle, Info } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { TECH_GUIDANCE, type TechOptionGuidance } from '@/data/techGuidance';
import { cn } from '@/lib/utils/cn';

interface TechGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: keyof typeof TECH_GUIDANCE | null;
}

export function TechGuideDialog({
  open,
  onOpenChange,
  category,
}: TechGuideDialogProps) {
  if (!category || !TECH_GUIDANCE[category]) {
    return null;
  }

  const guidance = TECH_GUIDANCE[category];

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`${guidance.title} Guide`}
      description={guidance.description}
    >
      <div className="space-y-6">
        {/* Overview Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary-500" />
            Overview
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {guidance.overview}
          </p>
        </section>

        {/* Comparison Table Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Option Comparison
          </h3>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Option
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Description
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Pros & Cons
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Best For
                  </th>
                  <th className="text-center p-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Setup
                  </th>
                  <th className="text-center p-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Docs
                  </th>
                </tr>
              </thead>
              <tbody>
                {guidance.options.map((option, index) => (
                  <tr
                    key={index}
                    className={cn(
                      'border-b border-gray-100 dark:border-gray-800',
                      index % 2 === 0
                        ? 'bg-gray-50/50 dark:bg-gray-900/30'
                        : 'bg-white dark:bg-gray-900'
                    )}
                  >
                    <td className="p-3 align-top">
                      <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                        {option.name}
                      </div>
                      {option.popularity && (
                        <span
                          className={cn(
                            'inline-block mt-1 px-2 py-0.5 text-xs rounded-full',
                            option.popularity === 'High' &&
                              'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
                            option.popularity === 'Medium' &&
                              'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
                            option.popularity === 'Growing' &&
                              'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          )}
                        >
                          {option.popularity}
                        </span>
                      )}
                    </td>
                    <td className="p-3 align-top">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {option.description}
                      </p>
                    </td>
                    <td className="p-3 align-top">
                      <div className="space-y-2">
                        {option.pros.slice(0, 3).map((pro, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-1.5 text-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {pro}
                            </span>
                          </div>
                        ))}
                        {option.cons.slice(0, 2).map((con, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-1.5 text-xs"
                          >
                            <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {con}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 align-top">
                      <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                        {option.bestFor.slice(0, 3).map((use, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-primary-500 mt-0.5">•</span>
                            <span>{use}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3 align-top text-center">
                      <span
                        className={cn(
                          'inline-block px-2 py-1 text-xs rounded-md font-medium',
                          option.setupDifficulty === 'Easy' &&
                            'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
                          option.setupDifficulty === 'Moderate' &&
                            'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
                          option.setupDifficulty === 'Complex' &&
                            'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        )}
                      >
                        {option.setupDifficulty}
                      </span>
                    </td>
                    <td className="p-3 align-top text-center">
                      {option.documentation && (
                        <a
                          href={option.documentation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          aria-label={`${option.name} documentation`}
                        >
                          <ExternalLink className="w-4 h-4 text-primary-500" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden space-y-4">
            {guidance.options.map((option, index) => (
              <OptionCard key={index} option={option} />
            ))}
          </div>
        </section>

        {/* Recommendations Section */}
        <section className="bg-primary-50/50 dark:bg-primary-900/10 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Recommendations
          </h3>
          <ul className="space-y-2">
            {guidance.recommendations.map((rec, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <CheckCircle2 className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Learn More Link */}
        {guidance.learnMoreUrl && (
          <div className="text-center">
            <a
              href={guidance.learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Learn more about {guidance.title.toLowerCase()} options
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </div>
    </Dialog>
  );
}

/**
 * Mobile/Tablet Card Component for Options
 */
function OptionCard({ option }: { option: TechOptionGuidance }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-base text-gray-900 dark:text-gray-100">
            {option.name}
          </h4>
          {option.popularity && (
            <span
              className={cn(
                'inline-block mt-1 px-2 py-0.5 text-xs rounded-full',
                option.popularity === 'High' &&
                  'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
                option.popularity === 'Medium' &&
                  'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
                option.popularity === 'Growing' &&
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              )}
            >
              {option.popularity}
            </span>
          )}
        </div>
        <span
          className={cn(
            'px-2 py-1 text-xs rounded-md font-medium whitespace-nowrap',
            option.setupDifficulty === 'Easy' &&
              'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
            option.setupDifficulty === 'Moderate' &&
              'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
            option.setupDifficulty === 'Complex' &&
              'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          )}
        >
          {option.setupDifficulty}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 dark:text-gray-300">
        {option.description}
      </p>

      {/* Pros */}
      <div>
        <h5 className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Pros
        </h5>
        <ul className="space-y-1">
          {option.pros.map((pro, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cons */}
      <div>
        <h5 className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Cons
        </h5>
        <ul className="space-y-1">
          {option.cons.map((con, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs">
              <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{con}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Best For */}
      <div>
        <h5 className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Best For
        </h5>
        <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
          {option.bestFor.map((use, i) => (
            <li key={i} className="flex items-start gap-1">
              <span className="text-primary-500 mt-0.5">•</span>
              <span>{use}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Documentation Link */}
      {option.documentation && (
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
          <a
            href={option.documentation}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Documentation
          </a>
        </div>
      )}
    </div>
  );
}
