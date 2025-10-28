import type { Meta, StoryObj } from '@storybook/react';
import { DocumentExport } from '@/components/document/DocumentExport';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const meta = {
  title: 'Document/DocumentExport',
  component: DocumentExport,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DocumentExport>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: (open) => console.log('Dialog open:', open),
    onExport: async (format) => {
      console.log('Export format:', format);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    },
    documentTitle: 'E-Commerce Platform BRD',
  },
};

export const LimitedFormats: Story = {
  args: {
    open: true,
    onOpenChange: (open) => console.log('Dialog open:', open),
    onExport: async (format) => {
      console.log('Export format:', format);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    },
    documentTitle: 'Business Requirements Document',
    availableFormats: ['pdf', 'docx'],
  },
};

export const Exporting: Story = {
  args: {
    open: true,
    onOpenChange: (open) => console.log('Dialog open:', open),
    onExport: async (format) => console.log('Export format:', format),
    documentTitle: 'Product Requirements Document',
    isExporting: true,
  },
};

export const Interactive = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async (format: string) => {
      console.log('Exporting as:', format);
      setIsExporting(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsExporting(false);
      alert(`Document exported as ${format.toUpperCase()}!`);
    };

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Export Document</Button>
        <DocumentExport
          open={open}
          onOpenChange={setOpen}
          onExport={handleExport}
          documentTitle="E-Commerce Platform BRD"
          isExporting={isExporting}
        />
      </div>
    );
  },
};

export const InDocumentContext = {
  render: () => {
    const [open, setOpen] = useState(false);

    const handleExport = async (format: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert(`Downloaded as ${format.toUpperCase()}`);
    };

    return (
      <div className="max-w-5xl p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Business Requirements Document</h2>
            <Button variant="outline" onClick={() => setOpen(true)}>
              Export
            </Button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Document content would be displayed here...
          </p>
        </div>

        <DocumentExport
          open={open}
          onOpenChange={setOpen}
          onExport={handleExport}
          documentTitle="Business Requirements Document"
        />
      </div>
    );
  },
};

export const AllFormatsDemo = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <div>
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg max-w-md">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Available Formats:</strong>
            <br />
            • PDF - Best for printing
            <br />
            • Word - Edit in Microsoft Word
            <br />
            • Markdown - Plain text format
            <br />• HTML - Web page format
          </p>
        </div>
        <DocumentExport
          open={open}
          onOpenChange={setOpen}
          onExport={async (format) => {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            alert(`Exported as ${format}`);
          }}
          documentTitle="E-Commerce Platform PRD"
        />
      </div>
    );
  },
};

export const AccessibilityDemo: Story = {
  args: {
    open: true,
    onOpenChange: (open) => console.log('Dialog open:', open),
    onExport: async (format) => console.log('Export:', format),
    documentTitle: 'Accessible Document Export',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The export dialog includes keyboard navigation, clear format descriptions, and accessible selection states.',
      },
    },
  },
};

