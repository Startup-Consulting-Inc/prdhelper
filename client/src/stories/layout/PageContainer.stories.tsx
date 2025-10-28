import type { Meta, StoryObj } from '@storybook/react';
import { PageContainer } from '@/components/layout/PageContainer';

const meta = {
  title: 'Layout/PageContainer',
  component: PageContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PageContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div className="bg-white dark:bg-gray-950 rounded-lg border p-6"><h1 className="text-2xl font-bold">Page Content</h1></div>,
  },
};

export const MaxWidthSm: Story = {
  args: {
    maxWidth: 'sm',
    children: <div className="bg-white dark:bg-gray-950 rounded-lg border p-6"><h1>Small Width</h1></div>,
  },
};

export const MaxWidthFull: Story = {
  args: {
    maxWidth: 'full',
    children: <div className="bg-white dark:bg-gray-950 rounded-lg border p-6"><h1>Full Width</h1></div>,
  },
};

