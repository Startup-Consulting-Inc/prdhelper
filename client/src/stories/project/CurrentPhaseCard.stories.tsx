import type { Meta, StoryObj } from '@storybook/react';
import { CurrentPhaseCard } from '../../components/project/CurrentPhaseCard';
import { FileText, Code, CheckCircle } from 'lucide-react';

const meta = {
  title: 'Project/CurrentPhaseCard',
  component: CurrentPhaseCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CurrentPhaseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReviewBRD: Story = {
  args: {
    title: 'Review BRD',
    subtitle: 'BRD QUESTIONS',
    actionText: 'Review & Approve BRD',
    icon: FileText,
    onAction: () => alert('Review BRD clicked'),
  },
};

export const StartBRD: Story = {
  args: {
    title: 'Start BRD',
    subtitle: 'BRD WIZARD',
    actionText: 'Start BRD Wizard',
    icon: FileText,
    onAction: () => alert('Start BRD clicked'),
  },
};

export const ReviewPRD: Story = {
  args: {
    title: 'Review PRD',
    subtitle: 'PRD QUESTIONS',
    actionText: 'Review & Approve PRD',
    icon: FileText,
    onAction: () => alert('Review PRD clicked'),
  },
};

export const GenerateTasks: Story = {
  args: {
    title: 'Generate Tasks',
    subtitle: 'TECHNICAL TASKS',
    actionText: 'Generate Task List',
    icon: Code,
    onAction: () => alert('Generate Tasks clicked'),
  },
};

export const ProjectComplete: Story = {
  args: {
    title: 'Completed',
    subtitle: 'PROJECT COMPLETE',
    actionText: 'View All Documents',
    icon: CheckCircle,
    onAction: () => alert('View Documents clicked'),
  },
};

export const Loading: Story = {
  args: {
    title: 'Review BRD',
    subtitle: 'BRD QUESTIONS',
    actionText: 'Review & Approve BRD',
    icon: FileText,
    onAction: () => {},
    isLoading: true,
  },
};
