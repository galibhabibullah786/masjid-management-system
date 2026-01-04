'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Download, Filter, Search, Edit, Trash2, CheckCircle, XCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card, Badge, Select, Avatar } from '@/components/admin/ui';
import { DataTable } from '@/components/admin/ui/DataTable';
import { ConfirmModal } from '@/components/admin/ui/Modal';
import { ContributionFormModal } from '@/components/admin/forms';
import { contributionsApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { hasPermission } from '@/lib/permissions';
import { CONTRIBUTION_TYPES, CONTRIBUTION_STATUS } from '@/lib/constants';
import type { Contribution } from '@/lib/types';
import { useToast, useAuth } from '@/lib/context';

export default function ContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingContribution, setEditingContribution] = useState<Contribution | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Contribution | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;
  
  const { addToast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  
  const canManage = user?.role && hasPermission(user.role, 'manage_contributions');

  // Check permission
  useEffect(() => {
    if (user && !canManage) {
      addToast({ type: 'error', title: 'Access denied', message: 'You do not have permission to manage contributions.' });
      router.push('/admin/dashboard');
    }
  }, [user, canManage, router, addToast]);

  // Fetch contributions
  const fetchContributions = async (page = 1) => {
    setLoading(true);
    try {
      const response = await contributionsApi.getAll({ 
        page, 
        limit: pageSize,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        search: search || undefined,
      });
      setContributions((response as { data: Contribution[] }).data || []);
      const meta = (response as { meta?: { total: number; totalPages: number } }).meta;
      if (meta) {
        setTotalItems(meta.total);
        setTotalPages(meta.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch contributions:', error);
      addToast({ type: 'error', title: 'Failed to load contributions' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions(currentPage);
  }, [currentPage, typeFilter, statusFilter, search]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, statusFilter, search]);

  const handleSave = async (data: Partial<Contribution>) => {
    try {
      if (editingContribution) {
        await contributionsApi.update(editingContribution._id, data);
        addToast({ type: 'success', title: 'Contribution updated' });
      } else {
        await contributionsApi.create(data as { contributorName: string; type: 'Cash' | 'Material'; amount: number; date: string });
        addToast({ type: 'success', title: 'Contribution created' });
      }
      fetchContributions(currentPage);
    } catch (error) {
      console.error('Failed to save contribution:', error);
      addToast({ type: 'error', title: 'Failed to save contribution' });
    }
    setFormOpen(false);
    setEditingContribution(null);
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      try {
        await contributionsApi.delete(deleteConfirm._id);
        addToast({ type: 'success', title: 'Contribution deleted' });
        fetchContributions(currentPage);
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Failed to delete contribution:', error);
        addToast({ type: 'error', title: 'Failed to delete contribution' });
      }
    }
  };

  const handleVerify = async (contribution: Contribution) => {
    try {
      await contributionsApi.updateStatus(contribution._id, 'verified');
      setContributions((prev) =>
        prev.map((c) => (c._id === contribution._id ? { ...c, status: 'verified' as const } : c))
      );
      addToast({ type: 'success', title: 'Contribution verified' });
    } catch (error) {
      console.error('Failed to verify contribution:', error);
      addToast({ type: 'error', title: 'Failed to verify contribution' });
    }
  };

  const handleReject = async (contribution: Contribution) => {
    try {
      await contributionsApi.updateStatus(contribution._id, 'rejected');
      setContributions((prev) =>
        prev.map((c) => (c._id === contribution._id ? { ...c, status: 'rejected' as const } : c))
      );
      addToast({ type: 'warning', title: 'Contribution rejected' });
    } catch (error) {
      console.error('Failed to reject contribution:', error);
      addToast({ type: 'error', title: 'Failed to reject contribution' });
    }
  };

  const handleDownloadReceipt = (contribution: Contribution) => {
    window.open(`/api/contributions/${contribution._id}/receipt`, '_blank');
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['Receipt Number', 'Contributor', 'Type', 'Amount', 'Date', 'Purpose', 'Status'];
    const rows = contributions.map(c => [
      c.receiptNumber,
      c.anonymous ? 'Anonymous' : c.contributorName,
      c.type,
      c.amount.toString(),
      formatDate(c.date),
      c.purpose || '',
      c.status,
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contributions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', title: 'Export completed', message: 'CSV file downloaded' });
  };

  const columns = [
    {
      key: 'contributorName',
      label: 'Contributor',
      sortable: true,
      render: (_: unknown, row: Contribution) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.anonymous ? '?' : row.contributorName} size="sm" />
          <div>
            <p className={`font-medium ${row.anonymous ? 'text-gray-400 italic' : 'text-gray-900'}`}>
              {row.anonymous ? 'Anonymous' : row.contributorName}
            </p>
            {row.purpose && <p className="text-xs text-gray-500">{row.purpose}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'receiptNumber',
      label: 'Receipt #',
      sortable: true,
      render: (value: unknown) => (
        <span className="font-mono text-xs text-gray-600">{value as string}</span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value: unknown) => (
        <Badge
          variant={
            value === 'Cash' ? 'success' : 'info'
          }
        >
          {value as string}
        </Badge>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value: unknown) => (
        <span className="font-semibold text-gray-900">{formatCurrency(value as number)}</span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value: unknown) => <span className="text-gray-600">{formatDate(value as string)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: unknown) => (
        <Badge
          variant={
            value === 'verified' ? 'success' : value === 'pending' ? 'warning' : 'danger'
          }
        >
          {value as string}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'w-32',
      render: (_: unknown, row: Contribution) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadReceipt(row);
            }}
            className="p-1.5 rounded hover:bg-blue-50 text-blue-600"
            title="Download Receipt"
          >
            <FileText className="w-4 h-4" />
          </button>
          {row.status === 'pending' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVerify(row);
                }}
                className="p-1.5 rounded hover:bg-emerald-50 text-emerald-600"
                title="Verify"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReject(row);
                }}
                className="p-1.5 rounded hover:bg-red-50 text-red-600"
                title="Reject"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingContribution(row);
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
          <h1 className="text-2xl font-bold text-gray-900">Contributions</h1>
          <p className="text-gray-500 mt-1">Manage and track all contributions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            onClick={() => {
              setEditingContribution(null);
              setFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Add Contribution
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contributions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={showFilters ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100"
          >
            <Select
              label="Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={CONTRIBUTION_TYPES.map((t) => ({ value: t.value, label: t.label }))}
              placeholder="All types"
            />
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={CONTRIBUTION_STATUS.map((s) => ({ value: s.value, label: s.label }))}
              placeholder="All statuses"
            />
            <div className="flex items-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTypeFilter('');
                  setStatusFilter('');
                  setSearch('');
                }}
              >
                Clear filters
              </Button>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Table */}
      <DataTable
        data={contributions}
        columns={columns}
        keyExtractor={(row) => row._id}
        emptyMessage="No contributions found"
        loading={loading}
        pagination={totalPages > 0 ? {
          currentPage,
          totalPages: totalPages || 1,
          pageSize,
          totalItems,
          onPageChange: setCurrentPage,
        } : undefined}
      />

      {/* Form Modal */}
      <ContributionFormModal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingContribution(null);
        }}
        contribution={editingContribution}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Contribution"
        message={`Are you sure you want to delete this contribution from ${deleteConfirm?.contributorName}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
