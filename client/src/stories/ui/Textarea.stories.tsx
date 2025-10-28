import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '@/components/ui/Textarea';
import { useState } from 'react';

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    rows: {
      control: { type: 'number', min: 2, max: 20 },
    },
    maxLength: {
      control: { type: 'number', min: 0, max: 5000 },
    },
    showCharacterCount: {
      control: 'boolean',
    },
    autoResize: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter your description...',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Project Details',
    placeholder: 'Describe your project...',
    helperText: 'Provide a detailed description of your project requirements',
  },
};

export const WithCharacterCount: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Textarea
        label="Project Idea"
        placeholder="Describe your initial idea..."
        maxLength={200}
        showCharacterCount
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const WithMaxLength: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Textarea
        label="Initial Idea"
        placeholder="Describe your project (max 2000 characters)..."
        maxLength={2000}
        showCharacterCount
        rows={6}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        helperText="This will be used to generate your Business Requirements Document"
      />
    );
  },
};

export const AutoResize: Story = {
  render: () => {
    const [value, setValue] = useState('Start typing and watch the textarea grow automatically...');
    return (
      <Textarea
        label="Auto-Resizing Textarea"
        autoResize
        rows={2}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        helperText="The textarea will expand as you type"
      />
    );
  },
};

export const WithError: Story = {
  args: {
    label: 'Project Description',
    value: 'Too short',
    errorText: 'Description must be at least 20 characters long',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Textarea',
    value: 'This content cannot be edited',
    disabled: true,
  },
};

// Use case: Wizard answer input
export const WizardAnswerInput: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const minLength = 20;
    const maxLength = 500;
    const hasError = value.length > 0 && value.length < minLength;

    return (
      <Textarea
        label="What are the main goals of your project?"
        placeholder="Describe the primary objectives and expected outcomes..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={maxLength}
        showCharacterCount
        rows={5}
        errorText={hasError ? `Please provide at least ${minLength} characters` : undefined}
        helperText={!hasError ? 'Be specific about what you want to achieve' : undefined}
      />
    );
  },
};

// Accessibility
export const AccessibilityDemo = {
  render: () => (
    <div className="space-y-6">
      <Textarea
        label="Accessible Label"
        helperText="Helper text is properly associated with aria-describedby"
        placeholder="Type here"
      />
      <Textarea
        label="With Error"
        errorText="Error message is announced to screen readers"
        value="Invalid input"
      />
      <Textarea
        label="Required Field"
        required
        placeholder="This field is required"
      />
    </div>
  ),
};

