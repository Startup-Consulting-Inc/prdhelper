import type { Meta, StoryObj } from '@storybook/react';
import { AnswerInput } from '@/components/wizard/AnswerInput';
import { useState } from 'react';

const meta = {
  title: 'Wizard/AnswerInput',
  component: AnswerInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AnswerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    onChange: (value) => console.log('Value:', value),
    onSubmit: () => console.log('Submit clicked'),
  },
};

export const WithValue: Story = {
  args: {
    value: 'We need to build a mobile-first e-commerce platform that allows users to browse products, add items to cart, and complete purchases seamlessly.',
    onChange: (value) => console.log('Value:', value),
    onSubmit: () => console.log('Submit clicked'),
  },
};

export const Loading: Story = {
  args: {
    value: 'Creating a comprehensive requirements document for our new platform.',
    onChange: (value) => console.log('Value:', value),
    onSubmit: () => console.log('Submit clicked'),
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    value: '',
    onChange: (value) => console.log('Value:', value),
    onSubmit: () => console.log('Submit clicked'),
    disabled: true,
  },
};

// Interactive demo
export const Interactive = {
  render: () => {
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = () => {
      console.log('Submitting:', value);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setValue('');
        alert('Answer submitted!');
      }, 2000);
    };

    return (
      <div className="max-w-3xl">
        <AnswerInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    );
  },
};

// Character count demo
export const CharacterCountDemo = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div className="space-y-4 max-w-3xl">
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Character limits:</strong>
            <br />
            • Minimum: 10 characters
            <br />
            • Maximum: 2000 characters
            <br />
            • Warning at 80% (1600 characters)
            <br />• Try typing to see the counter in action
          </p>
        </div>
        <AnswerInput
          value={value}
          onChange={setValue}
          onSubmit={() => alert('Submitted!')}
        />
      </div>
    );
  },
};

// Near limit
export const NearLimit = {
  render: () => {
    const longText = 'A'.repeat(1650); // 82.5% of 2000
    const [value, setValue] = useState(longText);

    return (
      <div className="max-w-3xl">
        <AnswerInput
          value={value}
          onChange={setValue}
          onSubmit={() => console.log('Submit')}
        />
      </div>
    );
  },
};

// Over limit
export const OverLimit = {
  render: () => {
    const longText = 'A'.repeat(2100); // Over 2000
    const [value, setValue] = useState(longText);

    return (
      <div className="max-w-3xl">
        <AnswerInput
          value={value}
          onChange={setValue}
          onSubmit={() => console.log('Submit')}
        />
      </div>
    );
  },
};

// Below minimum
export const BelowMinimum = {
  render: () => {
    const [value, setValue] = useState('Short');

    return (
      <div className="max-w-3xl">
        <AnswerInput
          value={value}
          onChange={setValue}
          onSubmit={() => console.log('Submit')}
          minLength={10}
        />
      </div>
    );
  },
};

// In conversation context
export const InConversationContext = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div className="space-y-6 max-w-3xl">
        {/* Previous Q&A */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">AI</span>
          </div>
          <div className="flex-1 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-gray-900 dark:text-gray-100">
              What is the main goal of your project?
            </p>
          </div>
        </div>

        <div className="flex gap-4 ml-14">
          <div className="flex-1 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
            <p className="text-blue-900 dark:text-blue-100">
              To build a modern e-commerce platform that provides a seamless shopping experience for our customers.
            </p>
          </div>
        </div>

        {/* New question */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">AI</span>
          </div>
          <div className="flex-1 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-gray-900 dark:text-gray-100">
              Who are the primary users or customers for this platform?
            </p>
          </div>
        </div>

        {/* Input for current answer */}
        <AnswerInput
          value={value}
          onChange={setValue}
          onSubmit={() => {
            alert(`Answer: ${value}`);
            setValue('');
          }}
        />
      </div>
    );
  },
};

// Keyboard shortcuts demo
export const KeyboardShortcuts = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div className="space-y-4 max-w-3xl">
        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300">
            <strong>⌨️ Keyboard Shortcuts:</strong>
            <br />
            • <kbd>⌘/Ctrl + Enter</kbd> - Submit answer
            <br />• Answer must meet minimum length requirement to submit
          </p>
        </div>
        <AnswerInput
          value={value}
          onChange={setValue}
          onSubmit={() => alert('Submitted with keyboard shortcut!')}
        />
      </div>
    );
  },
};

// Accessibility demo
export const AccessibilityDemo: Story = {
  args: {
    value: '',
    onChange: (value) => console.log('Value:', value),
    onSubmit: () => console.log('Submit clicked'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'The answer input includes keyboard shortcuts, clear character limits, and proper ARIA labels for accessibility.',
      },
    },
  },
};

