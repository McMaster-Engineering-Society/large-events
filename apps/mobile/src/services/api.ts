import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { AuthUser, InstanceListResponse } from '@large-event/api-types';
import { createMobileInstanceApi } from '@large-event/mobile-components';

// API base URL - Direct connection to web-admin server
// For React Native:
// - iOS Simulator: use localhost or 127.0.0.1
// - Android Emulator: use 10.0.2.2 (special alias for host machine)
// - Physical Device: use your computer's local IP (e.g., 192.168.1.x)
//
// NOTE: In development, we connect directly to web-admin server (port 4101)
// which has the auth endpoints. In production, use Nginx gateway.
const getApiBaseUrl = () => {
  if (__DEV__) {
    // Development mode - direct connection to web-admin server
    if (Platform.OS === 'android') {
      // Android emulator uses 10.0.2.2 to access host machine
      return 'http://10.0.2.2:4101/api';
    }
    // iOS simulator and web can use localhost
    return 'http://localhost:4101/api';
  }
  // Production
  return 'https://api.large-event.com';
};

const API_BASE_URL = getApiBaseUrl();

// AsyncStorage keys
const AUTH_TOKEN_KEY = '@auth_token';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token to headers
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Clear stored token
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      // You might want to emit an event here to trigger logout in AuthContext
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authApi = {
  /**
   * Login with email (no password)
   * Returns user object and JWT token
   */
  login: async (email: string): Promise<{ user: AuthUser; token: string }> => {
    console.log('[API] Attempting login to:', API_BASE_URL);
    console.log('[API] Email:', email);
    try {
      const response = await apiClient.post('/auth/login', { email });
      console.log('[API] Login successful');
      return response.data;
    } catch (error: any) {
      console.error('[API] Login failed:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  /**
   * Logout - clear session
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  },

  /**
   * Get current authenticated user
   */
  me: async (): Promise<AuthUser> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  /**
   * Get current JWT token (for passing to team components)
   */
  getToken: async (): Promise<string> => {
    const response = await apiClient.get('/auth/token');
    return response.data.token;
  },
};

// Instance API endpoints (using shared implementation)
export const instanceApi = createMobileInstanceApi(apiClient);

// Token storage helpers
export const tokenStorage = {
  /**
   * Save JWT token to AsyncStorage
   */
  saveToken: async (token: string): Promise<void> => {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  /**
   * Get JWT token from AsyncStorage
   */
  getToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  },

  /**
   * Remove JWT token from AsyncStorage
   */
  removeToken: async (): Promise<void> => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  },
};
