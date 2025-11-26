/**
 * File Upload Router
 *
 * Handles file uploads for contact form attachments
 *
 * SECURITY: All upload endpoints require authentication
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadFilesToGCS } from '../lib/storage.js';
import { authenticateUser } from '../lib/middleware/auth.js';
import { logger } from '../lib/logger.js';

export const uploadRouter = Router();

// Allowed file types
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'video/mp4',
  'video/webm',
];

// File size limit: 5MB per file
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Maximum number of files
const MAX_FILES = 5;

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to validate file types
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: images (png, jpg, gif) and videos (mp4, webm)`));
  }
};

// Configure multer middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
});

/**
 * Upload contact form attachments
 * POST /api/upload/contact-attachments
 *
 * SECURITY: Requires authentication
 */
uploadRouter.post(
  '/contact-attachments',
  authenticateUser, // Require authentication
  upload.array('attachments', MAX_FILES),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({
          error: 'No files uploaded',
        });
      }

      // Validate number of files
      if (files.length > MAX_FILES) {
        return res.status(400).json({
          error: `Too many files. Maximum ${MAX_FILES} files allowed`,
        });
      }

      // Validate file sizes
      const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        return res.status(400).json({
          error: `File(s) too large: ${oversizedFiles.map(f => f.originalname).join(', ')}. Maximum 5MB per file`,
        });
      }

      // Upload files to GCS
      const uploadedFiles = await uploadFilesToGCS(files, 'contact-attachments');

      logger.info({
        userId: req.tokenPayload?.userId,
        correlationId: req.correlationId,
        fileCount: uploadedFiles.length,
        totalSize: files.reduce((sum, f) => sum + f.size, 0),
      }, 'Files uploaded successfully');

      // Return uploaded file metadata
      return res.json({
        success: true,
        files: uploadedFiles.map((file) => ({
          url: file.url,
          filename: file.originalName,
          mimetype: file.mimetype,
          size: file.size,
        })),
      });
    } catch (error) {
      logger.error({
        err: error,
        userId: req.tokenPayload?.userId,
        correlationId: req.correlationId,
      }, 'Error uploading files');

      // Handle multer-specific errors
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            error: 'File too large. Maximum size is 5MB per file',
          });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            error: `Too many files. Maximum ${MAX_FILES} files allowed`,
          });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            error: 'Unexpected file field',
          });
        }
      }

      return res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to upload files',
      });
    }
  }
);

/**
 * Health check for upload service
 */
uploadRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'file-upload',
    maxFiles: MAX_FILES,
    maxFileSize: `${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    allowedTypes: ALLOWED_MIME_TYPES,
  });
});
