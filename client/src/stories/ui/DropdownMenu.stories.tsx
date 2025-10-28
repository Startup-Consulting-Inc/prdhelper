import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu } from '../../components/ui/DropdownMenu';
import { MoreVertical, Trash2, Archive, Edit, Eye } from 'lucide-react';

const meta = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    trigger: (
      <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
        <MoreVertical className="h-4 w-4" />
      </button>
    ),
    items: [
      {
        label: 'View',
        onClick: () => alert('View clicked'),
        icon: <Eye className="h-4 w-4" />,
      },
      {
        label: 'Edit',
        onClick: () => alert('Edit clicked'),
        icon: <Edit className="h-4 w-4" />,
      },
      {
        label: 'Archive',
        onClick: () => alert('Archive clicked'),
        icon: <Archive className="h-4 w-4" />,
      },
      {
        label: 'Delete',
        onClick: () => alert('Delete clicked'),
        icon: <Trash2 className="h-4 w-4" />,
        variant: 'danger',
      },
    ],
  },
};

export const WithDisabledItems: Story = {
  args: {
    trigger: (
      <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
        <MoreVertical className="h-4 w-4" />
      </button>
    ),
    items: [
      {
        label: 'View',
        onClick: () => alert('View clicked'),
        icon: <Eye className="h-4 w-4" />,
      },
      {
        label: 'Edit',
        onClick: () => alert('Edit clicked'),
        icon: <Edit className="h-4 w-4" />,
        disabled: true,
      },
      {
        label: 'Delete',
        onClick: () => alert('Delete clicked'),
        icon: <Trash2 className="h-4 w-4" />,
        variant: 'danger',
      },
    ],
  },
};

export const LeftAligned: Story = {
  args: {
    trigger: (
      <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
        <MoreVertical className="h-4 w-4" />
      </button>
    ),
    items: [
      {
        label: 'Archive',
        onClick: () => alert('Archive clicked'),
        icon: <Archive className="h-4 w-4" />,
      },
      {
        label: 'Delete',
        onClick: () => alert('Delete clicked'),
        icon: <Trash2 className="h-4 w-4" />,
        variant: 'danger',
      },
    ],
    align: 'left',
  },
};
