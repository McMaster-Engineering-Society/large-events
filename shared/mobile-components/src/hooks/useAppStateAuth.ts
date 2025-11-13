/**
 * React Native AppState Auth Hook
 * Re-checks authentication when app becomes active (foreground)
 */

import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export interface UseAppStateAuthOptions {
  /** Callback to re-check authentication */
  onAppBecomeActive: () => void | Promise<void>;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Hook to handle React Native app state changes for authentication
 *
 * When the app transitions to active state (foreground), it triggers
 * a callback to re-check authentication. This ensures the auth state
 * stays fresh when users return to the app.
 *
 * @example
 * ```typescript
 * function MyAuthProvider({ children }) {
 *   const checkAuth = async () => {
 *     // Re-verify token, fetch user data, etc.
 *   };
 *
 *   useAppStateAuth({
 *     onAppBecomeActive: checkAuth,
 *     debug: __DEV__
 *   });
 *
 *   return <AuthContext.Provider>{children}</AuthContext.Provider>;
 * }
 * ```
 */
export function useAppStateAuth(options: UseAppStateAuthOptions) {
  const { onAppBecomeActive, debug = false } = options;

  useEffect(() => {
    const log = (...args: any[]) => {
      if (debug) {
        console.log('[useAppStateAuth]', ...args);
      }
    };

    log('Setting up AppState listener');

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        log('App became active, triggering auth check');
        onAppBecomeActive();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      log('Cleaning up AppState listener');
      subscription.remove();
    };
  }, [onAppBecomeActive, debug]);
}
