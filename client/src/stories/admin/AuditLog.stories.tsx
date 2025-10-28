import type { Meta, StoryObj } from '@storybook/react';
import { AuditLog } from '@/components/admin/AuditLog';

const meta = {
  title: 'Admin/AuditLog',
  component: AuditLog,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AuditLog>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockEntries = [
  {
    id: '1',
    action: 'create' as const,
    resource: 'Project',
    resourceId: 'proj_abc123',
    user: 'john@example.com',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    details: 'Created new project: E-Commerce Platform',
  },
  {
    id: '2',
    action: 'update' as const,
    resource: 'Document',
    resourceId: 'doc_def456',
    user: 'jane@example.com',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    details: 'Updated BRD for Mobile App MVP',
  },
  {
    id: '3',
    action: 'delete' as const,
    resource: 'Project',
    resourceId: 'proj_ghi789',
    user: 'admin@example.com',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    details: 'Deleted archived project: Legacy Migration',
  },
  {
    id: '4',
    action: 'view' as const,
    resource: 'Document',
    resourceId: 'doc_jkl012',
    user: 'bob@example.com',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
];

export const Default: Story = {
  args: {
    entries: mockEntries,
  },
};

export const Interactive = {
  render: () => (
    <div className="max-w-4xl">
      <AuditLog entries={mockEntries} />
    </div>
  ),
};

