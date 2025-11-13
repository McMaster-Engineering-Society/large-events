/**
 * AsyncStorage adapter for @large-event/api
 * Implements StorageAdapter interface for React Native
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Define StorageAdapter interface locally (from @large-event/api)
export interface StorageAdapter {
  getItem(key: string): Promise<string | null> | string | null;
  setItem(key: string, value: string): Promise<void> | void;
  removeItem(key: string): Promise<void> | void;
}

/**
 * AsyncStorage adapter for React Native
 * Compatible with @large-event/api StorageAdapter interface
 *
 * @example
 * ```tsx
 * import { asyncStorageAdapter } from '@large-event/mobile-components';
 * import { createTokenStorage } from '@large-event/api';
 *
 * const storage = createTokenStorage({
 *   storage: asyncStorageAdapter,
 *   prefix: 'teamd'
 * });
 * ```
 */
export const asyncStorageAdapter: StorageAdapter = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('AsyncStorage getItem error:', error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('AsyncStorage setItem error:', error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('AsyncStorage removeItem error:', error);
    }
  },
};

/**
 * Helper to store JSON data
 */
export async function setJsonItem(key: string, value: any): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing JSON:', error);
  }
}

/**
 * Helper to retrieve JSON data
 */
export async function getJsonItem<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving JSON:', error);
    return null;
  }
}

/**
 * Helper to clear all AsyncStorage data (use with caution!)
 */
export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
}
