/**
 * Shared Type Definitions
 * 
 * Common TypeScript interfaces and types used across frontend and backend.
 * Provides type safety for API responses and shared data structures.
 * 
 * Recent Changes:
 * - [2025-10-27] FEAT: Added shared type definitions for API responses
 */

// Shared types between frontend and backend

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
}

// Email Verification Types
export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  token?: string; // JWT token returned after successful verification
  user?: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
  };
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  email: string; // Return email for displaying in verification pending page
}

// Tech Preferences Types
export interface TechPreferences {
  frontend?: string | null;
  backend?: string | null;
  database?: string | null;
  authentication?: string | null;
  cloudPlatform?: string | null;
  infrastructureBuild?: string | null;
  deployment?: string | null;
  containerization?: string | null;
  secretManagement?: string | null;
  aiLlmModel?: string | null;
  aiAgenticFramework?: string | null;
}

export const TECH_OPTIONS = {
  frontend: [
    'React (Vite)',
    'React (Next.js)',
    'React (Create React App)',
    'Vue.js',
    'Vue (Nuxt.js)',
    'Angular',
    'Svelte',
    'SvelteKit',
    'Solid.js',
    'Qwik',
  ],
  backend: [
    'Node.js (Express)',
    'Node.js (Fastify)',
    'Node.js (NestJS)',
    'Python (FastAPI)',
    'Python (Django)',
    'Python (Flask)',
    'Go (Gin)',
    'Go (Fiber)',
    'Ruby on Rails',
    'Java (Spring Boot)',
  ],
  database: [
    'Google Cloud Firestore',
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'Redis',
    'Supabase',
    'PlanetScale',
    'AWS DynamoDB',
    'CockroachDB',
    'SQLite',
  ],
  authentication: [
    'Firebase Authentication',
    'Auth0',
    'Clerk',
    'AWS Cognito',
    'Supabase Auth',
    'NextAuth.js',
    'Passport.js',
    'OAuth 2.0 (Custom)',
    'SAML',
  ],
  cloudPlatform: [
    'Google Cloud Platform (GCP)',
    'Amazon Web Services (AWS)',
    'Microsoft Azure',
    'Vercel',
    'Netlify',
    'Railway',
    'Render',
    'Fly.io',
    'DigitalOcean',
  ],
  infrastructureBuild: [
    'Terraform',
    'AWS CloudFormation',
    'Pulumi',
    'AWS CDK',
    'Google Cloud Deployment Manager',
    'Azure Resource Manager (ARM)',
    'Ansible',
    'Chef',
    'Manual Configuration',
  ],
  deployment: [
    'Google Cloud Run',
    'Google Cloud Build',
    'Firebase Hosting',
    'Vercel',
    'AWS ECS/Fargate',
    'AWS Lambda',
    'Kubernetes',
    'Docker Swarm',
    'Heroku',
    'Netlify',
  ],
  containerization: [
    'Docker',
    'Podman',
    'Containerd',
    'LXC/LXD',
    'Not Using Containers',
  ],
  secretManagement: [
    'Google Secret Manager',
    'AWS Secrets Manager',
    'Azure Key Vault',
    'HashiCorp Vault',
    'Doppler',
    '1Password Secrets Automation',
    'Environment Variables (.env)',
  ],
  aiLlmModel: [
    'OpenRouter',
    'OpenAI (GPT-4, GPT-3.5)',
    'Anthropic Claude',
    'Google Gemini',
    'AWS Bedrock',
    'Azure OpenAI',
    'Cohere',
    'Hugging Face',
    'Ollama (Local)',
  ],
  aiAgenticFramework: [
    'LangChain',
    'LlamaIndex',
    'AutoGen',
    'CrewAI',
    'Semantic Kernel',
    'Haystack',
    'Rasa',
    'Custom Framework',
  ],
} as const;

// Output Tool Types
export type OutputToolType =
  | 'VIBE_V0'
  | 'VIBE_LOVEABLE'
  | 'VIBE_BOLT'
  | 'VIBE_REPLIT'
  | 'VIBE_FIREBASE_STUDIO'
  | 'CLAUDE_CODE'
  | 'CURSOR'
  | 'OPENAI_CODEX'
  | 'GOOGLE_ANTIGRAVITY';

export type OutputToolCategory = 'VIBE_CODING' | 'AI_CODING';

export interface OutputToolInfo {
  id: OutputToolType;
  label: string;
  description: string;
  category: OutputToolCategory;
  outputDescription: string;
}

export const OUTPUT_TOOLS: OutputToolInfo[] = [
  // Vibe Coding Tools
  {
    id: 'VIBE_V0',
    label: 'v0 (Vercel)',
    description: 'React + Next.js App Router + Tailwind CSS + shadcn/ui',
    category: 'VIBE_CODING',
    outputDescription: 'Project context + three-input structured prompts optimized for v0',
  },
  {
    id: 'VIBE_LOVEABLE',
    label: 'Loveable',
    description: 'React + Vite + TypeScript + Tailwind CSS + Supabase',
    category: 'VIBE_CODING',
    outputDescription: 'Knowledge file + scaffold prompt + feature-by-feature prompts',
  },
  {
    id: 'VIBE_BOLT',
    label: 'Bolt.new',
    description: 'JavaScript/TypeScript ecosystem, browser-based WebContainer',
    category: 'VIBE_CODING',
    outputDescription: 'System prompt + project prompt + .bolt/prompt file content',
  },
  {
    id: 'VIBE_REPLIT',
    label: 'Replit',
    description: '50+ languages, full Linux container, Python/JS/Go and more',
    category: 'VIBE_CODING',
    outputDescription: 'replit.md file + step-by-step implementation prompts',
  },
  {
    id: 'VIBE_FIREBASE_STUDIO',
    label: 'Firebase Studio',
    description: 'Next.js (App Prototyping Agent), Gemini AI, Firebase services',
    category: 'VIBE_CODING',
    outputDescription: '.idx/airules.md + prototyping agent prompts',
  },
  // AI Coding Tools
  {
    id: 'CLAUDE_CODE',
    label: 'Claude Code',
    description: 'Anthropic CLI tool with CLAUDE.md configuration',
    category: 'AI_CODING',
    outputDescription: 'CLAUDE.md + .claude/settings.json + reference document',
  },
  {
    id: 'CURSOR',
    label: 'Cursor',
    description: 'AI-powered IDE with .mdc rule files',
    category: 'AI_CODING',
    outputDescription: '.cursor/rules/*.mdc + AGENTS.md + reference document',
  },
  {
    id: 'OPENAI_CODEX',
    label: 'OpenAI Codex',
    description: 'OpenAI CLI tool with AGENTS.md',
    category: 'AI_CODING',
    outputDescription: 'AGENTS.md + .codex/config.toml + reference document',
  },
  {
    id: 'GOOGLE_ANTIGRAVITY',
    label: 'Google Antigravity',
    description: 'Google Gemini agent with rules, skills, and workflows',
    category: 'AI_CODING',
    outputDescription: '.agent/ rules + skills + workflows + AGENTS.md + reference document',
  },
];

export const VIBE_CODING_TOOLS = OUTPUT_TOOLS.filter((t) => t.category === 'VIBE_CODING');
export const AI_CODING_TOOLS = OUTPUT_TOOLS.filter((t) => t.category === 'AI_CODING');

// Tool Output File Structure (for AI coding tools that produce multiple files)
export interface ToolOutputFile {
  path: string;
  content: string;
  description?: string;
}

export interface ToolOutputBundle {
  toolType: OutputToolType;
  files: ToolOutputFile[];
  referenceDoc?: string;
  prdContent?: string;
}

// Tool Output Document shape (returned by documents.getById for TOOL_OUTPUT documents)
export interface ToolOutputDocumentData {
  id: string;
  projectId: string;
  type: 'TOOL_OUTPUT';
  toolType: OutputToolType;
  content: string;
  rawContent: string;
  bundle: string; // JSON-stringified ToolOutputBundle
  status: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
}

// Language Preferences Types
export type ProjectLanguage = 'en' | 'ko' | 'ja' | 'zh' | 'auto';

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  ko: '한국어 (Korean)',
  ja: '日本語 (Japanese)',
  zh: '中文 (Chinese)',
  auto: 'Auto-detect',
} as const;
