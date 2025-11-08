/**
 * File Upload Utilities
 *
 * Client-side utilities for file validation and upload handling
 */

/**
 * Allowed file types for contact form attachments
 */
export const ALLOWED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'video/mp4',
  'video/webm',
] as const;

/**
 * Maximum file size (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

/**
 * Maximum number of files
 */
export const MAX_FILES = 5;

/**
 * File upload error types
 */
export enum FileUploadError {
  INVALID_TYPE = 'INVALID_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  TOO_MANY_FILES = 'TOO_MANY_FILES',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
}

/**
 * Validate file type
 */
export function isValidFileType(file: File): boolean {
  return ALLOWED_FILE_TYPES.includes(file.type as any);
}

/**
 * Validate file size
 */
export function isValidFileSize(file: File, maxSize: number = MAX_FILE_SIZE): boolean {
  return file.size <= maxSize;
}

/**
 * Validate file
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!isValidFileType(file)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Allowed types: images (png, jpg, gif) and videos (mp4, webm)`,
    };
  }

  if (!isValidFileSize(file)) {
    return {
      valid: false,
      error: `File too large: ${formatFileSize(file.size)}. Maximum size: ${formatFileSize(MAX_FILE_SIZE)}`,
    };
  }

  return { valid: true };
}

/**
 * Validate multiple files
 */
export function validateFiles(
  files: File[],
  maxFiles: number = MAX_FILES
): { valid: boolean; error?: string } {
  if (files.length === 0) {
    return { valid: true };
  }

  if (files.length > maxFiles) {
    return {
      valid: false,
      error: `Too many files. Maximum ${maxFiles} files allowed`,
    };
  }

  for (const file of files) {
    const result = validateFile(file);
    if (!result.valid) {
      return result;
    }
  }

  return { valid: true };
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Get file type category (image, video, document, etc.)
 */
export function getFileTypeCategory(mimetype: string): 'image' | 'video' | 'document' | 'other' {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.includes('pdf') || mimetype.includes('document')) return 'document';
  return 'other';
}

/**
 * Upload files to server
 */
export async function uploadFiles(files: File[]): Promise<{
  success: boolean;
  files?: Array<{
    url: string;
    filename: string;
    mimetype: string;
    size: number;
  }>;
  error?: string;
}> {
  try {
    // Validate files first
    const validation = validateFiles(files);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Create FormData
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('attachments', file);
    });

    // Upload to server
    const response = await fetch('/api/upload/contact-attachments', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Upload failed');
    }

    const data = await response.json();

    return {
      success: true,
      files: data.files,
    };
  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload files',
    };
  }
}

/**
 * Create a preview URL for a file
 */
export function createPreviewUrl(file: File): string | null {
  const type = getFileTypeCategory(file.type);

  if (type === 'image' || type === 'video') {
    return URL.createObjectURL(file);
  }

  return null;
}

/**
 * Revoke preview URL to free memory
 */
export function revokePreviewUrl(url: string): void {
  try {
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to revoke preview URL:', error);
  }
}
