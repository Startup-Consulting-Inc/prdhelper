import type { Meta, StoryObj } from '@storybook/react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

const meta = {
  title: 'Auth/AuthLayout',
  component: AuthLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoginPage: Story = {
  args: {
    title: 'Welcome back',
    subtitle: 'Sign in to your account to continue',
    showBranding: true,
    children: (
      <div className="space-y-6">
        <OAuthButtons
          onProviderClick={async (provider) => {
            console.log('OAuth provider:', provider);
          }}
        />
        <LoginForm
          onSubmit={async (data) => {
            console.log('Login data:', data);
          }}
        />
      </div>
    ),
  },
};

export const SignupPage: Story = {
  args: {
    title: 'Create your account',
    subtitle: 'Start generating professional requirements documents today',
    showBranding: true,
    children: (
      <div className="space-y-6">
        <OAuthButtons
          onProviderClick={async (provider) => {
            console.log('OAuth provider:', provider);
          }}
        />
        <SignupForm
          onSubmit={async (data) => {
            console.log('Signup data:', data);
          }}
        />
      </div>
    ),
  },
};

export const WithoutBranding: Story = {
  args: {
    title: 'Sign in',
    subtitle: 'Enter your credentials to continue',
    showBranding: false,
    children: (
      <LoginForm
        onSubmit={async (data) => {
          console.log('Login data:', data);
        }}
      />
    ),
  },
};

export const MobileView: Story = {
  args: {
    title: 'Welcome back',
    subtitle: 'Sign in to your account',
    showBranding: true,
    children: (
      <div className="space-y-6">
        <OAuthButtons
          onProviderClick={async (provider) => {
            console.log('OAuth provider:', provider);
          }}
        />
        <LoginForm
          onSubmit={async (data) => {
            console.log('Login data:', data);
          }}
        />
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const WithError: Story = {
  args: {
    title: 'Welcome back',
    subtitle: 'Sign in to your account to continue',
    showBranding: true,
    children: (
      <div className="space-y-6">
        <OAuthButtons
          onProviderClick={async (provider) => {
            console.log('OAuth provider:', provider);
          }}
        />
        <LoginForm
          onSubmit={async (data) => {
            console.log('Login data:', data);
          }}
          error="Invalid email or password. Please try again."
        />
      </div>
    ),
  },
};

export const LoadingState: Story = {
  args: {
    title: 'Welcome back',
    subtitle: 'Sign in to your account to continue',
    showBranding: true,
    children: (
      <div className="space-y-6">
        <OAuthButtons
          onProviderClick={async (provider) => {
            console.log('OAuth provider:', provider);
          }}
          isLoading={true}
          loadingProvider="google"
        />
        <LoginForm
          onSubmit={async (data) => {
            console.log('Login data:', data);
          }}
        />
      </div>
    ),
  },
};

// Complete signup flow
export const CompleteSignupFlow: Story = {
  args: {
    title: 'Get started with Clearly',
    subtitle: 'Create your free account in less than a minute',
    showBranding: true,
    children: (
      <div className="space-y-6">
        <OAuthButtons
          onProviderClick={async (provider) => {
            console.log('OAuth provider:', provider);
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }}
        />
        <SignupForm
          onSubmit={async (data) => {
            console.log('Signup data:', data);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            alert('Account created successfully!');
          }}
        />
      </div>
    ),
  },
};

// Dark mode demonstration
export const DarkMode: Story = {
  args: {
    title: 'Welcome back',
    subtitle: 'Sign in to your account to continue',
    showBranding: true,
    children: (
      <div className="space-y-6">
        <OAuthButtons
          onProviderClick={async (provider) => {
            console.log('OAuth provider:', provider);
          }}
        />
        <LoginForm
          onSubmit={async (data) => {
            console.log('Login data:', data);
          }}
        />
      </div>
    ),
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Accessibility demo
export const AccessibilityDemo: Story = {
  args: {
    title: 'Accessible Authentication',
    subtitle: 'Full keyboard navigation and screen reader support',
    showBranding: true,
    children: (
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>♿ Accessibility Features:</strong>
            <br />
            • Full keyboard navigation
            <br />
            • Screen reader announcements
            <br />
            • High contrast colors
            <br />• Focus indicators
          </p>
        </div>
        <LoginForm
          onSubmit={async (data) => {
            console.log('Login data:', data);
          }}
        />
      </div>
    ),
  },
};

