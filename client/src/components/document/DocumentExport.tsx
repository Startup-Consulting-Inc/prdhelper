/**
 * Document Export Component
 * 
 * Modal dialog for exporting documents in multiple formats (PDF, DOCX, Markdown, HTML).
 * Provides format selection and export progress feedback.
 * 
 * Recent Changes:
 * - [2025-10-27] FEAT: Added document export dialog with multiple format support
 */

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Dialog } from '../ui/Dialog';
import { FileText, FileDown, Download, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type ExportFormat = 'pdf' | 'docx' | 'markdown' | 'html';

export interface DocumentExportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: ExportFormat) => Promise<void>;
  documentTitle: string;
  availableFormats?: ExportFormat[];
  isExporting?: boolean;
  className?: string;
}

const DocumentExport = ({
  open,
  onOpenChange,
  onExport,
  documentTitle,
  availableFormats = ['pdf', 'docx', 'markdown', 'html'],
  isExporting = false,
  className,
}: DocumentExportProps) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [justExported, setJustExported] = useState(false);

  const formatConfig = {
    pdf: {
      label: 'PDF',
      description: 'Best for printing and sharing',
      icon: FileText,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
    },
    docx: {
      label: 'Word Document',
      description: 'Edit in Microsoft Word',
      icon: FileDown,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    markdown: {
      label: 'Markdown',
      description: 'Plain text with formatting',
      icon: FileText,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
    },
    html: {
      label: 'HTML',
      description: 'Web page format',
      icon: FileText,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    },
  };

  const handleExport = async () => {
    await onExport(selectedFormat);
    setJustExported(true);
    setTimeout(() => {
      setJustExported(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Export Document"
      description="Choose a format to download your document"
    >
      <div className={cn('space-y-6', className)}>
        {/* Document info */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {documentTitle}
          </p>
        </div>

        {/* Format selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Format
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableFormats.map((format) => {
              const config = formatConfig[format];
              const Icon = config.icon;
              const isSelected = selectedFormat === format;

              return (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  disabled={isExporting}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all text-left',
                    'hover:bg-gray-50 dark:hover:bg-gray-900',
                    isSelected
                      ? 'border-primary-500 ring-2 ring-primary-500 dark:border-primary-400 dark:ring-primary-400'
                      : 'border-gray-200 dark:border-gray-800',
                    isExporting && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('p-2 rounded-lg', config.bgColor)}>
                      <Icon className={cn('h-5 w-5', config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {config.label}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {config.description}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={isExporting || justExported}
            isLoading={isExporting}
            iconLeft={
              justExported ? (
                <Check className="h-4 w-4" />
              ) : (
                <Download className="h-4 w-4" />
              )
            }
          >
            {justExported ? 'Downloaded!' : isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

DocumentExport.displayName = 'DocumentExport';

export { DocumentExport };

