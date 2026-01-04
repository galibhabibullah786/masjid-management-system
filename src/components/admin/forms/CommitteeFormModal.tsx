'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/admin/ui/Modal';
import { Button, Input, Select, Textarea } from '@/components/admin/ui';
import type { Committee } from '@/lib/types';
import { useToast } from '@/lib/context';

interface CommitteeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  committee?: Committee | null;
  onSave: (data: Partial<Committee>) => void;
}

type FormState = {
  name: string;
  term: string;
  description: string;
  type: 'past' | 'current';
};

const initialState: FormState = {
  name: '',
  term: '',
  description: '',
  type: 'past',
};

export function CommitteeFormModal({
  isOpen,
  onClose,
  committee,
  onSave,
}: CommitteeFormModalProps) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (committee) {
      setForm({
        name: committee.name,
        term: committee.term,
        description: committee.description || '',
        type: committee.type,
      });
    } else {
      setForm(initialState);
    }
    setErrors({});
  }, [committee, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) {
      newErrors.name = 'Committee name is required';
    }
    if (!form.term.trim()) {
      newErrors.term = 'Term is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      onSave(form);
      addToast({
        type: 'success',
        title: committee ? 'Committee updated' : 'Committee created',
        message: 'The committee has been saved successfully.',
      });
      onClose();
    } catch {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to save committee. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={committee ? 'Edit Committee' : 'Create Committee'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {committee ? 'Update' : 'Create'} Committee
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Committee Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          error={errors.name}
          placeholder="e.g., Construction Committee"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Term Period"
            value={form.term}
            onChange={(e) => setForm((f) => ({ ...f, term: e.target.value }))}
            error={errors.term}
            placeholder="e.g., 2024-2026"
            required
          />
          <Select
            label="Type"
            value={form.type}
            onChange={(e) =>
              setForm((f) => ({ ...f, type: e.target.value as typeof form.type }))
            }
            options={[
              { value: 'current', label: 'Current' },
              { value: 'past', label: 'Past' },
            ]}
          />
        </div>

        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Brief description of the committee's role and achievements..."
        />
      </div>
    </Modal>
  );
}
