import type { Meta, StoryObj } from '@storybook/react';
import { WizardActions } from '@/components/wizard/WizardActions';

const meta = {
  title: 'Wizard/WizardActions',
  component: WizardActions,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WizardActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllActions: Story = {
  args: {
    onSave: () => console.log('Save clicked'),
    onCancel: () => console.log('Cancel clicked'),
    onReset: () => console.log('Reset clicked'),
  },
};

export const SaveAndCancel: Story = {
  args: {
    onSave: () => console.log('Save clicked'),
    onCancel: () => console.log('Cancel clicked'),
  },
};

export const SaveOnly: Story = {
  args: {
    onSave: () => console.log('Save clicked'),
  },
};

export const Saving: Story = {
  args: {
    onSave: () => console.log('Save clicked'),
    onCancel: () => console.log('Cancel clicked'),
    onReset: () => console.log('Reset clicked'),
    isSaving: true,
  },
};

export const SaveDisabled: Story = {
  args: {
    onSave: () => console.log('Save clicked'),
    onCancel: () => console.log('Cancel clicked'),
    canSave: false,
  },
};

export const CustomLabels: Story = {
  args: {
    onSave: () => console.log('Submit clicked'),
    onCancel: () => console.log('Discard clicked'),
    onReset: () => console.log('Clear clicked'),
    saveLabel: 'Submit Form',
    cancelLabel: 'Discard Changes',
    resetLabel: 'Clear All',
  },
};

export const SpacedLayout: Story = {
  args: {
    onSave: () => console.log('Save clicked'),
    onCancel: () => console.log('Cancel clicked'),
    onReset: () => console.log('Reset clicked'),
    layout: 'spaced',
  },
};

export const SpacedWithoutReset: Story = {
  args: {
    onSave: () => console.log('Save clicked'),
    onCancel: () => console.log('Cancel clicked'),
    layout: 'spaced',
  },
};

// Interactive demo
export const Interactive = {
  render: () => {
    const handleSave = () => {
      alert('Progress saved!');
    };

    const handleCancel = () => {
      if (confirm('Are you sure you want to cancel? Unsaved progress will be lost.')) {
        alert('Cancelled');
      }
    };

    const handleReset = () => {
      if (confirm('Are you sure you want to reset all answers?')) {
        alert('Reset complete');
      }
    };

    return (
      <div className="max-w-3xl">
        <div className="mb-6 p-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Wizard Content</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your wizard form content would go here. Try the action buttons below.
          </p>
        </div>
        <WizardActions
          onSave={handleSave}
          onCancel={handleCancel}
          onReset={handleReset}
        />
      </div>
    );
  },
};

// In wizard page context
export const InWizardPage = {
  render: () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Project Requirements Wizard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Step 3 of 5: Stakeholder Information
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Primary Stakeholders
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900"
                  rows={4}
                  placeholder="List the key stakeholders..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Decision Makers
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900"
                  rows={4}
                  placeholder="Who has final approval?"
                />
              </div>
            </div>
          </div>

          {/* Footer with actions */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <WizardActions
              onSave={() => alert('Progress saved')}
              onCancel={() => alert('Cancelled')}
              onReset={() => alert('Reset')}
              layout="spaced"
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

// With validation message
export const WithValidation = {
  render: () => (
    <div className="max-w-3xl space-y-4">
      <div className="p-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Form Content</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Project name"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900"
          />
          <textarea
            placeholder="Project description (minimum 50 characters)"
            rows={4}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ Please complete all required fields before saving
        </p>
      </div>

      <WizardActions
        onSave={() => console.log('Save')}
        onCancel={() => console.log('Cancel')}
        canSave={false}
      />
    </div>
  ),
};

// Loading state demo
export const SavingDemo = {
  render: () => (
    <div className="max-w-3xl space-y-4">
      <div className="p-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Saving progress...</h3>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-primary-600 rounded-full" />
          <p className="text-sm">Please wait while we save your changes</p>
        </div>
      </div>

      <WizardActions
        onSave={() => console.log('Save')}
        onCancel={() => console.log('Cancel')}
        onReset={() => console.log('Reset')}
        isSaving={true}
      />
    </div>
  ),
};

// Accessibility demo
export const AccessibilityDemo: Story = {
  args: {
    onSave: () => console.log('Save clicked'),
    onCancel: () => console.log('Cancel clicked'),
    onReset: () => console.log('Reset clicked'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Wizard actions include keyboard navigation, clear visual feedback, and proper disabled states for accessibility.',
      },
    },
  },
};

