import type { Meta, StoryObj } from '@storybook/react';
import { SettingsPanel } from '@/components/admin/SettingsPanel';
import { Input } from '@/components/ui/Input';

const meta = {
  title: 'Admin/SettingsPanel',
  component: SettingsPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SettingsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockSections = [
  {
    id: 'general',
    title: 'General Settings',
    description: 'Manage your application preferences',
    content: (
      <div className="space-y-4">
        <Input label="Application Name" defaultValue="Clearly" />
        <Input label="Support Email" type="email" defaultValue="support@example.com" />
      </div>
    ),
  },
  {
    id: 'notifications',
    title: 'Notification Settings',
    description: 'Configure how you receive notifications',
    content: (
      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked className="rounded" />
          <span className="text-sm">Email notifications</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked className="rounded" />
          <span className="text-sm">Document completion alerts</span>
        </label>
      </div>
    ),
  },
];

export const Default: Story = {
  args: {
    sections: mockSections,
    onSave: () => console.log('Save settings'),
  },
};

export const Interactive = {
  render: () => (
    <div className="max-w-3xl">
      <SettingsPanel
        sections={mockSections}
        onSave={() => alert('Settings saved!')}
      />
    </div>
  ),
};

