import type { Meta, StoryObj } from '@storybook/react';
import { DocumentComments } from '@/components/document/DocumentComments';
import { useState } from 'react';

const meta = {
  title: 'Document/DocumentComments',
  component: DocumentComments,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DocumentComments>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockComments = [
  {
    id: '1',
    author: 'John Smith',
    content: 'Great document! The business requirements are very clear.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: '2',
    author: 'Sarah Johnson',
    content: 'I think we should add more details about the user authentication flow in section 3.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '3',
    author: 'Mike Wilson',
    content: 'Agreed with Sarah. Also, can we clarify the timeline for Phase 2?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

export const WithComments: Story = {
  args: {
    comments: mockComments,
    onAddComment: async (content) => {
      console.log('New comment:', content);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

export const Empty: Story = {
  args: {
    comments: [],
    onAddComment: async (content) => {
      console.log('New comment:', content);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

export const Interactive = {
  render: () => {
    const [comments, setComments] = useState(mockComments);

    const handleAddComment = async (content: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newComment = {
        id: String(comments.length + 1),
        author: 'You',
        content,
        timestamp: new Date(),
      };
      setComments([...comments, newComment]);
    };

    return (
      <div className="max-w-3xl">
        <DocumentComments comments={comments} onAddComment={handleAddComment} />
      </div>
    );
  },
};

export const InDocumentContext = {
  render: () => {
    const [comments, setComments] = useState(mockComments);

    const handleAddComment = async (content: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setComments([
        ...comments,
        {
          id: String(comments.length + 1),
          author: 'You',
          content,
          timestamp: new Date(),
        },
      ]);
    };

    return (
      <div className="max-w-5xl space-y-6">
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold mb-4">Business Requirements Document</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Document content would be displayed here...
          </p>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Comments</h3>
          <DocumentComments comments={comments} onAddComment={handleAddComment} />
        </div>
      </div>
    );
  },
};

export const AccessibilityDemo: Story = {
  args: {
    comments: mockComments,
    onAddComment: async (content) => console.log('New comment:', content),
  },
  parameters: {
    docs: {
      description: {
        story: 'Comments include proper semantic HTML, timestamps, and keyboard accessible forms.',
      },
    },
  },
};

