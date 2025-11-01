/**
 * Terms of Service Page
 *
 * Public page displaying Clearly's terms of service.
 */

import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Agreement to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              By accessing or using Clearly ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, then you may not access the Service.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              These Terms apply to all visitors, users, and others who access or use the Service. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Description of Service
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Clearly is an AI-powered platform that helps users create professional Business Requirements Documents (BRDs), Product Requirements Documents (PRDs), and related documentation through guided conversations. The Service includes:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>Interactive wizards for creating requirements documents</li>
              <li>AI-powered conversation interfaces</li>
              <li>Document generation and version management</li>
              <li>Integration capabilities with AI coding tools</li>
              <li>User account management and data storage</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              User Accounts
            </h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Account Creation</h3>
                <p>
                  To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Account Security</h3>
                <p>
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Account Termination</h3>
                <p>
                  We reserve the right to suspend or terminate your account at any time, with or without cause or notice, for any reason including, but not limited to, breach of these Terms.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Acceptable Use
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You agree not to use the Service:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>In any way that violates any applicable law or regulation</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
              <li>To impersonate or attempt to impersonate the company, an employee, another user, or any other person or entity</li>
              <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
              <li>To engage in any automated use of the system, such as using scripts to send comments or messages</li>
              <li>To interfere with or disrupt the Service or servers or networks connected to the Service</li>
              <li>To collect or store personal data about other users without their express permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Intellectual Property Rights
            </h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Service Ownership</h3>
                <p>
                  The Service and its original content, features, and functionality are owned by Clearly and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">User Content</h3>
                <p>
                  You retain ownership of any content you create, upload, or store using the Service ("User Content"). By using the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your User Content solely for the purpose of providing and improving the Service.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Feedback</h3>
                <p>
                  If you provide us with any feedback, suggestions, or ideas about the Service, you agree that we can use them without any obligation to compensate you.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Service Availability and Modifications
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time, with or without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              We do not guarantee that the Service will be available at all times or that it will be free from errors, viruses, or other harmful components. You are responsible for ensuring you have appropriate backup and security measures in place.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Limitation of Liability
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CLEARLY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>Your use or inability to use the Service</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
              <li>Any interruption or cessation of transmission to or from the Service</li>
              <li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through the Service</li>
              <li>Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Disclaimer of Warranties
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              We do not warrant that the Service will be uninterrupted, secure, or error-free, or that defects will be corrected. We do not warrant or make any representations regarding the use or the results of the use of the Service in terms of its correctness, accuracy, reliability, or otherwise.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Indemnification
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              You agree to defend, indemnify, and hold harmless Clearly and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of the Service, your User Content, or your violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Dispute Resolution
            </h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Governing Law</h3>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Clearly operates, without regard to its conflict of law provisions.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Dispute Resolution Process</h3>
                <p>
                  Any dispute arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the relevant arbitration association, rather than in court. You waive any right to a jury trial.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Changes to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Severability
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service and supersede and replace any prior agreements we might have between us regarding the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Contact Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                <strong>Email:</strong> legal@clearly.ai
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

