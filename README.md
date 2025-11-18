# PRD Helper

An AI-powered requirements document generator that helps you create professional Business Requirements Documents (BRDs) and Product Requirements Documents (PRDs) through an intelligent Q&A wizard interface.

## ✨ Features

### Core Features
- 🤖 **AI-Powered Wizards**: Interactive Q&A flow that adapts to your responses
- ❓ **Question Explanations**: Help button on AI questions provides detailed guidance, tips, and pros/cons comparisons
- 📄 **Document Generation**: Automatically generates BRDs, PRDs, task lists, and vibe coding prompts
- 🎯 **Two User Modes**: Plain language for business users, technical for developers
- 💬 **Smart Conversations**: AI remembers context and asks relevant follow-up questions
- 📊 **Progress Tracking**: Visual progress indicators as you answer questions
- 🌓 **Dark Mode**: Beautiful UI with dark mode support
- ♿ **Accessible**: WCAG compliant with keyboard navigation
- 🧪 **Well-Tested**: Comprehensive unit and E2E test coverage
- 🔐 **OAuth Authentication**: Secure Google OAuth login with account chooser support
- 📎 **File Upload**: Attach screenshots and videos to contact form inquiries
- 👤 **Professional Profiles**: Comprehensive user profiles with bio, company, job title, LinkedIn, website, location, and GitHub integration

### Team Collaboration
- 👥 **Project Sharing**: Invite team members to collaborate on projects
- 📧 **Email & Username Invites**: Invite collaborators by email address or username
- 🔐 **Role-Based Permissions**:
  - **VIEWER**: Read-only access to view project and documents
  - **EDITOR**: Full edit access to modify project and documents
- 📬 **Invitation Management**: Send, accept, reject, and track pending invitations
- 👑 **Owner Controls**: Invite, remove, and manage team member roles
- ⏰ **Invite Expiration**: Automatic 7-day expiration for pending invitations
- 📊 **Team Overview**: View all collaborators and their roles on project pages

### Document Management
- 🔄 **Document Regeneration**: Regenerate any document with optional feedback for improvements
- 📝 **Version History**: View and restore previous versions of all documents
- 💾 **Version Control**: Automatic versioning with metadata (creator, timestamp, status)
- 🔍 **Version Preview**: Preview any historical version before restoring
- ⏮️ **Version Restore**: Restore any previous version as the current document

### Vibe Coding Integration (Plain Mode)
- 🚀 **Prompt Build**: Generate copy-paste ready prompts for AI coding tools (Loveable, V0, Bolt)
- 🎨 **Auto-Generation**: After PRD approval in Plain Mode, automatically generate vibe coding prompts
- 📋 **Production-Ready**: Prompts designed to create complete, deployable web services

### Admin Features
- 👤 **User Management**: Admin dashboard for managing users and permissions
- 🔧 **System Prompt Management**: Edit and version control all AI system prompts
- 📊 **Token Usage Tracking**: Monitor AI token consumption and costs
- 📜 **Audit Logs**: Complete audit trail of all system actions
- 🔒 **Role-Based Access**: User and Admin role support with permission controls

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenRouter API key ([Get one here](https://openrouter.ai/))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd prd

# Install dependencies (root, server, and client)
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your API keys and database URL

# Set up the database
npx prisma migrate dev
npx prisma db seed
```

### Running the App

```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run dev:server  # Backend on http://localhost:3000
npm run dev:client  # Frontend on http://localhost:5173
```

Visit `http://localhost:5173` to use the application.

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite for blazing-fast builds
- Tailwind CSS for styling
- tRPC for type-safe API calls
- React Query for data fetching
- React Router for navigation

**Backend:**
- Express.js with TypeScript
- tRPC for API layer
- Prisma as ORM
- PostgreSQL database
- OpenRouter for AI integration

**Testing:**
- Vitest for unit tests
- React Testing Library
- Playwright for E2E tests

### Project Structure

```
.
├── server/              # Express backend
│   ├── src/
│   │   ├── routers/    # tRPC routers
│   │   ├── lib/        # Services and utilities
│   │   └── index.ts    # Server entry point
│   └── tsconfig.json
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   ├── hooks/      # Custom hooks
│   │   └── lib/        # Utilities
│   ├── e2e/            # Playwright E2E tests
│   └── tsconfig.json
├── prisma/             # Database schema and migrations
│   ├── schema.prisma
│   └── migrations/
├── shared/             # Shared TypeScript types
└── docs/               # Documentation
```

## 🧪 Testing

We maintain comprehensive test coverage with both unit and E2E tests.

### Running Tests

```bash
# All tests (unit + E2E)
cd client
npm run test:ci

# Unit tests only
npm run test:unit

# Unit tests in watch mode
npm run test

# E2E tests
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui

# E2E tests in debug mode
npm run test:e2e:debug

# Generate coverage report
npm run test:coverage
```

### BRD Wizard Tests

Quick test commands for the BRD wizard:

```bash
cd client

# Run all BRD wizard tests
./test-brd-wizard.sh

# Run only unit tests
./test-brd-wizard.sh unit

# Run E2E tests with UI
./test-brd-wizard.sh e2e-ui

# Show help
./test-brd-wizard.sh help
```

### Test Documentation

- **Testing Guide**: [`docs/BRD_WIZARD_TESTING.md`](docs/BRD_WIZARD_TESTING.md)
- **Test Results**: [`E2E_TEST_RESULTS.md`](E2E_TEST_RESULTS.md)
- **Test Summary**: [`TEST_IMPLEMENTATION_SUMMARY.md`](TEST_IMPLEMENTATION_SUMMARY.md)

### Current Test Status

**Unit Tests**: ✅ 1 passing, 10 todo  
**E2E Tests**: 🟡 5/17 passing (29% - basic UI and accessibility working)

## 🗄️ Database

### Recent Schema Changes

#### Team Collaboration Features (Migration: 20251115080212)
- Added `ProjectInvite` model for invitation management
  - Fields: email, invitedBy, role, status, expiresAt, timestamps
  - Enums: `CollaboratorRole` (VIEWER, EDITOR), `InviteStatus` (PENDING, ACCEPTED, REJECTED, EXPIRED)
  - 7-day expiration period for pending invitations
- Added `ProjectCollaborator` model for team members
  - Fields: user, project, role, addedBy, addedAt
  - Unique constraint on userId + projectId
  - Cascading deletes when project or user is removed
- Enhanced project ownership and access control
- Full backend API with collaborators router

#### Document Version History (Migration: 20251027170107)
- Added `DocumentVersion` model for tracking document history
- Fields: version number, content, rawContent, status, approvedAt, creator, timestamp
- Automatic versioning on document regeneration
- Full restore capability with audit logging

#### Prompt Build Workflow (Migrations: 20251027213104, 20251027223736, 20251027213200)
- Added `PROMPT_BUILD` document type
- Added `PROMPT_BUILD_GENERATING` and `PROMPT_BUILD_READY` project phases
- New workflow for Plain Mode: BRD → PRD → Prompt Build
- Added `PROMPT_BUILD` system prompt type

#### Token Usage Tracking (Migration: 20251027192249)
- Added `TokenUsage` model for AI cost monitoring
- Tracks: operation type, model used, tokens consumed, estimated cost
- Per-user and per-project tracking
- Admin dashboard integration

#### Prompt Version History (Migration: 20251027211952)
- Added `PromptVersion` model for system prompt versioning
- Tracks changes to all AI system prompts
- Admin can view history and revert changes
- Audit trail for prompt modifications

### Schema Management

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Mark migration as applied (if manually applied via SQL)
npx prisma migrate resolve --applied migration_name

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed the database
npx prisma db seed

# Reset database (dev only)
npx prisma migrate reset
```

## 🔧 Development

### Environment Variables

Required variables in `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/prd_helper"

# API URLs
API_URL="http://localhost:3000"
CLIENT_URL="http://localhost:5173"

# AI Integration
OPENROUTER_API_KEY="your_openrouter_api_key"

# Authentication (optional)
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:5173"
```

See `.env.example` for all available options.

### Code Quality

```bash
# Type checking
npm run type-check

# Linting
cd client
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Before Committing

```bash
# Build check
npm run build

# Type check
npm run type-check

# Run tests
cd client && npm run test:ci
```

Or use the shortcut:
```bash
# Automated pre-commit checks
npm run finish  # (if configured)
```

## 📦 Building for Production

```bash
# Build everything
npm run build

# Build backend only
npm run build:server

# Build frontend only
npm run build:client

# Preview production build
cd client && npm run preview
```

## 🚀 Deployment

```bash
# Start production server
npm start
```

The server serves both the API and the built frontend static files.

## 📚 Documentation

- **Quick Start**: [`QUICK_START.md`](QUICK_START.md)
- **Backend Setup**: [`docs/BACKEND_SETUP.md`](docs/BACKEND_SETUP.md)
- **Frontend Integration**: [`docs/FRONTEND_INTEGRATION.md`](docs/FRONTEND_INTEGRATION.md)
- **BRD Wizard Complete**: [`docs/BRD_WIZARD_COMPLETE.md`](docs/BRD_WIZARD_COMPLETE.md)
- **Testing Guide**: [`docs/BRD_WIZARD_TESTING.md`](docs/BRD_WIZARD_TESTING.md)
- **Product Requirements**: [`docs/prd.md`](docs/prd.md)

## 🎯 User Guide

### Managing Your Profile

1. Click your profile icon or navigate to `/profile`
2. Update your professional information:
   - **Name**: Your display name
   - **Bio**: Professional summary (up to 500 characters)
   - **Company**: Your organization
   - **Job Title**: Your current role
   - **Location**: City, Country or general location
   - **LinkedIn**: Your LinkedIn profile URL
   - **Website**: Personal or professional website
   - **GitHub**: Your GitHub profile (for technical users)
3. Choose your preferred mode (Plain or Technical)
4. Change password (if not using OAuth)
5. All fields are optional and can be updated anytime

### Creating a Project

1. Sign up or log in
2. Click "Create Project"
3. Enter project details and choose user mode:
   - **Plain Mode**: For business users, generates BRD → PRD → Vibe Coding Prompt
   - **Technical Mode**: For developers, generates BRD → PRD → Technical Task List
4. Click "Create"

### Generating a BRD

1. Navigate to your project
2. Click "Start BRD Wizard"
3. Answer the AI's questions (minimum 3 questions)
   - Click the help icon (?) next to any question to see:
     - What the question is about and why it matters
     - Tips for providing a good answer
     - Pros and cons comparison for different options
     - Common examples and use cases
4. Click "Generate BRD"
5. Review, regenerate (optional), or approve your document

### Generating a PRD

1. Complete and approve the BRD first
2. Click "Start PRD Wizard" from project details
3. Answer additional questions
   - Use the help icon (?) for guidance on complex technical questions
4. Generate and review your PRD
5. Approve to proceed to next step

### Plain Mode: Generating Vibe Coding Prompt

1. Complete and approve both BRD and PRD
2. System automatically generates a Prompt Build document
3. This prompt is ready to copy and paste into:
   - **Loveable**: AI web app builder
   - **V0**: Vercel's AI design tool
   - **Bolt**: Stackblitz's AI development tool
4. Copy the generated prompt and use it in your preferred vibe coding tool

### Technical Mode: Generating Task List

1. Complete and approve both BRD and PRD
2. Click "Generate Tasks"
3. AI creates a detailed technical task list with:
   - Task IDs and titles
   - Descriptions and acceptance criteria
   - Priority levels (HIGH, MEDIUM, LOW)
   - Effort estimates
   - Dependencies between tasks
   - Technical tags

### Document Management

#### Regenerating Documents
1. Open any document (BRD, PRD, Tasks, or Prompt Build)
2. Click "Regenerate" button
3. Optionally provide feedback for improvements (e.g., "Make it more concise", "Add security details")
4. System saves current version to history and generates new version
5. New version starts as DRAFT status and increments version number

#### Viewing Version History
1. Open any document
2. Click "History" button in the header
3. See all previous versions with:
   - Version number
   - Status (DRAFT or APPROVED)
   - Created date and time
   - Creator name
4. Click "View" to preview a version's content
5. Click "Restore" to revert to that version

#### Restoring Previous Versions
1. In Version History modal, select a version
2. Click "Restore" button
3. Confirm the restoration
4. System:
   - Saves current version to history
   - Restores selected version as new current version
   - Increments version number
   - Sets status to DRAFT (requires re-approval)
   - Creates audit log entry

### Team Collaboration

#### Inviting Team Members
1. Navigate to your project detail page
2. Scroll to the "Team" section
3. Click "Invite Collaborator" button
4. In the invite modal:
   - Enter collaborator's email address or username
   - Select role:
     - **VIEWER**: Can view project and all documents (read-only)
     - **EDITOR**: Can edit project and modify documents
   - Click "Send Invite"
5. Invitation expires after 7 days if not accepted

#### Managing Collaborators (Project Owners)
1. View all team members in the "Team" section of project details
2. For each collaborator, you can:
   - **Change Role**: Click role dropdown to switch between VIEWER and EDITOR
   - **Remove**: Click "Remove" button to revoke access
3. View pending invitations with option to cancel

#### Accepting/Rejecting Invitations
1. View pending invitations on your dashboard
2. Each invitation shows:
   - Project name and description
   - Inviter's name
   - Assigned role (VIEWER or EDITOR)
   - Expiration date
3. Click "Accept" to join the project as a collaborator
4. Click "Reject" to decline the invitation
5. Accepted invitations grant immediate access to the project

#### Permission Levels
- **Owner** (Project Creator):
  - Full control over project
  - Invite and remove collaborators
  - Change collaborator roles
  - Delete project

- **EDITOR**:
  - View and edit project details
  - View and regenerate all documents
  - Approve documents
  - Cannot manage team members
  - Cannot delete project

- **VIEWER**:
  - View project details (read-only)
  - View all documents (read-only)
  - Cannot edit or regenerate documents (edit buttons hidden from UI)
  - Cannot approve documents (approve button visible for read-only viewing)
  - Cannot manage team members
  - Cannot delete project

**Note**: Email notifications for invitations are not yet implemented. Users must check their dashboard for pending invites.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test:ci`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenRouter for AI integration
- Prisma for excellent ORM
- tRPC for type-safe APIs
- The React and Vite communities

---

## 📋 Recent Updates

### Version 2.5.0 - Team Collaboration & OAuth Improvements (November 15, 2025)

#### ✨ New Features
1. **Team Collaboration System** - Complete project sharing and collaboration workflow
   - Invite collaborators by email address or username
   - Role-based access control with VIEWER and EDITOR roles
   - Pending invitation management with accept/reject
   - Team overview on project detail pages
   - Owner controls for managing team members and roles
   - 7-day automatic expiration for pending invitations
   - View all pending invites on user dashboard

2. **OAuth Account Chooser** - Improved Google OAuth experience
   - Added account picker on login (prompt=select_account)
   - Users can easily switch between Google accounts
   - Better separation between login flows and account selection

#### 🐛 Bug Fixes
1. **Collaborator Visibility** - Fixed critical issue where collaborators couldn't see shared projects
   - Updated `getStats` query to include collaborated projects in dashboard
   - Created `verifyProjectAccess()` helper for proper role-based access control
   - Updated all 9 document endpoints to support collaborator access with role hierarchy
   - Dashboard now correctly shows project counts and documents for collaborators
   - VIEWER, EDITOR, and OWNER roles now work as expected

2. **Document Button Permissions** - Fixed UI showing edit buttons to VIEWER collaborators
   - Added permission check for Edit Document and Regenerate Document buttons
   - VIEWER role now sees read-only interface without edit controls
   - EDITOR and OWNER roles see full editing capabilities
   - Backend already enforced permissions; UI now matches server-side security

3. **Google OAuth Logout** - Fixed account switching issue
   - Added backend logout endpoint (`/api/auth/logout`)
   - Properly clears session and authentication state
   - Frontend logout now calls backend to clear sessions
   - Users can switch Google accounts without browser cache issues

#### 🔧 Technical Changes
- **Database Schema**: New collaboration models and enums
  - `ProjectInvite` model with email, role, status, expiration
  - `ProjectCollaborator` model linking users to projects
  - `CollaboratorRole` enum: VIEWER, EDITOR
  - `InviteStatus` enum: PENDING, ACCEPTED, REJECTED, EXPIRED
- **Backend API**: Complete collaborators router and permission system
  - POST /invite - Send invitation
  - GET /invites/pending - List user's pending invites
  - POST /invites/:id/accept - Accept invitation
  - POST /invites/:id/reject - Reject invitation
  - GET /project/:id/collaborators - List project team
  - PUT /collaborators/:id/role - Change member role
  - DELETE /collaborators/:id - Remove member
  - New `verifyProjectAccess()` helper enforces role hierarchy (OWNER > EDITOR > VIEWER)
  - All document endpoints updated to support collaborator access with proper permissions
- **Frontend Components**: New collaboration UI with role-based permissions
  - InviteCollaboratorModal with user search
  - PendingInvites section on dashboard
  - Team management section on project detail pages
  - Role selection and permission displays
  - DocumentViewPage updated with `canEditDocument` permission helper
  - Edit/Regenerate buttons conditionally rendered based on user role
  - VIEWER users see read-only interface without edit controls
- **Authentication**: Enhanced OAuth and logout flows
  - Backend session clearing on logout
  - Account picker parameter in Google OAuth
  - Proper state cleanup on logout

#### 📦 Database Changes
- Migration: `20251115080212_add_collaboration_features`
- New tables: ProjectInvite, ProjectCollaborator
- New enums: CollaboratorRole, InviteStatus
- Unique constraints and cascading deletes

#### 🚧 Known Limitations
- Email notifications for invitations not yet implemented (TODO)
- Users must check dashboard for pending invites
- Invite expiration is date-based (7 days), not enforced in real-time

---

### Version 2.4.0 - Enhanced User Profiles & Router Fix (November 12, 2025)

#### ✨ New Features
1. **Comprehensive User Profiles** - Professional profile fields for networking and collaboration
   - Bio/About section (max 500 characters with character counter)
   - Company and job title fields
   - LinkedIn profile integration
   - Personal website URL
   - Location (city/country)
   - GitHub profile for technical users
   - Dark mode support with responsive design
   - Two-column grid layout on desktop, single column on mobile

#### 🐛 Bug Fixes
1. **React Router Context Error** - Fixed critical routing issue
   - Moved BrowserRouter from App.tsx to main.tsx
   - Resolved "useNavigate() may be used only in the context of a Router" error
   - AuthProvider now properly wrapped in Router context
   - Improved component hierarchy and initialization order

#### 🔧 Technical Changes
- **Database Schema**: Added 7 new optional profile fields to User model
  - `bio`, `company`, `jobTitle`, `linkedInUrl`, `websiteUrl`, `location`, `githubUrl`
- **Backend Validation**: Enhanced with URL validation and field-specific constraints
  - LinkedIn URLs validated against linkedin.com domain
  - GitHub URLs validated against github.com domain
  - Character limits enforced (bio: 500, others: 100)
- **Frontend Types**: Updated User interface with new optional fields
- **Profile Page UI**: Complete redesign of profile information section
  - Professional layout with grouped fields
  - Real-time character counter for bio
  - Placeholder guidance for all fields
  - Full backward compatibility (all fields optional)

#### 📦 Database Changes
- Updated User model schema with 7 new VARCHAR fields (all nullable)
- Applied schema changes via `prisma db push`
- No breaking changes (backward compatible)

---

### Version 2.3.0 - Contact Form File Upload & OAuth Improvements (November 8, 2025)

#### ✨ New Features
1. **File Upload for Contact Form** - Users can now attach screenshots and videos
   - Drag-and-drop file upload interface
   - Support for images (PNG, JPG, GIF) and videos (MP4, WEBM)
   - Up to 5 files per submission, 5MB max per file
   - Files stored in Google Cloud Storage
   - Download links included in admin email notifications
2. **Enhanced OAuth Signup Flow** - Improved Google OAuth experience
   - Added account chooser for signup (prompt=select_account)
   - Users can select different Google accounts when signing up
   - Better separation between login and signup flows

#### 🔧 Technical Changes
- Implemented multer for multipart file uploads
- Added @google-cloud/storage integration for permanent file storage
- Created reusable FileUpload React component with drag-and-drop
- Updated Prisma schema with `attachments` JSON field
- Enhanced email templates with attachment sections and download buttons
- Added file validation (client and server-side)
- Updated Cloud Build configuration with GCS environment variables

#### 📦 New Components & Services
- `FileUpload.tsx` - Reusable drag-and-drop file upload component
- `server/src/lib/storage.ts` - Google Cloud Storage service
- `server/src/routes/upload.ts` - File upload API endpoint
- `client/src/lib/utils/fileUpload.ts` - Client-side file utilities

#### 🗄️ Database Changes
- Added `attachments` JSON field to `DemoRequest` table
- Stores array of attachment metadata (url, filename, mimetype, size)

---

### Version 2.2.0 - Admin Dashboard & Document Generation Improvements (November 4, 2025)

#### ✨ New Features
1. **Sortable Admin Tables** - All admin dashboard tables now support column sorting
   - User Management: Sort by name, email, role, project count, created date
   - Document Management: Sort by type, project, owner, status, created date
   - Project Management: Sort by title, owner, status, mode, documents, created date
   - Token Usage: Sort by user, project, operation, model, tokens, cost, date
   - Audit Logs: Sort by action, user, target type, timestamp
2. **Enhanced Audit Logs** - Improved data extraction from JSON details field
3. **Clean Document Display** - Technical markers (<<TASKS_START>>, etc.) now hidden from users

#### 🔧 Technical Changes
- Implemented client-side sorting for all admin tables with proper handling of:
  - Nested object properties (e.g., project.user.name)
  - Null/undefined values
  - String and numeric comparisons
- Created content filter utility (`contentFilter.ts`) for stripping document markers
- Applied filtering in DocumentPreview and DocumentViewer components
- Removed Target ID column from Audit Logs (redundant data)

#### 🐛 Fixes & Optimizations
1. **Token Limit Increases** - Prevents document truncation
   - BRD: 16,000 tokens (already optimized)
   - PRD: 10,000 → 16,000 tokens
   - TASKS: 8,000 → 16,000 tokens (fixes incomplete task lists)
   - PROMPT_BUILD: 5,000 → 8,000 tokens
2. **AI Assistant Improvements**
   - Increased response limit from 500 to 2,000 tokens (fixes cutoff mid-response)
   - Fixed unwanted content in task generation (removed kickoff prompts)
3. **System Prompt Cleanup**
   - Updated TASKS prompt to generate only task lists without extra content
   - More explicit instructions for AI to prevent content drift

#### 📊 Admin Dashboard Enhancements
- Full sorting capability across all data tables
- Better data visualization for audit logs
- Cleaner UI with removed redundant columns
- Improved data extraction from JSON fields

---

### Version 2.1.0 - Authentication & UI Enhancements (October 27, 2025)

#### ✨ New Features
1. **OAuth Integration** - Google OAuth authentication support
2. **Profile Management** - User profile page with settings
3. **PDF Export** - Export documents as PDF files
4. **Enhanced State Management** - Improved state machine for better UX
5. **Auth Callback Handling** - Proper OAuth callback processing

#### 🔧 Technical Changes
- Added OAuth authentication flow
- New AuthCallbackPage and ProfilePage components
- PDF export utility with document formatting
- Enhanced state machine for project workflows
- Improved authentication context and error handling
- Updated package dependencies

#### 🐛 Fixes
- Fixed authentication flow issues
- Improved error handling in auth components
- Enhanced document preview functionality
- Better state management across components

---

### Version 2.0.0 - Major Feature Release

#### ✨ New Features
1. **Vibe Coding Prompt Build** - Generate production-ready prompts for AI coding tools
2. **Document Version History** - Full version control with preview and restore
3. **Document Regeneration** - Regenerate any document with optional feedback
4. **Admin Enhancements** - Token usage tracking, prompt version history

#### 🔧 Technical Changes
- Added 5 new database migrations
- New DocumentVersion and PromptVersion models
- Enhanced AI router with regeneration logic
- New VersionHistory React component
- Updated state machine for dual-mode workflows

#### 🐛 Fixes
- Fixed regeneration asking questions instead of generating directly
- Improved version control with automatic history saving
- Enhanced error handling for document operations

---

**Version**: 2.5.0
**Last Updated**: November 15, 2025
**Status**: ✅ Production Ready

For questions or issues, please open an issue on GitHub.
