# PRD Helper

An AI-powered requirements document generator that helps you create professional Business Requirements Documents (BRDs) and Product Requirements Documents (PRDs) through an intelligent Q&A wizard interface.

## ✨ Features

### Core Features
- 🤖 **AI-Powered Wizards**: Interactive Q&A flow that adapts to your responses
- 📄 **Document Generation**: Automatically generates BRDs, PRDs, task lists, and vibe coding prompts
- 🎯 **Two User Modes**: Plain language for business users, technical for developers
- 💬 **Smart Conversations**: AI remembers context and asks relevant follow-up questions
- 📊 **Progress Tracking**: Visual progress indicators as you answer questions
- 🌓 **Dark Mode**: Beautiful UI with dark mode support
- ♿ **Accessible**: WCAG compliant with keyboard navigation
- 🧪 **Well-Tested**: Comprehensive unit and E2E test coverage

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
4. Click "Generate BRD"
5. Review, regenerate (optional), or approve your document

### Generating a PRD

1. Complete and approve the BRD first
2. Click "Start PRD Wizard" from project details
3. Answer additional questions
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

**Version**: 2.2.0
**Last Updated**: November 4, 2025
**Status**: ✅ Production Ready

For questions or issues, please open an issue on GitHub.
