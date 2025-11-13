# @large-event/api-client

Client-side API utilities and React hooks for the Large Event Platform.

## What's Included

- **Auth Contexts**: `createAuthContext` for React auth state management
- **HTTP Clients**: `createFetchClient` for API requests
- **Auth API**: `createAuthApi` for login/logout operations
- **Storage**: `createTokenStorage` with browser storage adapters
- **Cross-Tab Auth**: `createCrossTabAuth` for auth sync across tabs
- **React Hooks**: `useInstances`, `useInstance`
- **Instance Provider**: React context for instance management

## Usage

```typescript
import {
  createAuthContext,
  createFetchClient,
  createTokenStorage,
  sessionStorageAdapter,
} from '@large-event/api-client';

// Create HTTP client
const httpClient = createFetchClient({
  baseURL: 'http://localhost:3000/api',
  authType: 'cookie',
});

// Create auth context
const { AuthProvider, useAuth } = createAuthContext({
  authApi: createAuthApi({ httpClient }),
  tokenStorage: createTokenStorage({
    storage: sessionStorageAdapter,
    prefix: 'app',
  }),
});
```

## Browser-Only

This package is designed for browser environments only. For server-side auth utilities, use `@large-event/api`.
