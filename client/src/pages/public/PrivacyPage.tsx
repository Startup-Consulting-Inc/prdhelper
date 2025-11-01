/**
 * Privacy Policy Page
 *
 * Public page displaying Clearly's privacy policy.
 */

import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Sparkles className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Clearly</span>
            </button>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/login')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="mb-8"
          iconLeft={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Home
        </Button>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Introduction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Welcome to Clearly ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our products and services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Information We Collect
            </h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Account Information</h3>
                <p>
                  When you create an account, we collect information such as your name, email address, and password. We may also collect additional profile information that you choose to provide.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Usage Data</h3>
                <p>
                  We automatically collect information about how you interact with our service, including pages visited, features used, and actions taken. This helps us improve our service and provide better user experiences.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Content Data</h3>
                <p>
                  We store the documents, projects, and conversations you create within our service. This content is stored securely and is only accessible to you unless you explicitly share it.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Technical Data</h3>
                <p>
                  We collect technical information such as IP addresses, browser type, device information, and operating system to ensure compatibility and security.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              How We Use Your Information
            </h2>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>To provide, maintain, and improve our services</li>
              <li>To process your transactions and send related information</li>
              <li>To send you technical notices, updates, and support messages</li>
              <li>To respond to your comments, questions, and requests</li>
              <li>To monitor and analyze usage patterns and trends</li>
              <li>To detect, prevent, and address technical issues and security threats</li>
              <li>To personalize your experience and provide relevant content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Data Storage and Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is stored on secure servers with encryption at rest and in transit.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Data Sharing and Disclosure
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations or respond to lawful requests</li>
              <li>To protect our rights, privacy, safety, or property</li>
              <li>With service providers who assist us in operating our service (under strict confidentiality agreements)</li>
              <li>In connection with a business transfer, merger, or acquisition</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Your Rights and Choices
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Objection:</strong> Object to processing of your personal information</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              To exercise these rights, please contact us using the information provided in the Contact section below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Data Retention
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When you delete your account, we will delete or anonymize your personal information, except where we are required to retain it for legal or regulatory purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Children's Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us, and we will take steps to delete such information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                <strong>Email:</strong> privacy@clearly.ai
              </p>
              <p>
                <strong>Support:</strong> support@clearly.ai
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary-400" />
              <span className="text-lg font-bold text-white">Clearly</span>
            </div>
            <p className="text-sm text-center">
              Making Requirements Clear Since 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

