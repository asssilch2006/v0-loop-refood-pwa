// Vercel Blob Service for Food Item Photo Uploads

export async function uploadFoodPhoto(file: File): Promise<string> {
  try {
    console.log(`[v0] Starting upload for file: ${file.name}`);

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('[v0] Upload successful:', data.url);
    return data.url;
  } catch (error) {
    console.error('[v0] Photo upload error:', error);
    throw error;
  }
}

// Generate thumbnail for uploaded photo
export function getPhotoThumbnail(url: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
  const sizes = {
    small: '?w=200&h=200&fit=crop',
    medium: '?w=400&h=400&fit=crop',
    large: '?w=800&h=800&fit=crop',
  };

  return `${url}${sizes[size]}`;
}

// Delete uploaded photo
export async function deletePhotoFile(url: string): Promise<void> {
  try {
    const response = await fetch('/api/delete-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }

    console.log('[v0] Photo deleted successfully');
  } catch (error) {
    console.error('[v0] Photo deletion error:', error);
    throw error;
  }
}

// Validate file before upload
export function validatePhotoFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, and WebP images are allowed' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  return { valid: true };
}
