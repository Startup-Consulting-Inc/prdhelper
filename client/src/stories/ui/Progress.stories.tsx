import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '@/components/ui/Progress';

const meta = {
  title: 'UI/Progress',
  component: Progress,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showValue: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
  },
};

export const WithLabel: Story = {
  args: {
    value: 75,
    label: 'Document Generation Progress',
  },
};

export const WithValue: Story = {
  args: {
    value: 60,
    showValue: true,
  },
};

export const WithLabelAndValue: Story = {
  args: {
    value: 85,
    label: 'Upload Progress',
    showValue: true,
  },
};

// Different values
export const ZeroPercent: Story = {
  args: {
    value: 0,
    label: 'Not Started',
    showValue: true,
  },
};

export const FiftyPercent: Story = {
  args: {
    value: 50,
    label: 'In Progress',
    showValue: true,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
    label: 'Completed',
    showValue: true,
  },
};

// Sizes
export const Small: Story = {
  args: {
    value: 65,
    size: 'sm',
    label: 'Small Progress',
  },
};

export const Medium: Story = {
  args: {
    value: 65,
    size: 'md',
    label: 'Medium Progress',
  },
};

export const Large: Story = {
  args: {
    value: 65,
    size: 'lg',
    label: 'Large Progress',
  },
};

export const AllSizes = {
  render: () => (
    <div className="space-y-6">
      <Progress value={70} size="sm" label="Small" showValue />
      <Progress value={70} size="md" label="Medium" showValue />
      <Progress value={70} size="lg" label="Large" showValue />
    </div>
  ),
};

// Use cases
export const UseCases = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold mb-4">Project Progress</h3>
        <div className="space-y-4">
          <Progress value={100} label="BRD" showValue />
          <Progress value={75} label="PRD" showValue />
          <Progress value={0} label="Tasks" showValue />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4">Wizard Steps</h3>
        <Progress value={50} label="Question 2 of 4" showValue />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4">Document Generation</h3>
        <Progress value={67} label="Generating..." showValue size="lg" />
      </div>
    </div>
  ),
};

// Accessibility
export const AccessibilityDemo: Story = {
  args: {
    value: 75,
    label: 'Task Completion',
    showValue: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar includes proper ARIA attributes for screen readers',
      },
    },
  },
};

