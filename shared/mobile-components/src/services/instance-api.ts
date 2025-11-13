/**
 * Mobile Instance API implementation using axios
 * Implements the platform-agnostic InstanceApi interface
 */

import type { AxiosInstance } from 'axios';
import type { InstanceApi, InstanceListResponse, InstanceResponse } from '@large-event/api-types';

/**
 * Create a mobile-specific instance API client
 * Uses axios but conforms to the shared InstanceApi interface
 *
 * @param axiosClient - Configured axios instance (from createMobileApiClient)
 * @returns InstanceApi implementation
 *
 * @example
 * ```tsx
 * import { createMobileApiClient, createMobileInstanceApi } from '@large-event/mobile-components';
 *
 * const apiClient = createMobileApiClient({
 *   port: 3004,
 *   tokenKey: '@teamd_auth_token'
 * });
 *
 * const instanceApi = createMobileInstanceApi(apiClient);
 *
 * // Fetch instances
 * const { instances } = await instanceApi.getInstances();
 *
 * // Fetch single instance
 * const instance = await instanceApi.getInstance(1);
 * ```
 */
export function createMobileInstanceApi(axiosClient: AxiosInstance): InstanceApi {
  return {
    async getInstances(): Promise<InstanceListResponse> {
      const response = await axiosClient.get<{
        instances: InstanceResponse[];
        count: number;
      }>('/instances');

      return {
        instances: response.data.instances || [],
        count: response.data.count || 0,
      };
    },

    async getInstance(id: number): Promise<InstanceResponse> {
      const response = await axiosClient.get<{ instance: InstanceResponse }>(
        `/instances/${id}`
      );

      return response.data.instance;
    },
  };
}
