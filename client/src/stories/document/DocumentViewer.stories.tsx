import type { Meta, StoryObj } from '@storybook/react';
import { DocumentViewer } from '@/components/document/DocumentViewer';

const meta = {
  title: 'Document/DocumentViewer',
  component: DocumentViewer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DocumentViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

const brdContent = `# Business Requirements Document

## Project Overview
**Project Name:** E-Commerce Platform Redesign
**Date:** ${new Date().toLocaleDateString()}

## Executive Summary
This document outlines the business requirements for redesigning our e-commerce platform to improve user experience and increase conversion rates.

## Business Goals
1. Increase conversion rate by 25%
2. Reduce cart abandonment by 30%
3. Improve mobile experience

## Key Stakeholders
- **Project Sponsor:** John Smith, VP of Product
- **Business Owner:** Jane Doe, Director of E-Commerce
- **Technical Lead:** Bob Johnson, CTO

## Success Metrics
- Conversion Rate: Target 3.5% (current 2.8%)
- Cart Abandonment: Target 45% (current 65%)
- Mobile Traffic: Target 60% of total traffic
`;

const prdContent = `# Product Requirements Document

## Product Overview
**Product:** Mobile-First E-Commerce Platform
**Version:** 2.0
**Last Updated:** ${new Date().toLocaleDateString()}

## Features

### 1. Product Discovery
- **Search Functionality**
  - Real-time search with autocomplete
  - Filters: price, brand, rating, availability
  - Sort options: relevance, price, rating

### 2. Shopping Cart
- Persistent cart across sessions
- Quick add from product listings
- Easy quantity updates
- Saved for later option

### 3. Checkout Process
\`\`\`javascript
// Simplified checkout flow
const checkoutSteps = [
  'Review Cart',
  'Shipping Info',
  'Payment Method',
  'Order Confirmation'
];
\`\`\`

## User Stories
1. **As a customer**, I want to easily search for products so that I can find what I need quickly
2. **As a returning customer**, I want my cart to be saved so that I can complete my purchase later
`;

const tasksContent = `# Technical Task List

## Development Tasks

### Phase 1: Frontend Development
- [ ] Set up React project with TypeScript
- [ ] Implement responsive navigation
- [ ] Create product listing component
- [ ] Build search functionality
  - [ ] Search API integration
  - [ ] Autocomplete UI
  - [ ] Filter system
- [ ] Shopping cart implementation
  - [ ] Cart state management
  - [ ] Add/remove items
  - [ ] Persistence logic

### Phase 2: Backend Development
\`\`\`python
# API Endpoint Example
@app.route('/api/products/search')
def search_products():
    query = request.args.get('q')
    filters = request.args.get('filters')
    return jsonify(product_service.search(query, filters))
\`\`\`

### Phase 3: Testing
1. Unit tests for all components
2. Integration tests for checkout flow
3. E2E tests for critical paths

**Estimated Timeline:** 8-10 weeks
**Team Size:** 4 developers, 1 QA
`;

const now = new Date();

export const BRD: Story = {
  args: {
    title: 'E-Commerce Platform BRD',
    content: brdContent,
    documentType: 'BRD',
    lastModified: now,
    onDownload: () => console.log('Download BRD'),
    onEdit: () => console.log('Edit BRD'),
  },
};

export const PRD: Story = {
  args: {
    title: 'E-Commerce Platform PRD',
    content: prdContent,
    documentType: 'PRD',
    lastModified: now,
    onDownload: () => console.log('Download PRD'),
    onEdit: () => console.log('Edit PRD'),
  },
};

export const Tasks: Story = {
  args: {
    title: 'E-Commerce Platform Tasks',
    content: tasksContent,
    documentType: 'Tasks',
    lastModified: now,
    onDownload: () => console.log('Download Tasks'),
    onEdit: () => console.log('Edit Tasks'),
  },
};

export const MarkdownView: Story = {
  args: {
    title: 'E-Commerce Platform BRD',
    content: brdContent,
    documentType: 'BRD',
    defaultViewMode: 'markdown',
    onDownload: () => console.log('Download'),
  },
};

export const WithoutActions: Story = {
  args: {
    title: 'Read-Only Document',
    content: brdContent,
    documentType: 'BRD',
    showActions: false,
  },
};

export const LongDocument: Story = {
  args: {
    title: 'Comprehensive PRD',
    content: prdContent + '\n\n' + prdContent + '\n\n' + prdContent,
    documentType: 'PRD',
    lastModified: now,
    onDownload: () => console.log('Download'),
    onEdit: () => console.log('Edit'),
  },
};

// Interactive demo
export const Interactive = {
  render: () => {
    const handleDownload = () => {
      alert('Downloading document...');
    };

    const handleEdit = () => {
      alert('Opening editor...');
    };

    return (
      <div className="max-w-5xl">
        <DocumentViewer
          title="E-Commerce Platform BRD"
          content={brdContent}
          documentType="BRD"
          lastModified={new Date()}
          onDownload={handleDownload}
          onEdit={handleEdit}
        />
      </div>
    );
  },
};

// Side-by-side comparison
export const DocumentComparison = {
  render: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DocumentViewer
        title="BRD"
        content={brdContent}
        documentType="BRD"
        showActions={false}
      />
      <DocumentViewer
        title="PRD"
        content={prdContent}
        documentType="PRD"
        showActions={false}
      />
    </div>
  ),
};

// In project page context
export const InProjectPage = {
  render: () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            E-Commerce Platform Redesign
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Technical Mode • Active
          </p>
        </div>

        <DocumentViewer
          title="Business Requirements Document"
          content={brdContent}
          documentType="BRD"
          lastModified={new Date()}
          onDownload={() => alert('Downloading BRD')}
          onEdit={() => alert('Edit BRD')}
        />
      </div>
    </div>
  ),
};

// Accessibility demo
export const AccessibilityDemo: Story = {
  args: {
    title: 'Accessible Document',
    content: brdContent,
    documentType: 'BRD',
    lastModified: now,
    onDownload: () => console.log('Download'),
    onEdit: () => console.log('Edit'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'The document viewer includes keyboard navigation, proper heading structure, and accessible code blocks.',
      },
    },
  },
};

