/**
 * Mobile API client factory using axios
 */

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { asyncStorageAdapter } from './storage';
import { getApiBaseUrl } from './platform';

export interface MobileApiConfig {
  /** Port number for the API */
  port: number;
  /** Optional base path (e.g., '/api') */
  basePath?: string;
  /** Storage key for auth token */
  tokenKey?: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Create a mobile API client with axios
 * Automatically handles platform-specific URLs and token injection
 *
 * @example
 * ```tsx
 * import { createMobileApiClient } from '@large-event/mobile-components';
 *
 * const api = createMobileApiClient({
 *   port: 3004,
 *   basePath: '/api',
 *   tokenKey: '@teamd_auth_token'
 * });
 *
 * // Use the client
 * const response = await api.get('/instances');
 * ```
 */
export function createMobileApiClient(config: MobileApiConfig): AxiosInstance {
  const {
    port,
    basePath,
    tokenKey = '@auth_token',
    timeout = 30000,
    debug = false,
  } = config;

  const baseURL = getApiBaseUrl(port, basePath);

  if (debug) {
    console.log('[MobileAPI] Creating client with baseURL:', baseURL);
  }

  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor: Add auth token
  instance.interceptors.request.use(
    async (config) => {
      try {
        const token = await asyncStorageAdapter.getItem(tokenKey);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          if (debug) {
            console.log('[MobileAPI] Request with token:', config.method?.toUpperCase(), config.url);
          }
        }
      } catch (error) {
        console.error('[MobileAPI] Error getting token:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor: Handle errors and unwrap responses
  instance.interceptors.response.use(
    (response) => {
      if (debug) {
        console.log('[MobileAPI] Response:', response.status, response.config.url);
      }

      // Unwrap { success, data } API response format
      if (response.data?.success && 'data' in response.data) {
        return { ...response, data: response.data.data };
      }

      return response;
    },
    async (error) => {
      if (debug) {
        console.error('[MobileAPI] Error:', error.response?.status, error.config?.url);
      }

      // Handle 401 Unauthorized - clear token
      if (error.response?.status === 401) {
        await asyncStorageAdapter.removeItem(tokenKey);
        console.log('[MobileAPI] Token cleared due to 401');
      }

      return Promise.reject(error);
    }
  );

  return instance;
}

/**
 * Unwrap API response from standard format { success, data, error }
 *
 * @deprecated This function is no longer needed as the axios interceptor
 * automatically unwraps responses. Simply access response.data directly.
 *
 * @example
 * ```tsx
 * const response = await api.get('/instances');
 * const instances = response.data; // Already unwrapped
 * ```
 */
export function unwrapApiResponse<T = any>(response: AxiosResponse): T {
  // Since the interceptor now unwraps automatically, just return response.data
  return response.data as T;
}
