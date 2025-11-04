/**
 * Document Viewer Component
 * 
 * Displays documents with preview/markdown toggle, copy/download actions.
 * Supports syntax highlighting and responsive design for BRD/PRD/Tasks.
 * 
 * Recent Changes:
 * - [2025-10-27] FEAT: Added document viewer with markdown preview and actions
 */

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';
import { Button } from '../ui/Button';
import { Copy, Check, Download, FileText } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { stripDocumentMarkers } from '@/lib/utils/contentFilter';
import 'highlight.js/styles/github-dark.css';

type ViewMode = 'preview' | 'markdown';

export interface DocumentViewerProps {
  title: string;
  content: string;
  documentType: 'BRD' | 'PRD' | 'Tasks';
  lastModified?: Date;
  onDownload?: () => void;
  onEdit?: () => void;
  showActions?: boolean;
  defaultViewMode?: ViewMode;
  className?: string;
}

const DocumentViewer = ({
  title,
  content,
  documentType,
  lastModified,
  onDownload,
  onEdit,
  showActions = true,
  defaultViewMode = 'preview',
  className,
}: DocumentViewerProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const documentTypeConfig = {
    BRD: { label: 'Business Requirements', icon: FileText, color: 'text-blue-600 dark:text-blue-400' },
    PRD: { label: 'Product Requirements', icon: FileText, color: 'text-purple-600 dark:text-purple-400' },
    Tasks: { label: 'Technical Tasks', icon: FileText, color: 'text-green-600 dark:text-green-400' },
  };

  const config = documentTypeConfig[documentType];
  const Icon = config.icon;

  const tabs = [
    { value: 'preview', label: 'Preview', content: <></> },
    { value: 'markdown', label: 'Markdown', content: <></> },
  ];

  return (
    <div className={cn('bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm', className)}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Icon className={cn('h-5 w-5', config.color)} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {config.label}
                {lastModified && ` • Last modified ${lastModified.toLocaleDateString()}`}
              </p>
            </div>
          </div>

          {showActions && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                iconLeft={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
              {onDownload && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDownload}
                  iconLeft={<Download className="h-4 w-4" />}
                >
                  Download
                </Button>
              )}
              {onEdit && (
                <Button variant="primary" size="sm" onClick={onEdit}>
                  Edit
                </Button>
              )}
            </div>
          )}
        </div>

        {/* View mode tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setViewMode('preview')}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              viewMode === 'preview'
                ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            )}
          >
            Preview
          </button>
          <button
            onClick={() => setViewMode('markdown')}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              viewMode === 'markdown'
                ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            )}
          >
            Markdown
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {viewMode === 'preview' ? (
          <div
            className={cn(
              'prose prose-gray dark:prose-invert max-w-none',
              'prose-headings:font-semibold prose-a:text-primary-600 dark:prose-a:text-primary-400',
              'prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-code:rounded prose-code:px-1 prose-code:py-0.5',
              'prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100'
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
              }}
            >
              {stripDocumentMarkers(content)}
            </ReactMarkdown>
          </div>
        ) : (
          <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-auto text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono border border-gray-200 dark:border-gray-800">
            {stripDocumentMarkers(content)}
          </pre>
        )}
      </div>
    </div>
  );
};

DocumentViewer.displayName = 'DocumentViewer';

export { DocumentViewer };
