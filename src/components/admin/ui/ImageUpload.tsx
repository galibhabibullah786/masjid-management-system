'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder: 'gallery' | 'avatars' | 'members' | 'committees' | 'settings';
  className?: string;
  aspectRatio?: 'square' | 'video' | 'banner';
  disabled?: boolean;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder,
  className,
  aspectRatio = 'square',
  disabled = false,
  placeholder = 'Click or drag to upload',
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    banner: 'aspect-[3/1]',
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG, GIF, and WebP images are allowed.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 5MB.');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/upload/${folder}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      onChange(data.data.url);
      setPreview(null); // Clear preview, use actual URL now
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreview(null);
    } finally {
      setLoading(false);
    }
  }, [folder, onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled || loading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [disabled, loading, handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !loading) {
      setIsDragging(true);
    }
  }, [disabled, loading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleRemove = useCallback(() => {
    onChange('');
    setPreview(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onChange]);

  const displayUrl = preview || value;

  return (
    <div className={cn('relative', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleInputChange}
        disabled={disabled || loading}
        className="sr-only"
        id={`image-upload-${folder}`}
      />

      <label
        htmlFor={`image-upload-${folder}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative block overflow-hidden rounded-lg border-2 border-dashed transition-all cursor-pointer h-40',
          isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed',
          displayUrl && 'border-solid border-gray-200'
        )}
      >
        {displayUrl ? (
          <>
            <Image
              src={displayUrl}
              alt="Uploaded image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
            {!disabled && !loading && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemove();
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            {loading ? (
              <>
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                <span className="mt-2 text-sm">Uploading...</span>
              </>
            ) : (
              <>
                {isDragging ? (
                  <Upload className="w-10 h-10 text-primary-500" />
                ) : (
                  <ImageIcon className="w-10 h-10" />
                )}
                <span className="mt-2 text-sm text-center px-4">
                  {isDragging ? 'Drop image here' : placeholder}
                </span>
                <span className="mt-1 text-xs text-gray-400">
                  JPEG, PNG, GIF, WebP up to 5MB
                </span>
              </>
            )}
          </div>
        )}
      </label>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
