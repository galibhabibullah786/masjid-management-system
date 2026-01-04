'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Shield, ShieldCheck, ShieldX, Search, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card, Badge, Avatar, Input } from '@/components/admin/ui';
import { ConfirmModal } from '@/components/admin/ui/Modal';
import { UserFormModal } from '@/components/admin/forms';
import { usersApi } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import { hasPermission } from '@/lib/permissions';
import type { AdminUser } from '@/lib/types';
import { useToast, useAuth } from '@/lib/context';

const PAGE_SIZE = 9;

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<AdminUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { addToast } = useToast();
  const { user: currentUser } = useAuth();
  const router = useRouter();

  // Check permission
  useEffect(() => {
    if (currentUser && !hasPermission(currentUser.role, 'manage_users')) {
      addToast({ type: 'error', title: 'Access denied', message: 'You do not have permission to manage users.' });
      router.push('/admin/dashboard');
    }
  }, [currentUser, router, addToast]);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await usersApi.getAll({ limit: 500 });
        setUsers((response as { data: AdminUser[] }).data || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        addToast({ type: 'error', title: 'Failed to load users' });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [addToast]);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, currentPage]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleSave = async (data: Partial<AdminUser>) => {
    try {
      if (editingUser) {
        await usersApi.update(editingUser._id, data);
        setUsers((prev) =>
          prev.map((u) => (u._id === editingUser._id ? { ...u, ...data } : u))
        );
        addToast({ type: 'success', title: 'User updated successfully' });
      } else {
        const response = await usersApi.create(data as { name: string; email: string; password: string; role: 'super_admin' | 'admin' | 'photographer' });
        const newUser = (response as { data: AdminUser }).data;
        setUsers((prev) => [newUser, ...prev]);
        addToast({ type: 'success', title: 'User created successfully' });
      }
    } catch (error) {
      console.error('Failed to save user:', error);
      addToast({ type: 'error', title: 'Failed to save user' });
    }
    setFormOpen(false);
    setEditingUser(null);
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      if (deleteConfirm._id === currentUser?._id) {
        addToast({ type: 'error', title: "You can't delete yourself" });
        setDeleteConfirm(null);
        return;
      }
      try {
        await usersApi.delete(deleteConfirm._id);
        setUsers((prev) => prev.filter((u) => u._id !== deleteConfirm._id));
        addToast({ type: 'success', title: 'User deleted' });
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Failed to delete user:', error);
        addToast({ type: 'error', title: 'Failed to delete user' });
      }
    }
  };

  const toggleStatus = async (user: AdminUser) => {
    if (user._id === currentUser?._id) {
      addToast({ type: 'error', title: "You can't deactivate yourself" });
      return;
    }
    try {
      await usersApi.update(user._id, { isActive: !user.isActive });
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isActive: !u.isActive } : u))
      );
      addToast({
        type: 'success',
        title: user.isActive ? 'User deactivated' : 'User activated',
      });
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      addToast({ type: 'error', title: 'Failed to update user status' });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <ShieldCheck className="w-4 h-4" />;
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'editor':
        return <Shield className="w-4 h-4" />;
      default:
        return <ShieldX className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'danger';
      case 'admin':
        return 'warning';
      case 'editor':
        return 'info';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'editor':
        return 'Editor';
      default:
        return 'Viewer';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">Manage admin users and permissions</p>
        </div>
        <Button
          onClick={() => {
            setEditingUser(null);
            setFormOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </Card>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500">No users found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedUsers.map((user, index) => {
            const isSelf = user._id === currentUser?._id;
            return (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card className={`relative ${!user.isActive && !isSelf ? 'opacity-75 bg-gray-50' : ''}`}>
                {isSelf && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="info" size="sm">You</Badge>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <Avatar name={user.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getRoleColor(user.role) as 'default' | 'success' | 'danger' | 'warning' | 'info'} size="sm">
                        {getRoleIcon(user.role)}
                        <span className="ml-1">{getRoleLabel(user.role)}</span>
                      </Badge>
                      {!user.isActive && (
                        <Badge variant="danger" size="sm">Inactive</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>

                {user.lastLogin && (
                  <p className="text-xs text-gray-500 mt-3">
                    Last login: {formatDateTime(user.lastLogin)}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleStatus(user)}
                    disabled={isSelf}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setFormOpen(true);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(user)}
                    disabled={isSelf}
                    className={`p-2 rounded-lg ${isSelf ? 'opacity-50 cursor-not-allowed text-gray-400' : 'hover:bg-red-50 text-red-600'}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * PAGE_SIZE) + 1} to{' '}
            {Math.min(currentPage * PAGE_SIZE, filteredUsers.length)} of{' '}
            {filteredUsers.length} users
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((page, idx, arr) => (
                  <span key={page} className="flex items-center">
                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium ${
                        currentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  </span>
                ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <UserFormModal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteConfirm?.name}? They will no longer have access to the admin panel.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
