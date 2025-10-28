import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useState } from 'react';

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Dialog Title"
        >
          <p>This is the dialog content. You can put any content here.</p>
        </Dialog>
      </>
    );
  },
};

export const WithDescription = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Confirm Action"
          description="This action cannot be undone. Please review carefully before proceeding."
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to continue?
          </p>
        </Dialog>
      </>
    );
  },
};

export const WithFooter = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Confirm Deletion"
          description="This action cannot be undone."
          footer={
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </>
          }
        >
          <p className="text-sm">
            Are you sure you want to delete this project? All associated documents will be permanently removed.
          </p>
        </Dialog>
      </>
    );
  },
};

export const WithForm = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
      // Handle form submission
      console.log({ title, description });
      setOpen(false);
    };

    return (
      <>
        <Button onClick={() => setOpen(true)}>Create Project</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Create New Project"
          description="Enter the details for your new project."
          footer={
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Create
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Project Title"
              placeholder="Enter project title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              label="Project Description"
              placeholder="Describe your project..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </Dialog>
      </>
    );
  },
};

export const LongContent = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Terms and Conditions"
          description="Please read our terms and conditions carefully."
          footer={
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Decline
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Accept
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </Dialog>
      </>
    );
  },
};

// Use cases
export const UseCases = {
  render: () => {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [approveOpen, setApproveOpen] = useState(false);
    const [regenerateOpen, setRegenerateOpen] = useState(false);

    return (
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setDeleteOpen(true)}>
          Delete Project
        </Button>
        <Button variant="primary" onClick={() => setApproveOpen(true)}>
          Approve Document
        </Button>
        <Button variant="secondary" onClick={() => setRegenerateOpen(true)}>
          Regenerate
        </Button>

        {/* Delete Confirmation */}
        <Dialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete Project"
          description="This action cannot be undone."
          footer={
            <>
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setDeleteOpen(false)}>
                Delete
              </Button>
            </>
          }
        >
          <p className="text-sm">
            Are you sure you want to delete this project? All documents and data will be permanently removed.
          </p>
        </Dialog>

        {/* Approval Dialog */}
        <Dialog
          open={approveOpen}
          onOpenChange={setApproveOpen}
          title="Approve BRD"
          description="Approving this document will unlock the next phase."
          footer={
            <>
              <Button variant="outline" onClick={() => setApproveOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setApproveOpen(false)}>
                Approve & Continue
              </Button>
            </>
          }
        >
          <div className="space-y-3">
            <p className="text-sm">
              By approving this Business Requirements Document, you confirm that:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>All requirements are accurate and complete</li>
              <li>You are ready to proceed to the PRD phase</li>
              <li>The document meets your expectations</li>
            </ul>
          </div>
        </Dialog>

        {/* Regenerate Dialog */}
        <Dialog
          open={regenerateOpen}
          onOpenChange={setRegenerateOpen}
          title="Regenerate Document"
          description="Provide additional context to improve the document."
          footer={
            <>
              <Button variant="outline" onClick={() => setRegenerateOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setRegenerateOpen(false)}>
                Regenerate
              </Button>
            </>
          }
        >
          <Textarea
            label="Additional Context"
            placeholder="Describe what you'd like to change or add..."
            rows={4}
            helperText="This will help the AI refine the document to better match your needs"
          />
        </Dialog>
      </div>
    );
  },
};

// Accessibility
export const AccessibilityDemo = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Accessible Dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Accessible Dialog"
          description="This dialog includes proper focus management and keyboard navigation."
          footer={
            <Button variant="primary" onClick={() => setOpen(false)}>
              Close
            </Button>
          }
        >
          <ul className="list-disc list-inside text-sm space-y-2">
            <li>Focus is trapped within the dialog</li>
            <li>Press ESC to close</li>
            <li>Tab cycles through interactive elements</li>
            <li>Proper ARIA attributes for screen readers</li>
          </ul>
        </Dialog>
      </>
    );
  },
};

