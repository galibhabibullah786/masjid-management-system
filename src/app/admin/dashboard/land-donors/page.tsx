'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Download, Edit, Trash2, MapPin, Ruler, User } from 'lucide-react';
import { Button, Card, Badge, Avatar } from '@/components/admin/ui';
import { DataTable } from '@/components/admin/ui/DataTable';
import { ConfirmModal } from '@/components/admin/ui/Modal';
import { LandDonorFormModal } from '@/components/admin/forms';
import { landDonorsApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { hasPermission } from '@/lib/permissions';
import type { LandDonor } from '@/lib/types';
import { useToast, useAuth } from '@/lib/context';

export default function LandDonorsPage() {
  const [donors, setDonors] = useState<LandDonor[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<LandDonor | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<LandDonor | null>(null);
  const { addToast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;
  
  const canManage = user?.role && hasPermission(user.role, 'manage_land_donors');

  // Check permission
  useEffect(() => {
    if (user && !canManage) {
      addToast({ type: 'error', title: 'Access denied', message: 'You do not have permission to manage land donors.' });
      router.push('/admin/dashboard');
    }
  }, [user, canManage, router, addToast]);

  // Fetch donors
  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      try {
        const response = await landDonorsApi.getAll({ page: currentPage, limit: pageSize });
        const result = response as { data: LandDonor[]; pagination?: { total: number; totalPages: number } };
        setDonors(result.data || []);
        if (result.pagination) {
          setTotalPages(result.pagination.totalPages);
          setTotalItems(result.pagination.total);
        }
      } catch (error) {
        console.error('Failed to fetch land donors:', error);
        addToast({ type: 'error', title: 'Failed to load land donors' });
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, [addToast, currentPage]);

  // Calculate stats
  const totalLand = donors.reduce((sum, d) => sum + d.landAmount, 0);
  const verifiedDonors = donors.filter((d) => d.verified).length;

  const handleSave = async (data: Partial<LandDonor>) => {
    try {
      if (editingDonor) {
        await landDonorsApi.update(editingDonor._id, data);
        setDonors((prev) =>
          prev.map((d) => (d._id === editingDonor._id ? { ...d, ...data } : d))
        );
        addToast({ type: 'success', title: 'Land donor updated' });
      } else {
        const response = await landDonorsApi.create(data as { name: string; landAmount: number; unit: string; location: string; date: string });
        const newDonor = (response as { data: LandDonor }).data;
        setDonors((prev) => [newDonor, ...prev]);
        addToast({ type: 'success', title: 'Land donor added' });
      }
    } catch (error) {
      console.error('Failed to save land donor:', error);
      addToast({ type: 'error', title: 'Failed to save land donor' });
    }
    setFormOpen(false);
    setEditingDonor(null);
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      try {
        await landDonorsApi.delete(deleteConfirm._id);
        setDonors((prev) => prev.filter((d) => d._id !== deleteConfirm._id));
        addToast({ type: 'success', title: 'Land donor deleted' });
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Failed to delete land donor:', error);
        addToast({ type: 'error', title: 'Failed to delete land donor' });
      }
    }
  };

  const toggleVerified = async (donor: LandDonor) => {
    try {
      await landDonorsApi.update(donor._id, { verified: !donor.verified });
      setDonors((prev) =>
        prev.map((d) => (d._id === donor._id ? { ...d, verified: !d.verified } : d))
      );
      addToast({
        type: 'success',
        title: donor.verified ? 'Verification removed' : 'Donor verified',
      });
    } catch (error) {
      console.error('Failed to toggle verification:', error);
      addToast({ type: 'error', title: 'Failed to update verification' });
    }
  };

  const handleExport = () => {
    const headers = ['Name', 'Land Amount', 'Unit', 'Location', 'Date', 'Verified', 'Quote', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...donors.map(d => [
        `"${d.name}"`,
        d.landAmount,
        d.unit,
        `"${d.location || ''}"`,
        formatDate(d.date),
        d.verified ? 'Yes' : 'No',
        `"${(d.quote || '').replace(/"/g, '""')}"`,
        `"${(d.notes || '').replace(/"/g, '""')}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `land-donors-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    addToast({ type: 'success', title: 'Export complete', message: 'Land donors exported to CSV' });
  };

  const columns = [
    {
      key: 'name',
      label: 'Donor',
      sortable: true,
      render: (_: unknown, row: LandDonor) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            {row.notes && (
              <p className="text-xs text-gray-500 truncate max-w-[200px]">{row.notes}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'landAmount',
      label: 'Land Amount',
      sortable: true,
      render: (value: unknown, row: LandDonor) => (
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-900">{String(value)} {row.unit}</span>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (value: unknown) => (
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="truncate max-w-[200px]">{value as string}</span>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Donation Date',
      sortable: true,
      render: (value: unknown) => (
        <span className="text-gray-600">{formatDate(value as string)}</span>
      ),
    },
    {
      key: 'verified',
      label: 'Status',
      sortable: true,
      render: (value: unknown, row: LandDonor) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleVerified(row);
          }}
          className="focus:outline-none"
        >
          <Badge variant={value ? 'success' : 'warning'}>
            {value ? 'Verified' : 'Pending'}
          </Badge>
        </button>
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'w-20',
      render: (_: unknown, row: LandDonor) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingDonor(row);
              setFormOpen(true);
            }}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteConfirm(row);
            }}
            className="p-1.5 rounded hover:bg-red-50 text-red-600"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Land Donors</h1>
          <p className="text-gray-500 mt-1">Manage land donation records</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            onClick={() => {
              setEditingDonor(null);
              setFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Add Donor
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{donors.length}</p>
              <p className="text-sm text-gray-600">Total Donors</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white">
              <Ruler className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalLand.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total Decimals</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{verifiedDonors}</p>
              <p className="text-sm text-gray-600">Verified Records</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <DataTable
        data={donors}
        columns={columns}
        keyExtractor={(row) => row._id}
        emptyMessage="No land donors found"
        loading={loading}
        pagination={{
          currentPage,
          totalPages,
          pageSize,
          totalItems,
          onPageChange: setCurrentPage,
        }}
      />

      {/* Form Modal */}
      <LandDonorFormModal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingDonor(null);
        }}
        donor={editingDonor}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Land Donor"
        message={`Are you sure you want to delete ${deleteConfirm?.name}'s donation record? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
