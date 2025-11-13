# Large Event Platform - Mobile App

React Native mobile application with authentication and team component integration.

## Overview

The mobile app is a React Native + Expo application that provides:

- **Email-based authentication** (JWT tokens stored in AsyncStorage)
- **User instance management** (view accessible instances with access levels)
- **Team component integration** (native React Native components from teams)
- **Navigation** (Drawer + Bottom Tabs)
- **Pull-to-refresh** for instance updates

## Architecture

### Authentication Flow

1. User enters email on LoginScreen
2. API call to `/api/auth/login` via Nginx gateway
3. JWT token stored in AsyncStorage
4. Token automatically added to all API requests via axios interceptor
5. User instances fetched from `/api/instances`
6. Auth state managed via React Context

### Team Integration Pattern

Teams build native React Native components in their `teams/*/src/mobile/` folders.

**Example: Team D**

1. Team D creates components:
   ```
   teams/teamD/src/mobile/
   ├── components/
   │   └── EventsList.tsx
   ├── screens/
   │   └── EventDetails.tsx
   └── index.ts  (exports)
   ```

2. Team D exports components:
   ```typescript
   // teams/teamD/src/mobile/index.ts
   export { EventsList } from './components/EventsList';
   export { EventDetails } from './screens/EventDetails';
   ```

3. Mobile app imports and uses:
   ```typescript
   import { EventsList } from '-components';
   import TeamComponentWrapper from '../components/TeamComponentWrapper';

   function SomeScreen() {
     const { user, token, instances } = useAuth();

     return (
       <TeamComponentWrapper
         user={user}
         token={token}
         instances={instances}
         teamName="Team D"
       >
         <EventsList />
       </TeamComponentWrapper>
     );
   }
   ```

### Component Props Interface

All team components receive these props via `TeamComponentProps`:

```typescript
interface TeamComponentProps {
  user: AuthUser;           // Current authenticated user
  token: string;            // JWT token for API calls
  instances: InstanceResponse[];  // User's accessible instances
  onNavigateBack?: () => void;    // Optional back navigation
}
```

## Project Structure

```
apps/mobile/
├── App.tsx                     # Root component with AuthProvider
├── index.js                    # Expo entry point
├── src/
│   ├── components/
│   │   ├── LoadingSpinner.tsx          # Loading UI
│   │   ├── InstanceCard.tsx            # Instance display card
│   │   ├── TeamCard.tsx                # Team selection card
│   │   └── TeamComponentWrapper.tsx    # Error boundary for team components
│   ├── contexts/
│   │   └── AuthContext.tsx             # Authentication state management
│   ├── navigation/
│   │   └── RootNavigator.tsx           # Main navigation (Stack → Drawer → Tabs)
│   ├── screens/
│   │   ├── LoginScreen.tsx             # Email login
│   │   ├── HomeScreen.tsx              # Dashboard with instances & teams
│   │   ├── EventsScreen.tsx            # Placeholder for team events
│   │   ├── VendorsScreen.tsx           # Placeholder for team vendors
│   │   ├── VenuesScreen.tsx            # Placeholder for team venues
│   │   ├── ProfileScreen.tsx           # User profile with logout
│   │   └── team-examples/
│   │       └── TeamDHomeScreen.tsx     # Example integration
│   ├── services/
│   │   └── api.ts                      # Axios client with interceptors
│   ├── constants/
│   │   └── teams.ts                    # Team configuration
│   └── types/
│       └── index.ts                    # TypeScript type definitions
└── package.json
```

## Development

### Prerequisites

- Node.js >= 18
- pnpm 8.15.0
- Expo CLI
- iOS Simulator (macOS) or Android Emulator

### Installation

```bash
# From project root
pnpm install

# Or from mobile directory
cd apps/mobile
pnpm install
```

### Running the App

```bash
# Start Expo development server
pnpm start

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android

# Run in web browser (for testing)
pnpm web
```

### Testing Authentication

1. Ensure the backend API is running (`http://localhost/api`)
2. Start the mobile app: `pnpm start`
3. Enter a valid email from the database
4. App should authenticate and show the dashboard

**Test User**: Use any user email from the `users` table in the database.

## API Integration

### Base URL

- **Development**: `http://localhost/api` (via Nginx gateway)
- **Production**: `https://api.large-event.com`

### Endpoints Used

- `POST /api/auth/login` - Email-based login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/token` - Get JWT token
- `POST /api/auth/logout` - Logout
- `GET /api/instances` - Get user's instances

### Authentication

All API requests automatically include the JWT token via axios interceptor:

```typescript
Authorization: Bearer <token>
```

## Navigation Structure

```
RootNavigator (Stack)
├── LoginScreen (if not authenticated)
└── DrawerNavigator (if authenticated)
    ├── Main (Drawer Item)
    │   └── TabNavigator (Bottom Tabs)
    │       ├── Home
    │       ├── Events
    │       ├── Vendors
    │       └── Venues
    └── Profile (Drawer Item)
```

## Team Development Guide

### For Teams Building Mobile Components

1. **Create your mobile components** in `teams/teamX/src/mobile/`

2. **Export components** in `teams/teamX/src/mobile/index.ts`:
   ```typescript
   export { YourComponent } from './components/YourComponent';
   ```

3. **Use TeamComponentProps interface**:
   ```typescript
   import type { TeamComponentProps } from '@large-event/mobile';

   export function YourComponent({ user, token, instances }: TeamComponentProps) {
     // Your component logic
     return <View>...</View>;
   }
   ```

4. **Make API calls** using the provided token:
   ```typescript
   import axios from 'axios';

   const api = axios.create({
     baseURL: 'http://localhost/api',
     headers: {
       Authorization: `Bearer ${token}`,
     },
   });
   ```

5. **Test your component** in isolation before integrating

### Integration Checklist

- [ ] Component exports properly from `teams/teamX/src/mobile/index.ts`
- [ ] Component accepts `TeamComponentProps` interface
- [ ] Component uses provided `token` for API calls
- [ ] Component handles loading and error states
- [ ] Component works with different instance access levels
- [ ] Component tested on both iOS and Android

## Dependencies

### Core

- **React Native**: 0.74.5
- **Expo**: ~51.0.8
- **React**: 18.2.0

### Navigation

- **@react-navigation/native**: ^6.1.18
- **@react-navigation/native-stack**: ^6.9.26
- **@react-navigation/drawer**: ^6.7.2
- **@react-navigation/bottom-tabs**: ^6.5.20

### State & Storage

- **@react-native-async-storage/async-storage**: ^1.23.1
- **axios**: ^1.6.8

### UI

- **@expo/vector-icons**: ^14.0.0
- **react-native-gesture-handler**: ~2.16.1
- **react-native-reanimated**: ~3.10.1

## Troubleshooting

### Auth Token Not Persisting

Check AsyncStorage:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Debug token storage
const token = await AsyncStorage.getItem('@auth_token');
console.log('Stored token:', token);
```

### API Requests Failing

1. Check Nginx gateway is running (`http://localhost`)
2. Verify API endpoint is accessible
3. Check network logs in Expo dev tools
4. Ensure token is being sent in headers

### Navigation Issues

1. Clear AsyncStorage: `AsyncStorage.clear()`
2. Restart Expo dev server
3. Clear React Native cache: `pnpm start --clear`

### Team Component Errors

Check the error boundary in `TeamComponentWrapper` - it will display team component errors.

## Future Enhancements

- [ ] Biometric authentication (Face ID / Touch ID)
- [ ] Offline support with local storage
- [ ] Push notifications
- [ ] Deep linking support
- [ ] Token refresh on expiration
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Team-specific navigation stacks

## Related Documentation

- [CLAUDE.md](../../CLAUDE.md) - Full project architecture
- [Web Admin](../web-admin/README.md) - Web admin portal (similar auth pattern)
- [Web User](../web-user/README.md) - Web user portal (similar auth pattern)
- [API Types](../../shared/api-types/README.md) - Shared TypeScript types

## License

Private - MacEngSociety Event Management Platform
