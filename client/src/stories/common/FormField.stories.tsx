import type { Meta } from '@storybook/react';
import { FormField } from '@/components/common/FormField';
import { useState } from 'react';

const meta = {
  title: 'Common/FormField',
  component: FormField,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormField>;

export default meta;

// Text Input
export const TextInput = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <FormField
        type="input"
        label="Email Address"
        helperText="We'll never share your email with anyone"
        required
        inputProps={{
          type: 'email',
          placeholder: 'you@example.com',
          value,
          onChange: (e) => setValue(e.target.value),
        }}
      />
    );
  },
};

// Password Input
export const PasswordInput = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <FormField
        type="input"
        label="Password"
        helperText="Must be at least 8 characters"
        required
        inputProps={{
          type: 'password',
          placeholder: 'Enter password',
          value,
          onChange: (e) => setValue(e.target.value),
        }}
      />
    );
  },
};

// Text Input with Error
export const WithError = {
  render: () => {
    const [value, setValue] = useState('invalid-email');
    return (
      <FormField
        type="input"
        label="Email Address"
        errorText="Please enter a valid email address"
        required
        inputProps={{
          type: 'email',
          value,
          onChange: (e) => setValue(e.target.value),
        }}
      />
    );
  },
};

// Textarea
export const TextareaField = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <FormField
        type="textarea"
        label="Project Description"
        helperText="Describe your project goals and requirements"
        required
        textareaProps={{
          placeholder: 'Enter description...',
          rows: 4,
          maxLength: 500,
          showCharacterCount: true,
          value,
          onChange: (e) => setValue(e.target.value),
        }}
      />
    );
  },
};

// Select
export const SelectField = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <FormField
        type="select"
        label="User Mode"
        helperText="Choose your preferred documentation style"
        required
        selectProps={{
          placeholder: 'Select a mode...',
          options: [
            { label: 'Plain Mode', value: 'plain' },
            { label: 'Technical Mode', value: 'technical' },
          ],
          value,
          onChange: (e) => setValue(e.target.value),
        }}
      />
    );
  },
};

// Complex Form
export const ComplexForm = {
  render: () => {
    const [formData, setFormData] = useState({
      title: '',
      mode: '',
      description: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = () => {
      const newErrors: Record<string, string> = {};
      if (!formData.title) newErrors.title = 'Title is required';
      if (!formData.mode) newErrors.mode = 'Please select a mode';
      if (formData.description.length < 20)
        newErrors.description = 'Description must be at least 20 characters';
      setErrors(newErrors);
    };

    return (
      <div className="space-y-6 max-w-lg">
        <h2 className="text-lg font-semibold">Create New Project</h2>
        
        <FormField
          type="input"
          label="Project Title"
          helperText="Choose a descriptive name for your project"
          errorText={errors.title}
          required
          inputProps={{
            placeholder: 'My New Project',
            value: formData.title,
            onChange: (e) =>
              setFormData({ ...formData, title: e.target.value }),
          }}
        />

        <FormField
          type="select"
          label="Documentation Mode"
          helperText="This affects the style and detail level of generated documents"
          errorText={errors.mode}
          required
          selectProps={{
            placeholder: 'Select mode...',
            options: [
              { label: 'Plain Mode - Simple language', value: 'plain' },
              { label: 'Technical Mode - Detailed specs', value: 'technical' },
            ],
            value: formData.mode,
            onChange: (e) =>
              setFormData({ ...formData, mode: e.target.value }),
          }}
        />

        <FormField
          type="textarea"
          label="Initial Idea"
          helperText="Describe what you want to build (minimum 20 characters)"
          errorText={errors.description}
          required
          textareaProps={{
            placeholder: 'I want to build an application that...',
            rows: 5,
            maxLength: 2000,
            showCharacterCount: true,
            value: formData.description,
            onChange: (e) =>
              setFormData({ ...formData, description: e.target.value }),
          }}
        />

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Create Project
        </button>
      </div>
    );
  },
};

// Accessibility Demo
export const AccessibilityDemo = {
  render: () => (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        FormField automatically handles proper label associations and ARIA attributes:
      </p>
      <FormField
        type="input"
        label="Accessible Input"
        helperText="Helper text is linked via aria-describedby"
        required
        inputProps={{
          placeholder: 'Type here',
        }}
      />
      <FormField
        type="textarea"
        label="Accessible Textarea"
        errorText="Error messages are announced to screen readers"
        textareaProps={{
          value: 'Invalid input',
        }}
      />
    </div>
  ),
};

