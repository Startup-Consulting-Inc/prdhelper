/**
 * Monospace doc excerpt for “Beyond Vibe Coding” posts (README-style blocks).
 */

import type { ReactNode } from 'react';

interface AgenticDocPreProps {
  children: ReactNode;
  caption?: string;
}

export function AgenticDocPre({ children, caption }: AgenticDocPreProps) {
  return (
    <figure className="my-10 not-prose">
      {caption ? (
        <figcaption className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      ) : null}
      <pre className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-950 px-4 py-5 sm:px-6 sm:py-6 text-[0.72rem] sm:text-[0.8125rem] leading-relaxed text-gray-100 font-mono whitespace-pre-wrap break-words shadow-inner">
        {children}
      </pre>
    </figure>
  );
}
