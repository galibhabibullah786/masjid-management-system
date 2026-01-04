'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, Trash2, Star, Grid, List, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card, Badge, Select } from '@/components/admin/ui';
import { ConfirmModal } from '@/components/admin/ui/Modal';
import { GalleryFormModal } from '@/components/admin/forms';
import { galleryApi } from '@/lib/api';
import { GALLERY_CATEGORIES } from '@/lib/constants';
import type { GalleryImage } from '@/lib/types';
import { useToast } from '@/lib/context';

const PAGE_SIZE = 12;

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<GalleryImage | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { addToast } = useToast();

  // Fetch images on mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await galleryApi.getAll({ limit: 500 });
        setImages((response as { data: GalleryImage[] }).data || []);
      } catch (error) {
        console.error('Failed to fetch gallery images:', error);
        addToast({ type: 'error', title: 'Failed to load gallery' });
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [addToast]);

  const filteredImages = useMemo(() => {
    return images.filter((img) =>
      !categoryFilter || img.category === categoryFilter
    );
  }, [images, categoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredImages.length / PAGE_SIZE);
  const paginatedImages = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredImages.slice(start, start + PAGE_SIZE);
  }, [filteredImages, currentPage]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter]);

  const handleSave = async (data: Partial<GalleryImage>) => {
    try {
      if (editingImage) {
        await galleryApi.update(editingImage._id, data);
        setImages((prev) =>
          prev.map((img) => (img._id === editingImage._id ? { ...img, ...data } : img))
        );
        addToast({ type: 'success', title: 'Image updated' });
      } else {
        const response = await galleryApi.create(data as { url: string; publicId: string; category: 'Foundation' | 'Construction' | 'Events' | 'FinalLook' | 'Ceremony'; alt: string });
        const newImage = (response as { data: GalleryImage }).data;
        setImages((prev) => [...prev, newImage]);
        addToast({ type: 'success', title: 'Image added' });
      }
    } catch (error) {
      console.error('Failed to save image:', error);
      addToast({ type: 'error', title: 'Failed to save image' });
    }
    setFormOpen(false);
    setEditingImage(null);
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      try {
        await galleryApi.delete(deleteConfirm._id);
        setImages((prev) => prev.filter((img) => img._id !== deleteConfirm._id));
        addToast({ type: 'success', title: 'Image deleted' });
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Failed to delete image:', error);
        addToast({ type: 'error', title: 'Failed to delete image' });
      }
    }
  };

  const toggleFeatured = async (image: GalleryImage) => {
    try {
      await galleryApi.update(image._id, { featured: !image.featured });
      setImages((prev) =>
        prev.map((img) => (img._id === image._id ? { ...img, featured: !img.featured } : img))
      );
      addToast({
        type: 'success',
        title: image.featured ? 'Removed from featured' : 'Added to featured',
      });
    } catch (error) {
      console.error('Failed to toggle featured:', error);
      addToast({ type: 'error', title: 'Failed to update image' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="text-gray-500 mt-1">Manage project photos and media</p>
        </div>
        <Button
          onClick={() => {
            setEditingImage(null);
            setFormOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Add Image
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={GALLERY_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
              placeholder="All categories"
              className="w-48"
            />
            {categoryFilter && (
              <Button variant="ghost" size="sm" onClick={() => setCategoryFilter('')}>
                Clear
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Gallery Grid/List */}
      {filteredImages.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500">No images found</p>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedImages.map((image, index) => (
            <motion.div
              key={image._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card padding="none" className="overflow-hidden group">
                <div className="relative aspect-video bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  {image.featured && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="warning">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => toggleFeatured(image)}
                      className={`p-2 rounded-lg ${image.featured ? 'bg-amber-500 text-white' : 'bg-white text-gray-700'}`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingImage(image);
                        setFormOpen(true);
                      }}
                      className="p-2 rounded-lg bg-white text-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(image)}
                      className="p-2 rounded-lg bg-red-500 text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-medium text-gray-900 text-sm truncate">{image.alt}</p>
                  <div className="flex items-center justify-between mt-1">
                    <Badge variant="default" size="sm">{image.category}</Badge>
                    {image.date && <span className="text-xs text-gray-500">{image.date}</span>}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card padding="none">
          <div className="divide-y divide-gray-100">
            {paginatedImages.map((image) => (
              <div key={image._id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x70?text=No+Image';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 truncate">{image.alt}</p>
                    {image.featured && (
                      <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="default" size="sm">{image.category}</Badge>
                    {image.date && <span className="text-xs text-gray-500">{image.date}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFeatured(image)}
                    className={`p-2 rounded-lg ${image.featured ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'}`}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingImage(image);
                      setFormOpen(true);
                    }}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(image)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * PAGE_SIZE) + 1} to{' '}
            {Math.min(currentPage * PAGE_SIZE, filteredImages.length)} of{' '}
            {filteredImages.length} images
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
      <GalleryFormModal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingImage(null);
        }}
        image={editingImage}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
