import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@/components/ui/Select';
import { useState } from 'react';

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const simpleOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

const modeOptions = [
  { label: 'Plain Mode', value: 'plain' },
  { label: 'Technical Mode', value: 'technical' },
];

const countryOptions = [
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Canada', value: 'ca' },
  { label: 'Australia', value: 'au' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'Japan', value: 'jp' },
];

export const Default: Story = {
  args: {
    label: 'Select an option',
    options: simpleOptions,
  },
};

export const WithPlaceholder = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Select
        label="Choose your mode"
        placeholder="Select a mode..."
        options={modeOptions}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'User Mode',
    options: modeOptions,
    helperText: 'Choose between plain language or technical documentation',
  },
};

export const WithError: Story = {
  args: {
    label: 'User Mode',
    options: modeOptions,
    value: '',
    errorText: 'Please select a mode to continue',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Select',
    options: simpleOptions,
    value: '1',
    disabled: true,
  },
};

export const LongLabels: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    helperText: 'Select your country',
  },
};

export const WithDisabledOption: Story = {
  args: {
    label: 'Select Status',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Pending', value: 'pending', disabled: true },
      { label: 'Completed', value: 'completed' },
      { label: 'Archived', value: 'archived' },
    ],
  },
};

// Use case: Mode selection
export const ModeSelection = {
  render: () => {
    const [mode, setMode] = useState('');
    return (
      <div className="space-y-4">
        <Select
          label="Select Your Mode"
          placeholder="Choose your preferred mode..."
          options={modeOptions}
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          helperText="Plain mode uses simple language, while Technical mode includes technical details"
        />
        {mode && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <p className="text-sm">
              Selected: <strong>{mode === 'plain' ? 'Plain Mode' : 'Technical Mode'}</strong>
            </p>
          </div>
        )}
      </div>
    );
  },
};

// Accessibility
export const AccessibilityDemo = {
  render: () => (
    <div className="space-y-6">
      <Select
        label="Accessible Label"
        options={simpleOptions}
        helperText="Helper text is properly associated with aria-describedby"
      />
      <Select
        label="With Error"
        options={simpleOptions}
        value=""
        errorText="Error message is announced to screen readers"
      />
      <Select
        label="Required Field"
        options={simpleOptions}
        required
      />
    </div>
  ),
};

