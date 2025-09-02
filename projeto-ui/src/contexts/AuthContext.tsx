'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { User, LoginForm, UserSchema } from '@/types/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginForm) => Promise<void>;
  register: (userData: UserSchema) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setToken(storedToken);
      apiClient.setToken(storedToken);
      // TODO: Verify token and get user info
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginForm) => {
    try {
      const tokenResponse = await apiClient.login(credentials);
      setToken(tokenResponse.access_token);
      
      // TODO: Get user info after login
      // For now, we'll set a basic user object
      setUser({
        id: 1,
        username: credentials.username,
        email: credentials.username, // API uses email as username
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: UserSchema) => {
    try {
      await apiClient.createUser(userData);
      // After successful registration, log the user in
      await login({ username: userData.email, password: userData.password });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    apiClient.removeToken();
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
