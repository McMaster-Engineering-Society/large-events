/**
 * Platform-specific utilities for mobile development
 */

import { Platform } from 'react-native';

/**
 * Get the appropriate API base URL for the current platform
 * Handles Android emulator (10.0.2.2) vs iOS localhost
 *
 * @param port - The port number
 * @param path - Optional path to append
 * @returns Full API URL
 *
 * @example
 * ```tsx
 * import { getApiBaseUrl } from '@large-event/mobile-components';
 *
 * const apiUrl = getApiBaseUrl(3004); // Android: http://10.0.2.2:3004, iOS: http://localhost:3004
 * const apiUrl = getApiBaseUrl(3004, '/api'); // Android: http://10.0.2.2:3004/api
 * ```
 */
export function getApiBaseUrl(port: number, path?: string): string {
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  const basePath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return `http://${host}:${port}${basePath}`;
}

/**
 * Check if running on iOS
 */
export function isIOS(): boolean {
  return Platform.OS === 'ios';
}

/**
 * Check if running on Android
 */
export function isAndroid(): boolean {
  return Platform.OS === 'android';
}

/**
 * Check if running on web (via Expo Web or React Native Web)
 */
export function isWeb(): boolean {
  return Platform.OS === 'web';
}

/**
 * Get platform name as string
 */
export function getPlatform(): 'ios' | 'android' | 'web' | string {
  return Platform.OS;
}

/**
 * Get platform-specific value
 *
 * @example
 * ```tsx
 * const padding = selectPlatform({ ios: 20, android: 16, default: 12 });
 * ```
 */
export function selectPlatform<T>(options: {
  ios?: T;
  android?: T;
  web?: T;
  default: T;
}): T {
  if (Platform.OS === 'ios' && options.ios !== undefined) {
    return options.ios;
  }
  if (Platform.OS === 'android' && options.android !== undefined) {
    return options.android;
  }
  if (Platform.OS === 'web' && options.web !== undefined) {
    return options.web;
  }
  return options.default;
}
