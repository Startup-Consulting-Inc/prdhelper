/**
 * Email Service
 *
 * Handles sending emails using Gmail SMTP with credentials from Google Secret Manager.
 * Used for demo request notifications and other transactional emails.
 */

import nodemailer from 'nodemailer';
import { getSecrets } from './secretManager.js';

type InquiryType = 'GENERAL' | 'QUESTION' | 'BUG_REPORT' | 'DEMO' | 'FEATURE_REQUEST' | 'OTHER';

interface ContactRequestEmailData {
  inquiryType: InquiryType;
  name: string;
  email: string;
  company?: string;
  role?: string;
  teamSize?: string;
  subject?: string;
  message?: string;
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
 * Legacy function - kept for backward compatibility
 * @deprecated Use sendContactNotificationEmail instead
 */
export async function _sendDemoNotificationEmailOld(demoRequest: DemoRequestEmailData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.warn('ADMIN_EMAIL not configured, skipping demo notification email');
    return;
  }

  try {
    const transporter = await createTransporter();

    // Skip email if transporter is null (development mode without Secret Manager)
    if (!transporter) {
      console.log(`[DEV] Demo request received from ${demoRequest.name} (${demoRequest.email})`);
      console.log(`[DEV] Email notification skipped - configure Secret Manager to enable emails`);
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
      border-left: 4px solid #4F46E5;
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
      <h1 style="margin: 0;">🎯 New Demo Request</h1>
      <p style="margin: 10px 0 0 0;">Someone wants to learn more about Clearly!</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Name</div>
        <div class="value">${demoRequest.name}</div>
      </div>

      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${demoRequest.email}">${demoRequest.email}</a></div>
      </div>

      ${
        demoRequest.company
          ? `
      <div class="field">
        <div class="label">Company</div>
        <div class="value">${demoRequest.company}</div>
      </div>
      `
          : ''
      }

      ${
        demoRequest.message
          ? `
      <div class="field">
        <div class="label">Message</div>
        <div class="message-box">${demoRequest.message.replace(/\n/g, '<br>')}</div>
      </div>
      `
          : ''
      }

      <div class="field">
        <div class="label">Submitted</div>
        <div class="value">${demoRequest.createdAt.toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
        })}</div>
      </div>
    </div>
    <div class="footer">
      <p>This email was sent from the Clearly demo request form.</p>
      <p>Reply directly to <strong>${demoRequest.email}</strong> to schedule the demo call.</p>
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
New Demo Request

Name: ${demoRequest.name}
Email: ${demoRequest.email}
${demoRequest.company ? `Company: ${demoRequest.company}` : ''}
${demoRequest.message ? `Message: ${demoRequest.message}` : ''}

Submitted: ${demoRequest.createdAt.toLocaleString()}

Reply to ${demoRequest.email} to schedule the demo call.
    `;

    // Get the Gmail user for the from field
    const gmailUser = process.env.NODE_ENV === 'development'
      ? process.env.GMAIL_USER
      : (await getSecrets(['GMAIL_USER'])).GMAIL_USER;

    await transporter.sendMail({
      from: `"Clearly Notifications" <${gmailUser}>`,
      to: adminEmail,
      replyTo: demoRequest.email,
      subject: `New Demo Request from ${demoRequest.name}`,
      text: textContent,
      html: htmlContent,
    });

    console.log(`Demo notification email sent to ${adminEmail}`);
  } catch (error) {
    console.error('Failed to send demo notification email:', error);
    // Don't throw error - let the demo request succeed even if email fails
    // The error will be logged and the request will still be saved to database
    if (process.env.NODE_ENV !== 'development') {
      // In production, you might want to implement retry logic or alert monitoring
      console.error('ALERT: Demo notification email failed in production');
    }
  }
}
