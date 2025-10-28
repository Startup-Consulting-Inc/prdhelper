import type { Meta, StoryObj } from '@storybook/react';
import { QuestionCard } from '@/components/wizard/QuestionCard';

const meta = {
  title: 'Wizard/QuestionCard',
  component: QuestionCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof QuestionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    question: 'What is the main goal of your project?',
  },
};

export const WithProgress: Story = {
  args: {
    question: 'Who are the primary stakeholders for this project?',
    questionNumber: 2,
    totalQuestions: 8,
  },
};

export const FirstQuestion: Story = {
  args: {
    question: 'Can you describe your project idea in a few sentences?',
    questionNumber: 1,
    totalQuestions: 8,
  },
};

export const LastQuestion: Story = {
  args: {
    question: 'Are there any additional requirements or constraints we should know about?',
    questionNumber: 8,
    totalQuestions: 8,
  },
};

export const LongQuestion: Story = {
  args: {
    question:
      'Please describe the expected user journey from initial login through completing their main task. Include any decision points, error states, and success scenarios you envision. This will help us understand the complete user experience.',
    questionNumber: 5,
    totalQuestions: 8,
  },
};

export const Typing: Story = {
  args: {
    question: '',
    questionNumber: 3,
    totalQuestions: 8,
    isTyping: true,
  },
};

// Conversation flow demo
export const ConversationFlow = {
  render: () => (
    <div className="space-y-6 max-w-3xl">
      <QuestionCard
        question="Let's start by understanding your project. What problem are you trying to solve?"
        questionNumber={1}
        totalQuestions={6}
      />
      <div className="ml-14 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          User's answer would appear here...
        </p>
      </div>
      <QuestionCard
        question="Great! Who are the primary users or customers for this solution?"
        questionNumber={2}
        totalQuestions={6}
      />
    </div>
  ),
};

// Multiple questions in sequence
export const QuestionSequence = {
  render: () => (
    <div className="space-y-4 max-w-3xl">
      <QuestionCard
        question="What is the primary goal of your project?"
        questionNumber={1}
        totalQuestions={5}
      />
      <QuestionCard
        question="Who are the key stakeholders?"
        questionNumber={2}
        totalQuestions={5}
      />
      <QuestionCard
        question="What is your expected timeline?"
        questionNumber={3}
        totalQuestions={5}
      />
      <QuestionCard
        question="What is your budget range?"
        questionNumber={4}
        totalQuestions={5}
      />
      <QuestionCard
        question="Are there any technical constraints?"
        questionNumber={5}
        totalQuestions={5}
      />
    </div>
  ),
};

// Typing animation demo
export const TypingAnimation = {
  render: () => (
    <div className="space-y-6 max-w-3xl">
      <QuestionCard
        question="What features are most critical for the MVP?"
        questionNumber={3}
        totalQuestions={8}
      />
      <div className="ml-14 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          User authentication, product catalog, and checkout flow.
        </p>
      </div>
      <QuestionCard
        question=""
        questionNumber={4}
        totalQuestions={8}
        isTyping={true}
      />
    </div>
  ),
};

// Without progress (standalone question)
export const StandaloneQuestion: Story = {
  args: {
    question: 'Before we begin, do you have any specific requirements or constraints?',
  },
};

// Accessibility demo
export const AccessibilityDemo: Story = {
  args: {
    question: 'How many team members will be working on this project?',
    questionNumber: 4,
    totalQuestions: 8,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The question card includes semantic HTML, proper contrast, and screen reader friendly progress indicators.',
      },
    },
  },
};

