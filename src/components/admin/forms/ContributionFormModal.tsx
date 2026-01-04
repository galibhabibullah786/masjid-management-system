'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/admin/ui/Modal';
import { Button, Input, Select, Textarea, Checkbox } from '@/components/admin/ui';
import { CONTRIBUTION_TYPES, CONTRIBUTION_STATUS } from '@/lib/constants';
import type { Contribution } from '@/lib/types';
import { useToast } from '@/lib/context';

interface ContributionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  contribution?: Contribution | null;
  onSave: (data: Partial<Contribution>) => void;
}

const initialState: FormState = {
  contributorName: '',
  type: 'Cash',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  anonymous: false,
  purpose: '',
  notes: '',
  status: 'pending',
};

type FormState = {
  contributorName: string;
  type: 'Cash' | 'Material';
  amount: number;
  date: string;
  anonymous: boolean;
  purpose: string;
  notes: string;
  status: 'pending' | 'verified' | 'rejected';
};

export function ContributionFormModal({
  isOpen,
  onClose,
  contribution,
  onSave,
}: ContributionFormModalProps) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (contribution) {
      setForm({
        contributorName: contribution.contributorName,
        type: contribution.type,
        amount: contribution.amount,
        date: contribution.date ? contribution.date.split('T')[0] : new Date().toISOString().split('T')[0],
        anonymous: contribution.anonymous,
        purpose: contribution.purpose || '',
        notes: contribution.notes || '',
        status: contribution.status,
      });
    } else {
      setForm(initialState);
    }
    setErrors({});
  }, [contribution, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.anonymous && !form.contributorName.trim()) {
      newErrors.contributorName = 'Contributor name is required';
    }
    if (form.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!form.date) {
      newErrors.date = 'Date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      onSave({
        ...form,
        contributorName: form.anonymous ? 'Anonymous' : form.contributorName,
      });
      addToast({
        type: 'success',
        title: contribution ? 'Contribution updated' : 'Contribution added',
        message: contribution 
          ? 'The contribution has been updated successfully.' 
          : 'The contribution has been added. Receipt number will be generated automatically.',
      });
      onClose();
    } catch {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to save contribution. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contribution ? 'Edit Contribution' : 'Add Contribution'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {contribution ? 'Update' : 'Add'} Contribution
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Checkbox
          label="Anonymous contribution"
          checked={form.anonymous}
          onChange={(checked) => setForm((f) => ({ ...f, anonymous: checked }))}
        />

        {!form.anonymous && (
          <Input
            label="Contributor Name"
            value={form.contributorName}
            onChange={(e) => setForm((f) => ({ ...f, contributorName: e.target.value }))}
            error={errors.contributorName}
            required
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Type"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as typeof form.type }))}
            options={CONTRIBUTION_TYPES.map((t) => ({ value: t.value, label: t.label }))}
            required
          />
          <Input
            label="Amount (৳)"
            type="number"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
            error={errors.amount}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            error={errors.date}
            required
          />
          {contribution && (
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as typeof form.status }))}
              options={CONTRIBUTION_STATUS.map((s) => ({ value: s.value, label: s.label }))}
            />
          )}
        </div>

        <Input
          label="Purpose"
          value={form.purpose}
          onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
          placeholder="e.g., General Fund, Construction, etc."
        />

        {contribution && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Receipt Number:</span> {contribution.receiptNumber}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Receipt numbers are auto-generated and cannot be modified.
            </p>
          </div>
        )}

        <Textarea
          label="Notes"
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          placeholder="Additional notes..."
        />
      </div>
    </Modal>
  );
}
