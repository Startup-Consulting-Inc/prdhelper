/**
 * Public Footer Component
 * 
 * Footer for public pages with four columns: Service info, Docs, Company, Contact
 * plus copyright and legal links at the bottom.
 */

import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export interface PublicFooterProps {
  className?: string;
}

export function PublicFooter({ className }: PublicFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 ${className ?? ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Four Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Service Name */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">Clearly</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Transform ideas into professional BRDs and PRDs in minutes with AI-guided conversations.
            </p>
          </div>

          {/* Column 2: Docs */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Docs</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/docs/vibe-coding"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Beyond Vibe coding
                </Link>
              </li>
              <li>
                <Link
                  to="/docs/brd"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Business Requirements Document
                </Link>
              </li>
              <li>
                <Link
                  to="/docs/prd"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Product Requirements Document
                </Link>
              </li>
              <li>
                <Link
                  to="/docs/software-development-process"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Software Development Process with AI
                </Link>
              </li>
              <li>
                <Link
                  to="/docs/how-to-use"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  How to use Clearly
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  About Company
                </Link>
              </li>
              <li>
                <Link
                  to="/case-studies"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Case Studies
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/schedule-demo"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row: Copyright and Legal Links */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} Clearly. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

