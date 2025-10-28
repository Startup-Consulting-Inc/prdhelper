import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '@/components/ui/Spinner';

const meta = {
  title: 'UI/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const WithLabel: Story = {
  args: {
    size: 'md',
    label: 'Loading...',
  },
};

export const WithCustomLabel: Story = {
  args: {
    size: 'md',
    label: 'Processing your request',
  },
};

// Accessibility demonstration
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="flex flex-col gap-6 items-center">
      <div>
        <p className="text-sm text-gray-600 mb-2">Screen reader announces loading state:</p>
        <Spinner label="Loading data" />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Hidden label for icon-only spinner:</p>
        <Spinner />
      </div>
    </div>
  ),
};

