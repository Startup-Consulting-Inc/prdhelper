import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <p>
        This is a basic card component. It can contain any content you want.
      </p>
    ),
  },
};

export const WithTitle: Story = {
  args: {
    title: 'Card Title',
    children: <p>Card content goes here.</p>,
  },
};

export const WithTitleAndDescription: Story = {
  args: {
    title: 'Project Details',
    description: 'View and manage your project information',
    children: (
      <div className="space-y-2">
        <p className="text-sm">
          <strong>Status:</strong> Active
        </p>
        <p className="text-sm">
          <strong>Created:</strong> January 15, 2024
        </p>
        <p className="text-sm">
          <strong>Documents:</strong> 3 generated
        </p>
      </div>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    title: 'Confirmation Required',
    children: (
      <p>
        Are you sure you want to delete this project? This action cannot be
        undone.
      </p>
    ),
    footer: (
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Confirm
        </Button>
      </div>
    ),
  },
};

export const NoHeader: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <p>This card has no header, just content.</p>
        <p className="text-sm text-gray-600">
          Perfect for simple content containers.
        </p>
      </div>
    ),
  },
};

export const LongContent: Story = {
  args: {
    title: 'Document Preview',
    description: 'Business Requirements Document',
    children: (
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur.
        </p>
        <p>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
          officia deserunt mollit anim id est laborum.
        </p>
      </div>
    ),
    footer: (
      <div className="flex justify-between">
        <Button variant="ghost" size="sm">
          Previous
        </Button>
        <Button variant="primary" size="sm">
          Next
        </Button>
      </div>
    ),
  },
};

// Accessibility demonstration
export const AccessibilityDemo = {
  render: () => (
    <div className="space-y-6">
      <Card
        title="Accessible Heading"
        description="The title uses semantic h3 heading"
      >
        <p>Screen readers will properly announce the card structure</p>
      </Card>
      <Card>
        <div role="article" aria-label="Custom content">
          <p>You can add custom ARIA attributes as needed</p>
        </div>
      </Card>
    </div>
  ),
};

