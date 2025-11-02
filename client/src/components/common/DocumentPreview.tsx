/**
 * Document Preview Component
 * 
 * Renders markdown content with syntax highlighting and copy/download actions.
 * Used for displaying document content in preview mode.
 * 
 * Recent Changes:
 * - [2025-10-27] FEAT: Added document preview with markdown rendering
 */

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@/lib/utils/cn';
import { Button } from '../ui/Button';
import { Copy, Download, Check } from 'lucide-react';
import 'highlight.js/styles/github-dark.css';

export interface DocumentPreviewProps {
  content: string;
  title?: string;
  showActions?: boolean;
  className?: string;
  onDownload?: () => void;
}

const DocumentPreview = ({
  content,
  title,
  showActions = true,
  className,
  onDownload,
}: DocumentPreviewProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950',
        className
      )}
    >
      {(title || showActions) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          )}
          {showActions && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                aria-label={copied ? 'Copied' : 'Copy to clipboard'}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              {onDownload && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDownload}
                  aria-label="Download document"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          )}
        </div>
      )}
      <div className="px-6 py-6 overflow-auto max-h-[600px]">
        <div
          className={cn(
            'prose prose-gray dark:prose-invert max-w-none',
            'prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-gray-100',
            'prose-h1:mt-12 prose-h1:mb-6',
            'prose-h2:mt-10 prose-h2:mb-5',
            'prose-h3:mt-8 prose-h3:mb-4',
            'prose-h4:mt-6 prose-h4:mb-3',
            'prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:mb-4',
            'prose-a:text-primary-600 dark:prose-a:text-primary-400',
            'prose-strong:text-gray-900 dark:prose-strong:text-gray-100',
            'prose-code:text-gray-900 dark:prose-code:text-gray-100',
            'prose-code:bg-gray-100 dark:prose-code:bg-gray-800',
            'prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
            'prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900',
            'prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-800',
            'prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-ul:mb-4',
            'prose-ol:text-gray-700 dark:prose-ol:text-gray-300 prose-ol:mb-4',
            'prose-li:text-gray-700 dark:prose-li:text-gray-300',
            'prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700',
            'prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300',
            'prose-hr:border-gray-200 dark:prose-hr:border-gray-800',
            'prose-table:text-gray-700 dark:prose-table:text-gray-300 prose-table:mb-6',
            'prose-th:border-gray-300 dark:prose-th:border-gray-700',
            'prose-td:border-gray-300 dark:prose-td:border-gray-700'
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  {...props}
                  className={cn(
                    'text-3xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-6',
                    props.className
                  )}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  {...props}
                  className={cn(
                    'text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-10 mb-5',
                    props.className
                  )}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  {...props}
                  className={cn(
                    'text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4',
                    props.className
                  )}
                />
              ),
              h4: ({ node, ...props }) => (
                <h4
                  {...props}
                  className={cn(
                    'text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3',
                    props.className
                  )}
                />
              ),
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

DocumentPreview.displayName = 'DocumentPreview';

export { DocumentPreview };
