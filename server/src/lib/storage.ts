/**
 * Google Cloud Storage Service
 *
 * Handles file uploads to Google Cloud Storage
 */

import { Storage } from '@google-cloud/storage';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize GCS client
export const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GCP_PROJECT_ID,
});

const bucketName = process.env.GCS_BUCKET_NAME || 'prd-helper-uploads';
const bucket = storage.bucket(bucketName);

/**
 * Upload file to GCS
 */
export async function uploadFileToGCS(
  file: Express.Multer.File,
  folder: string = 'contact-attachments'
): Promise<{ url: string; filename: string; publicUrl: string }> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${folder}/${timestamp}-${sanitizedOriginalName}`;

    // Create a blob in the bucket
    const blob = bucket.file(filename);

    // Create a write stream
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
        metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    // Upload the file
    await new Promise<void>((resolve, reject) => {
      blobStream.on('error', (err) => {
        console.error('Error uploading file to GCS:', err);
        reject(err);
      });

      blobStream.on('finish', () => {
        resolve();
      });

      blobStream.end(file.buffer);
    });

    // Make the file publicly accessible (optional - for contact attachments)
    await blob.makePublic();

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;

    return {
      url: publicUrl,
      filename: filename,
      publicUrl,
    };
  } catch (error) {
    console.error('Error uploading file to GCS:', error);
    throw new Error('Failed to upload file to cloud storage');
  }
}

/**
 * Upload multiple files to GCS
 */
export async function uploadFilesToGCS(
  files: Express.Multer.File[],
  folder: string = 'contact-attachments'
): Promise<Array<{ url: string; filename: string; publicUrl: string; originalName: string; mimetype: string; size: number }>> {
  const uploadPromises = files.map(async (file) => {
    const result = await uploadFileToGCS(file, folder);
    return {
      ...result,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  });

  return Promise.all(uploadPromises);
}

/**
 * Delete file from GCS
 */
export async function deleteFileFromGCS(filename: string): Promise<void> {
  try {
    await bucket.file(filename).delete();
    console.log(`File ${filename} deleted from GCS`);
  } catch (error) {
    console.error('Error deleting file from GCS:', error);
    throw new Error('Failed to delete file from cloud storage');
  }
}

/**
 * Get signed URL for private file access (valid for 1 hour)
 */
export async function getSignedUrl(filename: string): Promise<string> {
  try {
    const [url] = await bucket.file(filename).getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });
    return url;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate signed URL');
  }
}

/**
 * Check if bucket exists and is accessible
 */
export async function checkBucketAccess(): Promise<boolean> {
  try {
    const [exists] = await bucket.exists();
    if (!exists) {
      console.warn(`⚠️  GCS bucket '${bucketName}' does not exist`);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error checking GCS bucket access:', error);
    return false;
  }
}
