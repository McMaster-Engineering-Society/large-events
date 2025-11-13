/**
 * Shared API Client Factory
 * Creates configured API clients for web and mobile platforms
 */

import type { InstanceListResponse, InstanceResponse, InstanceApi } from '@large-event/api-types';

// Re-export for internal package use
export type { InstanceApi };

/**
 * Platform-specific storage interface
 * Implementations can use localStorage, sessionStorage, AsyncStorage, etc.
 */
export interface StorageAdapter {
  getItem(key: string): Promise<string | null> | string | null;
  setItem(key: string, value: string): Promise<void> | void;
  removeItem(key: string): Promise<void> | void;
}

/**
 * API Client configuration
 */
export interface ApiClientConfig {
  /** Base URL for API requests */
  baseURL: string;
  /** Authentication strategy */
  authType: 'cookie' | 'bearer';
  /** Storage adapter for tokens (required for bearer auth) */
  storage?: StorageAdapter;
  /** Storage key for auth token */
  tokenKey?: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Additional headers to include in all requests */
  headers?: Record<string, string>;
}

/**
 * Generic HTTP client interface
 * Can be implemented with fetch, axios, or any other HTTP library
 */
export interface HttpClient {
  get<T = any>(url: string, config?: RequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: RequestConfig): Promise<T>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

/**
 * Creates a fetch-based HTTP client
 * Works in both browser and React Native environments
 */
export function createFetchClient(config: ApiClientConfig): HttpClient {
  const { baseURL, authType, storage, tokenKey = '@auth_token', timeout = 30000 } = config;

  /**
   * Get authorization header based on auth type
   */
  async function getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    if (authType === 'bearer' && storage) {
      const token = await storage.getItem(tokenKey);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Make a fetch request with timeout and auth
   */
  async function request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const headers = await getAuthHeaders();
      const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          ...headers,
          ...(options.headers || {}),
        },
        credentials: authType === 'cookie' ? 'include' : options.credentials,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  return {
    get: <T = any>(url: string, config?: RequestConfig) =>
      request<T>(url, { method: 'GET', ...config }),

    post: <T = any>(url: string, data?: any, config?: RequestConfig) =>
      request<T>(url, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
        ...config,
      }),

    put: <T = any>(url: string, data?: any, config?: RequestConfig) =>
      request<T>(url, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
        ...config,
      }),

    delete: <T = any>(url: string, config?: RequestConfig) =>
      request<T>(url, { method: 'DELETE', ...config }),
  };
}

/**
 * Creates an instance API client
 */
export function createInstanceApi(httpClient: HttpClient): InstanceApi {
  return {
    async getInstances(): Promise<InstanceListResponse> {
      const response = await httpClient.get<{ instances: InstanceResponse[]; count: number }>('/instances');
      return {
        instances: response.instances || [],
        count: response.count || 0,
      };
    },

    async getInstance(id: number): Promise<InstanceResponse> {
      const response = await httpClient.get<{ instance: InstanceResponse }>(`/instances/${id}`);
      return response.instance;
    },
  };
}

/**
 * Browser localStorage adapter
 */
export const localStorageAdapter: StorageAdapter = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};

/**
 * Browser sessionStorage adapter
 */
export const sessionStorageAdapter: StorageAdapter = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
  },
};
