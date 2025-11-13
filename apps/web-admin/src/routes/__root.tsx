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
          storageKey: "web-admin-instance",
          refreshEventName: "auth-changed",
        }}
      >
        <div className="min-h-screen bg-gray-50">
          <main className="container mx-auto px-4 py-8">
            <Outlet />
          </main>
        </div>
        {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
      </InstanceProvider>
    </AuthProvider>
  ),
});
