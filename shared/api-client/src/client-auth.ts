import type { AuthUser, AuthToken } from '@large-event/api-types';

/**
 * Configuration for the client-side auth client
 */
export interface ClientAuthConfig {
  /**
   * Prefix for sessionStorage keys (e.g., 'teamd', 'teama', 'teamb')
   * Will create keys like: `${storagePrefix}-auth-user`, `${storagePrefix}-auth-token`, etc.
   */
  storagePrefix: string;

  /**
   * Optional API URL for checking shared cookie authentication
   * Example: 'http://localhost:3004'
   */
  apiUrl?: string;

  /**
   * Enable debug logging to console
   * @default false
   */
  debug?: boolean;
}

/**
 * Client-side authentication utilities
 * Provides methods for JWT handling, sessionStorage management, and auth state
 */
export interface ClientAuthClient {
  /**
   * Decode and verify a JWT token (client-side only - checks expiry, not signature)
   * @param token - JWT token string
   * @returns Decoded token payload or null if invalid/expired
   */
  verifyToken(token: string): AuthToken | null;

  /**
   * Extract authentication from URL query parameters
   * Automatically stores auth to sessionStorage and cleans URL
   * @returns User and token if auth token found in URL, null otherwise
   */
  getAuthFromUrl(): { user: AuthUser; token: string } | null;

  /**
   * Get stored authentication from sessionStorage
   * Validates token expiry before returning
   * @returns User and token if valid auth exists, null otherwise
   */
  getStoredAuth(): { user: AuthUser; token: string } | null;

  /**
   * Store authentication to sessionStorage
   * @param user - User object to store
   * @param token - JWT token to store
   * @param source - Optional source identifier (e.g., 'main', 'local')
   */
  setStoredAuth(user: AuthUser, token: string, source?: string): void;

  /**
   * Clear all authentication data from sessionStorage
   */
  clearStoredAuth(): void;

  /**
   * Get the current authenticated user
   * Checks URL first, then sessionStorage, then shared cookie auth
   * @returns Current user or null if not authenticated
   */
  getCurrentUser(): AuthUser | null;

  /**
   * Check for authentication via shared cookie from team API
   * Requires apiUrl to be configured
   * @returns User if authenticated via cookie, null otherwise
   */
  checkSharedCookieAuth(): Promise<AuthUser | null>;
}

/**
 * Create a client-side authentication client
 *
 * @example
 * ```typescript
 * import { createAuthClient } from '@large-event/api/client';
 *
 * const auth = createAuthClient({
 *   storagePrefix: 'teamd',
 *   apiUrl: 'http://localhost:3004',
 *   debug: false
 * });
 *
 * // Get current user
 * const user = auth.getCurrentUser();
 *
 * // Clear auth
 * auth.clearStoredAuth();
 * ```
 *
 * @param config - Configuration for the auth client
 * @returns Auth client with all authentication methods
 */
export function createAuthClient(config: ClientAuthConfig): ClientAuthClient {
  const { storagePrefix, apiUrl, debug = false } = config;

  const log = (...args: any[]) => {
    if (debug) {
      console.log(`[${storagePrefix}-auth]`, ...args);
    }
  };

  const getStorageKey = (key: string) => `${storagePrefix}-auth-${key}`;

  /**
   * Simple JWT decoder for client-side (no verification, just decode)
   * Server should verify the token signature
   */
  function decodeJWT(token: string): AuthToken | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));
      return payload as AuthToken;
    } catch (error) {
      log('Error decoding JWT:', error);
      return null;
    }
  }

  function verifyToken(token: string): AuthToken | null {
    try {
      const decoded = decodeJWT(token);

      // Check if token is expired
      if (decoded && decoded.exp) {
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp < now) {
          log('Token expired');
          return null;
        }
      }

      return decoded;
    } catch (error) {
      log('Error verifying token:', error);
      return null;
    }
  }

  function getAuthFromUrl(): { user: AuthUser; token: string } | null {
    if (typeof window === 'undefined') return null;

    log('Current URL:', window.location.href);
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('auth');
    log('Auth token from URL:', authToken);

    if (!authToken) return null;

    const decoded = verifyToken(authToken);
    log('Decoded token:', decoded);

    if (decoded?.user) {
      // Store the auth info in sessionStorage for persistence
      sessionStorage.setItem(getStorageKey('user'), JSON.stringify(decoded.user));
      sessionStorage.setItem(getStorageKey('token'), authToken);
      sessionStorage.setItem(getStorageKey('source'), 'main');
      log('Stored auth to sessionStorage');

      // Clean up URL
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      log('Cleaned URL to:', newUrl);

      return { user: decoded.user, token: authToken };
    }
    return null;
  }

  function getStoredAuth(): { user: AuthUser; token: string } | null {
    if (typeof window === 'undefined') return null;

    try {
      const storedUser = sessionStorage.getItem(getStorageKey('user'));
      const storedToken = sessionStorage.getItem(getStorageKey('token'));
      log('Stored user from sessionStorage:', storedUser);
      log('Stored token from sessionStorage:', storedToken ? 'present' : 'missing');

      if (!storedUser || !storedToken) return null;

      // Verify token is still valid
      const decoded = verifyToken(storedToken);
      log('Decoded stored token:', decoded);

      if (!decoded) {
        log('Token invalid, clearing storage');
        clearStoredAuth();
        return null;
      }

      const parsedUser = JSON.parse(storedUser);
      log('Returning parsed user:', parsedUser);
      return { user: parsedUser, token: storedToken };
    } catch (error) {
      log('Error in getStoredAuth:', error);
      clearStoredAuth();
      return null;
    }
  }

  function setStoredAuth(user: AuthUser, token: string, source?: string): void {
    if (typeof window === 'undefined') return;

    sessionStorage.setItem(getStorageKey('user'), JSON.stringify(user));
    sessionStorage.setItem(getStorageKey('token'), token);
    if (source) {
      sessionStorage.setItem(getStorageKey('source'), source);
    }
    log('Stored auth:', { user, source });
  }

  function clearStoredAuth(): void {
    if (typeof window === 'undefined') return;

    sessionStorage.removeItem(getStorageKey('user'));
    sessionStorage.removeItem(getStorageKey('token'));
    sessionStorage.removeItem(getStorageKey('source'));
    log('Cleared stored auth');
  }

  function getCurrentUser(): AuthUser | null {
    log('getCurrentUser called');

    // First try to get from URL (new session)
    const urlAuth = getAuthFromUrl();
    log('URL auth:', urlAuth);
    if (urlAuth) return urlAuth.user;

    // Then try stored session
    const stored = getStoredAuth();
    log('Stored auth:', stored);
    return stored?.user || null;
  }

  async function checkSharedCookieAuth(): Promise<AuthUser | null> {
    if (!apiUrl) {
      log('No apiUrl configured for checkSharedCookieAuth');
      return null;
    }

    try {
      log('Checking shared cookie auth...');
      // Check team API which will validate the shared cookie
      const response = await fetch(`${apiUrl}/api/auth/me`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        log('Shared cookie auth response:', data);

        if (data.success && data.data?.user) {
          const user = data.data.user;
          // Note: We don't have the token from cookie auth
          // Store user info but not token
          sessionStorage.setItem(getStorageKey('user'), JSON.stringify(user));
          sessionStorage.setItem(getStorageKey('source'), 'main');
          log('Authenticated via shared cookie');
          return user;
        }
      } else {
        log('Shared cookie auth failed:', response.status);
      }
    } catch (error) {
      log('Error checking shared cookie auth:', error);
    }

    return null;
  }

  return {
    verifyToken,
    getAuthFromUrl,
    getStoredAuth,
    setStoredAuth,
    clearStoredAuth,
    getCurrentUser,
    checkSharedCookieAuth,
  };
}
