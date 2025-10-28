import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from '@/components/auth/LoginForm';

const meta = {
  title: 'Auth/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: async (data) => {
      console.log('Login data:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

export const WithError: Story = {
  args: {
    onSubmit: async (data) => {
      console.log('Login data:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    error: 'Invalid email or password. Please try again.',
  },
};

export const Loading: Story = {
  args: {
    onSubmit: async (data) => {
      console.log('Login data:', data);
    },
    isLoading: true,
  },
};

export const NetworkError: Story = {
  args: {
    onSubmit: async (data) => {
      console.log('Login data:', data);
    },
    error: 'Unable to connect to the server. Please check your internet connection.',
  },
};

// Interactive story
export const Interactive: Story = {
  args: {
    onSubmit: async (data) => {
      console.log('Login attempt with:', data);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert('Login successful! (This is a demo)');
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Try logging in with any email and password (min 8 characters).',
      },
    },
  },
};

// Use case: After failed login attempt
export const AfterFailedAttempt = {
  render: () => {
    return (
      <div className="space-y-4 max-w-md">
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Demo credentials:</strong>
            <br />
            Email: demo@example.com
            <br />
            Password: demo12345
          </p>
        </div>
        <LoginForm
          onSubmit={async (data) => {
            console.log('Login data:', data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }}
          error="Invalid credentials. Please check your email and password."
        />
      </div>
    );
  },
};

// Accessibility demo
export const AccessibilityDemo: Story = {
  args: {
    onSubmit: async (data) => {
      console.log('Login data:', data);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'This form is fully accessible with keyboard navigation, screen reader support, and proper error announcements.',
      },
    },
  },
};

