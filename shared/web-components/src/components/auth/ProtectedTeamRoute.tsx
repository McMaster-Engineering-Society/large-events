'use client';

import React, { useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '@large-event/api-types';
import TeamLocalLoginForm from './TeamLocalLoginForm';
import type { SeedUser } from './TeamLocalLoginForm';

/**
 * Portal type for protected team routes
 */
export type PortalType = 'user' | 'admin';

/**
 * Portal configuration
 */
export interface PortalConfig {
  /** Portal type */
  type: PortalType;
  /** Portal name (e.g., "User Portal", "Admin Portal") */
  name: string;
  /** Main portal URL for fallback authentication */
  mainPortalUrl: string;
  /** Main portal port (for display) */
  mainPortalPort: number;
}

/**
 * Protected team route props
 */
export interface ProtectedTeamRouteProps {
  /** Child components to render when authenticated */
  children: ReactNode;

  // === Auth State (required) ===
  /** Current user from auth context */
  user: AuthUser | null;
  /** Loading state from auth context */
  isLoading: boolean;

  // === Portal Configuration ===
  /** Portal configuration (user or admin) */
  portalConfig: PortalConfig;

  // === Team Customization ===
  /** Team name (e.g., "Team D") */
  teamName: string;
  /** Team description for branding */
  teamDescription?: string;
  /** Primary theme color (hex) */
  primaryColor?: string;

  // === Local Login Configuration ===
  /** Enable local development login (default: true) */
  enableLocalLogin?: boolean;
  /** API URL for local login */
  loginApiUrl?: string;
  /** Storage prefix for auth data */
  storagePrefix?: string;
  /** Enable quick login with seed users (default: false) */
  enableQuickLogin?: boolean;
  /** Seed users for quick login */
  seedUsers?: SeedUser[];

  // === Auth Header Configuration ===
  /** Show authenticated user header (default: false for user, true for admin) */
  showAuthHeader?: boolean;
  /** Custom logout handler */
  onLogout?: () => void | Promise<void>;

  // === Callbacks ===
  /** Called after successful local login */
  onLocalLogin?: (user: AuthUser, token: string) => void;

  // === Custom Components ===
  /** Custom loading component */
  loadingComponent?: ReactNode;
  /** Custom loading message */
  loadingMessage?: string;
}

/**
 * Default portal configs
 */
export const PORTAL_CONFIGS: Record<PortalType, PortalConfig> = {
  user: {
    type: 'user',
    name: 'User Portal',
    mainPortalUrl: 'http://localhost:4000',
    mainPortalPort: 4000,
  },
  admin: {
    type: 'admin',
    name: 'Admin Portal',
    mainPortalUrl: 'http://localhost:4001',
    mainPortalPort: 4001,
  },
};

/**
 * Unauthorized access component
 */
function UnauthorizedAccess({
  portalConfig,
  teamName,
  primaryColor,
  enableLocalLogin,
  loginApiUrl,
  storagePrefix,
  enableQuickLogin,
  seedUsers,
  onLocalLogin,
}: {
  portalConfig: PortalConfig;
  teamName: string;
  primaryColor: string;
  enableLocalLogin: boolean;
  loginApiUrl: string;
  storagePrefix: string;
  enableQuickLogin: boolean;
  seedUsers?: SeedUser[];
  onLocalLogin: (user: AuthUser, token: string) => void;
}) {
  const [showLocalLogin, setShowLocalLogin] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-gray-50 text-center gap-5">
      {/* Local Login Form */}
      {showLocalLogin ? (
        <TeamLocalLoginForm
          title={`${teamName} Local Development`}
          subtitle="Quick login for development"
          teamName={teamName}
          teamDescription={`${portalConfig.name} - Local Development Mode`}
          enableQuickLogin={enableQuickLogin}
          seedUsers={seedUsers}
          apiUrl={loginApiUrl}
          storagePrefix={storagePrefix}
          layout="card"
          primaryColor={primaryColor}
          onLoginSuccess={onLocalLogin}
        />
      ) : (
        <div className="warning-box max-w-2xl shadow-card">
          <h1 className="text-warning-yellow mb-5 text-3xl">
            🔒 Authentication Required
          </h1>
          <p className="text-warning-yellow mb-5 text-lg leading-relaxed">
            Choose your authentication method:
          </p>

          {/* Local Development Option */}
          {enableLocalLogin && (
            <div className="info-box">
              <h3 className="text-info-blue m-0 mb-2.5 text-lg">
                🚀 Local Development
              </h3>
              <p className="text-info-blue m-0 mb-4 text-sm">
                Quick login for {teamName} local development (no main portal required)
              </p>
              <button
                onClick={() => setShowLocalLogin(true)}
                className="btn-secondary"
              >
                Use Local Login
              </button>
            </div>
          )}

          {/* Main Portal Option */}
          <div className="bg-gray-200 p-5 rounded mb-5">
            <h3 className="text-gray-700 m-0 mb-2.5 text-lg">
              🌐 Main Portal
            </h3>
            <p className="m-0 mb-4 text-gray-700 text-sm">
              Log in through the main {portalConfig.name.toLowerCase()} for full access:
            </p>
            <a
              href={portalConfig.mainPortalUrl}
              className="inline-block bg-brand-blue text-white no-underline px-5 py-2.5 rounded text-sm font-bold hover:bg-brand-blue-dark transition-colors"
            >
              Go to Main Portal
            </a>
            <p className="mt-2.5 mb-0 text-gray-500 text-xs">
              After logging in, use the "{teamName} Portal" button.
            </p>
          </div>
        </div>
      )}

      {/* Back Button for Local Login */}
      {showLocalLogin && (
        <button
          onClick={() => setShowLocalLogin(false)}
          className="bg-gray-600 text-white border-none px-4 py-2 rounded cursor-pointer text-sm hover:bg-gray-700 transition-colors"
        >
          ← Back to Auth Options
        </button>
      )}
    </div>
  );
}

/**
 * Auth header component
 */
function AuthHeader({
  user,
  storagePrefix,
  primaryColor,
  onLogout,
}: {
  user: AuthUser;
  storagePrefix: string;
  primaryColor: string;
  onLogout: () => void | Promise<void>;
}) {
  const authSource = sessionStorage.getItem(`${storagePrefix}-auth-source`);
  const isLocalAuth = authSource === 'local';

  const handleLogout = async () => {
    try {
      // Clear HTTP-only cookie via API
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      if (onLogout) {
        await onLogout();
      } else {
        // Default: reload page
        window.location.reload();
      }
    }
  };

  return (
    <div className="bg-green-100 border-b border-green-300 py-2.5 px-5 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <span className="text-green-900 text-sm">
          ✅ Authenticated as: <strong>{user.email}</strong>
        </span>
        <span className="text-cyan-900 text-xs bg-cyan-100 py-0.5 px-2 rounded-sm border border-cyan-200">
          {isLocalAuth ? '🚀 Local Dev' : '🌐 Main Portal'}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="text-white border-none py-1 px-2.5 rounded text-xs cursor-pointer transition-colors"
        style={{
          backgroundColor: isLocalAuth ? '#dc2626' : primaryColor,
        }}
      >
        {isLocalAuth ? 'Logout' : 'Logout & Close'}
      </button>
    </div>
  );
}

/**
 * Protected Team Route Component
 * Provides authentication protection with team-specific branding and features
 *
 * @example User portal with local login
 * ```tsx
 * import { ProtectedTeamRoute, PORTAL_CONFIGS } from '@large-event/web-components';
 * import { useAuth } from './contexts/AuthContext';
 *
 * export default function App() {
 *   const { user, isLoading } = useAuth();
 *
 *   return (
 *     <ProtectedTeamRoute
 *       user={user}
 *       isLoading={isLoading}
 *       portalConfig={PORTAL_CONFIGS.user}
 *       teamName="Team D"
 *       primaryColor="#8b5cf6"
 *       storagePrefix="teamd"
 *       enableLocalLogin
 *       onLocalLogin={(user, token) => {
 *         window.dispatchEvent(new Event('teamd-auth-changed'));
 *         window.location.reload();
 *       }}
 *     >
 *       <YourApp />
 *     </ProtectedTeamRoute>
 *   );
 * }
 * ```
 *
 * @example Admin portal with auth header
 * ```tsx
 * <ProtectedTeamRoute
 *   user={user}
 *   isLoading={isLoading}
 *   portalConfig={PORTAL_CONFIGS.admin}
 *   teamName="Team D"
 *   primaryColor="#8b5cf6"
 *   storagePrefix="teamd"
 *   showAuthHeader
 *   enableQuickLogin
 *   seedUsers={seedUsers}
 * >
 *   <AdminDashboard />
 * </ProtectedTeamRoute>
 * ```
 */
export default function ProtectedTeamRoute({
  children,
  user,
  isLoading,
  portalConfig,
  teamName,
  teamDescription,
  primaryColor = '#3b82f6',
  enableLocalLogin = true,
  loginApiUrl = '/api/auth/login',
  storagePrefix = 'team',
  enableQuickLogin = false,
  seedUsers,
  showAuthHeader,
  onLogout,
  onLocalLogin,
  loadingComponent,
  loadingMessage = 'Loading...',
}: ProtectedTeamRouteProps) {
  // Default showAuthHeader based on portal type if not specified
  const shouldShowAuthHeader = showAuthHeader ?? (portalConfig.type === 'admin');

  const handleLocalLogin = (authUser: AuthUser, token: string) => {
    console.log('Local login successful:', authUser);

    if (onLocalLogin) {
      onLocalLogin(authUser, token);
    } else {
      // Default: dispatch event and reload
      window.dispatchEvent(new Event(`${storagePrefix}-auth-changed`));
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      loadingComponent || (
        <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
          {loadingMessage}
        </div>
      )
    );
  }

  if (!user) {
    return (
      <UnauthorizedAccess
        portalConfig={portalConfig}
        teamName={teamName}
        primaryColor={primaryColor}
        enableLocalLogin={enableLocalLogin}
        loginApiUrl={loginApiUrl}
        storagePrefix={storagePrefix}
        enableQuickLogin={enableQuickLogin}
        seedUsers={seedUsers}
        onLocalLogin={handleLocalLogin}
      />
    );
  }

  // User is authenticated
  return (
    <div>
      {shouldShowAuthHeader && (
        <AuthHeader
          user={user}
          storagePrefix={storagePrefix}
          primaryColor={primaryColor}
          onLogout={onLogout || (() => window.location.reload())}
        />
      )}
      {children}
    </div>
  );
}
