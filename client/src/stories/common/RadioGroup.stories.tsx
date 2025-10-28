import type { Meta } from '@storybook/react';
import { RadioGroup } from '@/components/common/RadioGroup';
import { useState } from 'react';

const meta = {
  title: 'Common/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>;

export default meta;

const simpleOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const modeOptions = [
  {
    value: 'plain',
    label: 'Plain Mode',
    description: 'Simple language suitable for non-technical stakeholders',
  },
  {
    value: 'technical',
    label: 'Technical Mode',
    description: 'Detailed specifications for technical teams',
  },
];

export const Default = {
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <RadioGroup
        options={simpleOptions}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};

export const WithLabel = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <RadioGroup
        label="Select an option"
        options={simpleOptions}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};

export const WithDescriptions = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <RadioGroup
        label="Choose Your Mode"
        options={modeOptions}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};

export const WithDisabledOption = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <RadioGroup
        label="Select Status"
        options={[
          { value: 'active', label: 'Active' },
          { value: 'pending', label: 'Pending (Unavailable)', disabled: true },
          { value: 'completed', label: 'Completed' },
        ]}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};

export const Disabled = {
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <RadioGroup
        label="Disabled Group"
        options={simpleOptions}
        value={value}
        onValueChange={setValue}
        disabled
      />
    );
  },
};

// Use case: Mode selection
export const ModeSelection = {
  render: () => {
    const [mode, setMode] = useState('plain');
    return (
      <div className="space-y-4">
        <RadioGroup
          label="Select Your Documentation Mode"
          options={modeOptions}
          value={mode}
          onValueChange={setMode}
        />
        {mode && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <p className="text-sm">
              <strong>Selected:</strong> {mode === 'plain' ? 'Plain Mode' : 'Technical Mode'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {mode === 'plain'
                ? 'Documents will use simple, easy-to-understand language'
                : 'Documents will include detailed technical specifications'}
            </p>
          </div>
        )}
      </div>
    );
  },
};

// Use case: Priority selection
export const PrioritySelection = {
  render: () => {
    const [priority, setPriority] = useState('medium');
    return (
      <RadioGroup
        label="Task Priority"
        options={[
          {
            value: 'low',
            label: 'Low Priority',
            description: 'Can be done later, not time-sensitive',
          },
          {
            value: 'medium',
            label: 'Medium Priority',
            description: 'Should be completed within the sprint',
          },
          {
            value: 'high',
            label: 'High Priority',
            description: 'Critical task, needs immediate attention',
          },
        ]}
        value={priority}
        onValueChange={setPriority}
      />
    );
  },
};

// Accessibility Demo
export const AccessibilityDemo = {
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Radio groups are fully keyboard accessible:
        </p>
        <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
          <li>Use Tab to focus the group</li>
          <li>Use Arrow keys to navigate options</li>
          <li>Space to select</li>
          <li>Proper ARIA attributes for screen readers</li>
        </ul>
        <RadioGroup
          label="Accessible Radio Group"
          options={simpleOptions}
          value={value}
          onValueChange={setValue}
        />
      </div>
    );
  },
};

