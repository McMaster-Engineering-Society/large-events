/**
 * @large-event/web-components
 * Shared web component library for Large Event Platform main portals
 */

// Auth components
export { default as LoginForm } from './components/auth/LoginForm';
export type { LoginFormProps } from './components/auth/LoginForm';

export { default as ProtectedRoute } from './components/auth/ProtectedRoute';
export type { ProtectedRouteProps } from './components/auth/ProtectedRoute';

export { default as TeamLocalLoginForm } from './components/auth/TeamLocalLoginForm';
export type { TeamLocalLoginFormProps, SeedUser } from './components/auth/TeamLocalLoginForm';

export { default as ProtectedTeamRoute, PORTAL_CONFIGS } from './components/auth/ProtectedTeamRoute';
export type { ProtectedTeamRouteProps, PortalType, PortalConfig } from './components/auth/ProtectedTeamRoute';

// Re-export shared API utilities for convenience
export {
  createAuthContext,
  createAuthApi,
  createFetchClient,
  createTokenStorage,
  createCrossTabAuth,
  sessionStorageAdapter,
  localStorageAdapter,
} from '@large-event/api-client';

export type {
  AuthContextConfig,
  AuthContextValue,
  AuthApi,
  AuthApiConfig,
  HttpClient,
  TokenStorage,
  CrossTabAuth,
  StorageAdapter,
} from '@large-event/api-client';

// Re-export types
export type { AuthUser, InstanceResponse, AuthResponse } from '@large-event/api-types';
