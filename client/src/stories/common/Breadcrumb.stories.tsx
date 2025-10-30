import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from '@/components/common/Breadcrumb';

const meta = {
  title: 'Common/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects' },
      { label: 'Current Project' },
    ],
  },
};

export const TwoLevels: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Projects' },
    ],
  },
};

export const LongPath: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects' },
      { label: 'My Project', href: '/projects/123' },
      { label: 'Documents', href: '/projects/123/documents' },
      { label: 'BRD' },
    ],
  },
};

export const CurrentPageOnly: Story = {
  args: {
    items: [{ label: 'Dashboard' }],
  },
};

// Use cases
export const ProjectDetailPage = {
  render: () => (
    <div className="space-y-8">
      <div>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Projects', href: '/projects' },
            { label: 'Clearly Project' },
          ]}
        />
        <h1 className="mt-4 text-2xl font-bold">Clearly Project</h1>
      </div>
    </div>
  ),
};

export const DocumentViewPage = {
  render: () => (
    <div className="space-y-8">
      <div>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Projects', href: '/projects' },
            { label: 'Clearly', href: '/projects/123' },
            { label: 'Business Requirements Document' },
          ]}
        />
        <h1 className="mt-4 text-2xl font-bold">Business Requirements Document</h1>
      </div>
    </div>
  ),
};

export const WizardPage = {
  render: () => (
    <div className="space-y-8">
      <div>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Projects', href: '/projects' },
            { label: 'New Project', href: '/projects/new' },
            { label: 'BRD Wizard' },
          ]}
        />
        <h1 className="mt-4 text-2xl font-bold">BRD Question Wizard</h1>
        <p className="mt-2 text-gray-600">Answer questions to generate your document</p>
      </div>
    </div>
  ),
};

// Accessibility
export const AccessibilityDemo: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects' },
      { label: 'Current Page' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumb includes proper ARIA labels and aria-current for the current page.',
      },
    },
  },
};

