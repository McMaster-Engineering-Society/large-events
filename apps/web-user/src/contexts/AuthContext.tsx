/**
 * Web User Auth Context
 * Uses shared auth infrastructure from @large-event/api-client
 */

import {
  createAuthContext,
  createAuthApi,
  createFetchClient,
  createCrossTabAuth,
  sessionStorageAdapter,
} from '@large-event/api-client';

// Create HTTP client for cookie-based auth
const httpClient = createFetchClient({
  baseURL: '/api',
  authType: 'cookie',
  storage: sessionStorageAdapter,
});

// Create auth API client
const authApi = createAuthApi({
  httpClient,
  authType: 'cookie',
  basePath: '/auth',
});

// Create cross-tab auth sync
const crossTabAuth = createCrossTabAuth({
  channelName: 'large-event-auth',
  storageKey: 'large-event-logout-event',
  onLogout: () => {
    console.log('[Auth] Received logout from another tab - reloading');
    window.location.reload();
  },
});

// Create and export auth context
export const { AuthProvider, useAuth } = createAuthContext({
  authApi,
  crossTabAuth,
  customEvents: ['auth-changed'],
  enableInstanceManagement: false,
  debug: false,
});
