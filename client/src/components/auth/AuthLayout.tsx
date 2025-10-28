/**
 * Auth Layout Component
 * 
 * Provides consistent layout for authentication pages with optional branding.
 * Features split-screen design with gradient background and feature highlights.
 * 
 * Recent Changes:
 * - [2025-10-27] FEAT: Added responsive auth layout with branding panel
 */

import { ReactNode } from 'react';
import { FileText } from 'lucide-react';

export interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  showBranding?: boolean;
}

const AuthLayout = ({
  children,
  title,
  subtitle,
  footer,
  showBranding = true,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      {showBranding && (
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 p-12 items-center justify-center relative overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-md text-white">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">PRD Helper</h1>
                <p className="text-sm text-white/80">AI-Powered Requirements</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Transform Ideas into Professional Requirements Documents
            </h2>

            <p className="text-lg text-white/90 mb-8">
              Generate comprehensive BRDs, PRDs, and Task Lists in minutes with our
              intelligent wizard. Save days of work while maintaining professional quality.
            </p>

            <div className="space-y-4">
              <Feature
                icon="✨"
                title="AI-Guided Wizards"
                description="Smart Q&A flow that adapts to your needs"
              />
              <Feature
                icon="📝"
                title="Professional Output"
                description="Industry-standard document formats"
              />
              <Feature
                icon="⚡"
                title="Save Time"
                description="Reduce documentation time from days to hours"
              />
              <Feature
                icon="🎯"
                title="Two Modes"
                description="Plain mode for business, Technical mode for dev teams"
              />
            </div>
          </div>
        </div>
      )}

      {/* Right side - Form */}
      <div
        className={`flex-1 flex items-center justify-center p-8 ${
          showBranding ? 'lg:w-1/2' : 'w-full'
        }`}
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                PRD Helper
              </h1>
            </div>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
            )}
          </div>

          {/* Form content */}
          {children}
          
          {/* Footer */}
          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
}

const Feature = ({ icon, title, description }: FeatureProps) => (
  <div className="flex items-start gap-3">
    <div className="text-2xl">{icon}</div>
    <div>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-white/80">{description}</p>
    </div>
  </div>
);

AuthLayout.displayName = 'AuthLayout';

export { AuthLayout };

