/**
 * Instance API Type Definitions
 * Shared types for instance-related API requests and responses
 */

/**
 * Organization information included in instance responses
 */
export interface OrganizationSummary {
  id: number;
  name: string;
  acronym: string | null;
}

/**
 * Full organization details
 */
export interface Organization extends OrganizationSummary {
  school: string | null;
  userAccess?: boolean;
  adminAccess?: boolean;
}

/**
 * Instance access level
 */
export type InstanceAccessLevel = 'web_user' | 'web_admin' | 'both';

/**
 * Instance response from API
 */
export interface InstanceResponse {
  id: number;
  name: string;
  accessLevel: InstanceAccessLevel;
  ownerOrganization: OrganizationSummary;
}

/**
 * Instance list response from API
 */
export interface InstanceListResponse {
  instances: InstanceResponse[];
  count: number;
}

/**
 * Platform-agnostic Instance API interface
 * Implementations can use any HTTP client (fetch, axios, etc.)
 */
export interface InstanceApi {
  /**
   * Fetch all instances accessible by the authenticated user
   */
  getInstances(): Promise<InstanceListResponse>;

  /**
   * Fetch a specific instance by ID
   */
  getInstance(id: number): Promise<InstanceResponse>;
}
