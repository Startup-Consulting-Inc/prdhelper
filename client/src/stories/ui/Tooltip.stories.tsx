import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from '@/components/ui/Tooltip';
import { Button } from '@/components/ui/Button';
import { Info, HelpCircle } from 'lucide-react';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'This is a tooltip',
    children: (
      <Button variant="outline">Hover me</Button>
    ),
  },
};

// All sides
export const Top: Story = {
  args: {
    content: 'Tooltip on top',
    side: 'top',
    children: (
      <Button variant="outline">Hover me</Button>
    ),
  },
};

export const Right: Story = {
  args: {
    content: 'Tooltip on right',
    side: 'right',
    children: (
      <Button variant="outline">Hover me</Button>
    ),
  },
};

export const Bottom: Story = {
  args: {
    content: 'Tooltip on bottom',
    side: 'bottom',
    children: (
      <Button variant="outline">Hover me</Button>
    ),
  },
};

export const Left: Story = {
  args: {
    content: 'Tooltip on left',
    side: 'left',
    children: (
      <Button variant="outline">Hover me</Button>
    ),
  },
};

export const AllSides = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip content="Top tooltip" side="top">
        <Button variant="outline">Top</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" side="right">
        <Button variant="outline">Right</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" side="bottom">
        <Button variant="outline">Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" side="left">
        <Button variant="outline">Left</Button>
      </Tooltip>
    </div>
  ),
};

// Long content
export const LongContent: Story = {
  args: {
    content: 'This is a longer tooltip with multiple words that demonstrates how the component handles more substantial content.',
    children: (
      <Button variant="outline">Hover for long tooltip</Button>
    ),
  },
};

// With icon
export const WithIcon = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip content="Click here for more information">
        <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Info className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </Tooltip>
      <Tooltip content="Need help? Click to view documentation">
        <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </Tooltip>
    </div>
  ),
};

// Use cases
export const UseCases = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Form Field Help</h3>
        <div className="flex items-center gap-2">
          <label className="text-sm">Project Mode</label>
          <Tooltip content="Choose 'Plain' for simple language or 'Technical' for detailed specifications">
            <button className="p-1">
              <HelpCircle className="h-4 w-4 text-gray-500" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Action Button Hints</h3>
        <div className="flex gap-2">
          <Tooltip content="Download document as Markdown">
            <Button size="sm" variant="outline">
              Download
            </Button>
          </Tooltip>
          <Tooltip content="Approve and proceed to next phase">
            <Button size="sm" variant="primary">
              Approve
            </Button>
          </Tooltip>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Status Indicators</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm">Document Status:</span>
          <Tooltip content="This document is currently being reviewed">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              Pending
              <Info className="h-3 w-3" />
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  ),
};

// Accessibility
export const AccessibilityDemo: Story = {
  args: {
    content: 'Tooltips are keyboard accessible and include proper ARIA attributes',
    children: (
      <Button variant="outline">Focus me with Tab</Button>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Tooltips can be triggered by both hover and keyboard focus, making them accessible to all users.',
      },
    },
  },
};

