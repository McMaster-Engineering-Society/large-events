/**
 * React hook for fetching a single instance
 * Provides a simple interface for loading instance data by ID
 */

import { useState, useEffect, useCallback } from 'react';
import type { InstanceResponse } from '@large-event/api-types';
import type { InstanceApi } from '../client';

export interface UseInstanceOptions {
  /** Instance API client */
  instanceApi: InstanceApi;
  /** Instance ID to fetch */
  instanceId: number | null;
  /** Auto-fetch on mount (default: true) */
  autoFetch?: boolean;
}

export interface UseInstanceResult {
  /** Instance data */
  instance: InstanceResponse | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Refetch instance */
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching a single instance by ID
 *
 * @example
 * ```tsx
 * const { instance, loading, error, refetch } = useInstance({
 *   instanceApi,
 *   instanceId: 1
 * });
 *
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * if (!instance) return <div>Instance not found</div>;
 *
 * return <div>{instance.name}</div>;
 * ```
 */
export function useInstance(options: UseInstanceOptions): UseInstanceResult {
  const { instanceApi, instanceId, autoFetch = true } = options;
  const [instance, setInstance] = useState<InstanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchInstance = useCallback(async () => {
    if (instanceId === null) {
      setInstance(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await instanceApi.getInstance(instanceId);
      setInstance(response);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch instance');
      setError(error);
      console.error('Error fetching instance:', error);
    } finally {
      setLoading(false);
    }
  }, [instanceApi, instanceId]);

  useEffect(() => {
    if (autoFetch) {
      fetchInstance();
    }
  }, [autoFetch, fetchInstance]);

  return {
    instance,
    loading,
    error,
    refetch: fetchInstance,
  };
}
