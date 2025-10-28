import type { Meta, StoryObj } from '@storybook/react';
import { WizardNavigation } from '@/components/wizard/WizardNavigation';
import { useState } from 'react';

const meta = {
  title: 'Wizard/WizardNavigation',
  component: WizardNavigation,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WizardNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstStep: Story = {
  args: {
    currentStep: 1,
    totalSteps: 5,
    onNext: () => console.log('Next clicked'),
    canGoNext: true,
  },
};

export const MiddleStep: Story = {
  args: {
    currentStep: 3,
    totalSteps: 5,
    onBack: () => console.log('Back clicked'),
    onNext: () => console.log('Next clicked'),
    canGoBack: true,
    canGoNext: true,
  },
};

export const LastStep: Story = {
  args: {
    currentStep: 5,
    totalSteps: 5,
    onBack: () => console.log('Back clicked'),
    onFinish: () => console.log('Finish clicked'),
    canGoBack: true,
    canGoNext: true,
  },
};

export const NextDisabled: Story = {
  args: {
    currentStep: 2,
    totalSteps: 5,
    onBack: () => console.log('Back clicked'),
    onNext: () => console.log('Next clicked'),
    canGoNext: false,
  },
};

export const Loading: Story = {
  args: {
    currentStep: 3,
    totalSteps: 5,
    onBack: () => console.log('Back clicked'),
    onNext: () => console.log('Next clicked'),
    isLoading: true,
  },
};

export const CustomLabels: Story = {
  args: {
    currentStep: 4,
    totalSteps: 5,
    onBack: () => console.log('Back clicked'),
    onNext: () => console.log('Next clicked'),
    nextLabel: 'Continue',
    backLabel: 'Previous',
  },
};

export const CustomFinishLabel: Story = {
  args: {
    currentStep: 5,
    totalSteps: 5,
    onBack: () => console.log('Back clicked'),
    onFinish: () => console.log('Finish clicked'),
    finishLabel: 'Generate Documents',
  },
};

// Interactive wizard flow
export const InteractiveWizard = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const totalSteps = 6;

    const handleNext = () => {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
        setIsLoading(false);
      }, 1000);
    };

    const handleBack = () => {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleFinish = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        alert('Wizard completed!');
        setCurrentStep(1);
      }, 1500);
    };

    return (
      <div className="max-w-2xl space-y-6">
        <div className="p-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-2">Step {currentStep} Content</h2>
          <p className="text-gray-600 dark:text-gray-400">
            This is the content for step {currentStep}. Click navigation buttons to move through the
            wizard.
          </p>
        </div>

        <WizardNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onBack={handleBack}
          onNext={handleNext}
          onFinish={handleFinish}
          isLoading={isLoading}
        />
      </div>
    );
  },
};

// With validation
export const WithValidation = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isValid, setIsValid] = useState(false);
    const totalSteps = 4;

    return (
      <div className="max-w-2xl space-y-6">
        <div className="p-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Step {currentStep}: Answer Required</h2>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isValid}
              onChange={(e) => setIsValid(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I have provided a valid answer
            </span>
          </label>
        </div>

        <WizardNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onBack={() => {
            setCurrentStep((prev) => prev - 1);
            setIsValid(false);
          }}
          onNext={() => {
            setCurrentStep((prev) => prev + 1);
            setIsValid(false);
          }}
          onFinish={() => alert('Finished!')}
          canGoNext={isValid}
        />

        {!isValid && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            ⚠️ Check the box above to enable the Next button
          </p>
        )}
      </div>
    );
  },
};

// Multi-step progress visualization
export const ProgressVisualization = {
  render: () => (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h3 className="text-sm font-semibold mb-4">Beginning (0%)</h3>
        <WizardNavigation currentStep={1} totalSteps={8} onNext={() => {}} />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4">25% Complete</h3>
        <WizardNavigation
          currentStep={2}
          totalSteps={8}
          onBack={() => {}}
          onNext={() => {}}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4">50% Complete</h3>
        <WizardNavigation
          currentStep={4}
          totalSteps={8}
          onBack={() => {}}
          onNext={() => {}}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4">75% Complete</h3>
        <WizardNavigation
          currentStep={6}
          totalSteps={8}
          onBack={() => {}}
          onNext={() => {}}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4">Final Step (100%)</h3>
        <WizardNavigation
          currentStep={8}
          totalSteps={8}
          onBack={() => {}}
          onFinish={() => {}}
        />
      </div>
    </div>
  ),
};

// Accessibility demo
export const AccessibilityDemo: Story = {
  args: {
    currentStep: 3,
    totalSteps: 5,
    onBack: () => console.log('Back clicked'),
    onNext: () => console.log('Next clicked'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'The wizard navigation includes keyboard navigation, clear progress indicators, and proper button states for accessibility.',
      },
    },
  },
};

