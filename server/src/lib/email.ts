/**
 * Email Service
 *
 * Handles sending emails using Gmail SMTP with credentials from Google Secret Manager.
 * Used for demo request notifications and other transactional emails.
 */

import nodemailer from 'nodemailer';
import { getSecrets } from './secretManager.js';

type InquiryType = 'GENERAL' | 'QUESTION' | 'BUG_REPORT' | 'DEMO' | 'FEATURE_REQUEST' | 'OTHER';

interface Attachment {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

interface ContactRequestEmailData {
  inquiryType: InquiryType;
  name: string;
  email: string;
  company?: string;
  role?: string;
  teamSize?: string;
  subject?: string;
  message?: string;
  attachments?: Attachment[];
  createdAt: Date;
}

// Legacy interface for backward compatibility
interface DemoRequestEmailData {
  name: string;
  email: string;
  company?: string;
  message?: string;
  createdAt: Date;
}

/**
 * Create a nodemailer transporter with Gmail credentials
 * - In development: Uses GMAIL_USER and GMAIL_APP_PASSWORD from .env
 * - In production: Uses credentials from Google Secret Manager
 */
async function createTransporter() {
  try {
    let gmailUser: string;
    let gmailPassword: string;

    // In development, use environment variables directly
    if (process.env.NODE_ENV === 'development') {
      gmailUser = process.env.GMAIL_USER || '';
      gmailPassword = process.env.GMAIL_APP_PASSWORD || '';

      if (!gmailUser || !gmailPassword) {
        console.warn('Email disabled: GMAIL_USER and GMAIL_APP_PASSWORD not configured in .env');
        return null;
      }
    } else {
      // In production, fetch credentials from Secret Manager
      const secrets = await getSecrets(['GMAIL_USER', 'GMAIL_APP_PASSWORD']);
      gmailUser = secrets.GMAIL_USER;
      gmailPassword = secrets.GMAIL_APP_PASSWORD;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
    });

    // Verify connection configuration
    await transporter.verify();
    console.log('Email transporter verified successfully');

    return transporter;
  } catch (error) {
    console.error('Failed to create email transporter:', error);
    // In development, return null to skip email
    if (process.env.NODE_ENV === 'development') {
      console.warn('Email service not available - check your Gmail credentials');
      return null;
    }
    throw new Error('Email service configuration error');
  }
}

/**
 * Get inquiry type metadata (icon, color, label)
 */
function getInquiryTypeMetadata(type: InquiryType) {
  const metadata = {
    GENERAL: { icon: '📬', color: '#6B7280', label: 'General Inquiry' },
    QUESTION: { icon: '❓', color: '#8B5CF6', label: 'Question' },
    BUG_REPORT: { icon: '🐛', color: '#EF4444', label: 'Bug Report' },
    DEMO: { icon: '🎯', color: '#4F46E5', label: 'Demo Request' },
    FEATURE_REQUEST: { icon: '💡', color: '#10B981', label: 'Feature Request' },
    OTHER: { icon: '📋', color: '#6B7280', label: 'Other Inquiry' },
  };
  return metadata[type] || metadata.OTHER;
}

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

/**
 * Get file icon based on MIME type
 */
function getFileIcon(mimetype: string): string {
  if (mimetype.startsWith('image/')) return '🖼️';
  if (mimetype.startsWith('video/')) return '🎥';
  if (mimetype.startsWith('application/pdf')) return '📄';
  return '📎';
}

/**
 * Send contact request notification email to admin
 * @param contactRequest - Contact request data with inquiry type
 */
export async function sendContactNotificationEmail(contactRequest: ContactRequestEmailData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.warn('ADMIN_EMAIL not configured, skipping contact notification email');
    return;
  }

  try {
    const transporter = await createTransporter();

    // Skip email if transporter is null (development mode without Gmail config)
    if (!transporter) {
      console.log(`[DEV] Contact request received from ${contactRequest.name} (${contactRequest.email})`);
      console.log(`[DEV] Type: ${contactRequest.inquiryType}`);
      console.log(`[DEV] Email notification skipped - configure Gmail credentials to enable emails`);
      return;
    }

    const metadata = getInquiryTypeMetadata(contactRequest.inquiryType);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: ${metadata.color};
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: #f9fafb;
      padding: 30px;
      border: 1px solid #e5e7eb;
      border-radius: 0 0 8px 8px;
    }
    .inquiry-type {
      display: inline-block;
      background-color: ${metadata.color};
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .field {
      margin-bottom: 15px;
    }
    .label {
      font-weight: bold;
      color: #6b7280;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .value {
      margin-top: 5px;
      font-size: 16px;
      color: #111827;
    }
    .message-box {
      background-color: white;
      padding: 15px;
      border-left: 4px solid ${metadata.color};
      margin-top: 10px;
      border-radius: 4px;
    }
    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">${metadata.icon} New ${metadata.label}</h1>
      <p style="margin: 10px 0 0 0;">Someone reached out through the Clearly contact form</p>
    </div>
    <div class="content">
      <div class="inquiry-type">${metadata.icon} ${metadata.label}</div>

      <div class="field">
        <div class="label">Name</div>
        <div class="value">${contactRequest.name}</div>
      </div>

      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${contactRequest.email}">${contactRequest.email}</a></div>
      </div>

      ${
        contactRequest.company
          ? `
      <div class="field">
        <div class="label">Company</div>
        <div class="value">${contactRequest.company}</div>
      </div>
      `
          : ''
      }

      ${
        contactRequest.role
          ? `
      <div class="field">
        <div class="label">Role</div>
        <div class="value">${contactRequest.role}</div>
      </div>
      `
          : ''
      }

      ${
        contactRequest.teamSize
          ? `
      <div class="field">
        <div class="label">Team Size</div>
        <div class="value">${contactRequest.teamSize}</div>
      </div>
      `
          : ''
      }

      ${
        contactRequest.subject
          ? `
      <div class="field">
        <div class="label">Subject</div>
        <div class="value">${contactRequest.subject}</div>
      </div>
      `
          : ''
      }

      ${
        contactRequest.message
          ? `
      <div class="field">
        <div class="label">Message</div>
        <div class="message-box">${contactRequest.message.replace(/\n/g, '<br>')}</div>
      </div>
      `
          : ''
      }

      ${
        contactRequest.attachments && contactRequest.attachments.length > 0
          ? `
      <div class="field">
        <div class="label">Attachments (${contactRequest.attachments.length})</div>
        <div style="margin-top: 10px;">
          ${contactRequest.attachments
            .map(
              (attachment) => `
            <div style="background-color: white; padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">${getFileIcon(attachment.mimetype)}</span>
                <div>
                  <div style="font-weight: 600; color: #111827;">${attachment.filename}</div>
                  <div style="font-size: 12px; color: #6B7280;">${formatFileSize(attachment.size)}</div>
                </div>
              </div>
              <a href="${attachment.url}" style="background-color: #4F46E5; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-size: 14px; font-weight: 600;">Download</a>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
      `
          : ''
      }

      <div class="field">
        <div class="label">Submitted</div>
        <div class="value">${contactRequest.createdAt.toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
        })}</div>
      </div>
    </div>
    <div class="footer">
      <p>This email was sent from the Clearly contact form.</p>
      <p>Reply directly to <strong>${contactRequest.email}</strong> to respond.</p>
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
New ${metadata.label}

Name: ${contactRequest.name}
Email: ${contactRequest.email}
${contactRequest.company ? `Company: ${contactRequest.company}` : ''}
${contactRequest.role ? `Role: ${contactRequest.role}` : ''}
${contactRequest.teamSize ? `Team Size: ${contactRequest.teamSize}` : ''}
${contactRequest.subject ? `Subject: ${contactRequest.subject}` : ''}
${contactRequest.message ? `Message: ${contactRequest.message}` : ''}
${
  contactRequest.attachments && contactRequest.attachments.length > 0
    ? `
Attachments (${contactRequest.attachments.length}):
${contactRequest.attachments.map((a) => `- ${a.filename} (${formatFileSize(a.size)}): ${a.url}`).join('\n')}
`
    : ''
}
Submitted: ${contactRequest.createdAt.toLocaleString()}

Reply to ${contactRequest.email} to respond.
    `;

    // Get the Gmail user for the from field
    const gmailUser =
      process.env.NODE_ENV === 'development'
        ? process.env.GMAIL_USER
        : (await getSecrets(['GMAIL_USER'])).GMAIL_USER;

    const subjectLine = contactRequest.subject
      ? `${metadata.icon} ${metadata.label}: ${contactRequest.subject}`
      : `${metadata.icon} ${metadata.label} from ${contactRequest.name}`;

    await transporter.sendMail({
      from: `"Clearly Notifications" <${gmailUser}>`,
      to: adminEmail,
      replyTo: contactRequest.email,
      subject: subjectLine,
      text: textContent,
      html: htmlContent,
    });

    console.log(`Contact notification email sent to ${adminEmail} (Type: ${contactRequest.inquiryType})`);
  } catch (error) {
    console.error('Failed to send contact notification email:', error);
    // Don't throw error - let the contact request succeed even if email fails
    if (process.env.NODE_ENV !== 'development') {
      console.error('ALERT: Contact notification email failed in production');
    }
  }
}

/**
 * Send demo request notification email to admin (legacy, redirects to contact)
 * @param demoRequest - Demo request data
 * @deprecated Use sendContactNotificationEmail instead
 */
export async function sendDemoNotificationEmail(demoRequest: DemoRequestEmailData): Promise<void> {
  // Convert to contact request format and call new function
  return sendContactNotificationEmail({
    inquiryType: 'DEMO',
    ...demoRequest,
  });
}

/**
 * Send email verification email to user
 * @param email - User's email address
 * @param name - User's name
 * @param verificationToken - Verification token
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationToken: string
): Promise<void> {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const verificationUrl = `${clientUrl}/auth/verify-email?token=${verificationToken}`;

  try {
    const transporter = await createTransporter();

    // Skip email if transporter is null (development mode without Gmail config)
    if (!transporter) {
      console.log(`[DEV] Verification email would be sent to ${email}`);
      console.log(`[DEV] Verification URL: ${verificationUrl}`);
      console.log(`[DEV] Email notification skipped - configure Gmail credentials to enable emails`);
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #4F46E5;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: #f9fafb;
      padding: 30px;
      border: 1px solid #e5e7eb;
      border-radius: 0 0 8px 8px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #4F46E5;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #4338CA;
    }
    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    .warning {
      background-color: #FEF3C7;
      border-left: 4px solid #F59E0B;
      padding: 12px;
      margin: 20px 0;
      border-radius: 4px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Welcome to Clearly!</h1>
      <p style="margin: 10px 0 0 0;">Please verify your email address</p>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      
      <p>Thank you for signing up for Clearly! To complete your registration and start using our platform, please verify your email address by clicking the button below:</p>
      
      <div style="text-align: center;">
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
      
      <div class="warning">
        <strong>⚠️ Link expires in 24 hours</strong><br>
        If you didn't create an account with Clearly, you can safely ignore this email.
      </div>
      
      <p>If you have any questions, feel free to reach out to our support team.</p>
      
      <p>Best regards,<br>The Clearly Team</p>
    </div>
    <div class="footer">
      <p>This email was sent from Clearly (no-reply).</p>
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
Welcome to Clearly!

Hi ${name},

Thank you for signing up for Clearly! To complete your registration and start using our platform, please verify your email address by visiting this link:

${verificationUrl}

Link expires in 24 hours.

If you didn't create an account with Clearly, you can safely ignore this email.

Best regards,
The Clearly Team
    `;

    // Get the Gmail user for the from field
    const gmailUser =
      process.env.NODE_ENV === 'development'
        ? process.env.GMAIL_USER
        : (await getSecrets(['GMAIL_USER'])).GMAIL_USER;

    await transporter.sendMail({
      from: `"Clearly" <${gmailUser}>`,
      to: email,
      subject: 'Verify your Clearly account',
      text: textContent,
      html: htmlContent,
    });

    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error; // Re-throw so caller can handle rollback
  }
}

/**
 * Send verification reminder email to user
 * @param email - User's email address
 * @param name - User's name
 * @param verificationToken - Verification token
 */
export async function sendVerificationReminderEmail(
  email: string,
  name: string,
  verificationToken: string
): Promise<void> {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const verificationUrl = `${clientUrl}/auth/verify-email?token=${verificationToken}`;

  try {
    const transporter = await createTransporter();

    // Skip email if transporter is null (development mode without Gmail config)
    if (!transporter) {
      console.log(`[DEV] Verification reminder email would be sent to ${email}`);
      console.log(`[DEV] Verification URL: ${verificationUrl}`);
      console.log(`[DEV] Email notification skipped - configure Gmail credentials to enable emails`);
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #F59E0B;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: #f9fafb;
      padding: 30px;
      border: 1px solid #e5e7eb;
      border-radius: 0 0 8px 8px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #4F46E5;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #4338CA;
    }
    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    .warning {
      background-color: #FEF3C7;
      border-left: 4px solid #F59E0B;
      padding: 12px;
      margin: 20px 0;
      border-radius: 4px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">📧 Reminder: Verify Your Email</h1>
      <p style="margin: 10px 0 0 0;">Complete your Clearly account setup</p>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      
      <p>We noticed you haven't verified your email address yet. To access your Clearly account, please verify your email by clicking the button below:</p>
      
      <div style="text-align: center;">
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
      
      <div class="warning">
        <strong>⚠️ Link expires in 24 hours</strong><br>
        If you didn't create an account with Clearly, you can safely ignore this email.
      </div>
      
      <p>If you have any questions, feel free to reach out to our support team.</p>
      
      <p>Best regards,<br>The Clearly Team</p>
    </div>
    <div class="footer">
      <p>This email was sent from Clearly (no-reply).</p>
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
Reminder: Verify Your Email

Hi ${name},

We noticed you haven't verified your email address yet. To access your Clearly account, please verify your email by visiting this link:

${verificationUrl}

Link expires in 24 hours.

If you didn't create an account with Clearly, you can safely ignore this email.

Best regards,
The Clearly Team
    `;

    // Get the Gmail user for the from field
    const gmailUser =
      process.env.NODE_ENV === 'development'
        ? process.env.GMAIL_USER
        : (await getSecrets(['GMAIL_USER'])).GMAIL_USER;

    await transporter.sendMail({
      from: `"Clearly" <${gmailUser}>`,
      to: email,
      subject: 'Reminder: Verify your Clearly account',
      text: textContent,
      html: htmlContent,
    });

    console.log(`Verification reminder email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send verification reminder email:', error);
    throw error; // Re-throw so caller can handle
  }
}

