/**
 * Shared Authentication API Client
 * Provides standardized login/logout/me endpoints for all applications
 */

import type { AuthUser, AuthResponse, LoginDto } from '@large-event/api-types';
import type { HttpClient } from './client';

/**
 * Authentication API interface
 */
export interface AuthApi {
  /**
   * Log in a user with email
   * @param email - User's email address
   * @returns Auth response with user and token
   */
  login(email: string): Promise<AuthResponse>;

  /**
   * Log out the current user
   */
  logout(): Promise<void>;

  /**
   * Get the current authenticated user
   * @returns Current user information
   */
  me(): Promise<AuthUser>;

  /**
   * Get the stored auth token (bearer auth only)
   * @returns Token string or null
   */
  getToken?(): Promise<string | null>;
}

/**
 * Configuration for auth API
 */
export interface AuthApiConfig {
  /** HTTP client for making requests */
  httpClient: HttpClient;
  /** Base path for auth endpoints (default: '/api/auth') */
  basePath?: string;
  /** Authentication type */
  authType: 'cookie' | 'bearer';
}

/**
 * Create an authentication API client
 *
 * @example Cookie-based (Main Portal)
 * ```typescript
 * const httpClient = createFetchClient({
 *   baseURL: 'http://localhost',
 *   authType: 'cookie'
 * });
 *
 * const authApi = createAuthApi({
 *   httpClient,
 *   authType: 'cookie'
 * });
 *
 * const response = await authApi.login('user@example.com');
 * ```
 *
 * @example Bearer token-based (Mobile)
 * ```typescript
 * const httpClient = createFetchClient({
 *   baseURL: 'http://localhost:3004',
 *   authType: 'bearer',
 *   storage: AsyncStorage,
 *   tokenKey: '@teamd_auth_token'
 * });
 *
 * const authApi = createAuthApi({
 *   httpClient,
 *   authType: 'bearer'
 * });
 *
 * const response = await authApi.login('user@example.com');
 * ```
 */
export function createAuthApi(config: AuthApiConfig): AuthApi {
  const { httpClient, basePath = '/api/auth', authType } = config;

  return {
    async login(email: string): Promise<AuthResponse> {
      const dto: LoginDto = { email };
      const response = await httpClient.post<AuthResponse>(
        `${basePath}/login`,
        dto,
        authType === 'cookie' ? { credentials: 'include' } : undefined
      );
      return response;
    },

    async logout(): Promise<void> {
      await httpClient.post(
        `${basePath}/logout`,
        undefined,
        authType === 'cookie' ? { credentials: 'include' } : undefined
      );
    },

    async me(): Promise<AuthUser> {
      const response = await httpClient.get<{ user?: AuthUser }>(
        `${basePath}/me`,
        authType === 'cookie' ? { credentials: 'include' } : undefined
      );

      if (!response.user) {
        throw new Error('User not found in response');
      }

      return response.user;
    },

    async getToken(): Promise<string | null> {
      if (authType === 'bearer' && config.httpClient) {
        // For bearer auth, we'd need to expose token from storage
        // This is implementation-specific
        return null;
      }
      return null;
    },
  };
}
