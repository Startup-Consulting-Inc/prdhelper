import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/ui/Badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'error'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
    size: 'md',
  },
};

// All variants
export const AllVariants = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
    </div>
  ),
};

export const Primary: Story = {
  args: {
    children: 'Technical Mode',
    variant: 'primary',
  },
};

export const Success: Story = {
  args: {
    children: 'Approved',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Pending',
    variant: 'warning',
  },
};

export const Error: Story = {
  args: {
    children: 'Failed',
    variant: 'error',
  },
};

// Sizes
export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium',
    size: 'md',
  },
};

export const AllSizes = {
  render: () => (
    <div className="flex items-center gap-3">
      <Badge size="sm">Small Badge</Badge>
      <Badge size="md">Medium Badge</Badge>
    </div>
  ),
};

// Long text
export const LongText: Story = {
  args: {
    children: 'This is a badge with very long text content',
    variant: 'primary',
  },
};

// Use cases
export const UseCases = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-2">Project Status:</p>
        <div className="flex gap-2">
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">In Progress</Badge>
          <Badge variant="error">Archived</Badge>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">User Mode:</p>
        <div className="flex gap-2">
          <Badge variant="primary">Technical</Badge>
          <Badge variant="default">Plain</Badge>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Document Type:</p>
        <div className="flex gap-2">
          <Badge size="sm" variant="default">
            BRD
          </Badge>
          <Badge size="sm" variant="default">
            PRD
          </Badge>
          <Badge size="sm" variant="default">
            Tasks
          </Badge>
        </div>
      </div>
    </div>
  ),
};

