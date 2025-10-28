import type { Meta, StoryObj } from '@storybook/react';
import { CreateProjectDialog } from '@/components/project/CreateProjectDialog';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const meta = {
  title: 'Project/CreateProjectDialog',
  component: CreateProjectDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CreateProjectDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: (open) => console.log('Dialog open state:', open),
    onSubmit: async (data) => {
      console.log('Project data:', data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    },
  },
};

export const Loading: Story = {
  args: {
    open: true,
    onOpenChange: (open) => console.log('Dialog open state:', open),
    onSubmit: async (data) => {
      console.log('Project data:', data);
    },
    isLoading: true,
  },
};

// Interactive story with button to open
export const Interactive = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: {
      title: string;
      description: string;
      mode: 'plain' | 'technical';
    }) => {
      console.log('Creating project:', data);
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false);
      setOpen(false);
      alert(`Project "${data.title}" created successfully in ${data.mode} mode!`);
    };

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Create New Project</Button>
        <CreateProjectDialog
          open={open}
          onOpenChange={setOpen}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    );
  },
};

// With pre-filled data (for testing/demo)
export const PrefilledExample = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <CreateProjectDialog
          open={open}
          onOpenChange={setOpen}
          onSubmit={async (data) => {
            console.log('Project data:', data);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setOpen(false);
          }}
        />
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>💡 Try this:</strong>
            <br />
            Title: "E-Commerce Platform Redesign"
            <br />
            Description: "We need to modernize our e-commerce platform with a mobile-first
            approach, improved checkout flow, and better product discovery features."
          </p>
        </div>
      </div>
    );
  },
};

// Validation demo
export const ValidationDemo = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <CreateProjectDialog
          open={open}
          onOpenChange={setOpen}
          onSubmit={async (data) => {
            console.log('Project data:', data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setOpen(false);
            alert('Project created!');
          }}
        />
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            <strong>⚠️ Validation Rules:</strong>
            <br />
            • Title: 1-200 characters
            <br />
            • Description: 20-2000 characters
            <br />• Mode: Must select Plain or Technical
          </p>
        </div>
      </div>
    );
  },
};

// Plain mode selection
export const PlainModeFlow = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Create Business Project</Button>
        <CreateProjectDialog
          open={open}
          onOpenChange={setOpen}
          onSubmit={async (data) => {
            console.log('Plain mode project:', data);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setOpen(false);
            alert(`Plain mode project created! You'll generate BRD and PRD documents.`);
          }}
        />
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg max-w-md">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Plain Mode is ideal for:</strong>
            <br />
            • Business requirements gathering
            <br />
            • Product planning
            <br />
            • Stakeholder alignment
            <br />• Non-technical documentation
          </p>
        </div>
      </div>
    );
  },
};

// Technical mode selection
export const TechnicalModeFlow = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Create Technical Project</Button>
        <CreateProjectDialog
          open={open}
          onOpenChange={setOpen}
          onSubmit={async (data) => {
            console.log('Technical mode project:', data);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setOpen(false);
            alert(
              `Technical mode project created! You'll get BRD, PRD, and detailed task lists.`
            );
          }}
        />
        <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg max-w-md">
          <p className="text-sm text-purple-700 dark:text-purple-300">
            <strong>Technical Mode includes:</strong>
            <br />
            • Business Requirements (BRD)
            <br />
            • Product Requirements (PRD)
            <br />
            • Technical Task Lists
            <br />• Development kickoff prompts
          </p>
        </div>
      </div>
    );
  },
};

// Character count demo
export const CharacterCountDemo = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <CreateProjectDialog
          open={open}
          onOpenChange={setOpen}
          onSubmit={async (data) => {
            console.log('Project data:', data);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setOpen(false);
          }}
        />
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>💬 Description Tips:</strong>
            <br />
            • Minimum 20 characters required
            <br />
            • Maximum 2000 characters
            <br />
            • Character counter shows live count
            <br />• Be as detailed as possible for better AI results
          </p>
        </div>
      </div>
    );
  },
};

// Accessibility demo
export const AccessibilityDemo = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Accessible Dialog</Button>
        <CreateProjectDialog
          open={open}
          onOpenChange={setOpen}
          onSubmit={async (data) => {
            console.log('Project data:', data);
          }}
        />
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300">
            <strong>♿ Accessibility Features:</strong>
            <br />
            • Keyboard navigation (Tab, Enter, Esc)
            <br />
            • Focus management
            <br />
            • Screen reader announcements
            <br />
            • ARIA labels and descriptions
            <br />• Proper form validation messages
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'The dialog is fully accessible with keyboard navigation, focus trapping, and screen reader support.',
      },
    },
  },
};

