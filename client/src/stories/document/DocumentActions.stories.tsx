import type { Meta, StoryObj } from '@storybook/react';
import { DocumentActions } from '@/components/document/DocumentActions';

const meta = {
  title: 'Document/DocumentActions',
  component: DocumentActions,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DocumentActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: {
    approvalStatus: 'pending',
    onApprove: () => console.log('Approve'),
    onReject: () => console.log('Reject'),
    onEdit: () => console.log('Edit'),
    onShare: () => console.log('Share'),
    onDownload: () => console.log('Download'),
  },
};

export const Approved: Story = {
  args: {
    approvalStatus: 'approved',
    onApprove: () => console.log('Approve'),
    onReject: () => console.log('Reject'),
    onEdit: () => console.log('Edit'),
    onShare: () => console.log('Share'),
    onDownload: () => console.log('Download'),
  },
};

export const Rejected: Story = {
  args: {
    approvalStatus: 'rejected',
    onApprove: () => console.log('Approve'),
    onReject: () => console.log('Reject'),
    onEdit: () => console.log('Edit'),
    onShare: () => console.log('Share'),
    onDownload: () => console.log('Download'),
  },
};

export const WithoutApproval: Story = {
  args: {
    showApproval: false,
    onEdit: () => console.log('Edit'),
    onShare: () => console.log('Share'),
    onDownload: () => console.log('Download'),
  },
};

export const Loading: Story = {
  args: {
    approvalStatus: 'pending',
    onApprove: () => console.log('Approve'),
    onReject: () => console.log('Reject'),
    isLoading: true,
  },
};

export const Interactive = {
  render: () => {
    const handleApprove = () => alert('Document approved!');
    const handleReject = () => {
      if (confirm('Are you sure you want to reject this document?')) {
        alert('Document rejected');
      }
    };
    const handleEdit = () => alert('Opening editor...');
    const handleShare = () => alert('Share dialog would open here');
    const handleDownload = () => alert('Downloading document...');

    return (
      <div className="max-w-3xl space-y-6">
        <div className="p-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-2">Business Requirements Document</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Review the document and approve or reject it.
          </p>
        </div>
        <DocumentActions
          onApprove={handleApprove}
          onReject={handleReject}
          onEdit={handleEdit}
          onShare={handleShare}
          onDownload={handleDownload}
        />
      </div>
    );
  },
};

// Accessibility demo
export const AccessibilityDemo: Story = {
  args: {
    approvalStatus: 'pending',
    onApprove: () => console.log('Approve'),
    onReject: () => console.log('Reject'),
    onEdit: () => console.log('Edit'),
    onShare: () => console.log('Share'),
    onDownload: () => console.log('Download'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Document actions include keyboard navigation, clear visual feedback, and accessible button states.',
      },
    },
  },
};

