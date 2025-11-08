/**
 * FileUpload Component
 *
 * Drag-and-drop file upload component with file preview and validation
 */

import { useCallback, useState } from 'react';
import { Upload, X, File, Image, Video } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '../ui/Button';

export interface UploadedFile {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

export interface FileUploadProps {
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[]; // MIME types
  onFilesChange?: (files: UploadedFile[]) => void;
  error?: string;
  className?: string;
}

export const FileUpload = ({
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'video/mp4', 'video/webm'],
  onFilesChange,
  error,
  className,
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Validate file before adding
   */
  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type: ${file.type}. Accepted types: images (png, jpg, gif) and videos (mp4, webm)`;
    }

    // Check file size
    if (file.size > maxSize) {
      return `File too large: ${formatFileSize(file.size)}. Maximum size: ${formatFileSize(maxSize)}`;
    }

    return null;
  };

  /**
   * Handle file selection
   */
  const handleFileSelect = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;

      const fileArray = Array.from(newFiles);
      const totalFiles = files.length + fileArray.length;

      // Check max files
      if (totalFiles > maxFiles) {
        setUploadError(`Too many files. Maximum ${maxFiles} files allowed`);
        return;
      }

      // Validate all files
      const validationErrors: string[] = [];
      const validFiles: File[] = [];

      fileArray.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          validationErrors.push(error);
        } else {
          validFiles.push(file);
        }
      });

      if (validationErrors.length > 0) {
        setUploadError(validationErrors[0]);
        return;
      }

      // Add valid files
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      setUploadError(null);

      // Auto-upload files
      uploadFiles([...validFiles]);
    },
    [files, maxFiles, maxSize, acceptedTypes]
  );

  /**
   * Upload files to server
   */
  const uploadFiles = async (filesToUpload: File[]) => {
    if (filesToUpload.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      filesToUpload.forEach((file) => {
        formData.append('attachments', file);
      });

      const response = await fetch('/api/upload/contact-attachments', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();

      // Update uploaded files
      const newUploadedFiles = [...uploadedFiles, ...data.files];
      setUploadedFiles(newUploadedFiles);

      // Notify parent
      if (onFilesChange) {
        onFilesChange(newUploadedFiles);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err instanceof Error ? err.message : 'Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Remove file
   */
  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedUploadedFiles = uploadedFiles.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setUploadedFiles(updatedUploadedFiles);

    if (onFilesChange) {
      onFilesChange(updatedUploadedFiles);
    }
  };

  /**
   * Handle drag events
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  /**
   * Get file icon based on MIME type
   */
  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (mimetype.startsWith('video/')) return <Video className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Drop Zone */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
            : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600',
          files.length >= maxFiles && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (files.length < maxFiles) {
            document.getElementById('file-input')?.click();
          }
        }}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={files.length >= maxFiles}
        />

        <Upload
          className={cn(
            'mx-auto h-12 w-12 mb-4',
            isDragging ? 'text-primary-500' : 'text-gray-400 dark:text-gray-600'
          )}
        />

        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
          {isDragging ? 'Drop files here' : 'Drag and drop files here, or click to browse'}
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          {acceptedTypes.includes('image/png') && 'Images (PNG, JPG, GIF)'}
          {acceptedTypes.includes('video/mp4') && ' and Videos (MP4, WEBM)'} up to{' '}
          {formatFileSize(maxSize)}. Max {maxFiles} files.
        </p>
      </div>

      {/* Error Message */}
      {(uploadError || error) && (
        <div className="mt-2 p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-md">
          <p className="text-sm text-error-600 dark:text-error-400">{uploadError || error}</p>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Selected Files ({files.length}/{maxFiles})
          </p>

          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-gray-500 dark:text-gray-400">
                  {getFileIcon(file.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {uploadedFiles[index] && (
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Uploaded ✓
                  </span>
                )}

                {isUploading && !uploadedFiles[index] && (
                  <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                    Uploading...
                  </span>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="ml-2"
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

FileUpload.displayName = 'FileUpload';
