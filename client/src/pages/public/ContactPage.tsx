/**
 * Contact Us Page
 *
 * Universal contact form supporting multiple inquiry types:
 * - General Inquiry
 * - Question
 * - Bug Report
 * - Schedule Demo
 * - Feature Request
 * - Other
 */

import { PublicLayout } from '../../components/layout/PublicLayout';
import {
  Mail,
  MessageSquare,
  Bug,
  Calendar,
  Lightbulb,
  FileText,
  CheckCircle,
  Clock,
  Users,
  ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { trpc } from '../../lib/trpc';

type InquiryType = 'GENERAL' | 'QUESTION' | 'BUG_REPORT' | 'DEMO' | 'FEATURE_REQUEST' | 'OTHER';

interface InquiryTypeOption {
  value: InquiryType;
  label: string;
  icon: any;
  description: string;
  color: string;
}

const inquiryTypes: InquiryTypeOption[] = [
  {
    value: 'GENERAL',
    label: 'General Inquiry',
    icon: Mail,
    description: 'General questions about the platform',
    color: 'gray',
  },
  {
    value: 'QUESTION',
    label: 'Question',
    icon: MessageSquare,
    description: 'Specific questions about features/usage',
    color: 'purple',
  },
  {
    value: 'BUG_REPORT',
    label: 'Bug Report',
    icon: Bug,
    description: 'Report technical issues',
    color: 'red',
  },
  {
    value: 'DEMO',
    label: 'Schedule Demo',
    icon: Calendar,
    description: 'Request product demonstration',
    color: 'blue',
  },
  {
    value: 'FEATURE_REQUEST',
    label: 'Feature Request',
    icon: Lightbulb,
    description: 'Suggest new features',
    color: 'green',
  },
  {
    value: 'OTHER',
    label: 'Other',
    icon: FileText,
    description: 'Other inquiries',
    color: 'gray',
  },
];

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');

  const [inquiryType, setInquiryType] = useState<InquiryType>('GENERAL');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    teamSize: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set inquiry type from URL param on mount
  useEffect(() => {
    if (typeParam) {
      const upperType = typeParam.toUpperCase() as InquiryType;
      if (inquiryTypes.some(t => t.value === upperType)) {
        setInquiryType(upperType);
      }
    }
  }, [typeParam]);

  const selectedType = inquiryTypes.find(t => t.value === inquiryType);

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
      await submitContactMutation.mutateAsync({
        inquiryType,
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        role: formData.role || undefined,
        teamSize: formData.teamSize || undefined,
        subject: formData.subject || undefined,
        message: formData.message || undefined,
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

  // Show different fields based on inquiry type
  const shouldShowField = (field: string): boolean => {
    switch (field) {
      case 'subject':
        return ['GENERAL', 'QUESTION', 'BUG_REPORT', 'FEATURE_REQUEST', 'OTHER'].includes(inquiryType);
      case 'company':
      case 'role':
      case 'teamSize':
        return inquiryType === 'DEMO';
      default:
        return true;
    }
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
              Thank you for reaching out!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {inquiryType === 'DEMO'
                ? "We've received your demo request and will be in touch within 24 hours to schedule a time that works for you."
                : inquiryType === 'BUG_REPORT'
                ? "We've received your bug report and our team will investigate it promptly."
                : "We've received your message and will respond within 24 hours."}
            </p>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                In the meantime, feel free to explore our documentation:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/docs/how-to-use"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  How to Use Clearly
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/docs/brd"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Learn About BRDs
                  <ArrowRight className="w-4 h-4" />
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
              Have a question, need help, or want to see Clearly in action? We're here to help!
              Select an inquiry type and fill out the form.
            </p>

            {/* Dynamic content based on inquiry type */}
            {inquiryType === 'DEMO' && (
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      30-Minute Session
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Quick, focused walkthrough tailored to your needs and use cases.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Personalized Experience
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      We'll customize the demo based on your team size and requirements workflow.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Flexible Scheduling
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      We work around your schedule. Available for demos across all time zones.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {inquiryType === 'BUG_REPORT' && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Reporting a bug?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  To help us resolve the issue quickly, please include:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <span>Steps to reproduce the issue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <span>What you expected to happen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <span>What actually happened</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <span>Browser and operating system</span>
                  </li>
                </ul>
              </div>
            )}

            <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                We're here to help!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Our team typically responds within 24 hours during business days. For urgent issues,
                please mention it in your message.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Business hours: Monday-Friday, 9 AM - 5 PM EST
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Get in Touch
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inquiry Type Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    What can we help you with? *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {inquiryTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = inquiryType === type.value;
                      const colorClasses = {
                        gray: 'border-gray-300 dark:border-gray-600 hover:border-gray-400 checked:border-gray-600 checked:bg-gray-50 dark:checked:bg-gray-700',
                        purple: 'border-gray-300 dark:border-gray-600 hover:border-purple-400 checked:border-purple-600 checked:bg-purple-50 dark:checked:bg-purple-900/20',
                        red: 'border-gray-300 dark:border-gray-600 hover:border-red-400 checked:border-red-600 checked:bg-red-50 dark:checked:bg-red-900/20',
                        blue: 'border-gray-300 dark:border-gray-600 hover:border-blue-400 checked:border-blue-600 checked:bg-blue-50 dark:checked:bg-blue-900/20',
                        green: 'border-gray-300 dark:border-gray-600 hover:border-green-400 checked:border-green-600 checked:bg-green-50 dark:checked:bg-green-900/20',
                      };

                      return (
                        <label
                          key={type.value}
                          className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            isSelected ? colorClasses[type.color as keyof typeof colorClasses] : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="inquiryType"
                            value={type.value}
                            checked={isSelected}
                            onChange={(e) => setInquiryType(e.target.value as InquiryType)}
                            className="sr-only"
                          />
                          <Icon className={`h-5 w-5 mr-3 flex-shrink-0 ${isSelected ? `text-${type.color}-600 dark:text-${type.color}-400` : 'text-gray-400'}`} />
                          <div className="flex-1">
                            <span className="block text-sm font-medium text-gray-900 dark:text-white">
                              {type.label}
                            </span>
                            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {type.description}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Name */}
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

                {/* Email */}
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

                {/* Subject (for most types except DEMO) */}
                {shouldShowField('subject') && (
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={
                        inquiryType === 'BUG_REPORT' ? 'Brief description of the bug' :
                        inquiryType === 'FEATURE_REQUEST' ? 'Feature name or summary' :
                        'What is this regarding?'
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                {/* Company, Role, Team Size (for DEMO only) */}
                {shouldShowField('company') && (
                  <>
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
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Role
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select your role</option>
                        <option value="product-manager">Product Manager</option>
                        <option value="developer">Developer</option>
                        <option value="designer">Designer</option>
                        <option value="founder">Founder/CEO</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Team Size
                      </label>
                      <select
                        id="teamSize"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select team size</option>
                        <option value="1-5">1-5 people</option>
                        <option value="6-20">6-20 people</option>
                        <option value="21-50">21-50 people</option>
                        <option value="51+">51+ people</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {inquiryType === 'BUG_REPORT' ? 'Bug Description *' :
                     inquiryType === 'FEATURE_REQUEST' ? 'Feature Description' :
                     inquiryType === 'DEMO' ? 'Tell us about your needs (optional)' :
                     'Message'}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required={inquiryType === 'BUG_REPORT'}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={
                      inquiryType === 'BUG_REPORT' ? 'Please describe the bug in detail, including steps to reproduce...' :
                      inquiryType === 'FEATURE_REQUEST' ? 'Describe the feature and how it would help you...' :
                      inquiryType === 'DEMO' ? 'What challenges are you facing with requirements documentation?' :
                      'Tell us more about your inquiry...'
                    }
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
                  {submitContactMutation.isPending ? 'Submitting...' :
                   inquiryType === 'DEMO' ? 'Request Demo' :
                   inquiryType === 'BUG_REPORT' ? 'Submit Bug Report' :
                   'Send Message'}
                </button>

                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  We'll respond within 24 hours during business days.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
