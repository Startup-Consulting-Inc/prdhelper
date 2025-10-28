import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Home, Layers, FileText, Settings } from 'lucide-react';

const meta = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onItemClick: (id) => console.log('Navigate to:', id),
  },
};

export const WithCounts: Story = {
  args: {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Home, isActive: true },
      { id: 'projects', label: 'Projects', icon: Layers, count: 12 },
      { id: 'documents', label: 'Documents', icon: FileText, count: 48 },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    onItemClick: (id) => console.log('Navigate to:', id),
  },
};

export const Collapsed: Story = {
  args: {
    isOpen: false,
    onItemClick: (id) => console.log('Navigate to:', id),
  },
};

export const Interactive = {
  render: () => (
    <div className="flex h-screen">
      <Sidebar onItemClick={(id) => alert(`Navigate to ${id}`)} />
      <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-2xl font-bold">Main Content</h1>
      </div>
    </div>
  ),
};

