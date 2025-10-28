import {
  PrismaClient,
  UserRole,
  UserMode,
  PromptType,
  DocumentType,
  DocumentStatus,
  ProjectPhase,
} from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@prdhelper.com' },
    update: {},
    create: {
      email: 'admin@prdhelper.com',
      name: 'Admin User',
      password: adminPassword,
      role: UserRole.ADMIN,
      modePreference: UserMode.TECHNICAL,
      emailVerified: new Date(),
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create demo user
  const demoPassword = await hash('Demo@123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@prdhelper.com' },
    update: {},
    create: {
      email: 'demo@prdhelper.com',
      name: 'Demo User',
      password: demoPassword,
      role: UserRole.USER,
      modePreference: UserMode.PLAIN,
      emailVerified: new Date(),
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  // Create system prompts
  const systemPrompts = [
    {
      type: PromptType.BRD_PLAIN,
      prompt: `You are a business requirements expert helping non-technical stakeholders create Business Requirements Documents (BRD).

Your role:
- Ask clear, business-focused questions about project goals, users, features, and constraints
- Use simple language avoiding technical jargon
- Guide users through 3-5 questions to gather comprehensive requirements
- Extract key information to generate a professional BRD
- For EACH question, provide 2-3 concrete example answers to help guide the user

Format your questions like this:
**Question:** [Your question here]

**Example answers:**
- Example 1: [Concrete example]
- Example 2: [Concrete example]
- Example 3: [Concrete example]

When generating the BRD:
1. Start with <<BRD_START>> marker
2. Include sections: Executive Summary, Business Objectives, Target Users, Requirements, Success Metrics
3. Use business-friendly language
4. End with <<BRD_END>> marker

Ask questions about: project goals, target audience, key features, success criteria, timeline, budget constraints.`,
    },
    {
      type: PromptType.BRD_TECHNICAL,
      prompt: `You are a business requirements expert working with technical teams to create Business Requirements Documents (BRD).

Your role:
- Ask strategic questions about business objectives, technical constraints, and system requirements
- Balance business and technical perspectives
- Guide users through 3-5 questions covering goals, architecture, and constraints
- Extract information to generate a comprehensive BRD
- For EACH question, provide 2-3 concrete example answers to help guide the user

Format your questions like this:
**Question:** [Your question here]

**Example answers:**
- Example 1: [Concrete example]
- Example 2: [Concrete example]
- Example 3: [Concrete example]

When generating the BRD, follow this professional business document format:

**START with <<BRD_START>> marker**

**Document Header:**
# Business Requirements Document: [Project Title]
**Project Name:** [Project Title]
**Date:** [Current Date]
**Version:** 1.0

**Document Structure (use numbered sections):**

## 1. Introduction
Brief overview of the document purpose and project context

## 2. Stakeholder & User Analysis
### 2.1. RACI Matrix
Create a markdown table with columns: Role | Responsible (R) | Accountable (A) | Consulted (C) | Informed (I)
Include roles: Product Owner, Development Team Lead, UI/UX Designer, Marketing Lead, Content Creators

### 2.2. Target Users
User personas, demographics, needs

### 2.3. User Journey Map
High-level user flow

## 3. Business Objectives
### 3.1. Primary Objectives
Clear, measurable business goals

### 3.2. Success Metrics
KPIs with target values in a table format

### 3.3. Business Value
ROI, competitive advantages

## 4. Technical Context
### 4.1. System Architecture Overview
High-level architecture description

### 4.2. Technical Constraints
Infrastructure, compliance, integration requirements

### 4.3. Scalability Requirements
Expected load, growth projections

## 5. Functional Requirements
### 5.1. Core Features
Detailed feature descriptions with priority levels (Must Have, Should Have, Nice to Have)

### 5.2. User Stories
Format: "As a [user], I want [goal] so that [benefit]"

## 6. Non-Functional Requirements
### 6.1. Performance
Response times, throughput

### 6.2. Security
Authentication, authorization, data protection

### 6.3. Usability
Accessibility standards, UX principles

### 6.4. Reliability
Uptime targets, disaster recovery

## 7. Constraints & Assumptions
### 7.1. Budget Constraints
Cost limitations

### 7.2. Timeline
Project milestones

### 7.3. Assumptions
Key assumptions made

## 8. Risk Analysis
Create a table with columns: Risk | Impact | Probability | Mitigation Strategy

## 9. Dependencies
External systems, third-party services

## 10. Approval
Approval criteria and sign-off requirements

**END with <<BRD_END>> marker**

Ask questions about: business drivers, system architecture, technical constraints, integrations, scalability, security.`,
    },
    {
      type: PromptType.PRD_PLAIN,
      prompt: `You are a product requirements expert helping non-technical stakeholders create Product Requirements Documents (PRD).

Context: You have access to an approved BRD. Use it as foundation for detailed product requirements.

Your role:
- Ask specific questions about features, user flows, and product details
- Use the BRD to inform your questions
- Guide users through 3-5 questions to elaborate on product specifics
- Extract information to generate a comprehensive PRD
- For EACH question, provide 2-3 concrete example answers to help guide the user

Format your questions like this:
**Question:** [Your question here]

**Example answers:**
- Example 1: [Concrete example]
- Example 2: [Concrete example]
- Example 3: [Concrete example]

When generating the PRD:
1. Start with <<PRD_START>> marker
2. Include sections: Product Overview, User Stories, Feature Requirements, User Experience, Acceptance Criteria, Assumptions and Constraints
3. Reference and expand on the BRD
4. Use clear, non-technical language
5. End with <<PRD_END>> marker

Ask questions about: user personas, specific features, user journeys, UI/UX preferences, success metrics.`,
    },
    {
      type: PromptType.PRD_TECHNICAL,
      prompt: `You are a product requirements expert working with technical teams to create Product Requirements Documents (PRD).

Context: You have access to an approved BRD. Use it as foundation for detailed technical product requirements.

Your role:
- Ask detailed questions about features, architecture, APIs, and technical implementation
- Use the BRD to inform your questions and maintain alignment
- Guide users through 3-5 questions covering product and technical details
- Extract information to generate a comprehensive technical PRD
- For EACH question, provide 2-3 concrete example answers to help guide the user

Format your questions like this:
**Question:** [Your question here]

**Example answers:**
- Example 1: [Concrete example]
- Example 2: [Concrete example]
- Example 3: [Concrete example]

When generating the PRD, follow this professional technical document format:

**START with <<PRD_START>> marker**

**Document Header:**
# Product Requirements Document: [Project Title]
**Project Name:** [Project Title]
**Date:** [Current Date]
**Version:** 1.0
**Based on:** BRD v1.0

**Document Structure (use numbered sections):**

## 1. Product Overview
### 1.1. Product Vision
### 1.2. Product Goals
### 1.3. Target Audience
### 1.4. Key Success Criteria

## 2. Technical Architecture
### 2.1. System Architecture Diagram (describe in text)
### 2.2. Technology Stack
Create a table with columns: Layer | Technology | Rationale

### 2.3. Component Breakdown
Major system components and their responsibilities

### 2.4. Integration Points
External systems, APIs, third-party services

## 3. User Stories & Use Cases
### 3.1. User Personas
Detailed user profiles

### 3.2. User Stories
Format: "As a [user], I want [goal] so that [benefit]"
Include priority (P0/P1/P2) and effort estimates

### 3.3. Use Case Scenarios
Step-by-step workflows

## 4. Feature Requirements
### 4.1. Core Features
Create a table with columns: Feature | Description | Priority | Dependencies | Acceptance Criteria

### 4.2. Feature Specifications
Detailed specifications for each major feature

### 4.3. User Interface Requirements
Wireframes, UI flows, design system requirements

## 5. API Specifications
### 5.1. API Endpoints
Create a table with columns: Method | Endpoint | Description | Request | Response

### 5.2. Authentication & Authorization
Auth mechanisms, token management, permission levels

### 5.3. Error Handling
Error codes, messages, recovery strategies

## 6. Data Models
### 6.1. Database Schema
Entity descriptions and relationships

### 6.2. Data Flow Diagrams (describe in text)

### 6.3. Data Validation Rules

## 7. Security & Compliance
### 7.1. Security Requirements
Authentication, encryption, data protection

### 7.2. Privacy & Compliance
GDPR, data retention, user consent

### 7.3. Security Testing Requirements

## 8. Performance Requirements
### 8.1. Performance Metrics
Create a table with columns: Metric | Target | Measurement Method

### 8.2. Scalability Requirements
Load capacity, growth projections

### 8.3. Optimization Strategies

## 9. Testing & Quality Assurance
### 9.1. Testing Strategy
Unit, integration, E2E testing approaches

### 9.2. Acceptance Criteria
Detailed acceptance criteria for each feature

### 9.3. Quality Metrics
Code coverage, performance benchmarks

## 10. Deployment & DevOps
### 10.1. Deployment Strategy
CI/CD pipeline, environments

### 10.2. Monitoring & Logging
Observability requirements

### 10.3. Rollback Procedures

## 11. Timeline & Milestones
Create a table with columns: Phase | Deliverables | Timeline | Dependencies

## 12. Assumptions & Constraints
### 12.1. Technical Assumptions
### 12.2. Resource Constraints
### 12.3. External Dependencies

**END with <<PRD_END>> marker**

Ask questions about: architecture decisions, APIs, data models, tech stack, integrations, performance requirements.`,
    },
    {
      type: PromptType.TASKS,
      prompt: `You are a technical project manager creating a detailed task list for development teams.

Context: You have access to approved BRD and PRD documents. Use them to break down the project into actionable tasks.

Your role:
- Analyze the PRD to identify all required development tasks
- Create a structured task list with clear priorities, effort estimates, and dependencies
- Organize tasks by component/feature area
- Ensure tasks are actionable and testable

When generating the task list:
1. Start with <<TASKS_START>> marker
2. For each task include:
   - **Task ID**: Unique identifier (e.g., TASK-001)
   - **Title**: Clear, action-oriented title
   - **Description**: Detailed description of what needs to be done
   - **Acceptance Criteria**: Specific, testable criteria
   - **Priority**: HIGH/MEDIUM/LOW
   - **Effort**: Story points or time estimate
   - **Dependencies**: Other task IDs this depends on
   - **Tags**: Technology or feature area tags
3. Group tasks by feature or component
4. Include setup, development, testing, and deployment tasks
5. End with <<TASKS_END>> marker

After the task list, generate a project kickoff prompt summarizing the technical approach and priorities.`,
    },
  ];

  for (const promptData of systemPrompts) {
    const prompt = await prisma.systemPrompt.upsert({
      where: { type: promptData.type },
      update: { prompt: promptData.prompt },
      create: promptData,
    });
    console.log(`✅ Created/updated system prompt: ${prompt.type}`);
  }

  // Create a demo project for the demo user
  const demoProjectData = {
    userId: demoUser.id,
    title: 'E-Commerce Platform Redesign',
    description: `We want to redesign our existing e-commerce platform to improve user experience and increase conversions. 
      
The current platform is outdated and has a high cart abandonment rate. We need a modern, mobile-first design with better product discovery, streamlined checkout, and personalized recommendations.

Key goals:
- Reduce cart abandonment by 30%
- Increase mobile conversion rate by 50%
- Improve page load speed by 40%
- Implement AI-powered product recommendations

Target launch: Q2 2024
Budget: $200,000`,
    mode: UserMode.TECHNICAL,
    status: 'ACTIVE',
    currentPhase: ProjectPhase.TASKS_READY,
  } as const;

  const existingDemoProject = await prisma.project.findFirst({
    where: {
      userId: demoUser.id,
      title: demoProjectData.title,
    },
  });

  const demoProject = existingDemoProject
    ? await prisma.project.update({
        where: { id: existingDemoProject.id },
        data: demoProjectData,
      })
    : await prisma.project.create({
        data: demoProjectData,
      });

  if (existingDemoProject) {
    console.log('ℹ️  Updated existing demo project');
    await prisma.document.deleteMany({
      where: { projectId: demoProject.id },
    });
    console.log('ℹ️  Cleared previous demo documents');
  } else {
    console.log('✅ Created demo project:', demoProject.title);
  }

  // Seed sample documents for the demo project
  const demoDocuments = [
    {
      type: DocumentType.BRD,
      status: DocumentStatus.APPROVED,
      approvedAt: new Date(),
      rawContent: `<<BRD_START>>
# Executive Summary
Our e-commerce platform redesign focuses on delivering a modern, mobile-first shopping experience that reduces cart abandonment and boosts conversions. The initiative aligns with 2024 revenue targets and introduces AI-driven personalization across the buyer journey.

# Business Objectives
- Reduce overall cart abandonment by 30% within six months of launch
- Increase mobile conversion rate by 50%
- Improve perceived site speed with target sub-2s Largest Contentful Paint
- Launch AI-powered product recommendations that increase average order value by 15%

# Target Users
- Returning loyalty customers who expect quick reordering and curated suggestions
- Mobile-first shoppers discovering products through social media and paid ads
- New visitors evaluating our catalog across desktop and tablet devices

# Requirements
- Responsive design system optimized for mobile and tablet breakpoints
- Streamlined checkout with express payment options (Apple Pay, Google Pay, Shop Pay)
- AI recommendation engine powered by user behavior and order history
- Unified product discovery with enhanced search, filtering, and saved collections
- Accessibility compliance at WCAG 2.1 AA level

# Success Metrics
- Conversion rate uplift (+50% mobile, +20% desktop)
- Abandonment rate decrease (-30%)
- Average order value increase (+15%)
- Net Promoter Score improvement (+10 points)
- Core Web Vitals passing rates above 90%
<<BRD_END>>`,
      content: `# Business Requirements Document

## Executive Summary
Our e-commerce platform redesign focuses on delivering a modern, mobile-first shopping experience that reduces cart abandonment and boosts conversions. The initiative aligns with 2024 revenue targets and introduces AI-driven personalization across the buyer journey.

## Business Objectives
- Reduce overall cart abandonment by 30% within six months of launch
- Increase mobile conversion rate by 50%
- Improve perceived site speed with target sub-2s Largest Contentful Paint
- Launch AI-powered product recommendations that increase average order value by 15%

## Target Users
- Returning loyalty customers who expect quick reordering and curated suggestions
- Mobile-first shoppers discovering products through social media and paid ads
- New visitors evaluating our catalog across desktop and tablet devices

## Requirements
- Responsive design system optimized for mobile and tablet breakpoints
- Streamlined checkout with express payment options (Apple Pay, Google Pay, Shop Pay)
- AI recommendation engine powered by user behavior and order history
- Unified product discovery with enhanced search, filtering, and saved collections
- Accessibility compliance at WCAG 2.1 AA level

## Success Metrics
- Conversion rate uplift (+50% mobile, +20% desktop)
- Abandonment rate decrease (-30%)
- Average order value increase (+15%)
- Net Promoter Score improvement (+10 points)
- Core Web Vitals passing rates above 90%`,
    },
    {
      type: DocumentType.PRD,
      status: DocumentStatus.APPROVED,
      approvedAt: new Date(),
      rawContent: `<<PRD_START>>
# Product Overview
The redesigned platform provides a modular architecture supporting personalized homepages, frictionless checkout, and AI-driven recommendations. The solution integrates with existing inventory, CMS, and analytics services.

# Technical Architecture
- Frontend: React + Next.js hosted on Vercel with edge caching
- Backend: Node.js services exposing GraphQL APIs
- Recommendation engine: AWS Personalize with real-time event ingestion
- Data: PostgreSQL for transactional data, Redis for sessions, Snowflake for analytics

# User Stories
- As a mobile shopper, I want to complete checkout in under two minutes so I can purchase quickly.
- As a returning customer, I want relevant product recommendations on the homepage so I can discover complementary items.
- As a new visitor, I want advanced filtering options so I can narrow down the catalog efficiently.

# Feature Requirements
- Modular homepage with personalized content blocks
- Unified search across products, collections, and editorial content
- Persistent mini cart with real-time shipping estimates
- Checkout flow with express payment buttons and progress indicator
- Post-purchase cross-sell recommendations

# API Specifications
- \`/api/recommendations\` (GET) returns curated products per user session
- \`/api/cart/express-checkout\` (POST) initiates wallet-based payments
- \`/api/search\` (POST) supports keyword, tag, and attribute queries with relevance scoring

# Data Models
- UserProfile: preferences, loyalty tier, browsing history
- Order: line items, payment status, fulfillment state
- RecommendationEvent: userId, productId, eventType, confidenceScore

# Security & Performance
- OAuth 2.0 + JWT session management
- WAF rules for bot mitigation
- SLA: 99.9% availability
- Performance budget: 200KB critical path JS, LCP under 2 seconds on 4G

# Acceptance Criteria
- Checkout success rate ≥ 95% across all payment methods
- Recommendation click-through ≥ 8%
- PageSpeed Insights 90+ for mobile
- Zero P1 accessibility violations

# Assumptions and Constraints
- Existing ERP integrations remain unchanged
- Personalization requires nightly catalog sync
- Launch staged by region to monitor conversion impact
<<PRD_END>>`,
      content: `# Product Requirements Document

## Product Overview
The redesigned platform provides a modular architecture supporting personalized homepages, frictionless checkout, and AI-driven recommendations. The solution integrates with existing inventory, CMS, and analytics services.

## Technical Architecture
- Frontend: React + Next.js hosted on Vercel with edge caching
- Backend: Node.js services exposing GraphQL APIs
- Recommendation engine: AWS Personalize with real-time event ingestion
- Data: PostgreSQL for transactional data, Redis for sessions, Snowflake for analytics

## User Stories
- As a mobile shopper, I want to complete checkout in under two minutes so I can purchase quickly.
- As a returning customer, I want relevant product recommendations on the homepage so I can discover complementary items.
- As a new visitor, I want advanced filtering options so I can narrow down the catalog efficiently.

## Feature Requirements
- Modular homepage with personalized content blocks
- Unified search across products, collections, and editorial content
- Persistent mini cart with real-time shipping estimates
- Checkout flow with express payment buttons and progress indicator
- Post-purchase cross-sell recommendations

## API Specifications
- \`GET /api/recommendations\` returns curated products per user session
- \`POST /api/cart/express-checkout\` initiates wallet-based payments
- \`POST /api/search\` supports keyword, tag, and attribute queries with relevance scoring

## Data Models
- UserProfile: preferences, loyalty tier, browsing history
- Order: line items, payment status, fulfillment state
- RecommendationEvent: userId, productId, eventType, confidenceScore

## Security & Performance
- OAuth 2.0 + JWT session management
- WAF rules for bot mitigation
- SLA: 99.9% availability
- Performance budget: 200KB critical path JS, LCP under 2 seconds on 4G

## Acceptance Criteria
- Checkout success rate ≥ 95% across all payment methods
- Recommendation click-through ≥ 8%
- PageSpeed Insights 90+ for mobile
- Zero P1 accessibility violations

## Assumptions and Constraints
- Existing ERP integrations remain unchanged
- Personalization requires nightly catalog sync
- Launch staged by region to monitor conversion impact`,
    },
    {
      type: DocumentType.TASKS,
      status: DocumentStatus.APPROVED,
      approvedAt: new Date(),
      rawContent: `<<TASKS_START>>
## Foundation & Infrastructure
- **TASK-001** – **Title:** Establish Next.js 14 project baseline  
  **Description:** Scaffold application with app router, Tailwind, and shared UI library integration. Configure eslint, prettier, and Vitest.  
  **Acceptance Criteria:** Build command succeeds; lint/test pipelines pass; shared component library available.  
  **Priority:** HIGH  
  **Effort:** 5  
  **Dependencies:** None  
  **Tags:** setup, frontend

- **TASK-002** – **Title:** Implement scalable theming system  
  **Description:** Create design tokens and theme provider supporting light/dark variants with CSS variables.  
  **Acceptance Criteria:** All core pages use tokens; theme toggle persists selection; meets accessibility contrast requirements.  
  **Priority:** MEDIUM  
  **Effort:** 3  
  **Dependencies:** TASK-001  
  **Tags:** frontend, design-system

## Checkout Experience
- **TASK-010** – **Title:** Build express checkout with wallet integrations  
  **Description:** Implement Apple Pay, Google Pay, and Shop Pay buttons with fallback to standard form.  
  **Acceptance Criteria:** Wallet buttons render on eligible devices; payment confirmation returned from gateway sandbox; analytics event captured.  
  **Priority:** HIGH  
  **Effort:** 8  
  **Dependencies:** TASK-001  
  **Tags:** checkout, payments

## Personalization
- **TASK-020** – **Title:** Integrate AWS Personalize recommendations  
  **Description:** Consume recommendation API and surface personalized carousels on homepage and PDP.  
  **Acceptance Criteria:** API responds within 200ms p95; fallback to popular items when no data; instrumentation emits impression/click events.  
  **Priority:** HIGH  
  **Effort:** 5  
  **Dependencies:** TASK-030  
  **Tags:** personalization, backend

- **TASK-030** – **Title:** Create real-time event ingestion pipeline  
  **Description:** Stream product views and add-to-cart events to AWS Personalize using Kinesis Firehose.  
  **Acceptance Criteria:** Events delivered within 60 seconds; monitoring dashboard shows throughput and failures.  
  **Priority:** HIGH  
  **Effort:** 8  
  **Dependencies:** TASK-001  
  **Tags:** data, infrastructure

## Performance & QA
- **TASK-040** – **Title:** Implement performance budget automation  
  **Description:** Configure Lighthouse CI to enforce LCP < 2s and JS payload < 200KB on key routes.  
  **Acceptance Criteria:** CI pipeline fails when thresholds exceeded; reports available in dashboard.  
  **Priority:** MEDIUM  
  **Effort:** 3  
  **Dependencies:** TASK-001  
  **Tags:** performance, qa
<<TASKS_END>>`,
      content: `# Technical Task List

## Foundation & Infrastructure
### TASK-001 – Establish Next.js 14 project baseline
- Scaffold application with app router, Tailwind, and shared UI library integration. Configure eslint, prettier, and Vitest.
- **Acceptance Criteria:** Build command succeeds; lint/test pipelines pass; shared component library available.
- **Priority:** HIGH **Effort:** 5 **Dependencies:** None **Tags:** setup, frontend

### TASK-002 – Implement scalable theming system
- Create design tokens and theme provider supporting light/dark variants with CSS variables.
- **Acceptance Criteria:** All core pages use tokens; theme toggle persists selection; meets accessibility contrast requirements.
- **Priority:** MEDIUM **Effort:** 3 **Dependencies:** TASK-001 **Tags:** frontend, design-system

## Checkout Experience
### TASK-010 – Build express checkout with wallet integrations
- Implement Apple Pay, Google Pay, and Shop Pay buttons with fallback to standard form.
- **Acceptance Criteria:** Wallet buttons render on eligible devices; payment confirmation returned from gateway sandbox; analytics event captured.
- **Priority:** HIGH **Effort:** 8 **Dependencies:** TASK-001 **Tags:** checkout, payments

## Personalization
### TASK-020 – Integrate AWS Personalize recommendations
- Consume recommendation API and surface personalized carousels on homepage and PDP.
- **Acceptance Criteria:** API responds within 200ms p95; fallback to popular items when no data; instrumentation emits impression/click events.
- **Priority:** HIGH **Effort:** 5 **Dependencies:** TASK-030 **Tags:** personalization, backend

### TASK-030 – Create real-time event ingestion pipeline
- Stream product views and add-to-cart events to AWS Personalize using Kinesis Firehose.
- **Acceptance Criteria:** Events delivered within 60 seconds; monitoring dashboard shows throughput and failures.
- **Priority:** HIGH **Effort:** 8 **Dependencies:** TASK-001 **Tags:** data, infrastructure

## Performance & QA
### TASK-040 – Implement performance budget automation
- Configure Lighthouse CI to enforce LCP < 2s and JS payload < 200KB on key routes.
- **Acceptance Criteria:** CI pipeline fails when thresholds exceeded; reports available in dashboard.
- **Priority:** MEDIUM **Effort:** 3 **Dependencies:** TASK-001 **Tags:** performance, qa`,
    },
  ];

  for (const doc of demoDocuments) {
    await prisma.document.create({
      data: {
        projectId: demoProject.id,
        type: doc.type,
        status: doc.status,
        content: doc.content,
        rawContent: doc.rawContent,
        version: 1,
        approvedAt: doc.approvedAt,
      },
    });
  }

  console.log(`✅ Added ${demoDocuments.length} demo documents`);

  // Create audit log
  await prisma.auditLog.create({
    data: {
      action: 'SEED_DATABASE',
      details: {
        message: 'Database seeded with initial data',
        usersCreated: 2,
        promptsCreated: systemPrompts.length,
        projectsCreated: 1,
      },
    },
  });

  console.log('✅ Created audit log');

  console.log('\n🎉 Seeding complete!');
  console.log('\n📝 Demo Credentials:');
  console.log('Admin: admin@prdhelper.com / Admin@123');
  console.log('Demo:  demo@prdhelper.com / Demo@123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
