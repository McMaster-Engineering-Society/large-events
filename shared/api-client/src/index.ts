// Client-side auth exports
export {
  type ClientAuthConfig,
  type ClientAuthClient,
  createAuthClient,
} from './client-auth';

// Instance API interface (platform-agnostic)
export { type InstanceApi } from '@large-event/api-types';

// API client exports
export {
  type StorageAdapter,
  type ApiClientConfig,
  type HttpClient,
  type RequestConfig,
  createFetchClient,
  createInstanceApi,
  localStorageAdapter,
  sessionStorageAdapter,
} from './client';

// Auth API exports
export {
  type AuthApi,
  type AuthApiConfig,
  createAuthApi,
} from './auth-api';

// Token storage exports
export {
  type TokenStorage,
  type TokenStorageConfig,
  createTokenStorage,
} from './storage/token-storage';

// Cross-tab auth exports
export {
  type CrossTabAuth,
  type CrossTabAuthConfig,
  type AuthEventType,
  type AuthEvent,
  createCrossTabAuth,
} from './utils/cross-tab-auth';

// Auth context exports
export {
  type AuthContextConfig,
  type AuthContextValue,
  createAuthContext,
} from './contexts/auth-context';

// React hooks exports
export {
  useInstances,
  useInstance,
  type UseInstancesOptions,
  type UseInstancesResult,
  type UseInstanceOptions,
  type UseInstanceResult,
} from './hooks';

// React context exports
export {
  InstanceProvider,
  useInstanceContext,
  type InstanceContextConfig,
  type InstanceContextValue,
  type InstanceProviderProps,
} from './contexts';
