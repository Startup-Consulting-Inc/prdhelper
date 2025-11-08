/**
 * Contact Us Page
 *
 * Public page for general contact inquiries
 */

import { PublicLayout } from '../../components/layout/PublicLayout';
import { Mail, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { trpc } from '../../lib/trpc';
import { FileUpload, UploadedFile } from '../../components/common/FileUpload';

type InquiryType = 'GENERAL' | 'QUESTION' | 'BUG_REPORT' | 'DEMO' | 'FEATURE_REQUEST' | 'OTHER';

// Map form contact reasons to backend InquiryType enum
const reasonToInquiryType: Record<string, InquiryType> = {
  general: 'GENERAL',
  support: 'QUESTION',
  sales: 'GENERAL',
  feature: 'FEATURE_REQUEST',
  bug: 'BUG_REPORT',
  partnership: 'GENERAL',
  other: 'OTHER',
};

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    reason: '',
    message: '',
  });
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitContactMutation = trpc.contact.submitContact.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setError(null);
    },
    onError: (err) => {
      setError(err.message || 'Failed to submit contact request. Please try again.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const inquiryType = reasonToInquiryType[formData.reason] || 'GENERAL';
      await submitContactMutation.mutateAsync({
        inquiryType,
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        subject: `Contact Request: ${formData.reason}`,
        message: formData.message || undefined,
        attachments: attachments.length > 0 ? attachments : undefined,
      });
    } catch (err) {
      // Error handled by mutation onError
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <PublicLayout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Thank you for contacting us!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              We've received your message and will get back to you within 24-48 hours.
            </p>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                In the meantime, feel free to explore our documentation:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/docs/how-to-use"
                  className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  How to Use Clearly
                </a>
                <a
                  href="/docs/brd"
                  className="inline-block px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Learn About BRDs
                </a>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Info */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Have questions or need assistance? We're here to help! Send us a message and our team
              will get back to you as soon as possible.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Clock className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Quick Response Time
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We aim to respond to all inquiries within 24-48 hours during business days.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Multiple Channels
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Reach us through this form, or email us directly at support@clearly.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Mail className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Expert Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our team of experts is ready to help with any questions about Clearly.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                How we can help:
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <span>Answer questions about our platform</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <span>Provide technical support and troubleshooting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <span>Discuss partnership opportunities</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <span>Help with feature requests and feedback</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Reason *
                  </label>
                  <select
                    id="reason"
                    name="reason"
                    required
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a reason</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Attachments (Optional)
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Upload screenshots or videos to help us better understand your inquiry
                  </p>
                  <FileUpload
                    maxFiles={5}
                    maxSize={5 * 1024 * 1024} // 5MB
                    acceptedTypes={[
                      'image/png',
                      'image/jpeg',
                      'image/jpg',
                      'image/gif',
                      'video/mp4',
                      'video/webm',
                    ]}
                    onFilesChange={setAttachments}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitContactMutation.isPending}
                  className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitContactMutation.isPending ? 'Sending...' : 'Send Message'}
                </button>

                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  We'll respond to your inquiry within 24-48 hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
