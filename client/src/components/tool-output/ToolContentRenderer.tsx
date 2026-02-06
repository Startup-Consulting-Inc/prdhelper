/**
 * Tool Content Renderer
 *
 * Renders tool output content with appropriate formatting:
 * - .md files → rendered markdown
 * - .json files → syntax-highlighted code
 * - .toml files → syntax-highlighted code
 * - other files → raw pre-formatted text
 *
 * Includes a raw/rendered toggle for markdown files.
 */

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { cn } from '../../lib/utils/cn';
import { Eye, Code } from 'lucide-react';

interface ToolContentRendererProps {
  content: string;
  filePath?: string;
  isMarkdown?: boolean;
  className?: string;
}

function getFileType(filePath: string): 'markdown' | 'json' | 'toml' | 'code' {
  const lower = filePath.toLowerCase();
  if (lower.endsWith('.md') || lower.endsWith('.mdc')) return 'markdown';
  if (lower.endsWith('.json')) return 'json';
  if (lower.endsWith('.toml')) return 'toml';
  return 'code';
}

function getLanguageClass(filePath: string): string {
  const lower = filePath.toLowerCase();
  if (lower.endsWith('.json')) return 'language-json';
  if (lower.endsWith('.toml')) return 'language-toml';
  if (lower.endsWith('.yaml') || lower.endsWith('.yml')) return 'language-yaml';
  if (lower.endsWith('.ts') || lower.endsWith('.tsx')) return 'language-typescript';
  if (lower.endsWith('.js') || lower.endsWith('.jsx')) return 'language-javascript';
  return '';
}

const proseClasses = cn(
  'prose prose-sm prose-gray dark:prose-invert max-w-none',
  'prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-gray-100',
  'prose-h1:text-2xl prose-h1:mt-8 prose-h1:mb-4',
  'prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3',
  'prose-h3:text-lg prose-h3:mt-5 prose-h3:mb-2',
  'prose-h4:text-base prose-h4:mt-4 prose-h4:mb-2',
  'prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:mb-3',
  'prose-a:text-primary-600 dark:prose-a:text-primary-400',
  'prose-strong:text-gray-900 dark:prose-strong:text-gray-100',
  'prose-code:text-gray-900 dark:prose-code:text-gray-100',
  'prose-code:bg-gray-100 dark:prose-code:bg-gray-800',
  'prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs',
  'prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100',
  'prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-800',
  'prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-ul:mb-3',
  'prose-ol:text-gray-700 dark:prose-ol:text-gray-300 prose-ol:mb-3',
  'prose-li:text-gray-700 dark:prose-li:text-gray-300',
  'prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700',
  'prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300',
  'prose-table:text-gray-700 dark:prose-table:text-gray-300 prose-table:mb-4',
  'prose-th:border-gray-300 dark:prose-th:border-gray-700',
  'prose-td:border-gray-300 dark:prose-td:border-gray-700',
);

function MarkdownContent({ content }: { content: string }) {
  return (
    <div className={proseClasses}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          a: ({ ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeContent({ content, languageClass }: { content: string; languageClass?: string }) {
  return (
    <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
      <code className={languageClass}>{content}</code>
    </pre>
  );
}

export function ToolContentRenderer({ content, filePath, isMarkdown, className }: ToolContentRendererProps) {
  const fileType = filePath ? getFileType(filePath) : (isMarkdown ? 'markdown' : 'code');
  const shouldRenderMarkdown = fileType === 'markdown' || isMarkdown;
  const [showRaw, setShowRaw] = useState(false);

  return (
    <div className={className}>
      {/* Toggle for markdown content */}
      {shouldRenderMarkdown && (
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors px-2 py-1 rounded border border-gray-200 dark:border-gray-700"
          >
            {showRaw ? (
              <>
                <Eye className="h-3 w-3" />
                Preview
              </>
            ) : (
              <>
                <Code className="h-3 w-3" />
                Raw
              </>
            )}
          </button>
        </div>
      )}

      {/* Content */}
      {shouldRenderMarkdown && !showRaw ? (
        <MarkdownContent content={content} />
      ) : fileType === 'json' || fileType === 'toml' ? (
        <CodeContent content={content} languageClass={filePath ? getLanguageClass(filePath) : undefined} />
      ) : (
        <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
          {content}
        </pre>
      )}
    </div>
  );
}

export default ToolContentRenderer;
