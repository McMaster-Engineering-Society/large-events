import React from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '@large-event/api-types';

/**
 * Protected route props
 */
export interface ProtectedRouteProps {
  /** Child components to render when authenticated */
  children: ReactNode;
  /** Current user from auth context */
  user: AuthUser | null;
  /** Loading state from auth context */
  loading: boolean;
  /** Custom loading component */
  loadingComponent?: ReactNode;
  /** Custom unauthorized component (login form, etc.) */
  unauthorizedComponent?: ReactNode;
  /** Custom loading message */
  loadingMessage?: string;
}

/**
 * Protected route component
 * Renders children only when user is authenticated
 *
 * @example With auth context
 * ```tsx
 * import { ProtectedRoute } from '@large-event/web-components';
 * import { useAuth } from './contexts/AuthContext';
 * import LoginForm from './components/LoginForm';
 *
 * export default function Dashboard() {
 *   const { user, loading } = useAuth();
 *
 *   return (
 *     <ProtectedRoute
 *       user={user}
 *       loading={loading}
 *       unauthorizedComponent={<LoginForm />}
 *     >
 *       <DashboardContent />
 *     </ProtectedRoute>
 *   );
 * }
 * ```
 */
export default function ProtectedRoute({
  children,
  user,
  loading,
  loadingComponent,
  unauthorizedComponent,
  loadingMessage = 'Loading...',
}: ProtectedRouteProps) {
  if (loading) {
    return (
      loadingComponent || (
        <div className="flex justify-center items-center min-h-screen text-lg">
          {loadingMessage}
        </div>
      )
    );
  }

  if (!user) {
    return <>{unauthorizedComponent || <div>Unauthorized</div>}</>;
  }

  return <>{children}</>;
}
