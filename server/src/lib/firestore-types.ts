/**
 * Firestore Document Type Definitions
 *
 * Strict interfaces for Firestore document shapes used across tRPC routers.
 * Casting doc.data() to these interfaces ensures TypeScript properly infers
 * tRPC return types, which propagates correct types to the client.
 */

import type { Timestamp } from './firebase.js';

// ---------------------------------------------------------------------------
// Project Collection
// ---------------------------------------------------------------------------

export interface ProjectData {
  id: string;
  userId: string;
  title: string;
  description: string;
  mode: 'PLAIN' | 'TECHNICAL' | 'UNIFIED';
  language?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  currentPhase?: string;
  skipProblemDefinition?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ---------------------------------------------------------------------------
// Documents Subcollection (under projects/{projectId}/documents)
// ---------------------------------------------------------------------------

export interface DocumentData {
  id: string;
  projectId: string;
  type: string;
  content: string;
  status: 'DRAFT' | 'APPROVED';
  version: number;
  approvedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ---------------------------------------------------------------------------
// Versions Subcollection (under projects/{projectId}/documents/{docId}/versions)
// ---------------------------------------------------------------------------

export interface DocumentVersionData {
  id: string;
  version: number;
  content: string;
  status: string;
  approvedAt: Timestamp | null;
  createdBy: string;
  createdAt: Timestamp;
}

// ---------------------------------------------------------------------------
// Conversations Subcollection (under projects/{projectId}/conversations)
// ---------------------------------------------------------------------------

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ConversationData {
  id: string;
  projectId: string;
  documentType: string;
  messages: ConversationMessage[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ---------------------------------------------------------------------------
// Collaborators Subcollection (under projects/{projectId}/collaborators)
// ---------------------------------------------------------------------------

export interface CollaboratorData {
  id: string;
  projectId: string;
  userId: string;
  role: 'VIEWER' | 'EDITOR';
  invitedBy: string;
  invitedAt: Timestamp;
  acceptedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ---------------------------------------------------------------------------
// Invites Subcollection (under projects/{projectId}/invites)
// ---------------------------------------------------------------------------

export interface InviteData {
  id: string;
  token: string;
  projectId: string;
  invitedEmail: string;
  invitedUserId: string | null;
  inviterId: string;
  role: 'VIEWER' | 'EDITOR';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  expiresAt: Timestamp | Date;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ---------------------------------------------------------------------------
// Users Collection
// ---------------------------------------------------------------------------

export interface UserData {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image: string | null;
  role: 'USER' | 'ADMIN';
  modePreference: 'PLAIN' | 'TECHNICAL';
  bio: string | null;
  company: string | null;
  jobTitle: string | null;
  linkedInUrl: string | null;
  websiteUrl: string | null;
  location: string | null;
  githubUrl: string | null;
  techPreferences: Record<string, string | null> | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ---------------------------------------------------------------------------
// TokenUsage Collection
// ---------------------------------------------------------------------------

export interface TokenUsageData {
  id: string;
  userId: string;
  projectId?: string;
  operation: string;
  model: string;
  tokensUsed: number;
  cost: number;
  createdAt: Timestamp;
}

// ---------------------------------------------------------------------------
// AuditLogs Collection
// ---------------------------------------------------------------------------

export interface AuditLogData {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: Record<string, unknown>;
  ipAddress?: string | null;
  createdAt: Timestamp;
}

// ---------------------------------------------------------------------------
// SystemPrompts Collection
// ---------------------------------------------------------------------------

export interface SystemPromptData {
  id: string;
  type: string;
  prompt: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ---------------------------------------------------------------------------
// Prompt Versions Subcollection (under systemPrompts/{promptId}/versions)
// ---------------------------------------------------------------------------

export interface PromptVersionData {
  id: string;
  promptId: string;
  prompt: string;
  version: number;
  createdBy: string;
  createdAt: Timestamp;
}
