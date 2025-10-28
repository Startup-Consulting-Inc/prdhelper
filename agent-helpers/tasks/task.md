# PRD Helper - Implementation Task List

## Prototype Overview

PRD Helper is an AI-powered application that guides users through creating Business Requirements Documents (BRD), Product Requirements Documents (PRD), Technical Task Lists, and Vibe Coding Prompts via intelligent wizards.

**Current Status**: Production-ready MVP with comprehensive features deployed.

**Key Features Implemented**:
- **Dual-Mode Workflows**: Plain Mode (BRD → PRD → Vibe Coding Prompt) and Technical Mode (BRD → PRD → Task List)
- **Document Management**: Full regeneration capability with optional feedback, version history, and restore functionality
- **Admin Dashboard**: User management, system prompt editing with version control, token usage tracking, audit logs
- **Vibe Coding Integration**: Generates production-ready prompts for Loveable, V0, and Bolt AI coding tools
- **Advanced Features**: Document versioning, automatic version saving on regeneration, version preview and restore

**Technology Stack**: Express.js backend with TypeScript, React 18 frontend with Vite, Prisma ORM with PostgreSQL, tRPC for type-safe APIs, OpenRouter for AI generation (Claude-3.5-Sonnet), Tailwind CSS with custom design system, comprehensive testing with Vitest and Playwright.

**Development Philosophy**: Evidence-based implementation with comprehensive testing, accessibility-first design (WCAG compliant), professional UI/UX with dark mode support, production-grade error handling and validation.

---

# Recent Implementations (October 2025)

## 1. Vibe Coding Prompt Build Feature
**Status**: ✅ Complete
**Migrations**: 20251027213104, 20251027223736, 20251027213200

### Database Changes
- Added `PROMPT_BUILD` to DocumentType enum
- Added `PROMPT_BUILD_GENERATING` and `PROMPT_BUILD_READY` to ProjectPhase enum
- Added `PROMPT_BUILD` to PromptType enum
- Created default system prompt for Prompt Build in seed data

### Backend Implementation
- **documentGenerator.ts**: New `generatePromptBuild()` function
  - Generates comprehensive prompts for vibe coding tools (Loveable, V0, Bolt)
  - Takes PRD and optional BRD as context
  - Uses markers: `<<PROMPT_BUILD_START>>` and `<<PROMPT_BUILD_END>>`
  - Temperature: 0.7, Max tokens: 5000

- **stateMachine.ts**: Updated phase transitions
  - Plain Mode: PRD_APPROVED → PROMPT_BUILD_GENERATING → PROMPT_BUILD_READY → COMPLETED
  - Technical Mode: PRD_APPROVED → TASKS_GENERATING → TASKS_READY → COMPLETED
  - Added labels and progress percentages for new phases

- **ai.ts router**: New `generatePromptBuild` mutation
  - Validates PRD approval
  - Retrieves PROMPT_BUILD system prompt based on project mode
  - Calls generatePromptBuild service
  - Creates document with type PROMPT_BUILD
  - Tracks token usage
  - Creates audit log

### Frontend Implementation
- **DocumentViewPage.tsx**: Enhanced to support PROMPT_BUILD type
  - Special display label: "Vibe Coding Prompt"
  - Contextual help text for copy-paste usage
  - Download and copy functionality

- **ProjectDetailPage.tsx**: Workflow integration
  - Shows "Generate Prompt Build" for Plain Mode after PRD approval
  - Automatic phase progression
  - Visual indicators for completion status

### User Experience
- After approving PRD in Plain Mode, users get "Generate Prompt Build" option
- Generated prompt is production-ready for AI coding tools
- Designed to create complete, deployable web services
- Clear instructions for using with Loveable, V0, or Bolt

---

## 2. Document Regeneration Feature
**Status**: ✅ Complete
**Implementation Date**: October 27, 2025

### Core Functionality
- **Regenerate Button**: Added to all document types (BRD, PRD, TASKS, PROMPT_BUILD)
- **Feedback Modal**: Optional user feedback for regeneration improvements
- **Direct Generation**: AI generates directly without asking questions (fixed wizard mode behavior)

### Backend Implementation
- **ai.ts router**: Enhanced `regenerateDocument` mutation
  - Added explicit instructions to override question-asking behavior
  - Appends: `**IMPORTANT: This is a regeneration request. Do NOT ask questions. Generate the complete [TYPE] document directly...`
  - Applied to all document types: BRD (line 547-549), PRD (591-593), PROMPT_BUILD (627-629), TASKS (664-666)
  - Supports optional feedback parameter for targeted improvements
  - Increments version number automatically
  - Sets status to DRAFT (requires re-approval)

### Document Type Specific Handling
- **BRD Regeneration**: Uses conversation history
- **PRD Regeneration**: Includes approved BRD context
- **PROMPT_BUILD Regeneration**: Includes PRD and BRD context
- **TASKS Regeneration**: Includes PRD and BRD context

### User Flow
1. User opens document view
2. Clicks "Regenerate" button
3. Modal appears with optional feedback textarea
4. User can provide specific improvement instructions (e.g., "Make it more concise", "Add security details")
5. System generates new version directly
6. Previous version automatically saved to history
7. New version ready for review

---

## 3. Document Version History System
**Status**: ✅ Complete
**Migration**: 20251027170107_add_document_versions

### Database Schema
```prisma
model DocumentVersion {
  id         String         @id @default(cuid())
  documentId String         @map("document_id")
  version    Int
  content    String         @db.Text
  rawContent String         @db.Text @map("raw_content")
  status     DocumentStatus
  approvedAt DateTime?      @map("approved_at")
  createdBy  String         @map("created_by")
  createdAt  DateTime       @default(now()) @map("created_at")

  document Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  user     User     @relation(fields: [createdBy], references: [id])

  @@index([documentId])
  @@index([version])
  @@map("document_versions")
}
```

### Backend Implementation

#### documents.ts Router - New Endpoints
1. **getVersionHistory** (line 264-302)
   - Input: documentId
   - Returns: Array of all versions with user metadata
   - Ordered by version descending (newest first)
   - Includes: version number, status, content, creator name/email, timestamp

2. **getVersion** (line 308-342)
   - Input: versionId
   - Returns: Specific version with full details
   - Includes document and project context
   - Used for version preview

3. **restoreVersion** (line 348-416)
   - Input: versionId
   - Process:
     1. Saves current document version to history
     2. Restores selected version content as current
     3. Increments version number
     4. Sets status to DRAFT
     5. Clears approvedAt timestamp
     6. Creates audit log entry
   - Returns: Updated document

#### ai.ts Router - Automatic Versioning
- **regenerateDocument mutation** (line 694-705)
  - Before updating document, automatically saves current version:
  ```typescript
  await ctx.prisma.documentVersion.create({
    data: {
      documentId: existingDoc.id,
      version: existingDoc.version,
      content: existingDoc.content,
      rawContent: existingDoc.rawContent,
      status: existingDoc.status,
      approvedAt: existingDoc.approvedAt,
      createdBy: ctx.user.id,
    },
  });
  ```
  - Then updates document with new content and incremented version

### Frontend Implementation

#### VersionHistory.tsx Component
**Location**: `client/src/components/document/VersionHistory.tsx`

**Features**:
- Split-view layout:
  - Left panel: List of all versions
  - Right panel: Selected version content preview
- Version list shows:
  - Version number with badge
  - Status (DRAFT/APPROVED) with icons
  - Creation timestamp
  - Creator name
- Actions per version:
  - **View**: Preview content without restoring
  - **Restore**: Revert to this version (with confirmation)
- Confirmation dialog before restoration
- Success/error messaging
- Loading states for async operations

#### DocumentViewPage.tsx Integration
**Location**: `client/src/pages/DocumentViewPage.tsx`

**Changes**:
- Added "History" button in header (line 174-181)
- Added `showVersionHistory` state
- Integrated VersionHistory modal (line 268-277)
- Success message on version restore
- Automatic data refresh after restore

### User Experience
1. **Viewing History**: Click "History" button → See all versions in chronological order
2. **Previewing Version**: Click "View" → See full content in right panel
3. **Restoring Version**: Click "Restore" → Confirm → Version restored as new current version
4. **Automatic Versioning**: Any regeneration automatically saves previous version

### Audit Trail
- All version creations logged with creator user ID
- Restore operations logged in AuditLog table
- Details include: documentId, projectId, restoredVersion, newVersion
- IP address tracking for security

---

## 4. Admin Features Enhancement
**Status**: ✅ Complete
**Migrations**: 20251027192249, 20251027211952

### Token Usage Tracking
**Migration**: 20251027192249_add_token_usage

#### Database Schema
```prisma
model TokenUsage {
  id          String   @id @default(cuid())
  userId      String   @map("user_id")
  projectId   String?  @map("project_id")
  operation   String   // BRD_GENERATION, PRD_GENERATION, TASKS_GENERATION, ASK_QUESTION
  model       String   // AI model used
  tokensUsed  Int      @map("tokens_used")
  cost        Float    // Estimated cost in USD
  createdAt   DateTime @default(now()) @map("created_at")

  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  project Project? @relation(fields: [projectId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([projectId])
  @@index([operation])
  @@index([createdAt])
}
```

#### Implementation
- **tokenTracker.ts service**: Centralized token tracking
- Automatic tracking on all AI operations:
  - Question generation
  - Document generation (BRD, PRD, TASKS, PROMPT_BUILD)
  - Document regeneration
- Cost estimation based on model pricing
- Per-user and per-project analytics
- Admin dashboard integration for monitoring

### Prompt Version History
**Migration**: 20251027211952_add_prompt_version_history

#### Database Schema
```prisma
model PromptVersion {
  id             String       @id @default(cuid())
  promptId       String       @map("prompt_id")
  prompt         String       @db.Text
  version        Int
  createdBy      String       @map("created_by")
  createdAt      DateTime     @default(now()) @map("created_at")

  systemPrompt SystemPrompt @relation(fields: [promptId], references: [id], onDelete: Cascade)
  creator      User         @relation(fields: [createdBy], references: [id], onDelete: Cascade)
}
```

#### Features
- Automatic version saving when admin edits system prompts
- View full history of prompt changes
- Revert to previous prompt versions
- Track who made changes and when
- Audit trail for compliance

### Admin Dashboard Components
- **SystemPromptsManagement**: Edit prompts with real-time preview
- **PromptVersionHistory**: View and restore prompt versions
- **TokenUsageTable**: Monitor AI token consumption and costs
- **UserManagement**: Manage users and permissions
- **AuditLog**: Complete system activity log

---

## Complete User Workflow (As Implemented)

### Plain Mode Workflow (Non-Technical Users)
```
1. Create Project (mode: PLAIN)
   ↓
2. BRD Wizard (Q&A with AI)
   ↓
3. Generate BRD
   - Option: Regenerate with feedback
   - Option: View version history
   ↓
4. Approve BRD
   ↓
5. PRD Wizard (Q&A with AI)
   ↓
6. Generate PRD
   - Option: Regenerate with feedback
   - Option: View version history
   ↓
7. Approve PRD
   ↓
8. Generate Prompt Build (Automatic)
   - Creates vibe coding prompt
   - Ready for Loveable, V0, Bolt
   - Option: Regenerate with feedback
   - Option: View version history
   ↓
9. Project Complete
```

### Technical Mode Workflow (Developers)
```
1. Create Project (mode: TECHNICAL)
   ↓
2. BRD Wizard (Q&A with AI)
   ↓
3. Generate BRD
   - Option: Regenerate with feedback
   - Option: View version history
   ↓
4. Approve BRD
   ↓
5. PRD Wizard (Q&A with AI)
   ↓
6. Generate PRD
   - Option: Regenerate with feedback
   - Option: View version history
   ↓
7. Approve PRD
   ↓
8. Generate Task List
   - Creates technical task breakdown
   - Includes priorities, dependencies, tags
   - Option: Regenerate with feedback
   - Option: View version history
   ↓
9. Project Complete
```

### Project Phase State Machine
```typescript
BRD_QUESTIONS
  ↓ (generate)
BRD_GENERATING
  ↓ (complete)
BRD_READY
  ↓ (approve) or (regenerate → BRD_GENERATING)
BRD_APPROVED
  ↓ (start PRD)
PRD_QUESTIONS
  ↓ (generate)
PRD_GENERATING
  ↓ (complete)
PRD_READY
  ↓ (approve) or (regenerate → PRD_GENERATING)
PRD_APPROVED
  ↓
  ├─ Plain Mode → PROMPT_BUILD_GENERATING → PROMPT_BUILD_READY → COMPLETED
  └─ Technical Mode → TASKS_GENERATING → TASKS_READY → COMPLETED
```

---

## Key Implementation Details

### Document Regeneration Flow
1. User clicks "Regenerate" on any document
2. System prompts for optional feedback
3. Backend:
   - Saves current version to `document_versions` table
   - Retrieves appropriate system prompt
   - Adds explicit instruction: "Do NOT ask questions. Generate directly."
   - Includes user feedback if provided
   - Calls AI with full context (conversation + previous docs)
   - Extracts generated content
   - Updates document:
     - Increments version number
     - Sets status to DRAFT
     - Clears approvedAt timestamp
   - Tracks token usage
   - Creates audit log
4. Frontend refreshes document view
5. User reviews new version

### Version History Flow
1. User clicks "History" button
2. System fetches all versions via `getVersionHistory` endpoint
3. Display split view:
   - Left: Version list (newest first)
   - Right: Selected version preview
4. User selects version and clicks "Restore"
5. Backend:
   - Saves current version to history
   - Restores selected version as current
   - Increments version number
   - Sets status to DRAFT
   - Creates audit log with details
6. Frontend shows success message
7. Document view refreshes with restored content

### Admin System Prompt Management
1. Admin navigates to Prompts page
2. Views all 6 prompt types:
   - BRD_PLAIN
   - BRD_TECHNICAL
   - PRD_PLAIN
   - PRD_TECHNICAL
   - TASKS
   - PROMPT_BUILD
3. Edits prompt with live preview
4. On save:
   - System creates PromptVersion record
   - Updates SystemPrompt table
   - Creates audit log
   - Refreshes admin view
5. Admin can view version history
6. Admin can restore previous versions

---

# Implementation Checklist

## Phase 0: Project Setup & Configuration

### Infrastructure
- [ ] Initialize Next.js 14 project with TypeScript and App Router
- [ ] Configure Tailwind CSS with custom design tokens (avoid purple, use neutral palette)
- [ ] Install and configure shadcn/ui component library
- [ ] Set up ESLint and Prettier with project-specific rules
- [ ] Configure environment variables structure (.env.example, .env.local)
- [ ] Set up Git repository with .gitignore for Next.js
- [ ] Create project directory structure (/app, /components, /lib, /prisma, /public)

### Database Setup
- [ ] Install Prisma and initialize with PostgreSQL
- [ ] Create initial Prisma schema with User, Project, Document models
- [ ] Set up database connection configuration
- [ ] Create first migration for base schema
- [ ] Configure Prisma Client generation

### Authentication
- [ ] Install NextAuth.js v5 (Auth.js)
- [ ] Configure NextAuth with email/password provider
- [ ] Add Google OAuth provider
- [ ] Add GitHub OAuth provider
- [ ] Set up JWT session strategy
- [ ] Create auth configuration file (auth.config.ts)
- [ ] Implement password hashing with bcrypt
- [ ] Add role-based access control (User, Admin)

### AI Integration
- [ ] Set up OpenRouter API client
- [ ] Configure AI model selection (Claude-3.5-Sonnet as default)
- [ ] Create AI service utility with error handling
- [ ] Implement streaming response support
- [ ] Add API rate limiting configuration
- [ ] Create prompt templates structure

### Development Tools
- [ ] Set up Storybook for component development
- [ ] Configure Storybook with Tailwind and dark mode
- [ ] Install and configure testing libraries (Jest, React Testing Library)
- [ ] Set up Playwright for E2E testing
- [ ] Configure screenshot tool for visual QA
- [ ] Add development scripts to package.json

---

## Phase 1: Core UI Components (Atoms)

### Basic Components
- [ ] **src/components/ui/Button.tsx** — Primary/secondary/ghost variants with sizes (sm, md, lg), loading and disabled states, Tailwind styling; optional lucide-react icons (left/right); props: variant ("primary" | "secondary" | "ghost" | "outline"), size ("sm" | "md" | "lg"), isLoading?, iconLeft?, iconRight?, aria-label for icon-only.
- [ ] **src/stories/ui/Button.stories.tsx** — CSF3 with Autodocs; stories: Default (primary, md), All variants (primary, secondary, ghost, outline), Sizes (sm, md, lg), Edge cases (icon-only, loading, disabled, long text wrap), A11y (keyboard focus, aria-label).

- [ ] **src/components/ui/Input.tsx** — Labeled text/email/password input with id, name, type, value, onChange, placeholder, helperText?, errorText?; accessible label association; Tailwind: rounded-md, focus ring, error color; dark mode support.
- [ ] **src/stories/ui/Input.stories.tsx** — CSF3; stories: Default (text), Types (email, password, number), Error state, Helper text, Disabled, A11y (label association).

- [ ] **src/components/ui/Textarea.tsx** — Multi-line text input with label, rows (default 4), maxLength?, characterCount?, errorText?; auto-resize option; Tailwind styled.
- [ ] **src/stories/ui/Textarea.stories.tsx** — CSF3; stories: Default, With character count, Max length, Auto-resize, Error state, A11y.

- [ ] **src/components/ui/Select.tsx** — Accessible select with label, value, onChange, options: { label, value }[], placeholder?, errorText?, helperText?; keyboard friendly; Tailwind styled.
- [ ] **src/stories/ui/Select.stories.tsx** — CSF3; stories: Default, With groups, Error state, Long labels, A11y (aria-describedby).

- [ ] **src/components/ui/Card.tsx** — Container with optional header and footer; props: title?, description?, children, footer?, className?; Tailwind: rounded-lg, border, shadow-sm, dark mode.
- [ ] **src/stories/ui/Card.stories.tsx** — CSF3; stories: Default, With header/footer, No header, Long content, A11y (semantic headings).

- [ ] **src/components/ui/Badge.tsx** — Status/mode indicator; props: variant ("default" | "primary" | "success" | "warning" | "error"), size ("sm" | "md"), children; Tailwind tokenized colors.
- [ ] **src/stories/ui/Badge.stories.tsx** — CSF3; stories: All variants, Sizes, Long text, A11y (contrast check).

- [ ] **src/components/ui/Progress.tsx** — Progress bar with percentage; props: value (0-100), label?, showValue?, size ("sm" | "md" | "lg"); accessible role="progressbar".
- [ ] **src/stories/ui/Progress.stories.tsx** — CSF3; stories: Default (50%), 0%, 100%, With label, Sizes, A11y.

- [ ] **src/components/ui/Spinner.tsx** — Loading spinner; props: size ("sm" | "md" | "lg"), label? (visually hidden); lucide-react Loader2 with animation.
- [ ] **src/stories/ui/Spinner.stories.tsx** — CSF3; stories: Sizes, With label, A11y (screen reader text).

- [ ] **src/components/ui/Alert.tsx** — Alert/notification component; props: variant ("info" | "success" | "warning" | "error"), title?, children, onClose?; icons from lucide-react.
- [ ] **src/stories/ui/Alert.stories.tsx** — CSF3; stories: All variants, Dismissible, Long content, A11y (role="alert").

- [ ] **src/components/ui/Tooltip.tsx** — Hover tooltip using Radix UI; props: content, children, side ("top" | "right" | "bottom" | "left"); accessible with aria-describedby.
- [ ] **src/stories/ui/Tooltip.stories.tsx** — CSF3; stories: All sides, Long content, A11y.

- [ ] **src/components/ui/Dialog.tsx** — Modal dialog using Radix UI; props: open, onOpenChange, title, description?, children, footer?; focus trap, ESC to close.
- [ ] **src/stories/ui/Dialog.stories.tsx** — CSF3; stories: Default, With footer, Long content, A11y (focus management).

### Icon Components
- [ ] **src/components/ui/Icon.tsx** — Wrapper for lucide-react icons; props: name (icon name), size?, className?; consistent sizing.
- [ ] Configure lucide-react icons: FileText (BRD), Layers (PRD), ListChecks (Tasks), Code (Technical Mode), User (Plain Mode), ChevronRight, Check, X, AlertCircle, Info, TrendingUp, Calendar, Settings, Download, Upload, Edit, Trash2.

---

## Phase 2: Composite Components (Molecules)

### Form Components
- [ ] **src/components/common/FormField.tsx** — Form field wrapper with label, input/select/textarea, error message, helper text; uses React Hook Form integration.
- [ ] **src/stories/common/FormField.stories.tsx** — CSF3; stories: Text input, Select, Textarea, With error, A11y.

- [ ] **src/components/common/RadioGroup.tsx** — Radio button group; props: options: { value, label, description? }[], value, onChange; Radix UI Radio.
- [ ] **src/stories/common/RadioGroup.stories.tsx** — CSF3; stories: Default, With descriptions, Disabled option, A11y.

- [ ] **src/components/common/OptionCard.tsx** — Selectable card for Q&A options; props: title, description?, icon?, selected, onClick; hover/focus states, checkmark when selected.
- [ ] **src/stories/common/OptionCard.stories.tsx** — CSF3; stories: Default, Selected, With icon, Long text, A11y (keyboard navigation).

### Navigation Components
- [ ] **src/components/common/Breadcrumb.tsx** — Breadcrumb navigation; props: items: { label, href? }[]; uses lucide-react ChevronRight separator.
- [ ] **src/stories/common/Breadcrumb.stories.tsx** — CSF3; stories: Default, Long path, Current page, A11y (aria-current).

- [ ] **src/components/common/Tabs.tsx** — Tab navigation using Radix UI; props: tabs: { value, label, content }[], defaultValue; accessible keyboard navigation.
- [ ] **src/stories/common/Tabs.stories.tsx** — CSF3; stories: Default, Many tabs, A11y (roving focus).

- [ ] **src/components/common/Stepper.tsx** — Multi-step progress indicator; props: steps: { label, status: "complete" | "current" | "upcoming" }[]; visual connector lines.
- [ ] **src/stories/common/Stepper.stories.tsx** — CSF3; stories: Step 1 of 3, Step 2 of 3, Completed, A11y.

### Display Components
- [ ] **src/components/common/StatCard.tsx** — Metric display card; props: label, value, change? (% change), icon?, trend ("up" | "down" | "neutral"); lucide-react TrendingUp/Down.
- [ ] **src/stories/common/StatCard.stories.tsx** — CSF3; stories: Default, With trend, Large numbers, A11y.

- [ ] **src/components/common/EmptyState.tsx** — Empty state illustration; props: icon, title, description, action? (button config); centered layout.
- [ ] **src/stories/common/EmptyState.stories.tsx** — CSF3; stories: No projects, No documents, With action, A11y.

- [ ] **src/components/common/DocumentPreview.tsx** — Markdown document preview; uses react-markdown with syntax highlighting; props: content, maxHeight?; scrollable.
- [ ] **src/stories/common/DocumentPreview.stories.tsx** — CSF3; stories: Short doc, Long doc, With code blocks, A11y.

---

## Phase 3: Feature Components (Organisms)

### Authentication Components
- [ ] **src/components/auth/LoginForm.tsx** — Email/password login form; uses React Hook Form + Zod validation; email and password fields, remember me checkbox, submit button with loading state; error handling.
- [ ] **src/stories/auth/LoginForm.stories.tsx** — CSF3; stories: Default, With error, Loading state, A11y.

- [ ] **src/components/auth/SignupForm.tsx** — Registration form; fields: name, email, password, confirm password; mode preference selection (Plain/Technical); validation with password strength indicator.
- [ ] **src/stories/auth/SignupForm.stories.tsx** — CSF3; stories: Default, Validation errors, Strong password, A11y.

- [ ] **src/components/auth/OAuthButtons.tsx** — Social login buttons; Google and GitHub OAuth; uses NextAuth signIn; loading states; error handling.
- [ ] **src/stories/auth/OAuthButtons.stories.tsx** — CSF3; stories: Default, Loading, Error, A11y.

- [ ] **src/components/auth/AuthLayout.tsx** — Auth page layout; split layout with branding on left, form on right; responsive (stack on mobile); dark mode support.
- [ ] **src/stories/auth/AuthLayout.stories.tsx** — CSF3; stories: Login page, Signup page, Mobile view, A11y.

### Project Components
- [ ] **src/components/project/ProjectCard.tsx** — Project card for dashboard; displays title, creation date, status, progress, last modified; actions: view, archive, delete; hover effects.
- [ ] **src/stories/project/ProjectCard.stories.tsx** — CSF3; stories: In progress, Completed, Recently created, With long title, A11y.

- [ ] **src/components/project/CreateProjectDialog.tsx** — Modal for new project creation; fields: title (max 200 chars), initial idea (max 2000 chars, textarea with character count), mode selection (Plain/Technical with radio cards); validation.
- [ ] **src/stories/project/CreateProjectDialog.stories.tsx** — CSF3; stories: Default, With validation, Character limits, A11y.

- [ ] **src/components/project/ProjectList.tsx** — Grid/list of project cards; empty state when no projects; filters: all, in-progress, completed; sort: newest, oldest, name.
- [ ] **src/stories/project/ProjectList.stories.tsx** — CSF3; stories: With projects, Empty state, Filtered, A11y.

- [ ] **src/components/project/ProjectHeader.tsx** — Project detail page header; breadcrumb, title, mode badge, status indicator, action buttons (download, delete); responsive.
- [ ] **src/stories/project/ProjectHeader.stories.tsx** — CSF3; stories: Plain mode, Technical mode, Different states, A11y.

- [ ] **src/components/project/ProgressOverview.tsx** — Visual progress across document types; shows BRD (complete/in-progress/pending), PRD (locked/complete/in-progress/pending), Tasks (locked/complete/in-progress/pending in Technical Mode); uses Stepper component.
- [ ] **src/stories/project/ProgressOverview.stories.tsx** — CSF3; stories: BRD started, PRD in progress, All complete, Technical mode, A11y.

### Q&A Wizard Components
- [ ] **src/components/wizard/QuestionCard.tsx** — Single question display; props: question (text), context (additional info), examples? (array of example answers), currentStep, totalSteps; card layout with step indicator.
- [ ] **src/stories/wizard/QuestionCard.stories.tsx** — CSF3; stories: Default, With examples, No context, Last question, A11y.

- [ ] **src/components/wizard/AnswerInput.tsx** — Answer input area; supports both option cards and free-text textarea; props: answerType ("options" | "text"), options? (for option cards), value, onChange, minLength (validation); character counter for text.
- [ ] **src/stories/wizard/AnswerInput.stories.tsx** — CSF3; stories: Option cards, Free text, With validation, A11y.

- [ ] **src/components/wizard/WizardNavigation.tsx** — Navigation footer; back button (disabled on first question), next/submit button (disabled until valid answer), progress indicator (e.g., "2 of 4"); skip option for optional questions.
- [ ] **src/stories/wizard/WizardNavigation.stories.tsx** — CSF3; stories: First question, Middle question, Last question, Disabled next, A11y.

- [ ] **src/components/wizard/WizardProgress.tsx** — Visual progress bar; props: currentStep, totalSteps, completedSteps; shows answered vs remaining questions; mobile-friendly.
- [ ] **src/stories/wizard/WizardProgress.stories.tsx** — CSF3; stories: 1 of 4, 3 of 4, Completed, A11y.

- [ ] **src/components/wizard/ConversationHistory.tsx** — Collapsible list of previous Q&A exchanges; props: exchanges: { question, answer }[], onEditAnswer? (allow editing previous answers); expandable cards.
- [ ] **src/stories/wizard/ConversationHistory.stories.tsx** — CSF3; stories: Default, Many exchanges, Editable, A11y.

- [ ] **src/components/wizard/GeneratingState.tsx** — Loading state during document generation; animated spinner, progress message ("Analyzing requirements...", "Generating sections...", "Finalizing document..."); estimated time remaining.
- [ ] **src/stories/wizard/GeneratingState.stories.tsx** — CSF3; stories: Initial, Mid-generation, Almost done, A11y.

### Document Review Components
- [ ] **src/components/document/DocumentViewer.tsx** — Markdown document display with sections; props: content (markdown), documentType ("BRD" | "PRD" | "Tasks"), createdAt; table of contents sidebar on desktop; syntax highlighting for code; print-friendly.
- [ ] **src/stories/document/DocumentViewer.stories.tsx** — CSF3; stories: BRD, PRD, Task list, Long document, A11y.

- [ ] **src/components/document/DocumentActions.tsx** — Action bar for document; buttons: approve, regenerate, download (MD/PDF), edit (future); state-dependent button visibility; loading states.
- [ ] **src/stories/document/DocumentActions.stories.tsx** — CSF3; stories: Review state, Approved state, Loading, A11y.

- [ ] **src/components/document/ApprovalDialog.tsx** — Confirmation dialog for document approval; explains next steps (e.g., "Approving BRD will unlock PRD wizard"); confirm/cancel buttons; checkbox: "I have reviewed and approve this document".
- [ ] **src/stories/document/ApprovalDialog.stories.tsx** — CSF3; stories: BRD approval, PRD approval, A11y.

- [ ] **src/components/document/RegenerateDialog.tsx** — Dialog for requesting regeneration; textarea for additional context/instructions; explanation: "Provide additional details to refine the document"; cancel/regenerate buttons.
- [ ] **src/stories/document/RegenerateDialog.stories.tsx** — CSF3; stories: Default, With context, A11y.

- [ ] **src/components/document/ExportOptions.tsx** — Export format selection; radio group: Markdown, PDF; metadata options (include/exclude date, version, title); download button.
- [ ] **src/stories/document/ExportOptions.stories.tsx** — CSF3; stories: Default, PDF selected, A11y.

### Dashboard Components
- [ ] **src/components/dashboard/DashboardStats.tsx** — Key metrics overview; stat cards: total projects, documents generated, documents this month, completion rate; uses StatCard component; responsive grid.
- [ ] **src/stories/dashboard/DashboardStats.stories.tsx** — CSF3; stories: Default, New user (zeros), Active user, A11y.

- [ ] **src/components/dashboard/RecentProjects.tsx** — List of recent projects; shows 5 most recent with quick actions; link to "View all projects"; uses ProjectCard (compact variant).
- [ ] **src/stories/dashboard/RecentProjects.stories.tsx** — CSF3; stories: Default, Empty state, Few projects, A11y.

- [ ] **src/components/dashboard/QuickActions.tsx** — Quick action buttons; "Create New Project", "View All Projects", "View Documentation"; large clickable cards with icons.
- [ ] **src/stories/dashboard/QuickActions.stories.tsx** — CSF3; stories: Default, Hover states, A11y.

### Admin Components
- [ ] **src/components/admin/PromptEditor.tsx** — Admin editor for system prompts; props: promptType ("brd_plain" | "brd_technical" | "prd_plain" | "prd_technical" | "tasks"), currentPrompt, onSave; syntax highlighting for prompt variables; preview mode; save/reset buttons.
- [ ] **src/stories/admin/PromptEditor.stories.tsx** — CSF3; stories: Default, Edited, Preview mode, A11y.

- [ ] **src/components/admin/UserManagement.tsx** — Admin table of users; columns: name, email, role, projects count, last active; actions: edit role, view projects, delete; pagination; search.
- [ ] **src/stories/admin/UserManagement.stories.tsx** — CSF3; stories: Default, Many users, Search, A11y.

- [ ] **src/components/admin/SystemLogs.tsx** — Log viewer; filters: error level (info, warning, error), date range, user; real-time updates option; export logs button; pagination.
- [ ] **src/stories/admin/SystemLogs.stories.tsx** — CSF3; stories: Default, Filtered, Real-time, A11y.

### Layout Components
- [ ] **src/components/layout/AppHeader.tsx** — Main navigation header; logo, user menu (avatar dropdown: dashboard, settings, logout), dark mode toggle; responsive (hamburger menu on mobile).
- [ ] **src/stories/layout/AppHeader.stories.tsx** — CSF3; stories: Logged in, Mobile, Dark mode, A11y.

- [ ] **src/components/layout/Sidebar.tsx** — Sidebar navigation (desktop only); links: Dashboard, Projects, Settings, Admin (if role allows); active state highlighting; collapsible.
- [ ] **src/stories/layout/Sidebar.stories.tsx** — CSF3; stories: Default, Collapsed, Admin user, A11y.

- [ ] **src/components/layout/Footer.tsx** — Footer with links: About, Privacy, Terms, Contact; version number; social links; responsive.
- [ ] **src/stories/layout/Footer.stories.tsx** — CSF3; stories: Default, Mobile, A11y.

- [ ] **src/components/layout/PageContainer.tsx** — Page wrapper with consistent padding, max-width, breadcrumb slot; responsive margins.
- [ ] **src/stories/layout/PageContainer.stories.tsx** — CSF3; stories: Default, With breadcrumb, Narrow content, A11y.

---

## Phase 4: Database Schema & Models

### Prisma Schema Definition
- [ ] **prisma/schema.prisma** — Define User model: id, name, email (unique), emailVerified, image, password (nullable for OAuth), role (User/Admin), modePreference (Plain/Technical), createdAt, updatedAt; relations: projects, accounts, sessions.
- [ ] **prisma/schema.prisma** — Define Account model (NextAuth): userId, type, provider, providerAccountId, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state; relation: user.
- [ ] **prisma/schema.prisma** — Define Session model (NextAuth): sessionToken (unique), userId, expires; relation: user.
- [ ] **prisma/schema.prisma** — Define VerificationToken model (NextAuth): identifier, token (unique), expires.
- [ ] **prisma/schema.prisma** — Define Project model: id, userId, title, description (initialIdea), mode (Plain/Technical), status (active/completed/archived), currentPhase (brd_questions/brd_generating/brd_ready/brd_approved/prd_questions/prd_generating/prd_ready/prd_approved/tasks_generating/tasks_ready/completed), createdAt, updatedAt; relations: user, documents, conversations.
- [ ] **prisma/schema.prisma** — Define Document model: id, projectId, type (BRD/PRD/Tasks), content (text), rawContent (with markers, text), status (draft/approved), version, approvedAt, createdAt, updatedAt; relations: project.
- [ ] **prisma/schema.prisma** — Define Conversation model: id, projectId, documentType (BRD/PRD/Tasks), messages (JSON array: { role, content, timestamp }), createdAt, updatedAt; relation: project.
- [ ] **prisma/schema.prisma** — Define SystemPrompt model (Admin): id, type (brd_plain/brd_technical/prd_plain/prd_technical/tasks), prompt (text), isActive, createdAt, updatedAt.
- [ ] **prisma/schema.prisma** — Define AuditLog model (Admin): id, userId (nullable), action, details (JSON), ipAddress, createdAt; relation: user (optional).
- [ ] Add indexes for performance: User.email, Project.userId, Document.projectId, Session.sessionToken, VerificationToken.identifier+token.

### Database Migrations
- [ ] Create migration: `npx prisma migrate dev --name init` — Initial schema with all models.
- [ ] Create migration: Add indexes for query optimization.
- [ ] Create migration: Add full-text search indexes on Project.title, Project.description, Document.content (if PostgreSQL).
- [ ] Seed script: `prisma/seed.ts` — Create admin user, sample system prompts for each type, demo project data for testing.

### Prisma Client Configuration
- [ ] **src/lib/db.ts** — Singleton Prisma Client instance with connection pooling; error handling for connection failures; development vs production config.
- [ ] Configure Prisma Client logging: query, error, warn in development; error only in production.

---

## Phase 5: API Layer (tRPC)

### tRPC Setup
- [ ] **src/server/trpc.ts** — Initialize tRPC with context (session, db); create router and procedure helpers; publicProcedure and protectedProcedure (requires auth).
- [ ] **src/server/context.ts** — Create context with NextAuth session and Prisma client; type-safe context.
- [ ] **src/app/api/trpc/[trpc]/route.ts** — tRPC HTTP handler for App Router; handles GET/POST requests.
- [ ] **src/lib/trpc/client.tsx** — Client-side tRPC setup with React Query; hooks: trpc.useQuery, trpc.useMutation; error handling.

### Auth Router
- [ ] **src/server/routers/auth.ts** — Procedures:
  - [ ] `signUp` (public) — Input: name, email, password, modePreference; validate (Zod), hash password, create user, return success.
  - [ ] `changePassword` (protected) — Input: currentPassword, newPassword; validate current, hash new, update user.
  - [ ] `updateProfile` (protected) — Input: name?, modePreference?; update user, return updated user.
  - [ ] `deleteAccount` (protected) — Soft delete: archive projects, remove sessions, mark user as deleted.

### Projects Router
- [ ] **src/server/routers/projects.ts** — Procedures:
  - [ ] `getAll` (protected) — Query all user's projects with filters (status, mode); pagination; order by updatedAt desc.
  - [ ] `getById` (protected) — Input: projectId; return project with related documents and conversations; verify ownership.
  - [ ] `create` (protected) — Input: title, description, mode; validate, create project with status=active, currentPhase=brd_questions; return project.
  - [ ] `update` (protected) — Input: projectId, title?, description?; verify ownership, update, return project.
  - [ ] `updatePhase` (protected) — Input: projectId, newPhase; validate phase transition logic, update, return project.
  - [ ] `archive` (protected) — Input: projectId; verify ownership, set status=archived, return success.
  - [ ] `delete` (protected) — Input: projectId; verify ownership, cascade delete documents and conversations, delete project.
  - [ ] `getStats` (protected) — Return stats: total projects, completed projects, documents generated, current month activity.

### Documents Router
- [ ] **src/server/routers/documents.ts** — Procedures:
  - [ ] `getByProjectId` (protected) — Input: projectId, type?; return documents filtered by type; verify ownership.
  - [ ] `getById` (protected) — Input: documentId; return document; verify ownership via project relation.
  - [ ] `create` (protected) — Input: projectId, type, content, rawContent; verify ownership, create document with status=draft, version=1; return document.
  - [ ] `approve` (protected) — Input: documentId; verify ownership, set status=approved, approvedAt=now; update project phase to next stage; return document.
  - [ ] `regenerate` (protected) — Input: documentId, additionalContext; increment version, set status=draft, store new content; return document.
  - [ ] `exportMarkdown` (protected) — Input: documentId; verify ownership, return formatted markdown content with metadata.
  - [ ] `exportPDF` (protected) — Input: documentId; verify ownership, generate PDF (server-side with Puppeteer or client-side with jsPDF), return blob URL or base64.

### Conversations Router
- [ ] **src/server/routers/conversations.ts** — Procedures:
  - [ ] `getByProject` (protected) — Input: projectId, documentType; return conversation messages; verify ownership.
  - [ ] `addMessage` (protected) — Input: projectId, documentType, role ("user" | "assistant"), content; append to messages array, save; return updated conversation.
  - [ ] `updateMessage` (protected) — Input: conversationId, messageIndex, newContent; update specific message; return conversation.
  - [ ] `clear` (protected) — Input: projectId, documentType; clear messages array; return success.

### AI Router
- [ ] **src/server/routers/ai.ts** — Procedures:
  - [ ] `askQuestion` (protected) — Input: projectId, documentType, userAnswer?; get system prompt based on mode + documentType, retrieve conversation history, retrieve context (BRD for PRD, PRD for Tasks), call OpenRouter API, extract question from response, save assistant message, return question + options.
  - [ ] `generateDocument` (protected) — Input: projectId, documentType; validate conversation has enough data (2-5 questions answered), get system prompt, build full context with all Q&A, include previous document (BRD for PRD, PRD for Tasks), call OpenRouter streaming API, extract content between markers (<<BRD_START>>...<<BRD_END>>), create document, update project phase, return document.
  - [ ] `regenerateWithContext` (protected) — Input: documentId, additionalContext; get original conversation + document, append additional context to prompt, call OpenRouter API, extract content, increment version, save document, return updated document.
  - [ ] `generateTaskList` (protected, Technical Mode only) — Input: projectId; verify mode=Technical, get approved PRD, use tasks system prompt, call OpenRouter API, extract content between markers, parse tasks (ID, title, description, priority, effort, dependencies, tags), create document, generate kickoff prompt, return document.

### Admin Router
- [ ] **src/server/routers/admin.ts** — Procedures (all require role=Admin):
  - [ ] `getSystemPrompts` — Return all system prompts with type and isActive.
  - [ ] `updateSystemPrompt` — Input: id, prompt, isActive?; update prompt, create audit log, return prompt.
  - [ ] `getAllUsers` — Return users with project count, last login; pagination.
  - [ ] `updateUserRole` — Input: userId, newRole; update user, create audit log, return user.
  - [ ] `deleteUser` — Input: userId; cascade delete projects/documents, delete user, create audit log.
  - [ ] `getAuditLogs` — Query logs with filters (userId, action, dateRange); pagination; return logs.
  - [ ] `getSystemStats` — Return: total users, active projects, documents generated, API usage stats.

### Root Router
- [ ] **src/server/routers/_app.ts** — Combine all routers: auth, projects, documents, conversations, ai, admin; export appRouter type.

---

## Phase 6: Business Logic & Utilities

### Validation Schemas (Zod)
- [ ] **src/lib/validations/auth.ts** — Schemas: signUpSchema (name, email, password with complexity rules, modePreference), loginSchema (email, password), updateProfileSchema.
- [ ] **src/lib/validations/project.ts** — Schemas: createProjectSchema (title max 200, description max 2000, mode), updateProjectSchema.
- [ ] **src/lib/validations/document.ts** — Schemas: createDocumentSchema, approveDocumentSchema, regenerateSchema (additionalContext max 1000).
- [ ] **src/lib/validations/conversation.ts** — Schemas: addMessageSchema (content min 20 chars for user answers), updateMessageSchema.

### AI Service
- [ ] **src/lib/services/ai.ts** — Function: `generateCompletion(prompt: string, context?: string, streaming?: boolean)` — Calls OpenRouter API with Claude-3.5-Sonnet, handles streaming, error handling, retry logic (3 attempts), timeout (60s); returns completion text or stream.
- [ ] **src/lib/services/ai.ts** — Function: `extractMarkedContent(rawContent: string, startMarker: string, endMarker: string)` — Regex-based extraction; handles edge cases (missing markers, multiple markers); fallback to full content if markers not found; logs parsing failures.
- [ ] **src/lib/services/ai.ts** — Function: `buildSystemPrompt(type: string, mode: string, context?: { brd?: string, prd?: string, conversation?: Message[] })` — Retrieves system prompt from database, replaces placeholders with context, returns final prompt.
- [ ] **src/lib/services/ai.ts** — Function: `parseTaskList(rawContent: string)` — Parses task markdown into structured array: { id, title, description, acceptanceCriteria, priority, effort, dependencies, tags }; validates required fields; returns array.

### Document Generation Logic
- [ ] **src/lib/services/documentGenerator.ts** — Function: `generateBRD(conversation: Message[], mode: string)` — Builds prompt with Q&A, calls AI service, extracts between <<BRD_START>> and <<BRD_END>>, validates sections present, returns markdown.
- [ ] **src/lib/services/documentGenerator.ts** — Function: `generatePRD(conversation: Message[], brdContent: string, mode: string)` — Includes full BRD in context, builds prompt with Q&A, calls AI service, extracts between <<PRD_START>> and <<PRD_END>>, validates sections, returns markdown.
- [ ] **src/lib/services/documentGenerator.ts** — Function: `generateTasks(prdContent: string)` — Includes full PRD in context, calls AI service with tasks prompt, extracts content, parses tasks with parseTaskList, validates task structure, returns markdown + structured tasks.
- [ ] **src/lib/services/documentGenerator.ts** — Function: `generateKickoffPrompt(tasks: Task[], prdSummary: string)` — Creates project kickoff prompt summarizing PRD and task priorities; returns prompt text.

### Export Utilities
- [ ] **src/lib/utils/export.ts** — Function: `formatMarkdownForExport(content: string, metadata: { title, date, version })` — Adds frontmatter, formats sections, ensures proper heading levels; returns formatted markdown.
- [ ] **src/lib/utils/export.ts** — Function: `generatePDF(content: string, metadata: { title, date, version })` — Uses Puppeteer (server) or jsPDF (client) to convert markdown to styled PDF; includes header/footer with metadata; returns PDF blob.
- [ ] **src/lib/utils/export.ts** — Function: `downloadFile(content: string | Blob, filename: string, mimeType: string)` — Creates download link, triggers download, cleans up; client-side utility.

### State Machine Logic
- [ ] **src/lib/utils/stateMachine.ts** — Type: `ProjectPhase` — Union of all valid phases (brd_questions, brd_generating, brd_ready, brd_approved, prd_questions, prd_generating, prd_ready, prd_approved, tasks_generating, tasks_ready, completed).
- [ ] **src/lib/utils/stateMachine.ts** — Function: `getNextPhase(currentPhase: ProjectPhase, action: "answer" | "generate" | "approve")` — State transition logic with validation; returns next phase or throws error if invalid transition.
- [ ] **src/lib/utils/stateMachine.ts** — Function: `canTransition(currentPhase: ProjectPhase, targetPhase: ProjectPhase)` — Validates if transition is allowed; prevents skipping required steps.
- [ ] **src/lib/utils/stateMachine.ts** — Function: `getPhaseLabel(phase: ProjectPhase)` — Returns human-readable label for UI display.

### Formatting Utilities
- [ ] **src/lib/utils/format.ts** — Function: `formatDate(date: Date, format?: string)` — Format date with date-fns; default: "MMM dd, yyyy".
- [ ] **src/lib/utils/format.ts** — Function: `formatRelativeTime(date: Date)` — Returns "2 hours ago", "3 days ago", etc.
- [ ] **src/lib/utils/format.ts** — Function: `truncateText(text: string, maxLength: number, ellipsis?: string)` — Truncates text with ellipsis; word-aware.
- [ ] **src/lib/utils/format.ts** — Function: `sanitizeFilename(filename: string)` — Removes invalid characters, ensures valid extension.

### Type Definitions
- [ ] **src/lib/types/project.ts** — Types: Project, ProjectWithRelations, CreateProjectInput, UpdateProjectInput.
- [ ] **src/lib/types/document.ts** — Types: Document, DocumentWithProject, CreateDocumentInput, ExportFormat.
- [ ] **src/lib/types/conversation.ts** — Types: Message (role, content, timestamp), Conversation, ConversationWithMessages.
- [ ] **src/lib/types/ai.ts** — Types: AIResponse, GenerationOptions, QuestionWithOptions, Task, TaskList.
- [ ] **src/lib/types/user.ts** — Types: User, UserProfile, UserMode, UserRole.

---

## Phase 7: Pages & Routing

### Public Pages
- [ ] **app/(auth)/login/page.tsx** — Login page; uses AuthLayout + LoginForm + OAuthButtons; redirects to dashboard if already authenticated; "Don't have an account?" link to signup.
- [ ] **app/(auth)/signup/page.tsx** — Signup page; uses AuthLayout + SignupForm + OAuthButtons; redirects to dashboard after successful signup; "Already have an account?" link to login.
- [ ] **app/(auth)/forgot-password/page.tsx** — Password reset request page (future phase); email input, send reset link button.
- [ ] **app/(public)/page.tsx** — Landing page; hero section with tagline, features overview, CTA buttons (Get Started, View Demo); testimonials; footer.
- [ ] **app/(public)/about/page.tsx** — About page; product description, team, mission statement.
- [ ] **app/(public)/privacy/page.tsx** — Privacy policy page; markdown content.
- [ ] **app/(public)/terms/page.tsx** — Terms of service page; markdown content.

### Protected Pages (Authenticated)
- [ ] **app/(app)/dashboard/page.tsx** — Dashboard page; uses PageContainer, AppHeader; displays DashboardStats, QuickActions, RecentProjects; fetches data with tRPC; loading skeleton.
- [ ] **app/(app)/projects/page.tsx** — Projects list page; breadcrumb (Home > Projects); ProjectList with filters/sort; pagination; empty state with "Create Project" CTA; search functionality.
- [ ] **app/(app)/projects/new/page.tsx** — Create project page; breadcrumb (Home > Projects > New); CreateProjectDialog (inline, not modal); on submit, redirect to project wizard page.
- [ ] **app/(app)/projects/[id]/page.tsx** — Project detail/overview page; breadcrumb (Home > Projects > [Project Title]); ProjectHeader, ProgressOverview, recent documents; action buttons to continue wizard or view documents.
- [ ] **app/(app)/projects/[id]/wizard/brd/page.tsx** — BRD wizard page; displays QuestionCard, AnswerInput, WizardNavigation, WizardProgress; handles Q&A flow; auto-saves answers; transitions to generating state; on completion, redirects to document review.
- [ ] **app/(app)/projects/[id]/wizard/prd/page.tsx** — PRD wizard page; similar to BRD wizard; requires BRD approval; includes BRD context in AI calls.
- [ ] **app/(app)/projects/[id]/wizard/tasks/page.tsx** — Tasks generation page (Technical Mode only); shows GeneratingState immediately; calls AI router to generate tasks; on completion, redirects to document review.
- [ ] **app/(app)/projects/[id]/documents/[type]/page.tsx** — Document review page; breadcrumb (Home > Projects > [Project] > [Document Type]); DocumentViewer, DocumentActions; approve/regenerate dialogs; download options; next steps CTA after approval.
- [ ] **app/(app)/settings/page.tsx** — User settings page; breadcrumb (Home > Settings); tabs: Profile (name, email, mode preference), Security (change password), Preferences (dark mode, language); uses FormField components.

### Admin Pages
- [ ] **app/(app)/admin/page.tsx** — Admin dashboard; requires role=Admin; redirect if not admin; displays SystemStats (users, projects, documents, API usage); quick links to user management, prompts, logs.
- [ ] **app/(app)/admin/users/page.tsx** — User management page; breadcrumb (Home > Admin > Users); UserManagement component; search, filter, pagination; edit user modal; delete confirmation.
- [ ] **app/(app)/admin/prompts/page.tsx** — System prompts page; breadcrumb (Home > Admin > Prompts); tabs for each prompt type (BRD Plain, BRD Technical, PRD Plain, PRD Technical, Tasks); PromptEditor for each; save/reset buttons; preview mode.
- [ ] **app/(app)/admin/logs/page.tsx** — Audit logs page; breadcrumb (Home > Admin > Logs); SystemLogs component; filters (user, action, date range); export CSV; pagination.

### Error Pages
- [ ] **app/not-found.tsx** — 404 page; friendly message, link back to dashboard or homepage; illustration.
- [ ] **app/error.tsx** — Global error boundary; error message, "Try again" button, "Go to dashboard" link; logs error to monitoring service.
- [ ] **app/(app)/projects/[id]/error.tsx** — Project-specific error; handles project not found, permission denied; appropriate messaging.

### Layout Components
- [ ] **app/layout.tsx** — Root layout; HTML structure, Providers (tRPC, NextAuth, Theme), global styles, fonts, metadata.
- [ ] **app/(auth)/layout.tsx** — Auth layout group; uses AuthLayout component; no header/sidebar.
- [ ] **app/(public)/layout.tsx** — Public layout group; minimal header (logo + login link), footer.
- [ ] **app/(app)/layout.tsx** — App layout group; requires authentication; AppHeader, Sidebar (desktop), mobile navigation; Providers.

---

## Phase 8: Client-Side Logic & Hooks

### Custom Hooks
- [ ] **src/hooks/useProject.ts** — Hook for project operations; uses tRPC queries/mutations; returns: project data, isLoading, create, update, archive, delete, updatePhase; error handling.
- [ ] **src/hooks/useDocument.ts** — Hook for document operations; returns: document data, isLoading, create, approve, regenerate, exportMarkdown, exportPDF; optimistic updates.
- [ ] **src/hooks/useConversation.ts** — Hook for conversation management; returns: messages, isLoading, addMessage, updateMessage, clear; real-time updates option.
- [ ] **src/hooks/useWizard.ts** — Hook for wizard state; manages: currentStep, answers, canProceed, goNext, goBack, submitAnswer, reset; validates min answer length; persists to local storage.
- [ ] **src/hooks/useAuth.ts** — Hook wrapping NextAuth; returns: user, session, isLoading, isAuthenticated, signIn, signOut, signUp, updateProfile; redirects.
- [ ] **src/hooks/useLocalStorage.ts** — Generic hook for local storage with typing; returns: [value, setValue, remove]; handles JSON serialization.
- [ ] **src/hooks/useDebounce.ts** — Debounce hook for search/input; accepts value and delay; returns debounced value.
- [ ] **src/hooks/useMediaQuery.ts** — Responsive hook; accepts media query string; returns boolean; handles SSR.
- [ ] **src/hooks/useAutoSave.ts** — Auto-save hook; accepts data, save function, interval (default 30s); debounces rapid changes; shows "Saving..." indicator.

### Context Providers
- [ ] **src/providers/TRPCProvider.tsx** — tRPC client provider; wraps QueryClientProvider; error handling; refetch on window focus.
- [ ] **src/providers/ThemeProvider.tsx** — Dark mode provider using next-themes; persists preference; provides toggle function.
- [ ] **src/providers/ToastProvider.tsx** — Toast notification provider using sonner; global toast functions (success, error, info, loading).
- [ ] **src/providers/AuthProvider.tsx** — NextAuth SessionProvider wrapper; handles session refresh; provides auth context.

### Client Utilities
- [ ] **src/lib/utils/cn.ts** — Tailwind className merger using clsx + tailwind-merge; export as `cn` function.
- [ ] **src/lib/utils/toast.ts** — Toast helper functions; wraps sonner toast with consistent styling; functions: showSuccess, showError, showLoading, dismissLoading.
- [ ] **src/lib/utils/validation.ts** — Client-side validation helpers; validateEmail, validatePassword (strength check), validateRequired; returns { isValid, error }.

---

## Phase 9: Styling & Theming

### Tailwind Configuration
- [ ] **tailwind.config.ts** — Extend theme:
  - Colors: neutral palette (50-950), primary (blue tones, avoid purple), success (green), warning (yellow), error (red), info (blue); dark mode variants.
  - Typography: font-sans (Inter or similar), font-mono (JetBrains Mono); sizes from xs to 3xl.
  - Spacing: consistent scale (4, 6, 8, 12, 16, 24, 32, 48, 64px).
  - Border radius: sm (4px), md (6px), lg (8px), xl (12px).
  - Shadows: sm, md, lg, xl with subtle shadows.
  - Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px).
- [ ] Enable dark mode: 'class' strategy; use `dark:` prefix for dark styles.
- [ ] Add custom animations: fade-in, slide-in, spin for loading states.

### Global Styles
- [ ] **app/globals.css** — Import Tailwind directives (@tailwind base, components, utilities).
- [ ] Define CSS custom properties for colors (for non-Tailwind use cases).
- [ ] Base styles: body (font-sans, antialiased), headings (font-semibold), links (underline-offset).
- [ ] Dark mode base styles: background, text color, border colors.
- [ ] Print styles: hide navigation, adjust colors for print.
- [ ] Scrollbar styling: thin scrollbar, dark mode compatible.

### Component-Specific Styles
- [ ] **src/components/ui/*.tsx** — Apply Tailwind classes; use `cn()` for dynamic classes; ensure dark mode support.
- [ ] Focus states: visible ring on all interactive elements; sufficient contrast.
- [ ] Disabled states: reduced opacity, cursor-not-allowed.
- [ ] Hover states: subtle background/border changes; no drastic color shifts.
- [ ] Loading states: skeleton loaders, shimmer animations, spinners.

### Responsive Design
- [ ] Mobile-first approach: default styles for mobile, use md:, lg: for larger screens.
- [ ] Test all pages at sm (375px), md (768px), lg (1024px), xl (1280px) breakpoints.
- [ ] Ensure touch targets are at least 44x44px on mobile.
- [ ] Stack layouts vertically on mobile, use grid/flex on desktop.
- [ ] Hamburger menu on mobile; sidebar on desktop.

---

## Phase 10: Testing

### Unit Tests
- [ ] **src/components/ui/*.test.tsx** — Test all atoms: rendering, props variations, events (onClick, onChange), accessibility (roles, labels).
- [ ] **src/components/common/*.test.tsx** — Test molecules: integration of atoms, state management, user interactions.
- [ ] **src/lib/services/*.test.ts** — Test AI service: mock OpenRouter API, test extractMarkedContent edge cases, test prompt building.
- [ ] **src/lib/utils/*.test.ts** — Test utilities: validation functions, formatters, state machine transitions; edge cases.
- [ ] **src/server/routers/*.test.ts** — Test tRPC procedures: mock Prisma, test authorization (protected routes), test validation errors, test success cases.

### Integration Tests
- [ ] **tests/integration/auth.test.ts** — Test auth flow: signup, login, session creation, logout, password change.
- [ ] **tests/integration/project-creation.test.ts** — Test project creation: from form to database; test wizard flow.
- [ ] **tests/integration/document-generation.test.ts** — Test full document generation: Q&A, AI call, extraction, database save, state transitions.
- [ ] **tests/integration/document-approval.test.ts** — Test approval flow: approve document, update project phase, unlock next wizard.

### E2E Tests (Playwright)
- [ ] **tests/e2e/signup-login.spec.ts** — Test signup, login, logout flows; verify redirects; test OAuth (mock providers).
- [ ] **tests/e2e/create-project.spec.ts** — Test create project from dashboard, fill form, navigate to wizard.
- [ ] **tests/e2e/brd-wizard.spec.ts** — Test BRD wizard: answer questions, submit, see generating state, view document, approve.
- [ ] **tests/e2e/prd-wizard.spec.ts** — Test PRD wizard: requires BRD approval, answer questions, generate, approve.
- [ ] **tests/e2e/tasks-generation.spec.ts** — Test tasks generation (Technical Mode): generate from PRD, view tasks, download.
- [ ] **tests/e2e/document-export.spec.ts** — Test export: download markdown, download PDF; verify file content.
- [ ] **tests/e2e/admin-prompts.spec.ts** — Test admin: edit system prompts, save, verify changes reflected in wizard.

### Accessibility Tests
- [ ] **tests/a11y/*.test.tsx** — Run axe-core on all pages; fix violations (contrast, labels, roles, keyboard navigation).
- [ ] Manual keyboard navigation test: tab through all pages, ensure focus visible, enter/space activate buttons, ESC closes dialogs.
- [ ] Screen reader test: test with NVDA/VoiceOver; verify announcements for form errors, loading states, document generation.

### Performance Tests
- [ ] Lighthouse audit: run on all major pages; target scores: Performance >90, Accessibility >95, Best Practices >90, SEO >90.
- [ ] Bundle size analysis: use @next/bundle-analyzer; ensure main bundle <200KB gzipped.
- [ ] Database query performance: test with 1000+ projects, 10,000+ documents; ensure queries <100ms P95.
- [ ] AI generation load test: simulate 10 concurrent generations; ensure no timeouts, no rate limit errors (with queue).

---

## Phase 11: Documentation

### Code Documentation
- [ ] **README.md** — Project overview, features, tech stack, setup instructions, environment variables, database setup, running locally, deployment guide, troubleshooting.
- [ ] **CONTRIBUTING.md** — Contribution guidelines, code standards, commit message format, PR process, testing requirements.
- [ ] **docs/ARCHITECTURE.md** — System architecture diagram, tech stack details, folder structure, state machine diagram, data flow diagrams.
- [ ] **docs/API.md** — tRPC API documentation: all routers, procedures, input/output types, examples, error codes.
- [ ] **docs/DATABASE.md** — Database schema documentation: ER diagram, model descriptions, relationships, indexes, migrations guide.
- [ ] **docs/DEPLOYMENT.md** — Deployment guide: Vercel setup, environment variables, database deployment (Supabase/Neon), AI API key setup, monitoring setup.
- [ ] **docs/TESTING.md** — Testing guide: running tests, writing tests, mocking guidelines, E2E test setup, CI/CD integration.

### Inline Code Comments
- [ ] Add JSDoc comments to all exported functions, components, types; include @param, @returns, @throws, @example.
- [ ] Document complex logic: state machine transitions, AI prompt building, document parsing, security considerations.
- [ ] Add TODO comments for future improvements with issue numbers if applicable.

### Storybook Documentation
- [ ] **src/stories/Introduction.stories.mdx** — Introduction to the design system, color palette, typography, spacing, component usage guidelines.
- [ ] Autodocs for all components; ensure all props documented, examples provided, accessibility notes included.
- [ ] Create "Patterns" stories: common UI patterns (wizard flow, document review, dashboard layout).

### User Documentation (Future)
- [ ] **docs/USER_GUIDE.md** — User guide: how to create projects, use wizards, interpret documents, export options.
- [ ] **docs/FAQ.md** — Frequently asked questions: pricing, data privacy, AI quality, support, feature requests.
- [ ] Help tooltips in UI: add contextual help icons with tooltips explaining features.

---

## Phase 12: DevOps & Deployment

### Environment Setup
- [ ] Create `.env.example` with all required variables: DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, OPENROUTER_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, NEXT_PUBLIC_APP_URL.
- [ ] Configure environment variables in Vercel: production, preview, development.
- [ ] Set up database on Supabase or Neon (PostgreSQL); get connection URL.
- [ ] Generate NEXTAUTH_SECRET: `openssl rand -base64 32`.

### Database Deployment
- [ ] Run Prisma migrations in production: `npx prisma migrate deploy`.
- [ ] Seed production database with default system prompts: `npx prisma db seed`.
- [ ] Set up database backups: daily automated backups.
- [ ] Configure connection pooling: use Prisma Data Proxy or PgBouncer.

### Vercel Deployment
- [ ] Connect GitHub repository to Vercel.
- [ ] Configure build settings: framework preset (Next.js), root directory, build command, install command.
- [ ] Set environment variables in Vercel dashboard.
- [ ] Configure domains: custom domain setup, SSL certificates.
- [ ] Set up preview deployments: automatic for PRs.
- [ ] Configure redirects and rewrites if needed.

### CI/CD Pipeline
- [ ] **GitHub Actions**: `.github/workflows/test.yml` — Run on PR: install dependencies, run lint, run type-check, run unit tests, run E2E tests (headless).
- [ ] **GitHub Actions**: `.github/workflows/deploy.yml` — Run on merge to main: same as test + trigger Vercel deployment.
- [ ] Configure branch protection: require tests to pass, require reviews.
- [ ] Set up status checks: tests, build, deploy.

### Monitoring & Error Tracking
- [ ] Set up Sentry: install @sentry/nextjs, configure error tracking, set environment (production/development), add source maps upload.
- [ ] Configure Sentry alerts: critical errors, high error rates, performance degradation.
- [ ] Set up Vercel Analytics: enable Web Analytics, enable Audiences.
- [ ] Configure logging: structured logging with pino or winston, log levels (error, warn, info, debug).
- [ ] Set up uptime monitoring: use Vercel Monitoring or third-party (UptimeRobot, Pingdom).

### Performance Optimization
- [ ] Enable Next.js Image Optimization: use next/image for all images.
- [ ] Configure caching: static assets (1 year), API routes (appropriate cache headers).
- [ ] Enable gzip/brotli compression: Vercel enables by default, verify.
- [ ] Optimize fonts: use next/font for self-hosted fonts, preload critical fonts.
- [ ] Code splitting: dynamic imports for large components, lazy load non-critical components.
- [ ] Database query optimization: add indexes, use select to fetch only needed fields, batch queries where possible.

### Security Hardening
- [ ] Enable HTTPS only: enforce in production, redirect HTTP to HTTPS.
- [ ] Set security headers: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.
- [ ] Configure CORS: restrict allowed origins, set credentials policy.
- [ ] Rate limiting: implement on API routes (AI endpoints: 10/min, auth: 5/min).
- [ ] Input sanitization: validate and sanitize all user inputs, prevent XSS, SQL injection (Prisma handles this).
- [ ] Dependency scanning: set up Dependabot or Snyk for vulnerability alerts.
- [ ] Set up WAF (Web Application Firewall) if needed: Cloudflare or Vercel Edge Network.

---

## Phase 13: Polish & Launch Preparation

### UI/UX Polish
- [ ] Consistent spacing: audit all pages for spacing consistency (use Tailwind spacing scale).
- [ ] Responsive review: test all pages on mobile (375px, 414px), tablet (768px), desktop (1024px, 1440px); fix layout issues.
- [ ] Dark mode review: test all pages in dark mode; ensure sufficient contrast, no FOUC (Flash of Unstyled Content).
- [ ] Loading states: ensure all async actions have loading indicators (buttons, pages, document generation).
- [ ] Error states: ensure all error scenarios have user-friendly messages, actionable suggestions.
- [ ] Empty states: ensure all empty states have helpful messaging, CTAs to guide users.
- [ ] Animations: subtle fade-ins for content, smooth transitions for state changes, no janky animations.
- [ ] Typography: ensure hierarchy is clear (headings, body text, captions), consistent font sizes.

### Accessibility Audit
- [ ] Run full accessibility audit with axe DevTools on all pages.
- [ ] Fix all critical and serious issues (contrast, missing labels, keyboard traps).
- [ ] Manual keyboard navigation: ensure all functionality accessible via keyboard.
- [ ] Screen reader test: test key flows with screen reader (signup, project creation, document review).
- [ ] Add skip links: "Skip to main content" on all pages.
- [ ] Ensure form validation is accessible: error messages associated with fields, aria-invalid, aria-describedby.

### Content & Copy
- [ ] Review all UI copy: ensure clarity, consistency, tone (friendly but professional).
- [ ] Add help text: contextual help for complex features (wizard questions, document markers).
- [ ] Error messages: ensure all errors have clear, actionable messages (not generic "Error occurred").
- [ ] Success messages: confirm actions (project created, document approved, exported).
- [ ] Loading messages: contextual messages during AI generation ("Analyzing requirements...", "Generating sections...").

### SEO Optimization
- [ ] Add metadata to all pages: title, description, Open Graph tags, Twitter Card tags.
- [ ] Create sitemap.xml: dynamic sitemap for public pages.
- [ ] Create robots.txt: allow crawling of public pages, disallow /dashboard, /projects, /admin.
- [ ] Add structured data: JSON-LD for organization, web application.
- [ ] Optimize page titles: descriptive, unique per page, include brand name.
- [ ] Optimize meta descriptions: compelling, under 160 chars, include keywords.

### Performance Review
- [ ] Run Lighthouse audit on all major pages: target 90+ scores.
- [ ] Optimize images: compress, use modern formats (WebP), lazy load below fold images.
- [ ] Minimize JavaScript: remove unused dependencies, tree-shake, code split.
- [ ] Minimize CSS: purge unused Tailwind classes, extract critical CSS.
- [ ] Database query optimization: add indexes for frequently queried fields, reduce N+1 queries.
- [ ] API response times: ensure P95 <500ms for all endpoints.

### Data Privacy & Compliance
- [ ] Add privacy policy page: data collection, usage, storage, third-party services.
- [ ] Add terms of service page: acceptable use, liability, termination.
- [ ] Cookie consent: implement cookie banner for EU users (GDPR).
- [ ] Data export: allow users to export their data (projects, documents).
- [ ] Account deletion: implement full account deletion with data cleanup.
- [ ] Audit third-party scripts: ensure only necessary scripts, privacy-compliant.

### Pre-Launch Checklist
- [ ] Final testing round: test all critical flows (signup, login, project creation, wizard, generation, approval, export).
- [ ] Load testing: simulate expected launch traffic, identify bottlenecks.
- [ ] Backup verification: ensure database backups are working, test restore process.
- [ ] Error tracking verification: trigger test errors, verify they appear in Sentry.
- [ ] Analytics verification: test event tracking, ensure data appears in Vercel Analytics.
- [ ] Email notifications setup (if applicable): test email delivery, templates.
- [ ] Admin account setup: create admin account, test admin features.
- [ ] Prepare launch announcement: blog post, social media posts, Product Hunt submission.

---

## Phase 14: Post-Launch

### Monitoring & Maintenance
- [ ] Monitor error rates: daily review of Sentry errors, fix critical bugs within 24h.
- [ ] Monitor performance: weekly review of Lighthouse scores, API response times; address degradation.
- [ ] Monitor usage: track key metrics (signups, projects created, documents generated, retention).
- [ ] User feedback: set up feedback mechanism (in-app widget, email), review weekly.
- [ ] Database maintenance: monitor query performance, add indexes as needed, archive old data.

### Iteration & Improvements
- [ ] Collect user feedback: surveys, user interviews, support tickets; prioritize improvements.
- [ ] Feature requests: maintain backlog, prioritize based on user demand and business value.
- [ ] Bug fixes: triage bugs, fix high-priority issues, release patches.
- [ ] A/B testing: test wizard question variations, UI improvements, onboarding flows.
- [ ] Performance improvements: continue optimizing based on real usage patterns.

### Documentation Updates
- [ ] Update docs as features change: keep API docs, user guide, FAQs current.
- [ ] Changelog: maintain changelog for all releases, communicate to users.
- [ ] Known issues: document known issues, workarounds, expected fixes.

### Community Building
- [ ] Create help center: comprehensive guides, video tutorials.
- [ ] Community forum: set up forum or Discord for users to ask questions, share tips.
- [ ] Blog: publish case studies, best practices, product updates.
- [ ] Social media: engage with users, share tips, announce features.

---

## Visual QA & Screenshots

### Screenshot Checklist
- [ ] Capture landing page (desktop, mobile, dark mode).
- [ ] Capture dashboard (empty state, with projects, dark mode).
- [ ] Capture project creation form (desktop, mobile).
- [ ] Capture BRD wizard (question view, generating state, document review, dark mode).
- [ ] Capture PRD wizard (question view, document review).
- [ ] Capture Tasks generation (generating state, task list view).
- [ ] Capture document export dialog.
- [ ] Capture admin pages (user management, prompt editor, logs).
- [ ] Capture Storybook for key components (Button, Input, Card, OptionCard, QuestionCard, DocumentViewer).

---

## Deployment & Review

### Build & Deploy
- [ ] Run `npm run build` locally — Fix any TypeScript or build errors; ignore warnings per project rules.
- [ ] Run `npm run lint` — Fix all linting errors.
- [ ] Run `npm run test` — Ensure all tests pass.
- [ ] Commit changes: `git add . && git commit -m "feat: PRD Helper MVP with full wizard flow, document generation, and admin panel"`
- [ ] Push to main branch: `git push origin main`.
- [ ] Verify Vercel deployment: check preview URL, test critical flows.
- [ ] Merge to production: create release, deploy to production.
- [ ] Post-deployment verification: test production site, verify database connections, verify AI API calls work.

### Documentation Updates
- [ ] Update CHANGELOG.md with release notes.
- [ ] Update README.md with any setup changes.
- [ ] Tag release in Git: `git tag v1.0.0 && git push --tags`.

---

## Success Metrics Tracking

### Analytics Setup
- [ ] Set up event tracking: signups, logins, projects created, documents generated, documents approved, exports, mode selection.
- [ ] Set up funnel tracking: signup → first project → first BRD → BRD approval → first PRD.
- [ ] Set up conversion tracking: free to paid (when implemented).
- [ ] Set up retention cohorts: 7-day, 30-day retention.

### KPI Dashboards
- [ ] Create dashboard for product metrics: users, projects, documents, activation rate, retention.
- [ ] Create dashboard for technical metrics: uptime, response times, error rates, API success rates.
- [ ] Set up alerts: critical errors, uptime drops, high response times.

---

## Additional Features (Future Phases)

### Phase 2 Features (P2)
- [ ] Document versioning: track iterations, view history, revert to previous versions.
- [ ] PDF export: server-side PDF generation with Puppeteer.
- [ ] Document editing: allow section-level editing instead of full regeneration.
- [ ] Custom AI prompts: allow users to customize prompts (advanced setting).
- [ ] Document templates: pre-filled templates for common use cases.
- [ ] Collaboration: invite team members, shared projects, comments.
- [ ] Project cloning: duplicate existing projects.
- [ ] Document comparison: compare versions, highlight changes.

### Potential Enhancements
- [ ] Multi-language support: i18n for UI, support for non-English document generation.
- [ ] Integrations: export to Notion, Google Docs, Jira, Linear.
- [ ] API access: public API for programmatic document generation.
- [ ] Webhooks: notify external systems when documents are generated/approved.
- [ ] Advanced analytics: document quality scoring, topic clustering.
- [ ] AI model selection: allow users to choose different AI models.
- [ ] Voice input: voice-to-text for wizard answers.
- [ ] Browser extension: generate documents from existing web pages.

---

**End of Task List**

This comprehensive checklist covers all aspects of building PRD Helper from initial setup through launch and post-launch maintenance. Each task is actionable and follows the same structure as the original tasks.md. The implementation should be done in phases, with Phase 0-13 representing the MVP, and Phase 14+ representing post-launch iterations.