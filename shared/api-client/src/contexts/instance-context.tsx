/**
 * Shared Instance Context Provider
 * Manages user's accessible instances and current selected instance
 *
 * This context can be configured for different applications:
 * - Web apps (cookie or bearer auth)
 * - Mobile apps (bearer auth with AsyncStorage)
 * - Team-specific configurations
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { InstanceResponse } from '@large-event/api-types';
import type { InstanceApi, StorageAdapter } from '../client';

export interface InstanceContextConfig {
  /** Instance API client for fetching data */
  instanceApi: InstanceApi;
  /** Storage adapter for persisting selected instance */
  storage?: StorageAdapter;
  /** Storage key for selected instance (default: 'selected-instance-id') */
  storageKey?: string;
  /** Custom event name to listen for refresh triggers (optional) */
  refreshEventName?: string;
  /** Auto-fetch instances on mount (default: true) */
  autoFetch?: boolean;
}

export interface InstanceContextValue {
  /** Currently selected instance */
  currentInstance: InstanceResponse | null;
  /** All accessible instances */
  instances: InstanceResponse[];
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Set the current instance and persist to storage */
  setCurrentInstance: (instance: InstanceResponse) => void;
  /** Clear the current instance */
  clearCurrentInstance: () => void;
  /** Refresh instances from API */
  refreshInstances: () => Promise<void>;
}

const InstanceContext = createContext<InstanceContextValue | undefined>(undefined);

export interface InstanceProviderProps {
  children: ReactNode;
  config: InstanceContextConfig;
}

/**
 * Instance Context Provider
 *
 * @example
 * ```tsx
 * // Web app with sessionStorage
 * import { sessionStorageAdapter, createFetchClient, createInstanceApi } from '@large-event/api';
 *
 * const httpClient = createFetchClient({
 *   baseURL: 'http://localhost:3004/api',
 *   authType: 'bearer',
 *   storage: sessionStorageAdapter,
 * });
 * const instanceApi = createInstanceApi(httpClient);
 *
 * <InstanceProvider config={{
 *   instanceApi,
 *   storage: sessionStorageAdapter,
 *   storageKey: 'teamd-current-instance',
 *   refreshEventName: 'teamd-auth-changed'
 * }}>
 *   <App />
 * </InstanceProvider>
 * ```
 *
 * @example
 * ```tsx
 * // Mobile app with AsyncStorage
 * import AsyncStorage from '@react-native-async-storage/async-storage';
 *
 * const asyncStorageAdapter = {
 *   getItem: (key) => AsyncStorage.getItem(key),
 *   setItem: (key, value) => AsyncStorage.setItem(key, value),
 *   removeItem: (key) => AsyncStorage.removeItem(key),
 * };
 *
 * <InstanceProvider config={{
 *   instanceApi,
 *   storage: asyncStorageAdapter,
 *   storageKey: '@current_instance_id'
 * }}>
 *   <App />
 * </InstanceProvider>
 * ```
 */
export function InstanceProvider({ children, config }: InstanceProviderProps) {
  const {
    instanceApi,
    storage,
    storageKey = 'selected-instance-id',
    refreshEventName,
    autoFetch = true,
  } = config;

  const [currentInstance, setCurrentInstanceState] = useState<InstanceResponse | null>(null);
  const [instances, setInstances] = useState<InstanceResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Refresh instances from API
   */
  const refreshInstances = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await instanceApi.getInstances();
      setInstances(response.instances);

      // Try to restore previously selected instance if storage is available
      if (storage) {
        const storedInstanceId = await storage.getItem(storageKey);
        if (storedInstanceId) {
          const restoredInstance = response.instances.find(
            (inst) => inst.id === parseInt(storedInstanceId, 10)
          );
          if (restoredInstance) {
            setCurrentInstanceState(restoredInstance);
          } else {
            // Clear invalid stored instance
            await storage.removeItem(storageKey);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching instances:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch instances');
    } finally {
      setLoading(false);
    }
  }, [instanceApi, storage, storageKey]);

  /**
   * Set current instance and persist to storage
   */
  const setCurrentInstance = useCallback(
    async (instance: InstanceResponse) => {
      setCurrentInstanceState(instance);
      if (storage) {
        await storage.setItem(storageKey, instance.id.toString());
      }
    },
    [storage, storageKey]
  );

  /**
   * Clear current instance
   */
  const clearCurrentInstance = useCallback(async () => {
    setCurrentInstanceState(null);
    if (storage) {
      await storage.removeItem(storageKey);
    }
  }, [storage, storageKey]);

  // Load instances on mount
  useEffect(() => {
    if (autoFetch) {
      refreshInstances();
    }
  }, [autoFetch, refreshInstances]);

  // Listen for custom refresh events (e.g., auth changes)
  useEffect(() => {
    if (!refreshEventName) return;

    const handleRefreshEvent = () => {
      console.log(`[InstanceContext] Received ${refreshEventName} event, refreshing instances...`);
      refreshInstances();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(refreshEventName, handleRefreshEvent);
      return () => {
        window.removeEventListener(refreshEventName, handleRefreshEvent);
      };
    }
  }, [refreshEventName, refreshInstances]);

  const value: InstanceContextValue = {
    currentInstance,
    instances,
    loading,
    error,
    setCurrentInstance,
    clearCurrentInstance,
    refreshInstances,
  };

  return <InstanceContext.Provider value={value}>{children}</InstanceContext.Provider>;
}

/**
 * Hook to access instance context
 * Must be used within an InstanceProvider
 */
export function useInstanceContext() {
  const context = useContext(InstanceContext);
  if (context === undefined) {
    throw new Error('useInstanceContext must be used within an InstanceProvider');
  }
  return context;
}
