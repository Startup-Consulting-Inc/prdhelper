import type { Meta, StoryObj } from '@storybook/react';
import { Header } from '@/components/layout/Header';

const meta = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onMenuClick: () => console.log('Menu clicked'),
    onNotificationsClick: () => console.log('Notifications'),
    onProfileClick: () => console.log('Profile'),
    onSettingsClick: () => console.log('Settings'),
    onLogout: () => console.log('Logout'),
  },
};

export const WithNotifications: Story = {
  args: {
    notificationCount: 5,
    onMenuClick: () => console.log('Menu clicked'),
    onNotificationsClick: () => console.log('Notifications'),
    onProfileClick: () => console.log('Profile'),
    onSettingsClick: () => console.log('Settings'),
    onLogout: () => console.log('Logout'),
  },
};

export const CustomBranding: Story = {
  args: {
    appName: 'My App',
    userName: 'Jane Smith',
    userEmail: 'jane@company.com',
    onMenuClick: () => console.log('Menu'),
    onLogout: () => console.log('Logout'),
  },
};

export const Interactive = {
  render: () => (
    <div>
      <Header
        onMenuClick={() => alert('Toggle sidebar')}
        onNotificationsClick={() => alert('View notifications')}
        onProfileClick={() => alert('Go to profile')}
        onSettingsClick={() => alert('Go to settings')}
        onLogout={() => {
          if (confirm('Are you sure you want to log out?')) {
            alert('Logged out');
          }
        }}
        notificationCount={3}
      />
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <h1 className="text-2xl font-bold">Page Content</h1>
      </div>
    </div>
  ),
};

export const AccessibilityDemo: Story = {
  args: {
    onMenuClick: () => console.log('Menu'),
    onNotificationsClick: () => console.log('Notifications'),
    onProfileClick: () => console.log('Profile'),
    onLogout: () => console.log('Logout'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Header includes ARIA labels, keyboard navigation, and accessible dropdown menus.',
      },
    },
  },
};

