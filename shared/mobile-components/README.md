# @large-event/mobile-components

Shared React Native components and utilities for Large Event Platform mobile applications.

## Installation

```bash
pnpm add @large-event/mobile-components
```

## Components

### LoadingSpinner

Generic loading spinner with optional message.

```tsx
import { LoadingSpinner } from '@large-event/mobile-components';

<LoadingSpinner message="Loading data..." size="large" color="#3b82f6" />
```

**Props:**
- `message?`: Optional loading message
- `size?`: Spinner size ('small' | 'large'), default: 'large'
- `color?`: Spinner color, default: '#3b82f6' (blue)

### InstanceCard

Card component displaying instance information with access level badge.

```tsx
import { InstanceCard } from '@large-event/mobile-components';

<InstanceCard instance={instanceData} />
```

**Props:**
- `instance`: InstanceResponse object from @large-event/api-types

### TeamCard

Card component for team selection screens.

```tsx
import { TeamCard } from '@large-event/mobile-components';

<TeamCard
  name="Team D"
  icon="🚀"
  color="#8b5cf6"
  onPress={() => navigation.navigate('TeamD')}
/>
```

**Props:**
- `name`: Team name
- `icon?`: Optional emoji or icon
- `color`: Background color for the card
- `onPress`: Callback when card is pressed

### ErrorBoundary

Error boundary wrapper to catch and display errors from child components.

```tsx
import { ErrorBoundary } from '@large-event/mobile-components';

<ErrorBoundary componentName="Team D Component">
  <TeamDComponent />
</ErrorBoundary>
```

**Props:**
- `children`: Child components to wrap
- `fallback?`: Custom fallback UI (ReactNode)
- `componentName?`: Name for error messages

---

## Services & Utilities

### Storage

AsyncStorage adapter compatible with @large-event/api.

```tsx
import { asyncStorageAdapter, setJsonItem, getJsonItem } from '@large-event/mobile-components';

// Use with @large-event/api
import { createTokenStorage } from '@large-event/api';

const storage = createTokenStorage({
  storage: asyncStorageAdapter,
  prefix: 'app'
});

// JSON helpers
await setJsonItem('user', { id: 1, name: 'John' });
const user = await getJsonItem('user');
```

**Exports:**
- `asyncStorageAdapter`: StorageAdapter implementation
- `setJsonItem(key, value)`: Store JSON data
- `getJsonItem<T>(key)`: Retrieve JSON data
- `clearAll()`: Clear all AsyncStorage (use with caution!)

### Platform Utilities

Platform-aware helpers for React Native development.

```tsx
import {
  getApiBaseUrl,
  isIOS,
  isAndroid,
  isWeb,
  getPlatform,
  selectPlatform
} from '@large-event/mobile-components';

// Get platform-specific API URL
const apiUrl = getApiBaseUrl(3004);
// Android: http://10.0.2.2:3004
// iOS: http://localhost:3004

// Platform checks
if (isIOS()) {
  // iOS-specific code
}

// Platform-specific values
const padding = selectPlatform({
  ios: 20,
  android: 16,
  default: 12
});
```

### API Client

Mobile-optimized axios client factory.

```tsx
import { createMobileApiClient, unwrapApiResponse } from '@large-event/mobile-components';

const api = createMobileApiClient({
  port: 3004,
  basePath: '/api',
  tokenKey: '@auth_token',
  debug: true
});

// Make requests
const response = await api.get('/instances');
const instances = unwrapApiResponse(response);
```

**Config:**
- `port`: API port number
- `basePath?`: Optional path prefix (e.g., '/api')
- `tokenKey?`: AsyncStorage key for auth token
- `timeout?`: Request timeout (default: 30000ms)
- `debug?`: Enable debug logging

---

## Constants

### Colors

Tailwind CSS-inspired color palette.

```tsx
import { colors, getAccessLevelColor } from '@large-event/mobile-components';

const MyComponent = () => (
  <View style={{ backgroundColor: colors.primary }}>
    <Text style={{ color: colors.textPrimary }}>Hello</Text>
  </View>
);

// Access level colors
const color = getAccessLevelColor('web_admin'); // Returns '#ef4444'
```

**Available colors:**
- Primary: `primary`, `primaryDark`, `primaryLight`
- Secondary: `secondary`, `secondaryDark`, `secondaryLight`
- Status: `success`, `warning`, `error`, `info`
- Neutral: `white`, `black`, `gray50`-`gray900`
- Text: `textPrimary`, `textSecondary`, `textTertiary`, `textInverse`
- Background: `bgPrimary`, `bgSecondary`, `bgTertiary`
- Border: `border`, `borderDark`
- Teams: `teamA`, `teamB`, `teamC`, `teamD`

### Styles

Common StyleSheet patterns and design tokens.

```tsx
import {
  shadows,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  layout,
  card,
  button,
  input
} from '@large-event/mobile-components';

const styles = StyleSheet.create({
  container: {
    ...layout.containerPadded,
    padding: spacing.lg,
  },
  card: {
    ...card.default,
    borderRadius: borderRadius.xl,
    ...shadows.medium,
  },
  button: {
    ...button.primary,
  },
});
```

**Exports:**
- `shadows`: Small, medium, large elevation styles
- `spacing`: xs (4), sm (8), md (12), lg (16), xl (24), xxl (32)
- `borderRadius`: sm (4), md (8), lg (12), xl (16), full (9999)
- `fontSize`: xs (12), sm (14), base (16), lg (18), xl (20), xxl (24), xxxl (32)
- `fontWeight`: normal, medium, semibold, bold
- `layout`: Common layout patterns (flex1, center, row, etc.)
- `card`: Card style presets
- `button`: Button style presets
- `input`: Input style presets

---

## Integration with @large-event/api

This package is designed to work seamlessly with `@large-event/api`:

```tsx
import { asyncStorageAdapter, createMobileApiClient, getApiBaseUrl } from '@large-event/mobile-components';
import { createAuthApi, createTokenStorage, createAuthContext } from '@large-event/api';

// Create HTTP client
const httpClient = createMobileApiClient({
  port: 3004,
  basePath: '/api',
  tokenKey: '@auth_token'
});

// Create auth API
const authApi = createAuthApi({
  httpClient: /* wrap httpClient to match HttpClient interface */,
  authType: 'bearer'
});

// Create token storage
const tokenStorage = createTokenStorage({
  storage: asyncStorageAdapter,
  prefix: 'app'
});

// Create auth context (for web-like auth state management)
const { AuthProvider, useAuth } = createAuthContext({
  authApi,
  tokenStorage,
  enableInstanceManagement: false
});
```

---

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

## Requirements

- React >= 18.0.0
- React Native >= 0.70.0
- @react-native-async-storage/async-storage ^1.23.1
- axios ^1.6.8

## License

MIT
