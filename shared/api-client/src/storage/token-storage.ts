/**
 * Unified Token Storage Abstraction
 * Works with sessionStorage (web), localStorage (web), AsyncStorage (mobile)
 */

import type { StorageAdapter } from '../client';
import type { AuthUser } from '@large-event/api-types';

/**
 * Token storage interface
 */
export interface TokenStorage {
  /**
   * Save authentication data
   */
  saveAuth(user: AuthUser, token: string, source?: string): Promise<void>;

  /**
   * Get authentication data
   */
  getAuth(): Promise<{ user: AuthUser; token: string } | null>;

  /**
   * Save just the token
   */
  saveToken(token: string): Promise<void>;

  /**
   * Get just the token
   */
  getToken(): Promise<string | null>;

  /**
   * Save just the user
   */
  saveUser(user: AuthUser): Promise<void>;

  /**
   * Get just the user
   */
  getUser(): Promise<AuthUser | null>;

  /**
   * Clear all authentication data
   */
  clearAuth(): Promise<void>;

  /**
   * Get the storage key prefix
   */
  getKeyPrefix(): string;
}

/**
 * Configuration for token storage
 */
export interface TokenStorageConfig {
  /** Storage adapter (sessionStorage, localStorage, AsyncStorage, etc.) */
  storage: StorageAdapter;
  /** Prefix for storage keys (e.g., 'teamd', 'main-portal') */
  prefix: string;
}

/**
 * Create a token storage instance
 *
 * @example Web with sessionStorage
 * ```typescript
 * import { sessionStorageAdapter } from '@large-event/api';
 *
 * const storage = createTokenStorage({
 *   storage: sessionStorageAdapter,
 *   prefix: 'main-portal'
 * });
 *
 * await storage.saveAuth(user, token, 'local');
 * const auth = await storage.getAuth();
 * ```
 *
 * @example Mobile with AsyncStorage
 * ```typescript
 * import AsyncStorage from '@react-native-async-storage/async-storage';
 *
 * const asyncStorageAdapter = {
 *   getItem: (key: string) => AsyncStorage.getItem(key),
 *   setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
 *   removeItem: (key: string) => AsyncStorage.removeItem(key),
 * };
 *
 * const storage = createTokenStorage({
 *   storage: asyncStorageAdapter,
 *   prefix: 'teamd'
 * });
 * ```
 */
export function createTokenStorage(config: TokenStorageConfig): TokenStorage {
  const { storage, prefix } = config;

  const getKey = (suffix: string) => `${prefix}-auth-${suffix}`;

  return {
    async saveAuth(user: AuthUser, token: string, source?: string): Promise<void> {
      await Promise.all([
        storage.setItem(getKey('user'), JSON.stringify(user)),
        storage.setItem(getKey('token'), token),
        source ? storage.setItem(getKey('source'), source) : Promise.resolve(),
      ]);
    },

    async getAuth(): Promise<{ user: AuthUser; token: string } | null> {
      try {
        const [userStr, token] = await Promise.all([
          storage.getItem(getKey('user')),
          storage.getItem(getKey('token')),
        ]);

        if (!userStr || !token) {
          return null;
        }

        const user = JSON.parse(userStr) as AuthUser;
        return { user, token };
      } catch (error) {
        console.error('Error getting auth from storage:', error);
        return null;
      }
    },

    async saveToken(token: string): Promise<void> {
      await storage.setItem(getKey('token'), token);
    },

    async getToken(): Promise<string | null> {
      return await storage.getItem(getKey('token'));
    },

    async saveUser(user: AuthUser): Promise<void> {
      await storage.setItem(getKey('user'), JSON.stringify(user));
    },

    async getUser(): Promise<AuthUser | null> {
      try {
        const userStr = await storage.getItem(getKey('user'));
        if (!userStr) return null;
        return JSON.parse(userStr) as AuthUser;
      } catch (error) {
        console.error('Error getting user from storage:', error);
        return null;
      }
    },

    async clearAuth(): Promise<void> {
      await Promise.all([
        storage.removeItem(getKey('user')),
        storage.removeItem(getKey('token')),
        storage.removeItem(getKey('source')),
      ]);
    },

    getKeyPrefix(): string {
      return prefix;
    },
  };
}
