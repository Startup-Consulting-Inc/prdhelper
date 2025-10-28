import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from '@/components/ui/Alert';
import { useState } from 'react';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'info',
    children: 'This is an informational alert message.',
  },
};

// All variants
export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    children: 'Your project has been saved successfully.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success',
    children: 'Your document has been approved and is ready for the next phase.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    children: 'This action cannot be undone. Please review carefully before proceeding.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    children: 'Failed to generate document. Please try again or contact support.',
  },
};

export const AllVariants = {
  render: () => (
    <div className="space-y-4">
      <Alert variant="info" title="Info">
        This is an informational message.
      </Alert>
      <Alert variant="success" title="Success">
        Operation completed successfully!
      </Alert>
      <Alert variant="warning" title="Warning">
        Please review before continuing.
      </Alert>
      <Alert variant="error" title="Error">
        Something went wrong.
      </Alert>
    </div>
  ),
};

// Without title
export const WithoutTitle: Story = {
  args: {
    variant: 'info',
    children: 'This alert has no title, just a message.',
  },
};

// Dismissible
export const Dismissible = {
  render: () => {
    const [show, setShow] = useState(true);
    
    if (!show) {
      return (
        <button
          onClick={() => setShow(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Show Alert
        </button>
      );
    }

    return (
      <Alert
        variant="info"
        title="Dismissible Alert"
        onClose={() => setShow(false)}
      >
        Click the X button to dismiss this alert.
      </Alert>
    );
  },
};

// Long content
export const LongContent: Story = {
  args: {
    variant: 'warning',
    title: 'Important Notice',
    children: (
      <>
        <p className="mb-2">
          This is a longer alert message that spans multiple paragraphs. It demonstrates
          how the alert component handles more substantial content.
        </p>
        <p>
          Make sure to review all the information carefully before taking action. This
          decision will affect your project and cannot be easily reversed.
        </p>
      </>
    ),
  },
};

// Use cases
export const UseCases = {
  render: () => (
    <div className="space-y-4">
      <Alert variant="info" title="Document Generation in Progress">
        Your BRD is being generated. This may take a few moments...
      </Alert>
      
      <Alert variant="success" title="BRD Approved">
        You can now proceed to generate your PRD.
      </Alert>
      
      <Alert variant="warning" title="Incomplete Information">
        Please answer all required questions before generating the document.
      </Alert>
      
      <Alert variant="error" title="AI Generation Failed" onClose={() => {}}>
        The AI service is temporarily unavailable. Please try again in a few minutes.
      </Alert>
    </div>
  ),
};

// Accessibility
export const AccessibilityDemo: Story = {
  args: {
    variant: 'info',
    title: 'Accessible Alert',
    children: 'This alert uses role="alert" for screen readers and includes proper ARIA attributes.',
    onClose: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Alert component includes role="alert" for immediate announcement to screen readers.',
      },
    },
  },
};

