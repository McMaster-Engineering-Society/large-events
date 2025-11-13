/**
 * Shared Auth Context Factory
 * Creates configurable authentication contexts for web and mobile apps
 */

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, InstanceResponse } from '@large-event/api-types';
import type { AuthApi } from '../auth-api';
import type { TokenStorage } from '../storage/token-storage';
import type { CrossTabAuth } from '../utils/cross-tab-auth';
import type { ClientAuthClient } from '../client-auth';

/**
 * Auth context configuration
 */
export interface AuthContextConfig {
  /** Authentication API client */
  authApi: AuthApi;
  /** Token storage (optional, for bearer auth) */
  tokenStorage?: TokenStorage;
  /** Cross-tab synchronization (optional) */
  crossTabAuth?: CrossTabAuth;
  /** Auth client for URL token extraction (optional, for bearer auth) */
  authClient?: ClientAuthClient;
  /** Custom events to dispatch on auth changes (e.g., ['auth-changed']) */
  customEvents?: string[];
  /** Logout behavior: 'reload' reloads page, 'none' does nothing */
  onLogoutBehavior?: 'reload' | 'none';
  /** Enable instance management */
  enableInstanceManagement?: boolean;
  /** Instance API fetch function (if instance management enabled) */
  fetchInstances?: () => Promise<InstanceResponse[]>;
  /** Callback after successful login */
  onLogin?: (user: AuthUser) => void | Promise<void>;
  /** Callback after logout */
  onLogout?: () => void | Promise<void>;
  /** Skip cookie auth fallback (prevents authApi.me() call for bearer-only apps) */
  skipCookieFallback?: boolean;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Auth context value
 */
export interface AuthContextValue {
  /** Current authenticated user */
  user: AuthUser | null;
  /** Current auth token (if using bearer auth) */
  token: string | null;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** User's accessible instances (if enabled) */
  instances: InstanceResponse[];
  /** Login function */
  login: (email: string) => Promise<boolean>;
  /** Logout function */
  logout: () => Promise<void>;
  /** Loading state */
  loading: boolean;
  /** Refresh instances */
  refreshInstances?: () => Promise<void>;
}

/**
 * Create an authentication context and provider
 *
 * @example Main Portal (Cookie Auth + Instance Management)
 * ```typescript
 * const authApi = createAuthApi({
 *   httpClient: createFetchClient({
 *     baseURL: 'http://localhost',
 *     authType: 'cookie'
 *   }),
 *   authType: 'cookie'
 * });
 *
 * const crossTabAuth = createCrossTabAuth({
 *   onLogout: () => console.log('Logout from another tab')
 * });
 *
 * const { AuthProvider, useAuth } = createAuthContext({
 *   authApi,
 *   crossTabAuth,
 *   enableInstanceManagement: true,
 *   fetchInstances: async () => {
 *     const response = await fetch('/api/instances', { credentials: 'include' });
 *     const data = await response.json();
 *     return data.instances || [];
 *   }
 * });
 * ```
 *
 * @example Team App (Bearer Auth + URL Inheritance)
 * ```typescript
 * const authClient = createAuthClient({
 *   storagePrefix: 'teamd',
 *   apiUrl: window.location.origin
 * });
 *
 * const storage = createTokenStorage({
 *   storage: sessionStorageAdapter,
 *   prefix: 'teamd'
 * });
 *
 * const authApi = createAuthApi({
 *   httpClient: createFetchClient({
 *     baseURL: window.location.origin,
 *     authType: 'bearer',
 *     storage: sessionStorageAdapter,
 *     tokenKey: 'teamd-auth-token'
 *   }),
 *   authType: 'bearer'
 * });
 *
 * const { AuthProvider, useAuth } = createAuthContext({
 *   authApi,
 *   tokenStorage: storage,
 *   enableInstanceManagement: false
 * });
 * ```
 */
export function createAuthContext(config: AuthContextConfig) {
  const {
    authApi,
    tokenStorage,
    crossTabAuth,
    authClient,
    customEvents = [],
    onLogoutBehavior = 'none',
    enableInstanceManagement = false,
    fetchInstances,
    onLogin,
    onLogout,
    skipCookieFallback = false,
    debug = false,
  } = config;

  const log = (...args: any[]) => {
    if (debug) {
      console.log('[AuthContext]', ...args);
    }
  };

  // Create the context
  const AuthContext = createContext<AuthContextValue | undefined>(undefined);

  /**
   * Dispatch custom events
   */
  const dispatchCustomEvents = () => {
    if (customEvents.length > 0 && typeof window !== 'undefined') {
      customEvents.forEach((eventName) => {
        window.dispatchEvent(new CustomEvent(eventName));
      });
    }
  };

  /**
   * Auth Provider Component
   */
  function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [instances, setInstances] = useState<InstanceResponse[]>([]);
    const [loading, setLoading] = useState(true);

    // Check authentication on mount
    useEffect(() => {
      checkAuth();
    }, []);

    // Setup cross-tab auth listener
    useEffect(() => {
      if (!crossTabAuth) return;

      log('Setting up cross-tab auth listener');

      // The cleanup function
      return () => {
        log('Cleaning up cross-tab auth listener');
        crossTabAuth.cleanup();
      };
    }, []);

    /**
     * Check if user is authenticated
     */
    const checkAuth = async () => {
      try {
        log('Checking auth...');

        // Check for URL-based auth token first (bearer auth)
        if (authClient) {
          const urlAuth = await authClient.getAuthFromUrl();
          if (urlAuth) {
            log('Found auth from URL:', urlAuth.user.email);
            setUser(urlAuth.user);
            setToken(urlAuth.token);

            // Store it for future use
            if (tokenStorage) {
              await tokenStorage.saveAuth(urlAuth.user, urlAuth.token, 'local');
            }

            if (enableInstanceManagement && fetchInstances) {
              await refreshInstances();
            }

            dispatchCustomEvents();
            setLoading(false);
            return;
          }
        }

        // For bearer auth with token storage, check stored token
        if (tokenStorage) {
          const auth = await tokenStorage.getAuth();
          if (auth) {
            log('Found stored auth:', auth.user.email);
            setUser(auth.user);
            setToken(auth.token);

            if (enableInstanceManagement && fetchInstances) {
              await refreshInstances();
            }

            dispatchCustomEvents();
            setLoading(false);
            return;
          }
        }

        // Try to get user from API (cookie auth) - skip if bearer-only mode
        if (!skipCookieFallback) {
          try {
            const currentUser = await authApi.me();
            log('Got user from API:', currentUser.email);
            setUser(currentUser);

            // For cookie auth, token is not exposed
            setToken(null);

            if (enableInstanceManagement && fetchInstances) {
              await refreshInstances();
            }

            dispatchCustomEvents();
          } catch (error) {
            log('No authenticated user:', error);
          }
        }
      } catch (error) {
        log('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    /**
     * Refresh user's instances
     */
    const refreshInstances = async () => {
      if (!enableInstanceManagement || !fetchInstances) {
        log('Instance management not enabled');
        return;
      }

      try {
        log('Fetching instances...');
        const userInstances = await fetchInstances();
        log('Got instances:', userInstances.length);
        setInstances(userInstances);
      } catch (error) {
        log('Failed to fetch instances:', error);
        console.error('Failed to fetch instances:', error);
      }
    };

    /**
     * Login function
     */
    const login = async (email: string): Promise<boolean> => {
      try {
        log('Logging in:', email);
        const response = await authApi.login(email);

        if (response.user) {
          log('Login successful:', response.user.email);
          setUser(response.user);

          // Set token if provided (bearer auth)
          if (response.token) {
            setToken(response.token);

            // Store token if using bearer auth
            if (tokenStorage) {
              await tokenStorage.saveAuth(response.user, response.token, 'local');
            }
          } else {
            setToken(null);
          }

          // Fetch instances if enabled
          if (enableInstanceManagement && fetchInstances) {
            await refreshInstances();
          }

          // Dispatch custom events
          dispatchCustomEvents();

          // Call onLogin callback
          if (onLogin) {
            await onLogin(response.user);
          }

          return true;
        }

        log('Login failed: no user in response');
        return false;
      } catch (error) {
        log('Login error:', error);
        console.error('Login failed:', error);
        return false;
      }
    };

    /**
     * Logout function
     */
    const logout = async () => {
      try {
        log('Logging out...');
        await authApi.logout();

        // Clear token storage
        if (tokenStorage) {
          await tokenStorage.clearAuth();
        }

        // Broadcast logout to other tabs
        if (crossTabAuth) {
          crossTabAuth.broadcast('logout');
        }

        // Clear state
        setUser(null);
        setToken(null);
        setInstances([]);

        // Dispatch custom events
        dispatchCustomEvents();

        // Call onLogout callback
        if (onLogout) {
          await onLogout();
        }

        log('Logout complete');

        // Handle logout behavior
        if (onLogoutBehavior === 'reload' && typeof window !== 'undefined') {
          window.location.reload();
        }
      } catch (error) {
        log('Logout error:', error);
        console.error('Logout failed:', error);

        // Clear state anyway
        setUser(null);
        setToken(null);
        setInstances([]);

        if (tokenStorage) {
          await tokenStorage.clearAuth();
        }
      }
    };

    const value: AuthContextValue = {
      user,
      token,
      isAuthenticated: user !== null,
      instances,
      login,
      logout,
      loading,
      ...(enableInstanceManagement && { refreshInstances }),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }

  /**
   * useAuth hook
   */
  function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  }

  return {
    AuthProvider,
    useAuth,
    AuthContext,
  };
}
