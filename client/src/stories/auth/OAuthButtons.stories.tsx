import type { Meta, StoryObj } from '@storybook/react';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

const meta = {
  title: 'Auth/OAuthButtons',
  component: OAuthButtons,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OAuthButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onProviderClick: async (provider) => {
      console.log('OAuth provider clicked:', provider);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    },
  },
};

export const WithError: Story = {
  args: {
    onProviderClick: async (provider) => {
      console.log('OAuth provider clicked:', provider);
    },
    error: 'Authentication failed. Please try again or use a different method.',
  },
};

export const LoadingGoogle: Story = {
  args: {
    onProviderClick: async (provider) => {
      console.log('OAuth provider clicked:', provider);
    },
    isLoading: true,
    loadingProvider: 'google',
  },
};

export const LoadingGitHub: Story = {
  args: {
    onProviderClick: async (provider) => {
      console.log('OAuth provider clicked:', provider);
    },
    isLoading: true,
    loadingProvider: 'github',
  },
};

export const OAuthCancelled: Story = {
  args: {
    onProviderClick: async (provider) => {
      console.log('OAuth provider clicked:', provider);
    },
    error: 'Authentication was cancelled. Please try again if you want to sign in.',
  },
};

export const OAuthPermissionDenied: Story = {
  args: {
    onProviderClick: async (provider) => {
      console.log('OAuth provider clicked:', provider);
    },
    error:
      'Permission denied. PRD Helper needs access to your email address to create your account.',
  },
};

// Interactive story
export const Interactive: Story = {
  args: {
    onProviderClick: async (provider) => {
      console.log('Initiating OAuth flow for:', provider);
      // Simulate OAuth redirect
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert(`Successfully authenticated with ${provider}! (This is a demo)`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Click on either Google or GitHub to simulate the OAuth flow.',
      },
    },
  },
};

// Use case: In login/signup page
export const InAuthPage = {
  render: () => (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Sign in to PRD Helper
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Choose your preferred sign-in method
        </p>
      </div>
      <OAuthButtons
        onProviderClick={async (provider) => {
          console.log('OAuth provider clicked:', provider);
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }}
      />
      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </div>
    </div>
  ),
};

// Accessibility demo
export const AccessibilityDemo: Story = {
  args: {
    onProviderClick: async (provider) => {
      console.log('OAuth provider clicked:', provider);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'OAuth buttons are fully keyboard accessible and include proper ARIA labels for screen readers.',
      },
    },
  },
};

