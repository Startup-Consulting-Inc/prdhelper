import type { Meta, StoryObj } from '@storybook/react';
import { DocumentVersionHistory } from '@/components/document/DocumentVersionHistory';

const meta = {
  title: 'Document/DocumentVersionHistory',
  component: DocumentVersionHistory,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DocumentVersionHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockVersions = [
  {
    id: '4',
    version: '1.3',
    description: 'Updated stakeholder section with new team members',
    author: 'John Smith',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isCurrent: true,
  },
  {
    id: '3',
    version: '1.2',
    description: 'Added detailed timeline and milestones',
    author: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isCurrent: false,
  },
  {
    id: '2',
    version: '1.1',
    description: 'Refined business goals based on stakeholder feedback',
    author: 'Mike Wilson',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isCurrent: false,
  },
  {
    id: '1',
    version: '1.0',
    description: 'Initial version of the BRD',
    author: 'AI Assistant',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isCurrent: false,
  },
];

export const WithHistory: Story = {
  args: {
    versions: mockVersions,
    onRestore: (id) => console.log('Restore version:', id),
    onViewVersion: (id) => console.log('View version:', id),
  },
};

export const Empty: Story = {
  args: {
    versions: [],
  },
};

export const SingleVersion: Story = {
  args: {
    versions: [mockVersions[0]],
    onViewVersion: (id) => console.log('View version:', id),
  },
};

export const Interactive = {
  render: () => {
    const handleRestore = (versionId: string) => {
      if (confirm('Are you sure you want to restore this version?')) {
        alert(`Restoring version ${versionId}`);
      }
    };

    const handleView = (versionId: string) => {
      alert(`Viewing version ${versionId}`);
    };

    return (
      <div className="max-w-3xl">
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Version History:</strong> View previous versions and restore them if needed.
          </p>
        </div>
        <DocumentVersionHistory
          versions={mockVersions}
          onRestore={handleRestore}
          onViewVersion={handleView}
        />
      </div>
    );
  },
};

export const InDocumentSidebar = {
  render: () => (
    <div className="flex gap-6 min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="flex-1">
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-2xl font-bold mb-4">Document Content</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Main document content would be displayed here...
          </p>
        </div>
      </div>

      <div className="w-80 flex-shrink-0">
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6 sticky top-6">
          <h3 className="text-lg font-semibold mb-4">Version History</h3>
          <DocumentVersionHistory
            versions={mockVersions}
            onRestore={(id) => alert(`Restore ${id}`)}
            onViewVersion={(id) => alert(`View ${id}`)}
          />
        </div>
      </div>
    </div>
  ),
};

export const AccessibilityDemo: Story = {
  args: {
    versions: mockVersions,
    onRestore: (id) => console.log('Restore:', id),
    onViewVersion: (id) => console.log('View:', id),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Version history includes clear labeling, keyboard navigation, and accessible action buttons.',
      },
    },
  },
};

