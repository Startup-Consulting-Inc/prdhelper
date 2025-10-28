# Product Requirements Document (PRD)
## PRD Helper - AI-Powered Requirements Document Generator

**Document Version:** 1.0  
**Date:** October 24, 2025  
**Product Manager:** Jaehee Song  
**Status:** Draft for Review

---

## Executive Summary

PRD Helper is an intelligent web application that democratizes the creation of professional Business Requirements Documents (BRD), Product Requirements Documents (PRD), and Technical Task Lists through AI-assisted wizards. The platform serves two distinct user segments: non-technical business stakeholders (Plain Mode) and technical teams (Technical Mode), guiding them through a contextual, conversational interface to generate production-ready documentation.

**Primary Goals:**
- Reduce time-to-documentation from days to hours
- Lower barrier to entry for creating professional requirements documents
- Enable seamless handoff between business and technical teams
- Provide intelligent, context-aware guidance throughout the documentation process

---

## 1. Feature Definition & Prioritization (Kano Model)

### Basic Features (Must-Have - Dissatisfiers if absent)

| Feature ID | Feature Name | Description | Priority |
|------------|-------------|-------------|----------|
| BF-01 | User Authentication | Secure sign-up/login via NextAuth.js + Prisma | P0 |
| BF-02 | Project Creation | Create new documentation projects with title and description | P0 |
| BF-03 | BRD Generation | Generate Business Requirements Document through guided Q&A | P0 |
| BF-04 | Document Storage | Persist all generated documents in database | P0 |
| BF-05 | Document Viewing | Display generated documents in readable format | P0 |
| BF-06 | State Persistence | Save user progress and allow resumption | P0 |
| BF-07 | Mode Selection | Choose between Plain and Technical modes | P0 |

### Performance Features (Satisfiers - Linear satisfaction)

| Feature ID | Feature Name | Description | Priority |
|------------|-------------|-------------|----------|
| PF-01 | PRD Generation | Generate Product Requirements Document from BRD | P0 |
| PF-02 | Progress Tracking | Visual indicators showing completion status | P1 |
| PF-03 | Document Review & Approval | Review and approve documents before proceeding | P1 |
| PF-04 | Interactive Q&A | One question at a time with option cards | P1 |
| PF-05 | Markdown Export | Download documents in Markdown format | P1 |
| PF-06 | Dashboard | Central view of all projects and their status | P1 |
| PF-07 | Document Versioning | Track iterations and changes to documents | P2 |
| PF-08 | PDF Export | Download documents as formatted PDFs | P2 |

### Excitement Features (Delighters - Disproportionate satisfaction)

| Feature ID | Feature Name | Description | Priority |
|------------|-------------|-------------|----------|
| EF-01 | Technical Task List Generation | Auto-generate prioritized tasks from PRD (Technical Mode) | P1 |
| EF-02 | Custom AI Prompts | Admin-configurable system prompts per mode | P2 |
| EF-03 | Smart Option Suggestions | AI-powered contextual options during Q&A | P1 |
| EF-04 | Project Prompt Generation | Generate project kickoff prompt from task list | P2 |
| EF-05 | Multi-turn Conversation | Contextual follow-up questions based on responses | P1 |
| EF-06 | Document Refinement | Edit and iterate on generated documents | P2 |
| EF-07 | Admin Dashboard | Comprehensive admin panel for system management | P2 |

---

## 2. Functional & Non-Functional Requirements

### 2.1 Functional Requirements

#### FR-1: Authentication & User Management
- **FR-1.1:** System shall support email/password authentication via NextAuth.js
- **FR-1.2:** System shall support OAuth providers (Google, GitHub) via NextAuth.js
- **FR-1.3:** System shall store user profiles with mode preference (Plain/Technical) using Prisma
- **FR-1.4:** System shall implement role-based access control (User, Admin)
- **FR-1.5:** System shall enforce password complexity requirements (min 8 chars, special characters)

#### FR-2: Project Management
- **FR-2.1:** Users shall create projects with title (max 200 chars) and initial idea (max 2000 chars)
- **FR-2.2:** Users shall select user mode (Plain/Technical) during project creation
- **FR-2.3:** System shall auto-save project data every 30 seconds
- **FR-2.4:** Users shall view all their projects in a dashboard with status indicators
- **FR-2.5:** Users shall archive or delete projects
- **FR-2.6:** System shall track creation date, last modified date, and completion percentage

#### FR-3: AI-Assisted Q&A Wizard
- **FR-3.1:** System shall present one question at a time to reduce cognitive load
- **FR-3.2:** System shall provide 3-5 option cards per question with visual selection
- **FR-3.3:** Users shall enter custom responses when provided options don't fit
- **FR-3.4:** System shall validate minimum response length (20 chars) before proceeding
- **FR-3.5:** System shall maintain conversation context across all exchanges
- **FR-3.6:** System shall limit Q&A to 2-5 questions per document type
- **FR-3.7:** System shall provide examples with each question for clarity
- **FR-3.8:** Users shall edit previous responses before generation

#### FR-4: BRD Generation
- **FR-4.1:** System shall collect requirements through guided questions covering:
  - Problem statement and target audience
  - Business objectives and success metrics
  - Scope and out-of-scope items
  - Key stakeholders
  - Constraints and dependencies
- **FR-4.2:** System shall generate BRD in Markdown format with sections and enclose it with markers such as `<<BRD_START>>` and `<<BRD_END>>`:
  - Executive Summary
  - Business Objectives
  - Stakeholders
  - Requirements
  - Success Metrics
  - Constraints
- **FR-4.3:** System shall display generation progress with loading indicator
- **FR-4.4:** System shall transition to document_ready state upon successful generation
- **FR-4.5:** System shall save it to database upon successful generation

#### FR-5: PRD Generation
- **FR-5.1:** System shall use approved BRD as context for PRD questions. Full BRD from database shall be included in the AI context
- **FR-5.2:** System shall collect product specifications through guided questions covering:
  - Feature definitions
  - User personas and journeys
  - Technical requirements
  - UI/UX considerations
  - Integration requirements
- **FR-5.3:** System shall generate PRD in Markdown format with sections and enclose it with markers such as `<<PRD_START>>` and `<<PRD_END>>`:
  - Product Overview
  - User Personas
  - Features & Requirements
  - User Stories
  - Technical Architecture
  - Success Metrics
  - Timeline
- **FR-5.4:** System shall not proceed to PRD until BRD is approved
- **FR-5.5:** System shall display generation progress with loading indicator
- **FR-5.6:** System shall transition to document_ready state upon successful generation
- **FR-5.7:** System shall save it to database upon successful generation

#### FR-6: Technical Task List Generation (Technical Mode Only)
- **FR-6.1:** System shall analyze approved PRD to extract technical requirements. Full PRD from database shall be included in the AI context
- **FR-6.2:** System shall generate prioritized task list with:
  - Task ID and title
  - Description and acceptance criteria
  - Priority (P0/P1/P2)
  - Estimated effort (T-shirt sizing: XS/S/M/L/XL)
  - Dependencies
  - Technical tags
- **FR-6.3:** System shall group tasks by implementation phase
- **FR-6.4:** System shall generate project kickoff prompt for development
- **FR-6.5:** System shall save it to database upon successful generation

#### FR-7: Document Review & Approval
- **FR-7.1:** Users shall review generated documents in dedicated panel
- **FR-7.2:** Users shall approve documents to proceed to next phase
- **FR-7.3:** Users shall request regeneration with additional context
- **FR-7.4:** System shall track approval status and timestamps
- **FR-7.5:** Users shall download documents before or after approval

#### FR-8: Document Export
- **FR-8.1:** System shall export documents in Markdown (.md) format
- **FR-8.2:** System shall export documents in PDF format with styling
- **FR-8.3:** System shall include metadata (creation date, version, project title) in exports
- **FR-8.4:** System shall preserve document formatting in both export formats

#### FR-9: State Management
- **FR-9.1:** System shall implement state machine with states:
  - `collecting_requirements`: Gathering information through Q&A
  - `generating_document`: AI processing and document creation
  - `document_ready`: Document available for review
  - `approved`: User approved, ready for next phase
  - `refining`: Iterating on existing document
- **FR-9.2:** System shall automatically transition states based on user actions
- **FR-9.3:** System shall persist state in database for resume capability
- **FR-9.4:** System shall display current state in UI with visual indicators

#### FR-10: Admin Panel
- **FR-10.1:** Admins shall view all users and their project count
- **FR-10.2:** Admins shall view all projects across users
- **FR-10.3:** Admins shall edit system prompts by type and mode:
  - BRD Generation (Plain/Technical)
  - PRD Generation (Plain/Technical)
  - Tasks Generation (Technical only)
  - Prompt Build (Technical only)
- **FR-10.4:** Admins shall preview prompt changes before saving
- **FR-10.5:** Admins shall view prompt usage analytics
- **FR-10.6:** System shall version control system prompts

### 2.2 Non-Functional Requirements

#### NFR-1: Performance
- **NFR-1.1:** Page load time shall not exceed 2 seconds on 3G connection
- **NFR-1.2:** AI response generation shall complete within 15 seconds
- **NFR-1.3:** Document generation shall complete within 30 seconds
- **NFR-1.4:** Auto-save operations shall not block user interactions
- **NFR-1.5:** System shall support 1000 concurrent users without degradation
- **NFR-1.6:** Database queries shall execute in < 100ms for 95th percentile

#### NFR-2: Security
- **NFR-2.1:** All API communications shall use HTTPS/TLS 1.3
- **NFR-2.2:** User passwords shall be hashed using bcrypt (cost factor 12)
- **NFR-2.3:** System shall implement application-level authorization with least-privilege database roles (no RLS assumptions)
- **NFR-2.4:** Session tokens shall expire after 1 hour of inactivity
- **NFR-2.5:** System shall sanitize all user inputs to prevent XSS/SQL injection
- **NFR-2.6:** API keys shall be stored in environment variables, never in code
- **NFR-2.7:** System shall implement rate limiting (100 requests/min per user)
- **NFR-2.8:** System shall log all authentication attempts
- **NFR-2.9:** System shall comply with OWASP Top 10 security standards

---

## Stack Alignment with Repository Standards

To align this PRD with the repository’s `.cursorrules` (Next.js, Prisma, tRPC, Inngest, Tailwind):

- Framework: Next.js (App Router) with Server/Client Components
- Styling: Tailwind CSS only (no component libraries)
- Auth: NextAuth.js with Prisma Adapter (email/password and OAuth)
- API: tRPC routers under `src/lib/api` exposed via Next.js route handlers
- Database: PostgreSQL via Prisma (no raw SQL committed; use Prisma migrations)
- Background Jobs: Inngest for document generation and long-running tasks
- Security: Application-level authorization and least-privilege DB roles (no RLS assumptions)
- AI Provider: OpenRouter (default model: `google/gemini-2.5-flash`)

Notes:
- Supabase-specific references (Auth, RLS, Edge Functions) are superseded by NextAuth + Prisma + Next.js route handlers + Inngest.
- Any raw SQL schema shown is illustrative only; actual schema must be defined in `prisma/schema.prisma` and managed via `npx prisma migrate dev`.

---

## 3. User Workflows & Journeys (User Story Mapping)

### 3.1 User Story Map Structure

```
BACKBONE (User Activities)
├── Discover & Sign Up
├── Create Project
├── Generate BRD
├── Review & Approve BRD
├── Generate PRD
├── Review & Approve PRD
├── Generate Tasks (Technical Mode)
└── Manage Projects

WALKING SKELETON (MVP)
- Basic auth
- Single project creation
- BRD generation (Plain mode)
- Document viewing
- Markdown export
```

### 3.2 Detailed User Journeys

#### Journey 1: Non-Technical Founder (Plain Mode) - BRD Creation

**Persona:** Sarah, Non-Technical Startup Founder  
**Goal:** Create professional BRD for investor presentation  
**Context:** Limited time, no technical background

**Flow:**

1. **Landing Page** (0 min)
   - Views value proposition and feature highlights
   - Clicks "Get Started" CTA
   - **Potential Friction:** Unclear differentiation from competitors

2. **Sign Up** (1-2 min)
   - Enters email and password
   - Confirms email (optional quick-start without confirmation)
   - **Potential Friction:** Email confirmation delay

3. **Create Project** (2-3 min)
   - Enters project title: "Mobile Fitness Coaching App"
   - Writes initial idea (200 words)
   - Selects "Plain Mode"
   - Clicks "Start Creating BRD"
   - **Potential Friction:** Uncertainty about how much detail to provide

4. **BRD Q&A** (10-15 min)
   - **Question 1:** "Who is your target audience?"
     - Options: "Consumers (B2C)", "Businesses (B2B)", "Both (B2B2C)"
     - Selects "Consumers (B2C)" and adds: "Primarily 25-45 fitness enthusiasts"
   - **Question 2:** "What problem are you solving?"
     - Options: "Cost", "Accessibility", "Quality", "Convenience"
     - Selects "Accessibility" and "Convenience"
     - Custom input: "Users can't afford personal trainers but need personalized guidance"
   - **Question 3:** "What are your key success metrics?"
     - Examples shown: MAU, Revenue, Retention
     - Types: "10K downloads in 6 months, 40% 30-day retention"
   - **Question 4:** "What are your must-have features?"
     - Selects multiple options, adds custom features
   - Reviews conversation, clicks "Generate BRD"
   - **Potential Bottleneck:** AI processing time, lack of progress indicator

5. **BRD Review** (5 min)
   - Document appears in left panel with `<<BRD_START>>` marker
   - Scans sections: Executive Summary, Objectives, Requirements
   - Downloads PDF for team review
   - **Friction Point:** Wants to edit specific section but must regenerate entirely
   - Clicks "Approve BRD"

6. **PRD Flow** (similar to BRD, 10-15 min)
   - System uses BRD context for smarter questions
   - Generates comprehensive PRD with `<<PRD_START>>` marker
   - Reviews, downloads, completes project

7. **Dashboard Return** (ongoing)
   - Sees project marked as "Completed"
   - Can reopen to refine documents
   - **Success:** Professional documents in 30-40 minutes vs. days

**Journey Insights:**
- **Peak Moment:** Seeing professionally formatted BRD for first time
- **Pain Points:** Document editing limitations, AI wait times
- **Drop-off Risk:** Between BRD and PRD if value isn't clear

#### Journey 2: Senior Developer (Technical Mode) - Full Project Documentation

**Persona:** Marcus, Senior Full-Stack Developer  
**Goal:** Generate complete technical documentation for new microservice  
**Context:** Experienced developer, needs detailed specifications

**Flow:**

1. **Fast Entry** (30 sec)
   - Already has account, logs in directly
   - Dashboard shows 3 previous projects

2. **Create Project** (1 min)
   - Title: "User Authentication Service Refactor"
   - Detailed technical idea with architecture notes
   - Selects "Technical Mode"

3. **BRD Q&A** (8-10 min)
   - Questions are more technical
   - "What are the technical constraints?"
   - "What are the integration requirements?"
   - "What are the scalability targets?"
   - Provides detailed architectural context

4. **BRD Review & Approve** (3 min)
   - Document includes technical sections
   - Validates completeness
   - Approves quickly

5. **PRD Q&A** (12-15 min)
   - Deep technical questions:
     - API specifications
     - Data models
     - Security requirements
     - Testing strategy
   - Provides extensive details
   - **Friction:** Wants to reference existing codebase but can't upload files

6. **PRD Review** (5 min)
   - Validates technical accuracy
   - Downloads for team review
   - Approves

7. **Task Generation** (3 min)
   - Clicks "Generate Task List"
   - AI analyzes PRD and creates prioritized tasks
   - Tasks include:
     - Setup & Configuration (P0)
     - Core Authentication Logic (P0)
     - Database Migrations (P0)
     - API Endpoints (P1)
     - Testing & Documentation (P1)
     - Performance Optimization (P2)
   - Each task has acceptance criteria and effort estimates

8. **Project Prompt** (1 min)
   - Clicks "Generate Project Prompt"
   - Receives comprehensive kickoff prompt for AI coding assistant
   - Copies to Claude/ChatGPT to start implementation

**Journey Insights:**
- **Peak Moment:** Task list generation saves hours of planning
- **Power User Need:** File upload, code context, integration with existing tools
- **Efficiency Gain:** 25-30 minutes for complete documentation vs. 4-6 hours manual

#### Journey 3: Returning User - Resume Incomplete Project

**Persona:** Alex, Product Manager  
**Goal:** Complete PRD started last week  
**Context:** Got interrupted, needs to resume

**Flow:**

1. **Login** (30 sec)
   - Authenticates successfully

2. **Dashboard** (1 min)
   - Sees 4 projects
   - One marked "In Progress - PRD Q&A" with 60% complete badge
   - Clicks to open

3. **Project View** (immediate)
   - Left panel shows approved BRD
   - Right panel restores conversation at exact point
   - Last message visible: "What are the key integration points?"
   - Progress bar shows 3/5 questions answered

4. **Continue Q&A** (5 min)
   - Answers remaining 2 questions
   - System maintains full context
   - Generates PRD

5. **Success Metric:** Zero friction in resuming workflow

**Journey Insights:**
- **Critical Feature:** State persistence prevents frustration
- **User Confidence:** Progress indicators reduce abandonment
- **Retention Driver:** Ability to return without starting over

### 3.3 Friction Points & Mitigation

| Friction Point | Impact | Mitigation Strategy |
|----------------|--------|---------------------|
| Email verification delay | Medium | Allow immediate use, verify async |
| AI generation wait time | High | Add progress indicator with estimated time |
| Cannot edit specific sections | High | Implement section-level regeneration (v2) |
| Unclear option choices | Medium | Add hover tooltips with examples |
| Lost context on page refresh | High | Implement aggressive auto-save (30s) |
| Mobile keyboard covering input | Low | Adjust viewport on mobile focus |
| Uncertainty about progress | Medium | Visual progress tracking with % complete |

---

## 4. Technical Feasibility & Architecture

### 4.1 Conceptual Architecture Diagram

```
┌───────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Next.js)                              │
├───────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │         Next.js App Router (Server + Client Components)             │  │
│  │  ┌────────────┬──────────────┬────────────┬────────────┬─────────┐ │  │
│  │  │  Landing   │   Auth       │ Dashboard  │  Project   │ Viewer  │ │  │
│  │  │   Page     │   Pages      │            │   Wizard   │         │ │  │
│  │  └────────────┴──────────────┴────────────┴────────────┴─────────┘ │  │
│  │   UI: Tailwind CSS (no component libs)                               │  │
│  │   State: React Query + Context                                       │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────┬───────────────────────────────────────────────┘
                            │ HTTPS
                            ↓
┌───────────────────────────────────────────────────────────────────────────┐
│                          API LAYER (Next.js)                               │
├───────────────────────────────────────────────────────────────────────────┤
│  Route Handlers (/app/api) + tRPC Routers (/src/lib/api)                  │
│  - Authentication (NextAuth.js)                                           │
│  - Project/Conversation/Document APIs                                     │
│  - Triggers background jobs (Inngest)                                     │
└───────────────────────────┬───────────────────────────────────────────────┘
                            │
                            ↓
┌───────────────────────────────────────────────────────────────────────────┐
│                         BACKGROUND JOBS (Inngest)                          │
├───────────────────────────────────────────────────────────────────────────┤
│  - document/generate (BRD, PRD)                                           │
│  - tasks/generate                                                          │
│  - export/pdf                                                              │
└───────────────────────────┬───────────────────────────────────────────────┘
                            │
                            ↓
┌───────────────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL via Prisma)                        │
├───────────────────────────────────────────────────────────────────────────┤
│  - Users, Profiles (NextAuth + Prisma Adapter)                             │
│  - Projects, Conversations, Documents, System Prompts                      │
│  - Migrations managed via Prisma                                           │
└───────────────────────────┬───────────────────────────────────────────────┘
                            │
                            ↓ HTTPS
┌───────────────────────────────────────────────────────────────────────────┐
│                           OPENROUTER API                                   │
├───────────────────────────────────────────────────────────────────────────┤
│  Models: google/gemini-2.5-flash (default), openai/gpt-4o (alt)            │
│  - Text generation, conversation, context-aware prompts                     │
└───────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Database Schema

All database models are defined and maintained via Prisma in `prisma/schema.prisma`. No raw SQL is committed. Use migrations via:

```
npx prisma migrate dev --name descriptive_name
```

Example model (illustrative):

```prisma
model SystemPrompt {
  id         String   @id @default(cuid())
  promptType String
  userMode   String
  content    String
  version    Int      @default(1)
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@map("system_prompts")
}
```

### 4.3 Technology Stack Justification

| Component | Technology | Justification |
|-----------|-----------|---------------|
| **Framework** | Next.js (App Router) + TypeScript | Full-stack React, SSR/SSG, server actions, great DX |
| **Styling** | Tailwind CSS | Utility-first, fast iteration, no component libs per guidelines |
| **State Management** | React Query + Context | Server state caching, simple global state |
| **Routing** | Next.js App Router | File-based routing, layouts, server components |
| **API** | tRPC (Next.js route handlers) | Typesafe end-to-end, great with Next.js |
| **Auth** | NextAuth.js + Prisma Adapter | Standard auth for Next.js, integrates with Prisma |
| **Database** | PostgreSQL via Prisma | Strong typing, migrations, portability |
| **Background Jobs** | Inngest | Reliable background processing with Next.js integration |
| **AI Provider** | OpenRouter + Gemini 2.5 | Cost-effective, fast responses, good quality |
| **Document Generation** | Server-side (Next API/Inngest) | Security (API keys), processing power |
| **PDF Generation** | jsPDF / Puppeteer | Standard library for PDF creation |
| **Hosting** | Vercel (Next.js) + Managed Postgres | Edge network, auto-scaling |

### 4.4 Architecture Decisions & Tradeoffs

#### Decision 1: Monolithic SPA vs Microservices
**Choice:** Monolithic Next.js app with background jobs (Inngest)  
**Rationale:**
- Simpler deployment and development
- Fewer network hops (latency)
- Sufficient for initial scale (< 10K users)
- Can extract services later if needed

**Tradeoff:** Less flexibility to scale individual components

#### Decision 2: Application Stack Choice
**Choice:** Server-side (Next.js API routes/Inngest)  
**Rationale:**
- Aligns with repository standards and type-safe development
- Flexible architecture with clear server/client boundaries
- Prisma migrations and models under version control
- Easy integration with NextAuth and Inngest

**Tradeoff:** More custom backend code to maintain vs BaaS convenience

#### Decision 3: Real-time vs Polling for Updates
**Choice:** Polling with 5-second intervals during active generation  
**Rationale:**
- Simpler implementation
- Sufficient UX (generation takes 15-30s)
- Less infrastructure complexity

**Tradeoff:** Slightly less responsive than WebSockets

#### Decision 4: Client-side vs Server-side AI Calls
**Choice:** Server-side (Edge Functions)  
**Rationale:**
- API key security
- Rate limiting control
- Preprocessing and postprocessing
- Conversation logging

**Tradeoff:** Additional network latency

#### Decision 5: Markdown-first vs WYSIWYG Editor
**Choice:** Markdown-first with styled preview  
**Rationale:**
- Developer-friendly format
- Easier AI generation
- Version control friendly
- Export flexibility

**Tradeoff:** Less intuitive for non-technical users

### 4.5 Technical Constraints & Dependencies

**External Dependencies:**
- OpenRouter API uptime and rate limits (100 req/min free tier)
- Managed Postgres service availability (e.g., Neon, Railway, RDS)
- Browser support for modern JavaScript (ES2020+)
- PDF generation library compatibility

**Technical Constraints:**
- AI response time: 5-30 seconds (uncontrollable)
- Database connection limits per managed provider tier
- Storage limits per managed provider tier
- Background job timeout limits

**Known Limitations:**
- No offline mode (requires internet connection)
- Limited file upload capability (future enhancement)
- English language only in MVP
- No collaborative editing (single user per project)

---

## 5. Acceptance Criteria (Gherkin Syntax)

### Feature: User Authentication

```gherkin
Scenario: New user signs up successfully
  Given I am on the sign-up page
  When I enter a valid email "user@example.com"
  And I enter a password "SecurePass123!"
  And I click the "Sign Up" button
  Then I should see my account dashboard
  And I should receive a welcome email

Scenario: User login with correct credentials
  Given I have an existing account with email "user@example.com"
  And I am on the login page
  When I enter my email "user@example.com"
  And I enter my password "SecurePass123!"
  And I click the "Login" button
  Then I should be redirected to my dashboard
  And I should see my list of projects

Scenario: User login fails with incorrect password
  Given I have an existing account with email "user@example.com"
  And I am on the login page
  When I enter my email "user@example.com"
  And I enter an incorrect password "WrongPass"
  And I click the "Login" button
  Then I should see an error message "Invalid credentials"
  And I should remain on the login page

Scenario: User logs out successfully
  Given I am logged in
  And I am on any page
  When I click the "Logout" button
  Then I should be redirected to the login page
  And my session should be cleared
```

### Feature: Project Creation

```gherkin
Scenario: Create new project in Plain mode
  Given I am logged in
  And I am on the dashboard
  When I click "Create New Project"
  And I enter project title "Mobile Fitness App"
  And I enter initial idea "An app that provides personalized workout plans"
  And I select mode "Plain"
  And I click "Create Project"
  Then a new project should be created
  And I should be redirected to the BRD wizard
  And the project should have status "collecting_requirements"

Scenario: Create new project in Technical mode
  Given I am logged in
  And I am on the dashboard
  When I click "Create New Project"
  And I enter project title "API Gateway Service"
  And I enter initial idea with technical details
  And I select mode "Technical"
  And I click "Create Project"
  Then a new project should be created
  And I should be redirected to the BRD wizard
  And the wizard should use technical language

Scenario: Cannot create project without title
  Given I am on the create project page
  When I leave the title field empty
  And I enter initial idea
  And I click "Create Project"
  Then I should see validation error "Title is required"
  And the project should not be created

Scenario: Cannot create project with too short idea
  Given I am on the create project page
  When I enter project title "Test"
  And I enter only 10 characters in initial idea
  And I click "Create Project"
  Then I should see error "Please provide at least 20 characters"
  And the project should not be created
```

### Feature: BRD Generation via Q&A

```gherkin
Scenario: Complete BRD Q&A with option selection
  Given I have created a project in Plain mode
  And I am in the BRD wizard
  When the assistant asks "Who is your target audience?"
  And I see options: ["Consumers (B2C)", "Businesses (B2B)", "Both (B2B2C)"]
  And I click option "Consumers (B2C)"
  Then my response should be saved to conversations
  And the assistant should ask the next question
  And progress indicator should show 1/4 complete

Scenario: Provide custom answer instead of options
  Given I am in the BRD wizard
  And I see a question with predefined options
  When I type a custom response "My target audience is healthcare professionals in rural areas"
  And I click "Submit"
  Then my custom response should be saved
  And the assistant should acknowledge my answer
  And the next question should appear

Scenario: Edit previous response during Q&A
  Given I have answered 3 questions in BRD wizard
  And I am on question 4
  When I click "Edit" on question 2
  Then I should see my previous answer
  And I should be able to modify the text
  When I click "Update"
  Then the conversation should be updated
  And I should return to question 4

Scenario: Generate BRD after completing all questions
  Given I have answered all required BRD questions
  And I see the summary of my responses
  When I click "Generate BRD"
  Then I should see a loading indicator with progress
  And generation_state should change to "generating_document"
  And within 30 seconds I should see the generated BRD
  And the BRD should be enclosed with <<BRD_START>> and <<BRD_END>> markers
  And generation_state should change to "document_ready"
  And the document should be saved to the database

Scenario: Cannot proceed without answering questions
  Given I am in the BRD wizard
  And I have answered only 1 of 4 questions
  When I try to click "Generate BRD"
  Then the button should be disabled
  And I should see "Answer all questions to generate document"
```

### Feature: Document Review and Approval

```gherkin
Scenario: Review generated BRD successfully
  Given I have generated a BRD
  And the document is displayed in the left panel
  When I scroll through all sections
  Then I should see: Executive Summary, Business Objectives, Stakeholders, Requirements, Success Metrics
  And each section should have content
  And formatting should be properly rendered

Scenario: Approve BRD and proceed to PRD
  Given I have reviewed the generated BRD
  And I am satisfied with the content
  When I click "Approve BRD"
  Then the document is_approved field should be set to TRUE
  And approved_at timestamp should be recorded
  And I should see "BRD Approved" confirmation
  And "Start PRD" button should become enabled
  And project current_phase should update to "prd"

Scenario: Request BRD regeneration with additional context
  Given I have reviewed the generated BRD
  And I want to add more details
  When I click "Add More Context"
  Then I should see a text input field
  When I enter "Please include detailed timeline and budget constraints"
  And I click "Regenerate"
  Then generation_state should change to "refining"
  And a new version of the BRD should be generated
  And document version should increment to 2

Scenario: Download BRD as Markdown
  Given I have a generated BRD
  When I click the "Download" dropdown
  And I select "Markdown (.md)"
  Then a file "Project-Title-BRD-v1.md" should download
  And the file should contain properly formatted Markdown
  And the file should include metadata header

Scenario: Download BRD as PDF
  Given I have a generated BRD
  When I click the "Download" dropdown
  And I select "PDF"
  Then a file "Project-Title-BRD-v1.pdf" should download
  And the PDF should have proper styling and formatting
  And the PDF should include page numbers and headers
```

### Feature: PRD Generation

```gherkin
Scenario: Start PRD generation after BRD approval
  Given I have an approved BRD
  And current_phase is "prd"
  When I click "Start PRD"
  Then I should enter the PRD Q&A wizard
  And the assistant should reference context from the BRD
  And the full BRD from database should be included in AI context
  And generation_state should be "collecting_requirements"

Scenario: PRD questions use BRD context
  Given I am in the PRD wizard
  And my BRD mentioned "mobile fitness app for consumers"
  When the assistant asks about features
  Then the question should reference my fitness app context
  And suggested options should be relevant to fitness domain

Scenario: Complete PRD generation workflow
  Given I have completed all PRD questions
  When I click "Generate PRD"
  Then I should see a loading indicator with progress
  And a comprehensive PRD should be generated
  And the PRD should be enclosed with <<PRD_START>> and <<PRD_END>> markers
  And the PRD should include sections: Product Overview, User Personas, Features, User Stories, Technical Architecture, Success Metrics, Timeline
  And the PRD should be longer and more detailed than the BRD
  And generation_state should change to "document_ready"
  And the document should be saved to the database

Scenario: Cannot start PRD without approved BRD
  Given I have a generated BRD
  But I have not approved it
  When I try to access the PRD wizard
  Then I should see message "Please approve BRD first"
  And the PRD wizard should not be accessible
```

### Feature: Technical Task List Generation (Technical Mode Only)

```gherkin
Scenario: Generate task list from approved PRD (Technical Mode)
  Given I am in Technical mode
  And I have an approved PRD
  When I click "Generate Task List"
  Then the system should analyze the PRD
  And the full PRD from database should be included in AI context
  And generate a prioritized list of tasks
  And tasks should include: ID, Title, Description, Priority, Effort, Dependencies, Tags
  And tasks should be grouped by implementation phase
  And the task list should be saved to the database

Scenario: Task list not available in Plain Mode
  Given I am in Plain mode
  And I have an approved PRD
  Then I should not see "Generate Task List" button
  And task generation should not be available

Scenario: View detailed task information
  Given I have a generated task list
  When I click on task "TASK-001: Setup Database Schema"
  Then I should see:
    | Field | Value |
    | ID | TASK-001 |
    | Priority | P0 |
    | Effort | M (Medium) |
    | Dependencies | None |
    | Acceptance Criteria | Database tables created, migrations work |

Scenario: Generate project kickoff prompt
  Given I have an approved task list
  When I click "Generate Project Prompt"
  Then a comprehensive kickoff prompt should be created
  And the prompt should include: project context, architecture, all tasks, technical requirements
  And I should be able to copy the prompt
  And the prompt should be saved as a document with type "prompt"
```

### Feature: State Persistence and Resume

```gherkin
Scenario: Auto-save during Q&A session
  Given I am answering questions in the wizard
  When I type an answer
  Then the system should auto-save within 30 seconds
  And I should see "Auto-saved" indicator briefly

Scenario: Resume project from dashboard
  Given I started a project yesterday
  And I completed 2 of 4 BRD questions
  And I closed the browser
  When I login today
  And I open the project from dashboard
  Then I should see exactly where I left off
  And the last 2 answered questions should be visible
  And I should be on question 3
  And generation_state should be "collecting_requirements"

Scenario: Resume after document generation started
  Given I clicked "Generate BRD"
  And the generation is in progress
  And I close the browser
  When I return and open the project
  Then I should either see the loading state OR the completed document
  And the system should have completed generation
  And no data should be lost

Scenario: Project shows correct status on dashboard
  Given I have multiple projects
  | Project | Phase | Status |
  | Project A | BRD | collecting_requirements |
  | Project B | PRD | document_ready |
  | Project C | Complete | approved |
  When I view my dashboard
  Then each project should display the correct status badge
  And completion percentage should be accurate
```

### Feature: Admin Panel

```gherkin
Scenario: Admin views all users
  Given I am logged in as admin
  And I navigate to Admin panel
  When I click "Users" tab
  Then I should see a list of all users
  And I should see columns: Email, Role, Created Date, Project Count, Last Active
  And I should be able to search users

Scenario: Admin views all projects
  Given I am logged in as admin
  And I am on the Admin panel
  When I click "Projects" tab
  Then I should see all projects across all users
  And I should see: Project Title, Owner, Status, Created Date
  And I should be able to filter by status

Scenario: Admin edits system prompt
  Given I am logged in as admin
  And I navigate to "System Prompts" section
  When I select "BRD Generation - Plain Mode"
  Then I should see the current prompt content
  When I modify the prompt text
  And I click "Preview"
  Then I should see how the prompt will appear
  When I click "Save"
  Then the prompt version should increment
  And is_active should be set to TRUE for new version
  And previous version should be archived

Scenario: Admin cannot delete active projects
  Given I am logged in as admin
  And I view a project that is "in progress"
  When I try to delete the project
  Then I should see confirmation warning
  And I should see "This will permanently delete user data"
  And deletion should require double confirmation

Scenario: Non-admin cannot access admin panel
  Given I am logged in as regular user
  When I try to navigate to "/admin"
  Then I should be redirected to dashboard
  And I should see "Access Denied" message
```

### Feature: Error Handling

```gherkin
Scenario: Handle AI API timeout gracefully
  Given I click "Generate BRD"
  And the AI API times out after 60 seconds
  Then I should see error message "Generation is taking longer than expected. Please try again."
  And generation_state should revert to "collecting_requirements"
  And I should have option to retry
  And my conversation data should be preserved

Scenario: Handle network disconnection during Q&A
  Given I am answering questions
  And I lose internet connection
  When I try to submit an answer
  Then I should see "Connection lost" message
  And my typed answer should be preserved in browser
  When connection is restored
  Then I should be able to submit my answer
  And the conversation should continue normally

Scenario: Handle database errors gracefully
  Given a database error occurs during save
  Then I should see user-friendly error message
  And the error should be logged to monitoring
  And I should be provided with next steps or contact support
```

---

## 6. Release Strategy & Timeline (Incremental Roadmap)

### 6.1 Release Philosophy

**Incremental Delivery Strategy:**
- Release working software every 2 weeks
- Each release provides standalone value
- Parallel workstreams for frontend and backend
- Feature flags for gradual rollout
- Beta users before general availability

### 6.2 Release Plan

#### **Phase 0: Foundation (Weeks 1-2)**
**Goal:** Setup infrastructure and development environment

**Deliverables:**
- Repository setup with CI/CD pipeline
- Development, staging, and production environments
- Database schema v1 deployment
- Authentication flow (email/password only)
- Basic landing page

**Team:** 1 Full-Stack Developer  
**Dependencies:** Managed Postgres, OpenRouter API key  
**Exit Criteria:** Developer can auth and access empty dashboard

---

#### **Phase 1: MVP - Plain Mode BRD (Weeks 3-5)**
**Goal:** First usable version for non-technical users

**Features:**
- ✅ BF-01: User Authentication (email/password)
- ✅ BF-02: Project Creation
- ✅ BF-03: BRD Generation (Plain Mode only)
- ✅ BF-04: Document Storage
- ✅ BF-05: Document Viewing
- ✅ PF-05: Markdown Export
- ✅ PF-04: Interactive Q&A (basic)

**User Flow:**
```
Sign Up → Create Project (Plain) → BRD Q&A (3 questions) → Generate → View → Download MD
```

**Technical Work:**
- Frontend: Create project flow, BRD wizard component, document viewer
- Backend: `ask-question` edge function, `generate-document` edge function with marker support
- Database: All base tables with RLS
- AI: BRD generation prompt for Plain mode with `<<BRD_START>>` and `<<BRD_END>>` markers

**Success Metrics:**
- 10 beta users complete BRD generation
- Average time < 20 minutes end-to-end
- < 5% error rate on generation
- Document markers correctly placed

**Parallel Workstreams:**
- Stream A: Frontend components (Developer 1)
- Stream B: Backend APIs and AI integration (Developer 2)
- Merge: Week 5 for integration testing

**Risk Mitigation:**
- Start AI integration early (Week 3) to validate latency
- Mock AI responses for frontend development
- Test marker extraction logic thoroughly

---

#### **Phase 2: PRD & Enhanced UX (Weeks 6-8)**
**Goal:** Complete documentation workflow with polish

**Features:**
- ✅ PF-01: PRD Generation with full BRD context
- ✅ PF-07: Document Review & Approval
- ✅ PF-02: Progress Tracking
- ✅ BF-06: State Persistence
- ✅ PF-06: Dashboard
- ✅ PF-08: PDF Export

**User Flow:**
```
[From Phase 1] → Approve BRD → PRD Q&A (4 questions) → Generate → Review → Approve → Download PDF
```

**Technical Work:**
- Frontend: Approval workflow, progress bars, dashboard with project cards
- Backend: PRD generation with full BRD context, PDF generation service, state machine logic
- AI: PRD prompt with BRD context awareness, `<<PRD_START>>` and `<<PRD_END>>` markers
- Database: Implement document retrieval for AI context

**Success Metrics:**
- 80% of users who create BRD proceed to PRD
- PDF exports render correctly on all devices
- Projects can be resumed without data loss
- Full BRD context improves PRD quality

**Dependencies:**
- Phase 1 must be stable before starting Phase 2
- PDF library evaluation completed by Week 6 Day 1

---

#### **Phase 3: Technical Mode (Weeks 9-11)**
**Goal:** Support developer users with advanced features

**Features:**
- ✅ BF-07: Mode Selection (enable Technical)
- ✅ EF-01: Technical Task List Generation with full PRD context
- ✅ EF-04: Project Prompt Generation
- ✅ EF-05: Multi-turn Conversation (enhanced)

**User Flow:**
```
Create Project (Technical) → BRD Q&A (technical) → PRD Q&A (technical) → Tasks → Project Prompt
```

**Technical Work:**
- Frontend: Technical mode UI with code formatting, task list component
- Backend: Task generation algorithm with full PRD context, prompt builder
- AI: Technical mode prompts for BRD/PRD/Tasks, effort estimation logic
- Database: Document retrieval for task generation context

**Success Metrics:**
- 30 developer users complete full workflow
- Task lists are actionable (validated by survey)
- Generated prompts successfully kickstart projects
- Full PRD context improves task generation quality

**Gating Factor:**
- Plain mode must have < 3% churn rate before releasing Technical mode
- Minimum 50 Plain mode users with positive feedback

---

#### **Phase 4: Refinement & Admin (Weeks 12-14)**
**Goal:** Production-ready with management capabilities

**Features:**
- ✅ EF-06: Document Refinement
- ✅ PF-07: Document Versioning
- ✅ EF-07: Admin Dashboard
- ✅ EF-02: Custom AI Prompts (admin editable)
- ✅ OAuth Authentication

**Technical Work:**
- Frontend: Admin panel, document diff viewer, OAuth buttons
- Backend: Versioning logic, admin authorization policies, prompt management API
- Infrastructure: Performance optimization, monitoring, error tracking

**Success Metrics:**
- Admin can update prompts without deployment
- Document versioning preserves history accurately
- System handles 100 concurrent users

---

#### **Phase 5: Scale & Polish (Weeks 15-16)**
**Goal:** General availability launch

**Features:**
- Performance optimization
- Mobile responsiveness perfection
- Comprehensive error handling
- Analytics integration
- User feedback system
- Help documentation

**Technical Work:**
- Performance audit and optimization
- Load testing (1000+ concurrent users)
- Security audit
- Accessibility compliance (WCAG 2.1 AA)
- Launch marketing site

**Launch Criteria:**
- ✅ 99.5% uptime over 2 weeks
- ✅ < 2s average page load
- ✅ 100% of acceptance criteria passing
- ✅ < 1% error rate
- ✅ Security audit passed
- ✅ 20+ beta testimonials

---

### 6.3 Post-Launch Roadmap (Phase 6+)

**Q1 Post-Launch:**
- Collaborative editing (multiple users per project)
- Template library (common project types)
- Integrations (Jira, Linear, Asana export)
- API access for developers

**Q2 Post-Launch:**
- File upload for context (images, existing docs)
- Multi-language support (Spanish, French)
- AI model selection (let users choose model)
- Advanced analytics dashboard

**Future Considerations:**
- White-label solution for enterprises
- On-premise deployment option
- IDE plugins (VS Code, JetBrains)
- Voice input for Q&A

---

### 6.4 Dependency Map

```
Phase 0 (Foundation)
    ↓
Phase 1 (MVP - Plain BRD) ← Must complete before Phase 2
    ↓
Phase 2 (PRD & UX) ← Must complete before Phase 3
    ↓
Phase 3 (Technical Mode) ← Parallel with Phase 4
    ↓
Phase 4 (Admin & Refinement) ← Parallel with Phase 3
    ↓
Phase 5 (Launch) ← Requires Phases 3 & 4 complete
```

**Critical Path:**  
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 5  
Estimated: 16 weeks with 2 developers

---

## 7. Risk Management & Assumptions (RAID Log)

### 7.1 Risks

| ID | Risk | Probability | Impact | Mitigation Strategy | Owner |
|----|------|-------------|---------|---------------------|-------|
| R-01 | AI API rate limits exceeded | Medium | High | Implement exponential backoff, queue system, upgrade to paid tier at 500 users | Backend Lead |
| R-02 | AI generation quality inconsistent | High | High | Extensive prompt engineering, human review loop, feedback mechanism | Product Manager |
| R-03 | User abandons during long wait times | High | Medium | Add progress indicators, set expectations (15-30s), optimize prompts for speed | UX Designer |
| R-04 | Database performance degrades at scale | Low | High | Implement read replicas, connection pooling, query optimization | Backend Lead |
| R-05 | Security vulnerability in document storage | Low | Critical | Regular security audits, penetration testing, bug bounty program | Security Engineer |
| R-06 | Database/host outage impacts service | Low | High | Implement graceful degradation, status page, backup/restore procedures | DevOps |
| R-07 | Users don't understand mode selection | Medium | Medium | Add onboarding tutorial, tooltips, default to Plain mode | Product Manager |
| R-08 | PDF generation fails on mobile browsers | Medium | Low | Fallback to Markdown, test on all major browsers | Frontend Lead |
| R-09 | Scope creep delays launch | High | Medium | Strict feature freeze after Phase 4, defer enhancements to post-launch | Product Manager |
| R-10 | Competition launches similar product | Medium | Medium | Focus on UX differentiation, fast iteration, community building | Product Manager |
| R-11 | Document markers not parsed correctly | Medium | High | Robust parsing logic, extensive testing, fallback extraction methods | Backend Lead |

### 7.2 Assumptions

| ID | Assumption | Validation Method | Impact if Wrong |
|----|------------|-------------------|-----------------|
| A-01 | Users will spend 15-30 min per document | Beta user testing | Need to simplify Q&A if time exceeds 45 min |
| A-02 | Gemini 2.5 Flash provides sufficient quality | Comparative testing with GPT-4 | May need to upgrade model, increasing costs |
| A-03 | 80% of users prefer Plain mode | User surveys | May need to rebalance development effort |
| A-04 | Users will approve documents on first generation | Analytics tracking | May need to improve regeneration UX |
| A-05 | 2-5 questions sufficient for quality docs | Document quality reviews | May need to increase questions, impacting time |
| A-06 | Markdown export is sufficient for MVP | User feedback | May need to prioritize PDF earlier |
| A-07 | Managed Postgres free tier handles 1000 users | Load testing | May need to upgrade sooner, impacting runway |
| A-08 | Users understand business requirements concepts | User research | May need educational content/glossary |
| A-09 | Document generation completes within 30s | Performance testing | May need streaming responses or background jobs |
| A-010 | OAuth not critical for MVP | Beta user feedback | May need to implement earlier if auth friction high |
| A-011 | Document markers won't confuse users | User testing | May need to hide markers in UI display |
| A-012 | Full document context improves AI quality | A/B testing | May need alternative context selection strategies |

### 7.3 Issues

| ID | Issue | Status | Priority | Resolution |
|----|-------|--------|----------|-----------|
| I-01 | No design system defined yet | Open | P0 | Use Tailwind utilities; component library is not allowed per rules |
| I-02 | PDF library not selected | Open | P1 | Evaluate jsPDF vs Puppeteer by Week 6 |
| I-03 | No error monitoring tool chosen | Open | P1 | Set up Sentry by end of Phase 1 |
| I-04 | Unclear who owns content/prompts | Open | P0 | Product Manager owns, with developer input |
| I-05 | No load testing infrastructure | Open | P2 | Plan load tests for Phase 5, use k6 |
| I-06 | Document marker format not finalized | Open | P0 | Use << >> format, validate in Week 3 |
| I-07 | Context window limits for large documents | Open | P1 | Implement chunking strategy if needed |

### 7.4 Dependencies

| ID | Dependency | Type | Owner | Status | Impact |
|----|------------|------|-------|--------|--------|
| D-01 | OpenRouter API access | External | Backend Lead | Active | Blocker - no AI without this |
| D-02 | Database provisioning (Postgres + Prisma) | External | DevOps | Active | Blocker - no backend without this |
| D-03 | Design mockups for key screens | Internal | UX Designer | Pending | High - delays frontend dev |
| D-04 | Content for system prompts | Internal | Product Manager | Pending | High - determines quality |
| D-05 | Legal review of terms of service | External | Legal Team | Pending | Medium - needed before public launch |
| D-06 | Domain name registration | External | Marketing | Pending | Low - can use temporary domain |
| D-07 | Payment processing (future) | External | Finance | Not Started | Low - not needed for MVP |
| D-08 | Mobile app developer (future) | Internal | Hiring | Not Started | Low - post-launch consideration |

### 7.5 Mitigation Strategies Detail

#### For R-02 (AI Quality Inconsistency)

**Strategy 1: Prompt Engineering Framework**
- Create prompt template library with variables
- A/B test prompt variations with beta users
- Maintain prompt changelog in Git
- Implement marker-based extraction for reliability

**Strategy 2: Human-in-the-Loop**
- Add "Report Quality Issue" button
- PM reviews flagged outputs weekly
- Iterate prompts based on patterns

**Strategy 3: Fallback Mechanisms**
- If generation fails 3 times, offer manual template
- Provide "guide me through manual creation" option

#### For R-03 (User Abandonment)

**Strategy 1: Expectation Setting**
- Show "This will take about 20 seconds" before generation
- Animated progress bar with messages: "Analyzing your responses...", "Generating structure...", "Finalizing document..."

**Strategy 2: Optimize for Speed**
- Set `max_tokens` appropriately (not too high)
- Use streaming responses to show incremental progress
- Investigate faster model for non-technical users

**Strategy 3: Engagement During Wait**
- Show tips about next steps
- Preview document sections as they generate

#### For R-01 (API Rate Limits)

**Strategy 1: Tiered Limits**
- Free users: 5 documents/day
- Paid users: Unlimited (use paid API tier)

**Strategy 2: Queue System**
- Implement job queue (Bull/BullMQ)
- Show queue position to user
- Process FIFO with priority for paid users

**Strategy 3: Caching**
- Cache similar Q&A patterns
- Reuse document templates where appropriate

#### For R-11 (Document Marker Parsing)

**Strategy 1: Robust Parsing**
- Use regex with fallback patterns
- Validate marker presence before extraction
- Log parsing failures for analysis

**Strategy 2: Testing**
- Unit tests for various marker scenarios
- Edge cases: missing markers, multiple markers, malformed markers
- Integration tests with real AI responses

**Strategy 3: Fallback**
- If markers not found, use full response
- Provide manual extraction tool in admin panel

---

## 8. Success Metrics & KPIs

### 8.1 Product Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **User Acquisition** | 1,000 sign-ups in first month | Analytics |
| **Activation Rate** | 70% complete first BRD | Funnel analysis |
| **Time to First Document** | < 25 minutes average | User session tracking |
| **Document Quality Score** | > 4.0/5.0 user rating | In-app surveys |
| **Feature Adoption (PRD)** | 60% of BRD users create PRD | Feature usage analytics |
| **Technical Mode Adoption** | 30% of users select Technical | Mode selection tracking |
| **Retention (7-day)** | 40% return within 7 days | Cohort analysis |
| **Retention (30-day)** | 25% return within 30 days | Cohort analysis |
| **NPS Score** | > 50 | Quarterly NPS survey |
| **Error Rate** | < 2% of sessions | Error logging |
| **Document Marker Success Rate** | > 99% | Backend logging |
| **Context Inclusion Rate** | 100% for PRD/Tasks | AI prompt logging |

### 8.2 Business Metrics (Future)

| Metric | Target | Timeframe |
|--------|--------|-----------|
| **Conversion to Paid** | 5% of free users | Post-monetization |
| **Monthly Recurring Revenue** | $10K MRR | 6 months post-launch |
| **Customer Acquisition Cost** | < $50 | Ongoing |
| **Lifetime Value** | > $200 | 12 months |
| **Churn Rate** | < 5% monthly | Ongoing |

### 8.3 Technical Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **API Uptime** | 99.9% | < 99.5% |
| **Average Response Time** | < 200ms (API) | > 500ms |
| **P95 Response Time** | < 1s | > 2s |
| **Error Rate** | < 0.5% | > 1% |
| **AI Generation Success Rate** | > 98% | < 95% |
| **Database Query Performance** | < 100ms P95 | > 200ms |
| **Session Duration** | 30-45 minutes average | Track trends |

---

## 9. Open Questions & Decisions Needed

### 9.1 Product Decisions

| Question | Options | Decision Maker | Deadline |
|----------|---------|----------------|----------|
| Should we allow editing specific sections of documents? | Yes (complex) / No (simple, regenerate only) | Product Manager | Week 2 |
| How many questions is optimal per document? | 3 / 4 / 5 / Variable | Product Manager + UX | Week 3 |
| Should we support document collaboration? | MVP: No / Post-launch / Never | Product Manager | Week 4 |
| Do we need document templates? | MVP: No / Phase 2 / Phase 3 | Product Manager | Week 6 |
| Should admins be able to view user documents? | Yes with consent / No / Anonymized only | Legal + Product | Week 1 |
| Should markers be visible to users? | Hide in UI / Show with toggle / Always visible | Product Manager | Week 3 |
| How to handle marker extraction failures? | Show full response / Retry / Manual extraction | Product Manager | Week 4 |

### 9.2 Technical Decisions

| Question | Options | Decision Maker | Deadline |
|----------|---------|----------------|----------|
| PDF generation: client or server? | Client (jsPDF) / Server (Puppeteer) | Tech Lead | Week 6 |
| Real-time updates or polling? | WebSockets / Polling / Hybrid | Tech Lead | Week 3 |
| Error logging service? | Sentry / LogRocket / Datadog | DevOps | Week 5 |
| CDN for static assets? | Vercel default / Cloudflare / None | DevOps | Week 4 |
| Testing strategy? | Unit + E2E / Unit only / Manual | Tech Lead | Week 2 |
| Document marker format? | << >> / {{ }} / ### ### / Custom | Tech Lead | Week 2 |
| Context chunking strategy? | Full document / Smart chunking / Summary | Tech Lead | Week 5 |

### 9.3 Business Decisions

| Question | Options | Decision Maker | Deadline |
|----------|---------|----------------|----------|
| Pricing model? | Freemium / Free trial + paid / Free only | CEO + Product | Week 10 |
| Target customer segment first? | Startups / Enterprises / Both | CEO | Week 1 |
| Go-to-market strategy? | Product Hunt / Direct sales / Content marketing | Marketing | Week 8 |
| Support model? | Email only / Chat / Community forum | Operations | Week 12 |

---

## 10. Appendices

### Appendix A: Glossary

- **BRD:** Business Requirements Document - defines business objectives and needs
- **PRD:** Product Requirements Document - defines product features and specifications
- **Plain Mode:** Simplified interface for non-technical users
- **Technical Mode:** Advanced interface with technical details for developers
- **Generation State:** Current phase of document creation (collecting, generating, ready, approved, refining)
- **Edge Function:** Serverless function running close to users (Supabase/Deno)
- **Row Level Security (RLS):** Database security ensuring users only access their own data
- **Kano Model:** Framework for categorizing features by customer satisfaction
- **Document Markers:** Special tags (e.g., <<BRD_START>>, <<BRD_END>>) used to identify and extract generated content
- **Full Context:** Including complete previous documents (BRD/PRD) in AI prompts for better generation quality

### Appendix B: References

- [OpenRouter API Docs](https://openrouter.ai/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Kano Model Methodology](https://en.wikipedia.org/wiki/Kano_model)
- [Gherkin Syntax Reference](https://cucumber.io/docs/gherkin/reference/)

### Appendix C: Team Structure

**Recommended Team:**
- 1 Product Manager (Jaehee Song)
- 2 Full-Stack Developers (Next.js + TypeScript + Prisma)
- 1 UX/UI Designer (part-time)
- 1 DevOps Engineer (part-time, for production setup)

---

## Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Manager | Jaehee Song | ___________ | _________ |
| Engineering Lead | [TBD] | ___________ | _________ |
| UX/UI Designer | [TBD] | ___________ | _________ |
| Stakeholder | [TBD] | ___________ | _________ |

---

**Document Control:**
- **Version:** 1.0
- **Last Updated:** October 24, 2025
- **Next Review:** November 1, 2025
- **Distribution:** Engineering Team, Design Team, Stakeholders

---

*This PRD is a living document and will be updated as the product evolves. All changes should be tracked in version control and communicated to relevant stakeholders.*