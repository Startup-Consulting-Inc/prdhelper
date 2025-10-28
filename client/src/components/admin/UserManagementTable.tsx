/**
 * User Management Table
 *
 * Table for viewing and managing users.
 */

import { useState } from 'react';
import { Shield, Trash2 } from 'lucide-react';
import { DataTable, Column } from '../ui/DataTable';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useUsers, useUpdateUserRole, useDeleteUser } from '../../hooks/useAdmin';

export function UserManagementTable() {
  const { users, isLoading } = useUsers();
  const { updateRole } = useUpdateUserRole();
  const { deleteUser } = useDeleteUser();
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await updateRole({ userId, role: newRole });
    } catch (error) {
      alert('Failed to update user role');
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteUser({ userId });
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const columns: Column<any>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
    },
    {
      key: 'role',
      header: 'Role',
      render: (user) => (
        <Badge variant={user.role === 'ADMIN' ? 'primary' : 'default'}>
          {user.role}
        </Badge>
      ),
    },
    {
      key: 'projectCount',
      header: 'Projects',
      sortable: true,
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (user) => new Date(user.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRoleToggle(user.id, user.role)}
          >
            <Shield className="h-4 w-4 mr-1" />
            {user.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(user.id, user.name)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        User Management
      </h2>
      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(user) => user.id}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
        emptyMessage="No users found"
      />
    </div>
  );
}
