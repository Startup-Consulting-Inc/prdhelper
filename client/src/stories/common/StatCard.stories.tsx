import type { Meta, StoryObj } from '@storybook/react';
import { StatCard } from '@/components/common/StatCard';
import { FileText, Layers, CheckCircle, Users } from 'lucide-react';

const meta = {
  title: 'Common/StatCard',
  component: StatCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    trend: {
      control: 'select',
      options: ['up', 'down', 'neutral'],
    },
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Total Projects',
    value: '24',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Documents Generated',
    value: '156',
    icon: FileText,
  },
};

export const WithTrendUp: Story = {
  args: {
    label: 'Active Projects',
    value: '18',
    change: 12.5,
    trend: 'up',
    icon: Layers,
  },
};

export const WithTrendDown: Story = {
  args: {
    label: 'Pending Approvals',
    value: '3',
    change: -25,
    trend: 'down',
    icon: CheckCircle,
  },
};

export const WithTrendNeutral: Story = {
  args: {
    label: 'Team Members',
    value: '8',
    change: 0,
    trend: 'neutral',
    icon: Users,
  },
};

export const LargeNumbers: Story = {
  args: {
    label: 'Total API Calls',
    value: '1,234,567',
    change: 15.3,
    trend: 'up',
  },
};

// Dashboard Use Case
export const DashboardStats = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Projects"
        value="24"
        change={8.2}
        trend="up"
        icon={Layers}
      />
      <StatCard
        label="Documents Generated"
        value="156"
        change={12.5}
        trend="up"
        icon={FileText}
      />
      <StatCard
        label="Completed Projects"
        value="18"
        change={5.1}
        trend="up"
        icon={CheckCircle}
      />
      <StatCard
        label="Active Users"
        value="12"
        change={-2.4}
        trend="down"
        icon={Users}
      />
    </div>
  ),
};

// Project Overview
export const ProjectOverview = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Project Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="BRDs Created"
          value="45"
          change={15}
          trend="up"
        />
        <StatCard
          label="PRDs Generated"
          value="38"
          change={10}
          trend="up"
        />
        <StatCard
          label="Task Lists"
          value="24"
          change={8}
          trend="up"
        />
      </div>
    </div>
  ),
};

// New User Stats
export const NewUserStats = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Projects" value="0" icon={Layers} />
      <StatCard label="Documents Generated" value="0" icon={FileText} />
      <StatCard label="Completed Projects" value="0" icon={CheckCircle} />
      <StatCard label="Team Members" value="1" icon={Users} />
    </div>
  ),
};

// Active User Stats
export const ActiveUserStats = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Projects"
        value="142"
        change={22.8}
        trend="up"
        icon={Layers}
      />
      <StatCard
        label="Documents Generated"
        value="487"
        change={18.5}
        trend="up"
        icon={FileText}
      />
      <StatCard
        label="Completion Rate"
        value="94%"
        change={3.2}
        trend="up"
        icon={CheckCircle}
      />
      <StatCard
        label="Avg. Time Saved"
        value="12.5h"
        change={8.7}
        trend="up"
      />
    </div>
  ),
};

// Accessibility
export const AccessibilityDemo: Story = {
  args: {
    label: 'Accessible Stat Card',
    value: '42',
    change: 10,
    trend: 'up',
    icon: FileText,
  },
  parameters: {
    docs: {
      description: {
        story: 'StatCard uses semantic HTML and clear text for screen readers.',
      },
    },
  },
};

