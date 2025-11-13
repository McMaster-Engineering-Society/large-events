import { createFileRoute } from '@tanstack/react-router';
import { AdminDashboard } from '../components/AdminDashboard';
import { ProtectedRoute, LoginForm } from '@large-event/web-components';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

function DashboardRoute() {
  const { user, loading, login } = useAuth();

  // Listen for logout messages from Team D tabs
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'teamd-logout') {
        console.log('[Admin Portal] Received logout from Team D, reloading...');
        window.location.reload();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <ProtectedRoute
      user={user}
      loading={loading}
      unauthorizedComponent={
        <LoginForm title="Large Event Admin Portal" onLogin={login} />
      }
    >
      <AdminDashboard />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/')({
  component: DashboardRoute,
});
