import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { AuthProvider } from '../contexts/AuthContext';
import {
  InstanceProvider,
  createFetchClient,
  createInstanceApi,
  sessionStorageAdapter,
} from '@large-event/api-client';

// Create HTTP client for cookie-based auth
const httpClient = createFetchClient({
  baseURL: '/api',
  authType: 'cookie',
  storage: sessionStorageAdapter,
});

// Create instance API
const instanceApi = createInstanceApi(httpClient);

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <InstanceProvider
        config={{
          instanceApi,
          storage: sessionStorageAdapter,
          storageKey: "web-user-instance",
          refreshEventName: "auth-changed",
        }}
      >
        <Outlet />
        {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
      </InstanceProvider>
    </AuthProvider>
  ),
});
