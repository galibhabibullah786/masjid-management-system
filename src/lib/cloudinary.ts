import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type UploadFolder = 'gallery' | 'avatars' | 'members' | 'committees' | 'settings';

interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload an image to Cloudinary
 */
export async function uploadImage(
  file: File | Buffer | string,
  folder: UploadFolder,
  options?: {
    transformation?: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string | number;
    };
  }
): Promise<UploadResult> {
  let uploadData: string;

  if (file instanceof File) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    uploadData = `data:${file.type};base64,${buffer.toString('base64')}`;
  } else if (Buffer.isBuffer(file)) {
    uploadData = `data:image/jpeg;base64,${file.toString('base64')}`;
  } else {
    uploadData = file;
  }

  const result = await cloudinary.uploader.upload(uploadData, {
    folder: `amanat-e-nazirpara/${folder}`,
    resource_type: 'image',
    transformation: options?.transformation ? [options.transformation] : undefined,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
}

/**
 * Delete multiple images from Cloudinary
 */
export async function deleteImages(publicIds: string[]): Promise<{ success: string[]; failed: string[] }> {
  const success: string[] = [];
  const failed: string[] = [];

  for (const publicId of publicIds) {
    const deleted = await deleteImage(publicId);
    if (deleted) {
      success.push(publicId);
    } else {
      failed.push(publicId);
    }
  }

  return { success, failed };
}

/**
 * Get optimized URL for an image
 */
export function getOptimizedUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  }
): string {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      {
        width: options?.width,
        height: options?.height,
        crop: options?.crop || 'fill',
        quality: options?.quality || 'auto',
        format: options?.format || 'auto',
      },
    ],
  });
}

export default cloudinary;
