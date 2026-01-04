import { NextRequest } from 'next/server';
import { uploadImage, UploadFolder } from '@/lib/cloudinary';
import { withAuth, successResponse, errorResponse } from '@/lib/api-utils';
import type { TokenPayload } from '@/lib/auth';

interface Params {
  folder: string;
}

// POST /api/upload/[folder] - Upload an image to Cloudinary
async function postHandler(request: NextRequest, _auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    const validFolders: UploadFolder[] = ['gallery', 'avatars', 'members', 'committees', 'settings'];
    
    if (!validFolders.includes(params.folder as UploadFolder)) {
      return errorResponse('Invalid upload folder', 400);
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return errorResponse('No file provided', 400);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return errorResponse('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.', 400);
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return errorResponse('File size exceeds 5MB limit', 400);
    }

    // Set transformation options based on folder
    const transformations: Record<UploadFolder, { width?: number; height?: number; crop?: string; quality?: string }> = {
      gallery: { width: 1200, quality: 'auto' },
      avatars: { width: 200, height: 200, crop: 'fill' },
      members: { width: 400, height: 400, crop: 'fill' },
      committees: { width: 800, quality: 'auto' },
      settings: { width: 500, quality: 'auto' },
    };

    const result = await uploadImage(file, params.folder as UploadFolder, {
      transformation: transformations[params.folder as UploadFolder],
    });

    return successResponse(result, 'Image uploaded successfully');
  } catch (error) {
    console.error('Upload error:', error);
    return errorResponse('Failed to upload image', 500);
  }
}

export const POST = withAuth(postHandler, 'upload_images');
