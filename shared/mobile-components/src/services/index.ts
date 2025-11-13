/**
 * Mobile services and utilities
 */

// Storage
export {
  asyncStorageAdapter,
  setJsonItem,
  getJsonItem,
  clearAll,
} from './storage';

// Platform utilities
export {
  getApiBaseUrl,
  isIOS,
  isAndroid,
  isWeb,
  getPlatform,
  selectPlatform,
} from './platform';

// API client
export {
  createMobileApiClient,
  unwrapApiResponse,
} from './api-client';

export type { MobileApiConfig } from './api-client';

// Instance API
export { createMobileInstanceApi } from './instance-api';
