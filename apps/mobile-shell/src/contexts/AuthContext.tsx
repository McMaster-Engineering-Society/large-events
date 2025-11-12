import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import type { AuthUser, InstanceResponse } from '@large-event/api-types';
import { authApi, instanceApi, tokenStorage } from '../services/api';

interface AuthContextType {
  user: AuthUser | null;
  instances: InstanceResponse[];
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshInstances: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [instances, setInstances] = useState<InstanceResponse[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Handle app state changes (foreground/background)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    // When app comes to foreground, validate auth
    if (nextAppState === 'active') {
      const storedToken = await tokenStorage.getToken();
      if (storedToken && !user) {
        // Token exists but user not loaded - check auth
        await checkAuth();
      }
    }
  };

  /**
   * Check authentication status on app load
   */
  const checkAuth = async () => {
    try {
      setLoading(true);

      // Check if token exists in AsyncStorage
      const storedToken = await tokenStorage.getToken();

      if (!storedToken) {
        // No token, user not authenticated
        setLoading(false);
        return;
      }

      // Token exists, verify it's valid by fetching user
      try {
        const userData = await authApi.me();
        setUser(userData);
        setToken(storedToken);

        // Fetch user's instances
        await fetchInstances();
      } catch (error) {
        // Token invalid or expired
        console.error('Auth check failed:', error);
        await tokenStorage.removeToken();
        setUser(null);
        setToken(null);
        setInstances([]);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login with email
   */
  const login = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);

      // Call login API
      const response = await authApi.login(email);

      // Save token to AsyncStorage
      await tokenStorage.saveToken(response.token);

      // Update state
      setUser(response.user);
      setToken(response.token);

      // Fetch instances
      await fetchInstances();

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout and clear all auth data
   */
  const logout = async () => {
    try {
      setLoading(true);

      // Call logout API
      await authApi.logout();

      // Clear token from AsyncStorage
      await tokenStorage.removeToken();

      // Clear state
      setUser(null);
      setToken(null);
      setInstances([]);
    } catch (error) {
      console.error('Logout error:', error);

      // Even if API call fails, clear local state
      await tokenStorage.removeToken();
      setUser(null);
      setToken(null);
      setInstances([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch user's instances
   */
  const fetchInstances = async () => {
    try {
      const response = await instanceApi.getInstances();
      setInstances(response.instances || []);
    } catch (error) {
      console.error('Error fetching instances:', error);
      setInstances([]);
    }
  };

  /**
   * Refresh instances (for pull-to-refresh)
   */
  const refreshInstances = async () => {
    await fetchInstances();
  };

  const value: AuthContextType = {
    user,
    instances,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    refreshInstances,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
