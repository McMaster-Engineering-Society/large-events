/**
 * Cross-Tab Authentication Synchronization
 * Allows logout events to propagate across browser tabs/windows
 */

/**
 * Configuration for cross-tab auth
 */
export interface CrossTabAuthConfig {
  /** Channel name for BroadcastChannel (default: 'large-event-auth') */
  channelName?: string;
  /** Storage key for fallback (default: 'large-event-logout-event') */
  storageKey?: string;
  /** Callback when logout event received */
  onLogout: () => void;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Cross-tab auth event types
 */
export type AuthEventType = 'logout' | 'login';

export interface AuthEvent {
  type: AuthEventType;
  timestamp: number;
  source?: string;
}

/**
 * Cross-tab authentication manager
 */
export interface CrossTabAuth {
  /**
   * Broadcast an auth event to other tabs
   */
  broadcast(event: AuthEventType): void;

  /**
   * Clean up listeners
   */
  cleanup(): void;
}

/**
 * Create a cross-tab authentication manager
 *
 * @example Listener (Main Portal)
 * ```typescript
 * const crossTab = createCrossTabAuth({
 *   onLogout: () => {
 *     setUser(null);
 *     setInstances([]);
 *   }
 * });
 *
 * // Cleanup on unmount
 * return () => crossTab.cleanup();
 * ```
 *
 * @example Broadcaster (Team App)
 * ```typescript
 * const crossTab = createCrossTabAuth({
 *   onLogout: () => {}  // Team app is the one logging out
 * });
 *
 * const logout = async () => {
 *   await authApi.logout();
 *   crossTab.broadcast('logout');
 *   setUser(null);
 * };
 * ```
 */
export function createCrossTabAuth(config: CrossTabAuthConfig): CrossTabAuth {
  const {
    channelName = 'large-event-auth',
    storageKey = 'large-event-logout-event',
    onLogout,
    debug = false,
  } = config;

  let channel: BroadcastChannel | null = null;
  const listeners: Array<() => void> = [];

  const log = (...args: any[]) => {
    if (debug) {
      console.log('[CrossTabAuth]', ...args);
    }
  };

  // Initialize BroadcastChannel (if supported)
  if (typeof BroadcastChannel !== 'undefined') {
    channel = new BroadcastChannel(channelName);
    channel.onmessage = (event: MessageEvent<AuthEvent>) => {
      log('Received message:', event.data);
      if (event.data?.type === 'logout') {
        log('Triggering onLogout callback');
        onLogout();
      }
    };
    log('BroadcastChannel initialized:', channelName);
  } else {
    log('BroadcastChannel not supported, using storage fallback');
  }

  // Fallback: Listen to storage events (cross-tab communication)
  const storageHandler = (e: StorageEvent) => {
    log('Storage event:', e.key, e.newValue);
    if (e.key === storageKey && e.newValue) {
      try {
        const event = JSON.parse(e.newValue) as AuthEvent;
        if (event.type === 'logout') {
          log('Triggering onLogout from storage event');
          onLogout();
        }
      } catch (error) {
        log('Error parsing storage event:', error);
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', storageHandler);
    listeners.push(() => window.removeEventListener('storage', storageHandler));
  }

  return {
    broadcast(eventType: AuthEventType): void {
      const event: AuthEvent = {
        type: eventType,
        timestamp: Date.now(),
      };

      log('Broadcasting event:', event);

      // Broadcast via BroadcastChannel
      if (channel) {
        channel.postMessage(event);
        log('Sent via BroadcastChannel');
      }

      // Fallback: Use localStorage to trigger storage event
      if (typeof window !== 'undefined' && eventType === 'logout') {
        try {
          localStorage.setItem(storageKey, JSON.stringify(event));
          // Clean up immediately (the storage event has already fired)
          setTimeout(() => {
            localStorage.removeItem(storageKey);
          }, 100);
          log('Sent via localStorage fallback');
        } catch (error) {
          log('Error broadcasting via storage:', error);
        }
      }
    },

    cleanup(): void {
      log('Cleaning up');
      if (channel) {
        channel.close();
        channel = null;
      }
      listeners.forEach((cleanup) => cleanup());
    },
  };
}
