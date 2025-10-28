import type { Meta } from '@storybook/react';
import { Tabs } from '@/components/common/Tabs';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useState } from 'react';

const meta = {
  title: 'Common/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;

export const Default = {
  render: () => (
    <Tabs
      tabs={[
        {
          value: 'tab1',
          label: 'Tab 1',
          content: <div className="p-4">Content for Tab 1</div>,
        },
        {
          value: 'tab2',
          label: 'Tab 2',
          content: <div className="p-4">Content for Tab 2</div>,
        },
        {
          value: 'tab3',
          label: 'Tab 3',
          content: <div className="p-4">Content for Tab 3</div>,
        },
      ]}
    />
  ),
};

export const ManyTabs = {
  render: () => (
    <Tabs
      tabs={[
        {
          value: 'overview',
          label: 'Overview',
          content: <div className="p-4">Overview content</div>,
        },
        {
          value: 'details',
          label: 'Details',
          content: <div className="p-4">Details content</div>,
        },
        {
          value: 'settings',
          label: 'Settings',
          content: <div className="p-4">Settings content</div>,
        },
        {
          value: 'history',
          label: 'History',
          content: <div className="p-4">History content</div>,
        },
        {
          value: 'analytics',
          label: 'Analytics',
          content: <div className="p-4">Analytics content</div>,
        },
      ]}
    />
  ),
};

// Controlled tabs
export const Controlled = {
  render: () => {
    const [activeTab, setActiveTab] = useState('profile');
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Active tab: <strong>{activeTab}</strong>
        </p>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          tabs={[
            {
              value: 'profile',
              label: 'Profile',
              content: <div className="p-4">Profile settings</div>,
            },
            {
              value: 'security',
              label: 'Security',
              content: <div className="p-4">Security settings</div>,
            },
            {
              value: 'preferences',
              label: 'Preferences',
              content: <div className="p-4">Preference settings</div>,
            },
          ]}
        />
      </div>
    );
  },
};

// Use case: Settings Page
export const SettingsPage = {
  render: () => (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <Tabs
        tabs={[
          {
            value: 'profile',
            label: 'Profile',
            content: (
              <div className="space-y-4">
                <Input label="Name" placeholder="Your name" />
                <Input label="Email" type="email" placeholder="your@email.com" />
                <Textarea label="Bio" placeholder="Tell us about yourself" rows={4} />
              </div>
            ),
          },
          {
            value: 'security',
            label: 'Security',
            content: (
              <div className="space-y-4">
                <Input label="Current Password" type="password" />
                <Input label="New Password" type="password" />
                <Input label="Confirm Password" type="password" />
              </div>
            ),
          },
          {
            value: 'preferences',
            label: 'Preferences',
            content: (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                  <span className="text-sm font-medium">Dark Mode</span>
                  <button className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md">
                    Toggle
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                  <span className="text-sm font-medium">Email Notifications</span>
                  <button className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md">
                    Enable
                  </button>
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  ),
};

// Use case: Project Documents
export const ProjectDocuments = {
  render: () => (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Project Documents</h2>
      <Tabs
        tabs={[
          {
            value: 'brd',
            label: 'BRD',
            content: (
              <div className="p-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Business Requirements Document</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Status: Approved • Last updated: 2 days ago
                </p>
                <p className="text-sm">
                  This document outlines the business objectives, stakeholder requirements,
                  and success criteria for the project...
                </p>
              </div>
            ),
          },
          {
            value: 'prd',
            label: 'PRD',
            content: (
              <div className="p-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Product Requirements Document</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Status: In Progress • Last updated: 1 hour ago
                </p>
                <p className="text-sm">
                  Detailed product specifications, user stories, and technical requirements...
                </p>
              </div>
            ),
          },
          {
            value: 'tasks',
            label: 'Tasks',
            content: (
              <div className="p-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Technical Task List</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Status: Pending • Requires PRD approval
                </p>
                <p className="text-sm text-gray-500">
                  Task list will be available after PRD is approved.
                </p>
              </div>
            ),
          },
        ]}
      />
    </div>
  ),
};

// Accessibility
export const AccessibilityDemo = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Tabs are fully keyboard accessible:
      </p>
      <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
        <li>Tab to focus the tab list</li>
        <li>Arrow keys to navigate between tabs</li>
        <li>Proper ARIA roles and attributes</li>
        <li>Focus management when switching tabs</li>
      </ul>
      <Tabs
        tabs={[
          {
            value: 'tab1',
            label: 'First Tab',
            content: <div className="p-4">Accessible content for first tab</div>,
          },
          {
            value: 'tab2',
            label: 'Second Tab',
            content: <div className="p-4">Accessible content for second tab</div>,
          },
        ]}
      />
    </div>
  ),
};

