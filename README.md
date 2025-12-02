# Clearly

In the era of AI-driven development—whether you're using Cursor, Claude, or other AI coding tools—the quality of your specifications directly impacts your outcomes. Clear requirements = better AI-generated code.

Clearly uses an intelligent Q&A wizard to guide both technical and non-technical team members through the specification process, generating actionable outputs that work seamlessly with modern development workflows.

## ✨ Features

### Core Features
- 🤖 **AI-Powered Wizards**: Interactive Q&A flow that adapts to your responses
- 💡 **Contextual Tips**: Helpful tips explaining what questions mean and why they matter, with detailed explanations, pros and cons for each sample answer—no matter your technical background
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
- 👥 **Real-time Collaboration**: Invite team members to collaborate on projects with viewer or editor permissions, making it easy to align stakeholders and iterate together on your requirements
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
  - Export users to CSV with all user data (name, email, role, projects, created date)
  - Sortable columns for easy data organization
- 🔧 **System Prompt Management**: Edit and version control all AI system prompts
- 📊 **Token Usage Tracking**: Monitor AI token consumption and costs
- 📜 **Audit Logs**: Complete audit trail of all system actions
- 🔒 **Role-Based Access**: User and Admin role support with permission controls

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore database
- OpenRouter API key ([Get one here](https://openrouter.ai/))
- Google Cloud project (for production deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/Startup-Consulting-Inc/prdhelper
cd prd

# Install dependencies (root, server, and client)
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your API keys and Firebase configuration

# Set up Firebase
# 1. Create a Firebase project at https://console.firebase.google.com
# 2. Enable Firestore Database
# 3. Download service account key from Project Settings > Service Accounts
# 4. Save it as server/firebase-service-account.json (or update FIREBASE_ADMIN_SDK_KEY_PATH in .env)
# 5. Get Firebase client config from Project Settings > General > Your apps > Web app
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

### Running with Docker

The application can be run using Docker Compose for a containerized development environment:

```bash
# Build and start containers
docker-compose up --build

# Or run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

**Docker Configuration:**

- Server runs on `http://localhost:3000`
- Client runs on `http://localhost:5173`
- Environment variable `VITE_API_TARGET=http://server:3000` enables client-to-server communication within Docker network
- Shared TypeScript types accessible via `@shared` path alias in client code
- GCS health check automatically skipped in development if credentials not configured

**Note:** The `.env` file is shared between containers. Make sure it's properly configured before starting Docker services.

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
- Firebase Admin SDK for Firestore database
- Google Cloud Firestore (named database: "clearly")
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
│   ├── firebase-service-account.json  # Firebase Admin SDK key (gitignored)
│   └── tsconfig.json
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   ├── hooks/      # Custom hooks
│   │   └── lib/        # Utilities
│   ├── e2e/            # Playwright E2E tests
│   └── tsconfig.json
├── scripts/            # Deployment and utility scripts
├── terraform/           # Infrastructure as Code (gitignored)
├── shared/             # Shared TypeScript types
└── docs/               # Documentation
```

## 🗄️ Database

### Firestore Database

The project uses **Google Cloud Firestore** (named database: "clearly") for all data storage. The database structure uses Firestore collections and subcollections:

**Main Collections:**
- `users` - User accounts and profiles
- `projects` - Project documents with subcollections:
  - `documents` - BRD, PRD, Tasks, Prompt Build documents
  - `conversations` - AI conversation history per document type
  - `collaborators` - Team members with roles (VIEWER, EDITOR)
  - `invites` - Pending collaboration invitations
- `systemPrompts` - AI system prompts with version history
- `demoRequests` - Contact form submissions
- `auditLogs` - System audit trail
- `tokenUsage` - AI token consumption tracking

### Database Features

#### Team Collaboration
- Project collaborators stored in `projects/{id}/collaborators` subcollection
- Role-based access: VIEWER (read-only), EDITOR (full edit), OWNER (full control)
- Invitation management with 7-day expiration

#### Document Version History
- Document versions stored as subcollection `projects/{id}/documents/{docId}/versions`
- Automatic versioning on regeneration
- Full restore capability with audit logging

#### System Prompt Management
- System prompts with version history in `systemPrompts/{id}/versions`
- Admin can view and revert prompt changes


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
- Firebase for authentication and Firestore database
- tRPC for type-safe APIs
- The React and Vite communities

---

**Version**: 2.6.0
**Last Updated**: November 19, 2025
**Status**: ✅ Production Ready with Staging Environment

For questions or issues, please open an issue on GitHub.
