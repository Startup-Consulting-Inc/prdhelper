/**
 * Authentication Context
 *
 * Provides authentication state and methods throughout the app.
 * Includes automatic session timeout after 1 hour of inactivity.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { useActivityTimeout } from '../hooks/useActivityTimeout';

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
  createdAt: Date | string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    modePreference: 'PLAIN' | 'TECHNICAL';
  }) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });
  const [isLoading, setIsLoading] = useState(true);

  // Get current user profile
  const { data: currentUser, isLoading: isLoadingUser } = trpc.auth.me.useQuery(undefined, {
    enabled: !!token,
    retry: false,
  });

  // Login mutation
  const loginMutation = trpc.auth.login.useMutation();

  // Signup mutation
  const signupMutation = trpc.auth.signUp.useMutation();

  // Update user state when profile is fetched
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser as User);
    }
    setIsLoading(isLoadingUser);
  }, [currentUser, isLoadingUser]);

  // Login function
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const result = await loginMutation.mutateAsync({ email, password });

        // Save token
        localStorage.setItem('auth_token', result.token);
        setToken(result.token);
        setUser(result.user as User);
      } catch (error) {
        // Error is handled by the caller
        throw error;
      }
    },
    [loginMutation]
  );

  // Signup function
  // Note: This now returns the email for use in verification flow
  const signup = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      modePreference: 'PLAIN' | 'TECHNICAL';
    }): Promise<{ success: boolean; email: string; message: string }> => {
      try {
        const result = await signupMutation.mutateAsync(data);

        // Do NOT save token or set user - email verification is required
        // Return the result for the caller to handle (redirect to verification page)
        return {
          success: result.success,
          email: result.email,
          message: result.message,
        };
      } catch (error) {
        // Error is handled by the caller
        throw error;
      }
    },
    [signupMutation]
  );

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    // Navigate to homepage after logout
    navigate('/');
  }, [navigate]);

  // Update user function
  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  // Set token function (for OAuth callback)
  const handleSetToken = useCallback((newToken: string) => {
    localStorage.setItem('auth_token', newToken);
    setToken(newToken);
  }, []);

  // Activity timeout - automatically logout after 1 hour of inactivity
  useActivityTimeout(
    logout,
    60 * 60 * 1000, // 1 hour in milliseconds
    !!user && !!token // Only track when user is authenticated
  );

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    signup,
    logout,
    updateUser,
    setToken: handleSetToken,
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

