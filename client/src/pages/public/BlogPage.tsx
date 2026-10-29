/**
 * Blog Page
 *
 * Public page listing blog posts and articles.
 * Features: category filter tabs, redesigned cards with category icons,
 * improved featured post with icon grid.
 */

import { PublicLayout } from '../../components/layout/PublicLayout';
import { SEO } from '../../components/SEO';
import {
  Calendar,
  User,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Zap,
  Wrench,
  FileText,
  Star,
  GraduationCap,
  Database,
  Search,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const CATEGORY_STYLES: Record<string, { bg: string; text: string; icon: LucideIcon }> = {
  Guides:               { bg: 'bg-blue-500',    text: 'text-blue-50',    icon: BookOpen },
  'Best Practices':     { bg: 'bg-purple-500',  text: 'text-purple-50',  icon: CheckCircle },
  'AI & Development':   { bg: 'bg-emerald-500', text: 'text-emerald-50', icon: Zap },
  Tools:                { bg: 'bg-orange-500',  text: 'text-orange-50',  icon: Wrench },
  Templates:            { bg: 'bg-rose-500',    text: 'text-rose-50',    icon: FileText },
  Featured:             { bg: 'bg-pink-500',    text: 'text-pink-50',    icon: Star },
  'AI & Education':          { bg: 'bg-indigo-500',  text: 'text-indigo-50',  icon: GraduationCap },
  'AI & Data Infrastructure': { bg: 'bg-violet-600',  text: 'text-violet-50',  icon: Database },
};

const DEFAULT_STYLE: { bg: string; text: string; icon: LucideIcon } = {
  bg: 'bg-gray-500',
  text: 'text-gray-50',
  icon: BookOpen,
};

function isNew(dateStr: string): boolean {
  const postDate = new Date(dateStr);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 14);
  return postDate >= cutoff;
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');

  const blogPosts = [
    {
      id: 48,
      slug: 'agentic-coding-needs-better-requirements-2026',
      title: 'Why Agentic Coding Needs Better Requirements — Not Faster Vibes (2026 Edition)',
      excerpt:
        "Builder.io proved 270 developers can build from a PRD in 60 minutes. They didn't measure how many rebuilt the next week. Here's how to avoid AI coding's hidden quality debt.",
      author: 'ClearlyReqs Team',
      date: '2026-10-29',
      readTime: '10 min read',
      category: 'AI & Development',
    },
    {
      id: 47,
      slug: 'agentic-coding-needs-requirements-2026',
      title: 'Why Agentic Coding Needs Better Requirements — Not Faster Vibes (2026)',
      excerpt:
        "Builder.io proved 270 developers can build apps from PRDs in 60 minutes. But speed without structure creates quality debt. Here's how non-developers can avoid rebuilds with proper BRDs.",
      author: 'ClearlyReqs Team',
      date: '2026-06-18',
      readTime: '8 min read',
      category: 'AI & Development',
    },