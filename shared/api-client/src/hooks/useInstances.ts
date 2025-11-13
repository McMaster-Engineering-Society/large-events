/**
 * React hook for fetching instances
 * Provides a simple interface for loading instance data
 */

import { useState, useEffect, useCallback } from 'react';
import type { InstanceResponse } from '@large-event/api-types';
import type { InstanceApi } from '../client';

export interface UseInstancesOptions {
  /** Instance API client */
  instanceApi: InstanceApi;
  /** Auto-fetch on mount (default: true) */
  autoFetch?: boolean;
}

export interface UseInstancesResult {
  /** Array of instances */
  instances: InstanceResponse[];
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Refetch instances */
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching user's accessible instances
 *
 * @example
 * ```tsx
 * const { instances, loading, error, refetch } = useInstances({ instanceApi });
 *
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return (
 *   <div>
 *     {instances.map(instance => (
 *       <div key={instance.id}>{instance.name}</div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useInstances(options: UseInstancesOptions): UseInstancesResult {
  const { instanceApi, autoFetch = true } = options;
  const [instances, setInstances] = useState<InstanceResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchInstances = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await instanceApi.getInstances();
      setInstances(response.instances);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch instances');
      setError(error);
      console.error('Error fetching instances:', error);
    } finally {
      setLoading(false);
    }
  }, [instanceApi]);

  useEffect(() => {
    if (autoFetch) {
      fetchInstances();
    }
  }, [autoFetch, fetchInstances]);

  return {
    instances,
    loading,
    error,
    refetch: fetchInstances,
  };
}
