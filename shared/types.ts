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

// Language Preferences Types
export type ProjectLanguage = 'en' | 'ko' | 'ja' | 'zh' | 'auto';

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  ko: '한국어 (Korean)',
  ja: '日本語 (Japanese)',
  zh: '中文 (Chinese)',
  auto: 'Auto-detect',
} as const;
