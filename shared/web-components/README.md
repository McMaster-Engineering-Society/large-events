# @large-event/web-components

Shared web component library for Large Event Platform main portals (User and Admin).

## Installation

```bash
pnpm add @large-event/web-components
```

## Components

### LoginForm

Configurable login form component for authentication.

```tsx
import { LoginForm } from '@large-event/web-components';
import { useAuth } from './contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <LoginForm
      title="User Portal"
      onLogin={login}
      onSuccess={() => console.log('Login successful!')}
    />
  );
}
```

**Props:**
- `title?`: Form title (default: "Large Event Portal")
- `onLogin`: Login function that returns Promise<boolean>
- `validateEmail?`: Custom email validation function
- `onSuccess?`: Callback after successful login
- `className?`: Custom container className
- `cardClassName?`: Custom card className

### ProtectedRoute

Authentication guard component that only renders children when user is authenticated.

```tsx
import { ProtectedRoute } from '@large-event/web-components';
import { useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';

export default function Dashboard() {
  const { user, loading, login } = useAuth();

  return (
    <ProtectedRoute
      user={user}
      loading={loading}
      unauthorizedComponent={<LoginForm title="User Portal" onLogin={login} />}
    >
      <DashboardContent />
    </ProtectedRoute>
  );
}
```

**Props:**
- `user`: Current authenticated user (or null)
- `loading`: Loading state boolean
- `children`: Components to render when authenticated
- `loadingComponent?`: Custom loading component
- `unauthorizedComponent?`: Custom unauthorized view (login form, etc.)
- `loadingMessage?`: Custom loading message (default: "Loading...")

## Styling

This package uses Tailwind CSS. Import the shared styles and preset:

### Import Styles

```tsx
// In your app entry point
import '@large-event/web-components/styles';
```

### Extend Tailwind Config

```js
// tailwind.config.js
module.exports = {
  presets: [require('@large-event/web-components/tailwind-preset')],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@large-event/web-components/dist/**/*.js'
  ],
};
```

### Custom CSS Classes

The package provides these Tailwind component classes:

- `.btn-primary` - Primary button styling
- `.input-primary` - Form input styling
- `.card` - Card container styling

### Color Palette

- `brand-blue`: #007bff
- `brand-blue-dark`: #0056b3
- `error-red`: #dc3545
- `border-gray`: #ddd
- `text-gray`: #666
- `text-dark`: #333
- `bg-gray`: #f5f5f5

## Authentication Setup

This package re-exports utilities from `@large-event/api` for convenience:

```tsx
import {
  createAuthContext,
  createAuthApi,
  createFetchClient,
  createCrossTabAuth,
  sessionStorageAdapter,
} from '@large-event/web-components';

// Create HTTP client
const httpClient = createFetchClient({
  baseURL: 'http://localhost',
  authType: 'cookie'
});

// Create auth API
const authApi = createAuthApi({
  httpClient,
  authType: 'cookie'
});

// Create cross-tab auth
const crossTabAuth = createCrossTabAuth({
  onLogout: () => console.log('Logout from another tab')
});

// Create auth context
const { AuthProvider, useAuth } = createAuthContext({
  authApi,
  crossTabAuth,
  enableInstanceManagement: true,
  fetchInstances: async () => {
    const response = await fetch('/api/instances', { credentials: 'include' });
    const data = await response.json();
    return data.instances || [];
  }
});

// Use in your app
export { AuthProvider, useAuth };
```

## Development

```bash
# Build package
pnpm build

# Watch mode
pnpm dev

# Clean dist
pnpm clean
```

## Publishing

```bash
# Publish to Verdaccio
pnpm publish --registry http://localhost:4873
```

## License

MIT
