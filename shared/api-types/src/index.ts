export * from './common';
export * from './teamA';
export * from './teamB';
export * from './teamC';
export * from './teamD';

export interface ApiClient {
  get<T>(url: string, config?: any): Promise<T>;
  post<T>(url: string, data?: any, config?: any): Promise<T>;
  put<T>(url: string, data?: any, config?: any): Promise<T>;
  delete<T>(url: string, config?: any): Promise<T>;
}

export interface TeamApiUrls {
  teamA: string;
  teamB: string;
  teamC: string;
  teamD: string;
}

export type AllApiEndpoints =
  | import('./teamA').TeamAApiEndpoints
  | import('./teamB').TeamBApiEndpoints
  | import('./teamC').TeamCApiEndpoints
  | import('./teamD').TeamDApiEndpoints;