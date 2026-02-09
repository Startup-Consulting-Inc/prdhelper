/**
 * Authentication Context
 *
 * Provides authentication state and methods throughout the app.
 * Uses Firebase Authentication for auth state management.
 * Includes automatic session timeout after 1 hour of inactivity.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import {
  signIn as firebaseSignIn,
  signUp as firebaseSignUp,
  signOut as firebaseSignOut,
  signInWithGoogle as firebaseSignInWithGoogle,
  onAuthChange,
  getIdToken,
  startTokenRefresh,
  stopTokenRefresh,
  type User as FirebaseUser,
} from '../lib/firebase';
import { useActivityTimeout } from '../hooks/useActivityTimeout';
import type { TechPreferences } from '@shared/types';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  modePreference: 'PLAIN' | 'TECHNICAL';
  image?: string | null;
  bio?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  linkedInUrl?: string | null;
  websiteUrl?: string | null;
  location?: string | null;
  githubUrl?: string | null;
  techPreferences?: TechPreferences | null;
  createdAt: Date | string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    modePreference: 'PLAIN' | 'TECHNICAL';
  }) => Promise<{ success: boolean; email: string; message: string }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get current user profile from backend
  const { data: currentUser, isLoading: isLoadingUser, refetch } = trpc.auth.me.useQuery(undefined, {
    enabled: !!firebaseUser,
    retry: 3, // Retry up to 3 times to handle token timing issues
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Signup mutation (creates user profile in backend)
  const signupMutation = trpc.auth.signUp.useMutation();

  // Update user state when profile is fetched
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser as User);
      setIsLoading(false);
      // Invalidate project caches so they refetch with valid auth
      utils.projects.invalidate();
    } else if (!isLoadingUser && !firebaseUser) {
      // Only set user to null if we're not loading AND there's no Firebase user
      setUser(null);
      setIsLoading(false);
    } else if (!isLoadingUser && firebaseUser) {
      // Firebase user exists but query failed - keep loading state to prevent premature redirect
      console.warn('Firebase user exists but profile fetch failed, retrying...');
      setIsLoading(true);
      // Trigger a refetch after a short delay
      setTimeout(() => {
        refetch();
      }, 1000);
    } else {
      setIsLoading(isLoadingUser);
    }
  }, [currentUser, isLoadingUser, firebaseUser, refetch]);

  // Subscribe to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      console.log('[AuthContext] Firebase auth state changed:', {
        uid: firebaseUser?.uid,
        email: firebaseUser?.email,
        hasToken: !!localStorage.getItem('firebaseToken'),
      });

      setFirebaseUser(firebaseUser);

      if (!firebaseUser) {
        console.log('[AuthContext] User logged out');
        setUser(null);
        setIsLoading(false);
        // Stop token refresh when user logs out
        stopTokenRefresh();
      } else {
        console.log('[AuthContext] User logged in, enabling profile query');
        // Firebase user exists, profile will be loaded by the query
        setIsLoading(true);
        // Start automatic token refresh to prevent 1-hour expiration
        startTokenRefresh();
      }
    });

    return () => {
      unsubscribe();
      // Clean up token refresh on component unmount
      stopTokenRefresh();
    };
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      await firebaseSignIn(email, password);
      // Firebase auth state change will trigger profile fetch and token refresh
    } catch (error: any) {
      // Enhanced error handling with specific messages
      console.error('Login error:', error);

      // Handle Firebase Auth errors
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password. Please try again.');
      }

      if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please try again later or reset your password.');
      }

      if (error.code === 'auth/user-disabled') {
        throw new Error('This account has been disabled. Please contact support.');
      }

      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        throw new Error('Network error. Please check your connection and try again.');
      }

      // Default error message
      throw new Error(error.message || 'Failed to sign in. Please try again.');
    }
  }, []);

  // Signup function
  const signup = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      modePreference: 'PLAIN' | 'TECHNICAL';
    }): Promise<{ success: boolean; email: string; message: string }> => {
      try {
        // Backend creates both Firebase Auth user AND Firestore document
        // This is a single atomic operation that ensures consistency
        const result = await signupMutation.mutateAsync({
          name: data.name,
          email: data.email,
          password: data.password,
          modePreference: data.modePreference,
        });

        // CRITICAL FIX: Sign in the user on the client after backend creates the account
        // This triggers onAuthStateChanged and stores the token
        try {
          await firebaseSignIn(data.email, data.password);
          console.log('User signed in after signup');
        } catch (signInError) {
          console.error('Failed to sign in after signup:', signInError);
          // Continue anyway - user can manually sign in
        }

        // Return the result for the caller to handle (redirect to verification page)
        return {
          success: result.success,
          email: data.email,
          message: 'Account created successfully. Please check your email to verify your account.',
        };
      } catch (error: any) {
        // Enhanced error handling with specific messages
        console.error('Signup error:', error);

        // Handle network errors with retry suggestion
        if (error.message?.includes('fetch') || error.message?.includes('network')) {
          throw new Error('Network error. Please check your connection and try again.');
        }

        // Handle tRPC errors with backend error messages
        if (error.data?.code === 'CONFLICT') {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }

        if (error.data?.code === 'BAD_REQUEST') {
          throw new Error(error.message || 'Invalid signup information. Please check your details.');
        }

        // Default error message
        throw new Error(error.message || 'Failed to create account. Please try again.');
      }
    },
    [signupMutation]
  );

  // Google OAuth login
  const loginWithGoogle = useCallback(async () => {
    try {
      await firebaseSignInWithGoogle();
      // Firebase auth state change will trigger profile fetch and token refresh
    } catch (error: any) {
      // Enhanced error handling with specific messages
      console.error('Google login error:', error);

      // Handle popup closed by user
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign in was cancelled. Please try again.');
      }

      // Handle popup blocked
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by your browser. Please allow popups and try again.');
      }

      // Handle network errors
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        throw new Error('Network error. Please check your connection and try again.');
      }

      // Default error message
      throw new Error(error.message || 'Failed to sign in with Google. Please try again.');
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Stop token refresh immediately
      stopTokenRefresh();
      await firebaseSignOut();
      setUser(null);
      setFirebaseUser(null);
      // Use window.location for hard navigation to ensure state is cleared
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if Firebase call fails
      stopTokenRefresh();
      setUser(null);
      setFirebaseUser(null);
      window.location.href = '/';
    }
  }, []);

  // Update user function
  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  // Session expiration warning - notify user before auto-logout
  const handleSessionWarning = useCallback(() => {
    console.warn('[AuthContext] Session expiring soon due to inactivity');
    // Show a browser-level alert so it's visible even during wizard flows
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('session-expiring', {
        detail: { minutesLeft: 5 },
      }));
    }
  }, []);

  // Activity timeout - automatically logout after 1 hour of inactivity
  // Warning fires 5 minutes before the actual logout
  useActivityTimeout(
    logout,
    60 * 60 * 1000, // 1 hour in milliseconds
    !!user && !!firebaseUser, // Only track when user is authenticated
    handleSessionWarning,
    5 * 60 * 1000 // Warn 5 minutes before timeout
  );

  const value: AuthContextType = {
    user,
    firebaseUser,
    isLoading,
    isAuthenticated: !!user && !!firebaseUser,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
