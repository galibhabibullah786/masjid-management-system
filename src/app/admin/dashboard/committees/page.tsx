'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Badge, Avatar } from '@/components/admin/ui';
import { ConfirmModal } from '@/components/admin/ui/Modal';
import { CommitteeFormModal, MemberFormModal } from '@/components/admin/forms';
import { committeesApi } from '@/lib/api';
import { hasPermission } from '@/lib/permissions';
import type { Committee, CommitteeMember } from '@/lib/types';
import { useToast, useAuth } from '@/lib/context';

export default function CommitteesPage() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCommittee, setExpandedCommittee] = useState<string | null>(null);
  const [committeeFormOpen, setCommitteeFormOpen] = useState(false);
  const [memberFormOpen, setMemberFormOpen] = useState(false);
  const [editingCommittee, setEditingCommittee] = useState<Committee | null>(null);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string>('');
  const [deleteCommitteeConfirm, setDeleteCommitteeConfirm] = useState<Committee | null>(null);
  const [deleteMemberConfirm, setDeleteMemberConfirm] = useState<CommitteeMember | null>(null);
  const { addToast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  
  const canManage = user?.role && hasPermission(user.role, 'manage_committees');

  // Check permission
  useEffect(() => {
    if (user && !canManage) {
      addToast({ type: 'error', title: 'Access denied', message: 'You do not have permission to manage committees.' });
      router.push('/admin/dashboard');
    }
  }, [user, canManage, router, addToast]);

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const response = await committeesApi.getAll();
        const data = (response as { data: Committee[] }).data || [];
        setCommittees(data);
        const current = data.find((c) => c.type === 'current');
        if (current) {
          setExpandedCommittee(current._id);
          setSelectedCommitteeId(current._id);
        }
      } catch (error) {
        console.error('Failed to fetch committees:', error);
        addToast({ type: 'error', title: 'Failed to load committees' });
      } finally {
        setLoading(false);
      }
    };
    fetchCommittees();
  }, [addToast]);

  const handleSaveCommittee = async (data: Partial<Committee>) => {
    try {
      if (editingCommittee) {
        const response = await committeesApi.update(editingCommittee._id, data);
        const updatedCommittee = (response as { data: Committee }).data;
        
        // If this committee is set to 'current', update all others to 'past'
        if (data.type === 'current') {
          setCommittees((prev) =>
            prev.map((c) => {
              if (c._id === editingCommittee._id) {
                return updatedCommittee;
              }
              // Mark other committees as 'past' if they were 'current'
              if (c.type === 'current') {
                return { ...c, type: 'past' as const };
              }
              return c;
            })
          );
        } else {
          setCommittees((prev) =>
            prev.map((c) => (c._id === editingCommittee._id ? updatedCommittee : c))
          );
        }
        addToast({ type: 'success', title: 'Committee updated' });
      } else {
        const response = await committeesApi.create(data as { name: string; term: string });
        const newCommittee = (response as { data: Committee }).data;
        
        // If new committee is 'current', update all others to 'past'
        if (data.type === 'current') {
          setCommittees((prev) => [
            ...prev.map((c) => (c.type === 'current' ? { ...c, type: 'past' as const } : c)),
            newCommittee,
          ]);
        } else {
          setCommittees((prev) => [...prev, newCommittee]);
        }
        addToast({ type: 'success', title: 'Committee created' });
      }
    } catch (error) {
      console.error('Failed to save committee:', error);
      addToast({ type: 'error', title: 'Failed to save committee' });
    }
    setCommitteeFormOpen(false);
    setEditingCommittee(null);
  };

  const handleSaveMember = async (data: Partial<CommitteeMember>) => {
    try {
      const committee = committees.find((c) => c._id === selectedCommitteeId);
      if (!committee) return;

      if (editingMember) {
        const response = await committeesApi.updateMember(selectedCommitteeId, editingMember._id || '', data);
        const updatedCommittee = (response as { data: Committee }).data;
        setCommittees((prev) =>
          prev.map((c) => c._id === selectedCommitteeId ? updatedCommittee : c)
        );
        addToast({ type: 'success', title: 'Member updated' });
      } else {
        const response = await committeesApi.addMember(selectedCommitteeId, data as { name: string; designation: string; designationLabel: string; order: number });
        const updatedCommittee = (response as { data: Committee }).data;
        setCommittees((prev) =>
          prev.map((c) => c._id === selectedCommitteeId ? updatedCommittee : c)
        );
        addToast({ type: 'success', title: 'Member added' });
      }
    } catch (error) {
      console.error('Failed to save member:', error);
      addToast({ type: 'error', title: 'Failed to save member' });
    }
    setMemberFormOpen(false);
    setEditingMember(null);
  };

  const handleDeleteCommittee = async () => {
    if (deleteCommitteeConfirm) {
      try {
        await committeesApi.delete(deleteCommitteeConfirm._id);
        setCommittees((prev) => prev.filter((c) => c._id !== deleteCommitteeConfirm._id));
        addToast({ type: 'success', title: 'Committee deleted' });
        setDeleteCommitteeConfirm(null);
      } catch (error) {
        console.error('Failed to delete committee:', error);
        addToast({ type: 'error', title: 'Failed to delete committee' });
      }
    }
  };

  const handleDeleteMember = async () => {
    if (deleteMemberConfirm) {
      try {
        const committee = committees.find((c) => c.members.some((m) => m._id === deleteMemberConfirm._id));
        if (committee) {
          await committeesApi.removeMember(committee._id, deleteMemberConfirm._id || '');
          setCommittees((prev) =>
            prev.map((c) => ({
              ...c,
              members: c.members.filter((m) => m._id !== deleteMemberConfirm._id),
            }))
          );
          addToast({ type: 'success', title: 'Member removed' });
        }
        setDeleteMemberConfirm(null);
      } catch (error) {
        console.error('Failed to remove member:', error);
        addToast({ type: 'error', title: 'Failed to remove member' });
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-100 rounded animate-pulse mt-2" />
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Committees</h1>
          <p className="text-gray-500 mt-1">Manage committee history and members</p>
        </div>
        <Button onClick={() => { setEditingCommittee(null); setCommitteeFormOpen(true); }}>
          <Plus className="w-4 h-4" />
          Add Committee
        </Button>
      </div>

      <div className="space-y-4">
        {committees.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Committees Yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first committee.</p>
            <Button onClick={() => { setEditingCommittee(null); setCommitteeFormOpen(true); }}>
              <Plus className="w-4 h-4" />
              Create First Committee
            </Button>
          </Card>
        ) : (
          committees.map((committee) => (
          <Card key={committee._id} padding="none" className="overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedCommittee(expandedCommittee === committee._id ? null : committee._id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{committee.name}</h3>
                    <Badge variant={committee.type === 'current' ? 'success' : 'default'}>
                      {committee.type === 'current' ? 'Current' : 'Past'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{committee.term} • {committee.members.length} members</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); setEditingCommittee(committee); setCommitteeFormOpen(true); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setDeleteCommitteeConfirm(committee); }} className="p-2 rounded-lg hover:bg-red-50 text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
                {expandedCommittee === committee._id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </div>
            </div>

            <AnimatePresence>
              {expandedCommittee === committee._id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-gray-100">
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Committee Members</h4>
                      <Button size="sm" onClick={() => { setSelectedCommitteeId(committee._id); setEditingMember(null); setMemberFormOpen(true); }}>
                        <Plus className="w-4 h-4" />
                        Add Member
                      </Button>
                    </div>

                    {committee.members.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No members added yet</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {committee.members.sort((a, b) => a.order - b.order).map((member) => (
                          <div key={member._id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3">
                              <Avatar name={member.name} size="lg" />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-gray-900 truncate">{member.name}</h5>
                                <p className="text-sm text-primary-600">{member.designationLabel}</p>
                                {member.phone && <p className="text-xs text-gray-500 mt-1">{member.phone}</p>}
                              </div>
                              <div className="flex items-center gap-1">
                                <button onClick={() => { setSelectedCommitteeId(committee._id); setEditingMember(member); setMemberFormOpen(true); }} className="p-1.5 rounded hover:bg-gray-100 text-gray-600">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => setDeleteMemberConfirm(member)} className="p-1.5 rounded hover:bg-red-50 text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))
        )}
      </div>

      <CommitteeFormModal isOpen={committeeFormOpen} onClose={() => { setCommitteeFormOpen(false); setEditingCommittee(null); }} committee={editingCommittee} onSave={handleSaveCommittee} />
      <MemberFormModal isOpen={memberFormOpen} onClose={() => { setMemberFormOpen(false); setEditingMember(null); }} member={editingMember} committeeId={selectedCommitteeId} onSave={handleSaveMember} />
      <ConfirmModal isOpen={!!deleteCommitteeConfirm} onClose={() => setDeleteCommitteeConfirm(null)} onConfirm={handleDeleteCommittee} title="Delete Committee" message={`Are you sure you want to delete "${deleteCommitteeConfirm?.name}"? All members will also be removed.`} confirmLabel="Delete" variant="danger" />
      <ConfirmModal isOpen={!!deleteMemberConfirm} onClose={() => setDeleteMemberConfirm(null)} onConfirm={handleDeleteMember} title="Remove Member" message={`Are you sure you want to remove ${deleteMemberConfirm?.name} from the committee?`} confirmLabel="Remove" variant="danger" />
    </div>
  );
}
