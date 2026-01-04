'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/admin/ui/Modal';
import { Button, Input, Select, Textarea, Checkbox, ImageUpload } from '@/components/admin/ui';
import { LAND_UNITS } from '@/lib/constants';
import type { LandDonor } from '@/lib/types';
import { useToast } from '@/lib/context';

interface LandDonorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  donor?: LandDonor | null;
  onSave: (data: Partial<LandDonor>) => void;
}

type FormState = {
  name: string;
  landAmount: number;
  unit: string;
  location: string;
  quote: string;
  date: string;
  notes: string;
  verified: boolean;
  photo: string;
};

const initialState: FormState = {
  name: '',
  landAmount: 0,
  unit: 'decimal',
  location: '',
  quote: '',
  date: new Date().toISOString().split('T')[0],
  notes: '',
  verified: false,
  photo: '',
};

export function LandDonorFormModal({
  isOpen,
  onClose,
  donor,
  onSave,
}: LandDonorFormModalProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (donor) {
      // Parse date to ensure proper format for date input
      const dateValue = donor.date ? new Date(donor.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      setForm({
        name: donor.name,
        landAmount: donor.landAmount,
        unit: donor.unit || 'decimal',
        location: donor.location || '',
        quote: donor.quote || '',
        date: dateValue,
        notes: donor.notes || '',
        verified: donor.verified,
        photo: donor.photo || '',
      });
    } else {
      setForm(initialState);
    }
    setErrors({});
  }, [donor, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) {
      newErrors.name = 'Donor name is required';
    }
    if (form.landAmount <= 0) {
      newErrors.landAmount = 'Land amount must be greater than 0';
    }
    if (!form.date) {
      newErrors.date = 'Donation date is required';
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
        title: donor ? 'Land donor updated' : 'Land donor added',
        message: 'The land donor record has been saved successfully.',
      });
      onClose();
    } catch {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to save record. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={donor ? 'Edit Land Donor' : 'Add Land Donor'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {donor ? 'Update' : 'Add'} Land Donor
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Donor Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          error={errors.name}
          placeholder="Full name of the donor"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Land Amount"
            type="number"
            value={form.landAmount}
            onChange={(e) => setForm((f) => ({ ...f, landAmount: parseFloat(e.target.value) || 0 }))}
            error={errors.landAmount}
            placeholder="e.g., 5"
            required
          />
          <Select
            label="Unit"
            value={form.unit}
            onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
            options={LAND_UNITS.map((u) => ({ value: u.value, label: u.label }))}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            placeholder="e.g., Plot A, Nazirpara"
          />
          <Input
            label="Donation Date"
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            error={errors.date}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Donor Photo</label>
          <ImageUpload
            value={form.photo}
            onChange={(url) => setForm((f) => ({ ...f, photo: url }))}
            folder="avatars"
            aspectRatio="square"
            placeholder="Click or drag to upload donor photo"
          />
        </div>

        <Textarea
          label="Quote"
          value={form.quote}
          onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
          placeholder="Donor's message or motivation for the donation..."
        />

        <Checkbox
          label="Mark as verified"
          checked={form.verified}
          onChange={(checked) => setForm((f) => ({ ...f, verified: checked }))}
        />
      </div>
    </Modal>
  );
}
