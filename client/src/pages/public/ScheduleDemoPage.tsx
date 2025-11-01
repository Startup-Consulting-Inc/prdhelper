/**
 * Schedule Demo Page
 *
 * Public page for scheduling product demos
 */

import { PublicLayout } from '../../components/layout/PublicLayout';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function ScheduleDemoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    teamSize: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission
    console.log('Demo request:', formData);
    setSubmitted(true);
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
              Thank you for your interest!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              We've received your demo request and will be in touch within 24 hours to schedule a time
              that works for you.
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
              Schedule a Demo
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              See how Clearly can transform your requirements documentation process. Our team will
              walk you through the platform and answer all your questions.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Clock className="h-6 w-6 text-primary-600 dark:text-primary-400" />
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
                <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                  <Users className="h-6 w-6 text-accent-600 dark:text-accent-400" />
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
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary-600 dark:text-primary-400" />
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

            <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                What you'll see in the demo:
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <span>AI-guided BRD and PRD wizards</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <span>Document generation and export features</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <span>Collaboration and sharing capabilities</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <span>Best practices and tips for your workflow</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Request a Demo
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
                    Work Email *
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

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tell us about your needs (optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="What challenges are you facing with requirements documentation?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Request Demo
                </button>

                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  We'll respond within 24 hours to schedule your personalized demo.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
