/**
 * Core authentication types aligned with database schema
 * These types are shared across all packages (server and client)
 */

/**
 * User object from database (matches users table schema)
 * Note: Uses 'name' field to match current database structure
 */
export interface AuthUser {
  id: number;
  email: string;
  name: string;
  isSystemAdmin: boolean;
}

/**
 * JWT token payload structure
 * Used by both server-side token generation and client-side token decoding
 */
export interface AuthToken {
  user: AuthUser;
  exp: number;
  iat: number;
}

/**
 * Auth response from login endpoint
 */
export interface AuthResponse {
  user: AuthUser;
  token: string;
}

/**
 * Login request payload
 */
export interface LoginDto {
  email: string;
  password?: string;
}
