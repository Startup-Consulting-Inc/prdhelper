import type { Meta, StoryObj } from '@storybook/react';
import { DocumentPreview } from '@/components/common/DocumentPreview';

const sampleBRD = `# Business Requirements Document (BRD)

## Project Overview
**Project Name:** E-Commerce Platform Redesign  
**Date:** January 2025  
**Version:** 1.0

### Executive Summary
This document outlines the business requirements for redesigning our e-commerce platform to improve user experience, increase conversion rates, and support mobile-first shopping.

## Business Objectives
1. **Increase Conversion Rate** by 25% within 6 months
2. **Improve Mobile Experience** - 60% of traffic is mobile
3. **Reduce Cart Abandonment** from 68% to 45%
4. **Enhance Search Functionality** with AI-powered recommendations

## Stakeholders
| Name | Role | Contact |
|------|------|---------|
| Jane Smith | Product Owner | jane@example.com |
| John Doe | Engineering Lead | john@example.com |
| Sarah Johnson | UX Designer | sarah@example.com |

## Key Features

### 1. Smart Search
- AI-powered product recommendations
- Voice search capability
- Visual search using images
- Auto-complete with trending products

### 2. Personalized Dashboard
Users should see:
- Recent orders
- Recommended products based on browsing history
- Saved items and wishlists
- Personalized deals and promotions

### 3. Streamlined Checkout
> **Goal:** Reduce checkout steps from 5 to 3

Features:
- Guest checkout option
- One-click payment with saved methods
- Real-time shipping calculations
- Multiple payment gateways (PayPal, Stripe, Apple Pay)

## Technical Requirements
\`\`\`typescript
interface Product {
  id: string;
  name: string;
  price: number;
  inventory: number;
  images: string[];
}
\`\`\`

## Success Metrics
- [ ] Conversion rate increase to 4.5%
- [ ] Mobile page load time < 2 seconds
- [ ] Cart abandonment rate < 45%
- [ ] User satisfaction score > 4.5/5

## Timeline
- **Phase 1:** Design & Prototyping (4 weeks)
- **Phase 2:** Development (12 weeks)
- **Phase 3:** Testing & QA (4 weeks)
- **Phase 4:** Launch & Monitoring (2 weeks)

## Budget
Estimated budget: **$250,000**

---
*Document prepared by the Product Team*
`;

const samplePRD = `# Product Requirements Document (PRD)

## Product: AI Chat Assistant

### Overview
An intelligent chat assistant that helps users generate requirements documents through natural conversation.

### User Stories

#### As a Product Manager
- I want to describe my project idea in plain language
- I want the AI to ask clarifying questions
- I want to receive a structured BRD/PRD automatically

#### As a Developer
- I want to generate technical task lists from requirements
- I want to export documents in multiple formats (MD, PDF, DOCX)
- I want to track document versions and changes

### Functional Requirements

1. **Conversation Interface**
   - Real-time chat with AI assistant
   - Support for plain language and technical mode
   - Context-aware follow-up questions
   - Ability to edit and refine responses

2. **Document Generation**
   - BRD generation from business ideas
   - PRD creation with technical specifications
   - Task list extraction with priority levels
   - Automatic formatting and structure

3. **Document Management**
   - Version history tracking
   - Export to multiple formats
   - Sharing and collaboration features
   - Template customization

### Non-Functional Requirements

#### Performance
- Response time < 3 seconds for AI queries
- Support for 100+ concurrent users
- Document generation < 30 seconds

#### Security
- End-to-end encryption for conversations
- SOC 2 compliance
- Regular security audits
- Data retention policies

### API Integration
\`\`\`bash
# Example API call
curl -X POST https://api.prdhelper.com/v1/generate \\
  -H "Authorization: Bearer TOKEN" \\
  -d '{"type": "BRD", "content": "..."}'
\`\`\`

### Design Considerations
- **Mobile-first** responsive design
- **Dark mode** support
- **Accessibility** (WCAG 2.1 AA)
- **Internationalization** (i18n) ready

### Open Questions
1. How do we handle multi-language support?
2. Should we allow custom AI models?
3. What's the pricing model for enterprise users?

---
*Last updated: January 2025*
`;

const sampleTaskList = `# Technical Task List

## Sprint 1: Foundation Setup

### Backend Tasks
- [ ] Set up project repository and CI/CD pipeline
- [ ] Configure database schema (PostgreSQL)
- [ ] Implement authentication system (NextAuth.js)
- [ ] Create API routes for user management
- [ ] Set up error logging and monitoring

### Frontend Tasks
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS and design system
- [ ] Create reusable UI components
- [ ] Implement authentication flows
- [ ] Set up state management (Context API)

### DevOps Tasks
- [ ] Provision AWS infrastructure
- [ ] Set up staging and production environments
- [ ] Configure CDN and asset optimization
- [ ] Implement automated testing pipeline
- [ ] Create deployment documentation

## Sprint 2: Core Features

### AI Integration
- [ ] Integrate OpenRouter API
- [ ] Implement prompt engineering system
- [ ] Create conversation context management
- [ ] Add streaming response support
- [ ] Implement rate limiting and cost tracking

### Document Generation
- [ ] Build markdown parsing engine
- [ ] Create document templates
- [ ] Implement version control system
- [ ] Add export functionality (PDF, DOCX)
- [ ] Create preview components

## Priority Legend
- 🔴 **High Priority** - Blocking or critical features
- 🟡 **Medium Priority** - Important but not blocking
- 🟢 **Low Priority** - Nice to have features

## Notes
> **Reminder:** All tasks should include unit tests and documentation.
> 
> **Dependencies:** Some backend tasks must be completed before frontend can proceed.

---
*Generated by PRD Helper AI*
`;

const shortMarkdown = `# Welcome to PRD Helper

This is a simple document preview showing how **markdown** content is rendered.

## Features
- Clean, readable typography
- Syntax highlighting for code
- Support for tables, lists, and more

\`\`\`javascript
console.log('Hello, World!');
\`\`\`
`;

const meta = {
  title: 'Common/DocumentPreview',
  component: DocumentPreview,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DocumentPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: shortMarkdown,
    title: 'Document Preview',
  },
};

export const WithoutTitle: Story = {
  args: {
    content: shortMarkdown,
    showActions: true,
  },
};

export const WithoutActions: Story = {
  args: {
    content: shortMarkdown,
    title: 'Read-Only Document',
    showActions: false,
  },
};

export const BRDExample: Story = {
  args: {
    content: sampleBRD,
    title: 'Business Requirements Document',
    showActions: true,
    onDownload: () => console.log('Download BRD'),
  },
};

export const PRDExample: Story = {
  args: {
    content: samplePRD,
    title: 'Product Requirements Document',
    showActions: true,
    onDownload: () => console.log('Download PRD'),
  },
};

export const TaskListExample: Story = {
  args: {
    content: sampleTaskList,
    title: 'Technical Task List',
    showActions: true,
    onDownload: () => console.log('Download Task List'),
  },
};

// Use Cases
export const ProjectDocumentView = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Project Documentation</h2>
      <DocumentPreview
        content={sampleBRD}
        title="Business Requirements Document"
        onDownload={() => console.log('Download BRD')}
      />
    </div>
  ),
};

export const DocumentComparison = {
  render: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <DocumentPreview
        content={sampleBRD}
        title="Original BRD"
        showActions={false}
      />
      <DocumentPreview
        content={sampleBRD}
        title="Updated BRD (v2)"
        showActions={false}
      />
    </div>
  ),
};

export const MinimalPreview = {
  render: () => (
    <div className="max-w-2xl mx-auto">
      <DocumentPreview
        content="# Quick Note\n\nThis is a minimal document preview without title or actions."
        showActions={false}
      />
    </div>
  ),
};

export const InteractiveDemo = {
  render: () => {
    const handleDownload = () => {
      const blob = new Blob([sampleBRD], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'BRD_Document.md';
      a.click();
      URL.revokeObjectURL(url);
    };

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 Try clicking the <strong>Copy</strong> or <strong>Download</strong> buttons to interact with the document.
          </p>
        </div>
        <DocumentPreview
          content={samplePRD}
          title="Interactive Product Requirements Document"
          showActions={true}
          onDownload={handleDownload}
        />
      </div>
    );
  },
};

// Accessibility
export const AccessibilityDemo: Story = {
  args: {
    content: `# Accessible Document Preview

This component is designed with accessibility in mind:

- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- ARIA labels on interactive elements
- High contrast text
- Readable typography

## Try It Out
Use keyboard navigation to interact with the buttons above.
`,
    title: 'Accessibility Features',
  },
  parameters: {
    docs: {
      description: {
        story: 'DocumentPreview uses semantic markup and provides accessible controls.',
      },
    },
  },
};

