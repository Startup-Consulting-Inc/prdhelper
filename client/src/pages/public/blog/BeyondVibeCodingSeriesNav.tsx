/**
 * Series banner + episode picker + prev/next for “Beyond Vibe Coding”.
 */

import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  BEYOND_VIBE_CODING_SERIES_POSTS,
  BEYOND_VIBE_CODING_SERIES_TITLE,
  type BeyondVibeCodingSeriesPart,
} from './beyondVibeCodingSeries';

interface BeyondVibeCodingSeriesNavProps {
  currentPart: BeyondVibeCodingSeriesPart;
}

function getSeriesNeighbors(currentPart: BeyondVibeCodingSeriesPart) {
  const total = BEYOND_VIBE_CODING_SERIES_POSTS.length;
  const idx = currentPart - 1;
  const prev = idx > 0 ? BEYOND_VIBE_CODING_SERIES_POSTS[idx - 1] : null;
  const next = idx < total - 1 ? BEYOND_VIBE_CODING_SERIES_POSTS[idx + 1] : null;
  return { total, prev, next };
}

/** Series label + episode picker — place after the article hero, before body content. */
export function BeyondVibeCodingSeriesBanner({
  currentPart,
}: BeyondVibeCodingSeriesNavProps) {
  const total = BEYOND_VIBE_CODING_SERIES_POSTS.length;

  const linkBase =
    'inline-flex items-center justify-center min-w-[2.25rem] h-9 rounded-lg text-sm font-semibold transition-colors border';

  return (
    <nav
      className="mb-10 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 bg-gradient-to-b from-emerald-50/95 to-white dark:from-emerald-950/40 dark:to-gray-900/40 px-5 sm:px-7 py-6 shadow-sm"
      aria-label={`${BEYOND_VIBE_CODING_SERIES_TITLE} series`}
    >
      <p className="m-0 text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
        Series
      </p>
      <p className="mt-2 mb-1 text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        {BEYOND_VIBE_CODING_SERIES_TITLE}
      </p>
      <p className="m-0 text-sm text-gray-600 dark:text-gray-300">
        Post {currentPart} of {total} · Read in order or jump to any episode below.
      </p>

      <ul className="mt-5 flex flex-wrap gap-2 list-none p-0 m-0" role="list">
        {BEYOND_VIBE_CODING_SERIES_POSTS.map((post) => {
          const isCurrent = post.part === currentPart;
          return (
            <li key={post.slug} className="m-0 p-0">
              <Link
                to={`/blog/${post.slug}`}
                className={`${linkBase} ${
                  isCurrent
                    ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-600'
                    : 'border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-900/50 text-gray-700 dark:text-gray-200 hover:border-emerald-400 hover:text-emerald-800 dark:hover:border-emerald-500 dark:hover:text-emerald-300'
                } px-3`}
                aria-current={isCurrent ? 'page' : undefined}
                title={post.title}
              >
                {post.part}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Previous / next episode cards — place after article body. */
export function BeyondVibeCodingSeriesFooter({
  currentPart,
}: BeyondVibeCodingSeriesNavProps) {
  const { prev, next } = getSeriesNeighbors(currentPart);

  return (
    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
      <div className="min-h-[5rem] flex">
        {prev ? (
          <Link
            to={`/blog/${prev.slug}`}
            className="group flex flex-col justify-center w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 px-5 py-4 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors"
          >
            <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
              Previous
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 leading-snug">
              {prev.title}
            </span>
          </Link>
        ) : (
          <div className="flex flex-col justify-center w-full rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
            First post in this series.
          </div>
        )}
      </div>

      <div className="min-h-[5rem] flex sm:justify-end">
        {next ? (
          <Link
            to={`/blog/${next.slug}`}
            className="group flex flex-col justify-center w-full sm:text-right rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 px-5 py-4 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors"
          >
            <span className="flex items-center gap-1 sm:flex-row-reverse text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Next
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 leading-snug">
              {next.title}
            </span>
          </Link>
        ) : (
          <div className="flex flex-col justify-center w-full sm:text-right rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
            Final post in this series.
          </div>
        )}
      </div>
    </div>
  );
}

