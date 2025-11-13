/**
 * Mobile App Auth Context
 * Uses shared auth infrastructure from @large-event/api-client
 */

import {
  createAuthContext,
  createAuthApi,
  createFetchClient,
  createTokenStorage,
} from '@large-event/api-client';
import { asyncStorageAdapter, useAppStateAuth } from '@large-event/mobile-components';
import { instanceApi } from '../services/api';
import { Platform } from 'react-native';

// API base URL for mobile
const getApiBaseUrl = () => {
  if (__DEV__) {
    // Development mode - direct connection to web-admin server
    if (Platform.OS === 'android') {
      // Android emulator uses 10.0.2.2 to access host machine
      return 'http://10.0.2.2:4101/api';
    }
    // iOS simulator and web can use localhost
    return 'http://localhost:4101/api';
  }
  // Production
  return 'https://api.large-event.com';
};

// Create HTTP client for bearer auth
const httpClient = createFetchClient({
  baseURL: getApiBaseUrl(),
  authType: 'bearer',
  storage: asyncStorageAdapter,
  tokenKey: '@auth_token',
});

// Create auth API client
const authApi = createAuthApi({
  httpClient,
  authType: 'bearer',
  basePath: '/auth',
});

// Create token storage
const tokenStorage = createTokenStorage({
  storage: asyncStorageAdapter,
  prefix: 'large-event',
});

// Fetch instances function
const fetchInstances = async () => {
  const response = await instanceApi.getInstances();
  return response.instances || [];
};

// Create and export auth context
const { AuthProvider: BaseAuthProvider, useAuth } = createAuthContext({
  authApi,
  tokenStorage,
  enableInstanceManagement: true,
  fetchInstances,
  debug: true,
});

// Export useAuth hook
export { useAuth };

// Enhanced AuthProvider with AppState handling
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseAuthProvider>
      <AppStateAuthHandler />
      {children}
    </BaseAuthProvider>
  );
}

// Internal component to handle AppState changes
function AppStateAuthHandler() {
  const { refreshInstances } = useAuth();

  // Refresh instances when app becomes active
  useAppStateAuth({
    onAppBecomeActive: async () => {
      console.log('[AppState] App became active, refreshing instances...');
      if (refreshInstances) {
        await refreshInstances();
      }
    },
    debug: __DEV__,
  });

  return null;
}
