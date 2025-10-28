import type { Meta, StoryObj } from '@storybook/react';
import { UserManagement } from '@/components/admin/UserManagement';

const meta = {
  title: 'Admin/UserManagement',
  component: UserManagement,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UserManagement>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin' as const,
    status: 'active' as const,
    joinedAt: new Date(2024, 0, 15),
    lastActive: new Date(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user' as const,
    status: 'active' as const,
    joinedAt: new Date(2024, 2, 20),
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'user' as const,
    status: 'inactive' as const,
    joinedAt: new Date(2023, 11, 1),
    lastActive: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
];

export const Default: Story = {
  args: {
    users: mockUsers,
    onEditUser: (id) => console.log('Edit user:', id),
    onDeleteUser: (id) => console.log('Delete user:', id),
  },
};

export const Interactive = {
  render: () => (
    <div className="max-w-6xl">
      <UserManagement
        users={mockUsers}
        onEditUser={(id) => alert(`Edit user ${id}`)}
        onDeleteUser={(id) => {
          if (confirm('Delete this user?')) {
            alert(`User ${id} deleted`);
          }
        }}
      />
    </div>
  ),
};

