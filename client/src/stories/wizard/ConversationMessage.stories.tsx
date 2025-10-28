import type { Meta, StoryObj } from '@storybook/react';
import { ConversationMessage } from '@/components/wizard/ConversationMessage';

const meta = {
  title: 'Wizard/ConversationMessage',
  component: ConversationMessage,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ConversationMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

const now = new Date();
const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

export const AIMessage: Story = {
  args: {
    role: 'ai',
    content: 'What is the main goal of your project?',
    timestamp: fiveMinutesAgo,
  },
};

export const UserMessage: Story = {
  args: {
    role: 'user',
    content: 'We want to build a mobile-first e-commerce platform that allows users to browse products, add items to their cart, and complete purchases seamlessly.',
    timestamp: now,
  },
};

export const LongAIMessage: Story = {
  args: {
    role: 'ai',
    content:
      'Great! Now let\'s dive deeper into the requirements. Can you describe the expected user journey from when they first land on the platform through completing a purchase? Please include any specific features you have in mind, such as product search, filters, wish lists, or guest checkout options.',
    timestamp: tenMinutesAgo,
  },
};

export const LongUserMessage: Story = {
  args: {
    role: 'user',
    content:
      'The user journey should start with a visually appealing homepage showcasing featured products and categories. Users should be able to search for products using keywords and apply filters like price range, brand, and ratings. They can add items to their cart and either continue shopping or proceed to checkout. We want to support both guest checkout and registered users. For registered users, we should store their shipping addresses and payment methods for faster checkout. The checkout process should be simple with clear steps: review cart, enter shipping info, select payment method, and confirm order.',
    timestamp: now,
  },
};

export const WithoutTimestamp: Story = {
  args: {
    role: 'ai',
    content: 'Who are the primary stakeholders for this project?',
  },
};

// Conversation thread
export const ConversationThread = {
  render: () => (
    <div className="space-y-6 max-w-3xl">
      <ConversationMessage
        role="ai"
        content="Let's start by understanding your project. What problem are you trying to solve?"
        timestamp={new Date(Date.now() - 15 * 60 * 1000)}
      />
      <ConversationMessage
        role="user"
        content="We need to modernize our legacy inventory management system. The current system is slow, lacks real-time updates, and has a poor user interface."
        timestamp={new Date(Date.now() - 14 * 60 * 1000)}
      />
      <ConversationMessage
        role="ai"
        content="I understand. Who are the primary users of this inventory management system?"
        timestamp={new Date(Date.now() - 13 * 60 * 1000)}
      />
      <ConversationMessage
        role="user"
        content="Our warehouse staff, inventory managers, and finance team. About 50 users total across different departments."
        timestamp={new Date(Date.now() - 12 * 60 * 1000)}
      />
      <ConversationMessage
        role="ai"
        content="Perfect! What are the most critical features that the new system must have?"
        timestamp={new Date(Date.now() - 11 * 60 * 1000)}
      />
    </div>
  ),
};

// Real-time conversation simulation
export const RealTimeChat = {
  render: () => (
    <div className="space-y-6 max-w-3xl">
      <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg mb-6">
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          <strong>💬 Conversation Flow Demo:</strong> This shows how messages appear in a
          real-time conversation between the AI and user.
        </p>
      </div>

      <ConversationMessage
        role="ai"
        content="Welcome! I'll help you create comprehensive requirements documents. Let's start with the basics. What type of project are you planning?"
        timestamp={new Date(Date.now() - 5 * 60 * 1000)}
      />
      <ConversationMessage
        role="user"
        content="A SaaS platform for team collaboration"
        timestamp={new Date(Date.now() - 4 * 60 * 1000)}
      />
      <ConversationMessage
        role="ai"
        content="Excellent! Team collaboration platforms are quite popular. Could you tell me more about what makes your platform unique? What specific pain points are you addressing?"
        timestamp={new Date(Date.now() - 3 * 60 * 1000)}
      />
      <ConversationMessage
        role="user"
        content="We're focusing on remote teams in creative industries. Our platform will integrate project management, file sharing, and real-time collaboration tools in one place. The key differentiator is our AI-powered workflow automation."
        timestamp={new Date(Date.now() - 2 * 60 * 1000)}
      />
      <ConversationMessage
        role="ai"
        content="That sounds innovative! AI-powered workflow automation is a great feature. Let's talk about your target audience. Who are the primary users, and what are their typical workflows?"
        timestamp={now}
      />
    </div>
  ),
};

// Mixed message lengths
export const MixedLengths = {
  render: () => (
    <div className="space-y-6 max-w-3xl">
      <ConversationMessage role="ai" content="What's your project name?" timestamp={now} />
      <ConversationMessage role="user" content="TaskFlow Pro" timestamp={now} />
      <ConversationMessage
        role="ai"
        content="Great name! Now, can you describe in detail what TaskFlow Pro will do and who will use it?"
        timestamp={now}
      />
      <ConversationMessage
        role="user"
        content="TaskFlow Pro is a comprehensive project management tool designed for software development teams. It combines issue tracking, sprint planning, time tracking, and team communication in a single platform. Our target users are agile teams of 5-50 people who need better visibility into their development process."
        timestamp={now}
      />
    </div>
  ),
};

// Accessibility demo
export const AccessibilityDemo: Story = {
  args: {
    role: 'ai',
    content: 'This message includes proper semantic HTML and ARIA labels for screen readers.',
    timestamp: now,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Messages include semantic HTML, proper contrast, and screen reader friendly timestamps and role indicators.',
      },
    },
  },
};

