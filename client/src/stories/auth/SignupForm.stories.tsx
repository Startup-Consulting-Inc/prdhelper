import type { Meta, StoryObj } from '@storybook/react';
import { SignupForm } from '@/components/auth/SignupForm';

const meta = {
  title: 'Auth/SignupForm',
  component: SignupForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SignupForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: async (data) => {
      console.log('Signup data:', data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    },
  },
};

export const WithError: Story = {
  args: {
    onSubmit: async (data) => {
      console.log('Signup data:', data);
    },
    error: 'This email address is already registered. Please use a different email or sign in.',
  },
};

export const Loading: Story = {
  args: {
    onSubmit: async (data) => {
      console.log('Signup data:', data);
    },
    isLoading: true,
  },
};

export const ValidationError: Story = {
  args: {
    onSubmit: async (data) => {
      console.log('Signup data:', data);
    },
    error: 'Please correct the errors below and try again.',
  },
};

// Interactive story
export const Interactive: Story = {
  args: {
    onSubmit: async (data) => {
      console.log('Signup attempt with:', data);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert(`Account created successfully! Welcome, ${data.name}! (This is a demo)`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Try creating an account. Watch the password strength indicator update in real-time.',
      },
    },
  },
};

// Password strength demo
export const PasswordStrengthDemo = {
  render: () => {
    return (
      <div className="space-y-4 max-w-md">
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>💡 Password Requirements:</strong>
            <br />
            • At least 8 characters
            <br />
            • One uppercase letter
            <br />
            • One lowercase letter
            <br />• One number
          </p>
        </div>
        <SignupForm
          onSubmit={async (data) => {
            console.log('Signup data:', data);
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }}
        />
      </div>
    );
  },
};

// Mode selection demo
export const ModeSelectionDemo = {
  render: () => {
    return (
      <div className="space-y-4 max-w-md">
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <h3 className="font-semibold text-sm mb-2 text-gray-900 dark:text-gray-100">
            Choose Your Mode
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>
              <strong>Plain Mode:</strong> Best for product managers, business analysts, and
              non-technical stakeholders
            </li>
            <li>
              <strong>Technical Mode:</strong> Includes detailed technical task lists for developers
              and engineering teams
            </li>
          </ul>
        </div>
        <SignupForm
          onSubmit={async (data) => {
            console.log('Selected mode:', data.modePreference);
            console.log('Signup data:', data);
          }}
        />
      </div>
    );
  },
};

// After email already exists error
export const EmailAlreadyExists = {
  render: () => {
    return (
      <div className="space-y-4 max-w-md">
        <SignupForm
          onSubmit={async (data) => {
            console.log('Signup data:', data);
          }}
          error="An account with this email already exists. Please sign in or use a different email address."
        />
      </div>
    );
  },
};

// Accessibility demo
export const AccessibilityDemo: Story = {
  args: {
    onSubmit: async (data) => {
      console.log('Signup data:', data);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'This form includes password strength indicators, real-time validation, and full keyboard navigation support.',
      },
    },
  },
};

