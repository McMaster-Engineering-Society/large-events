import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const teamPortalPorts: Record<string, number> = {
  teamA: 3021,
  teamB: 3022,
  teamC: 3023,
  teamD: 3024,
};

function TeamRedirectPage() {
  const { team } = Route.useParams();
  const { user, loading: authLoading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    const redirectToTeamPortal = async () => {
      if (!user) {
        setError('Please log in first');
        return;
      }

      const port = teamPortalPorts[team];
      if (!port) {
        setError(`Unknown team: ${team}`);
        return;
      }

      if (redirecting) return;
      setRedirecting(true);

      try {
        const tokenResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email })
        });

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          const url = `http://localhost:${port}?auth=${encodeURIComponent(tokenData.token)}`;
          window.location.href = url;
        } else {
          throw new Error('Failed to get auth token');
        }
      } catch (error) {
        console.error('Error redirecting to team portal:', error);
        setError('Failed to redirect. You can try accessing the portal directly.');
        setRedirecting(false);
      }
    };

    const timer = setTimeout(redirectToTeamPortal, 500);
    return () => clearTimeout(timer);
  }, [user, team, authLoading, redirecting]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Loading authentication...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-card text-center max-w-lg">
        {error ? (
          <>
            <div className="text-3xl mb-5">⚠️</div>
            <h1 className="text-error-red mb-4 text-2xl">
              Redirect Error
            </h1>
            <p className="text-text-gray mb-5">{error}</p>
            <div className="bg-gray-100 p-4 rounded mb-5">
              <p className="m-0 mb-2 text-sm">
                You can try:
              </p>
              <a
                href="/"
                className="block my-2 text-brand-blue no-underline hover:underline"
              >
                Go back to main portal
              </a>
              <a
                href={`http://localhost:${teamPortalPorts[team]}`}
                className="block my-2 text-brand-blue no-underline hover:underline"
              >
                Access {team?.toUpperCase()} portal directly
              </a>
            </div>
          </>
        ) : (
          <>
            <div className="text-3xl mb-5">🔄</div>
            <h1 className="text-text-dark mb-4 text-2xl">
              Redirecting to {team?.toUpperCase()} Portal
            </h1>
            <p className="text-text-gray mb-5">
              Please wait while we redirect you to the team portal...
            </p>
            <div className="bg-gray-200 p-4 rounded text-sm text-gray-700">
              Target: <strong>http://localhost:{teamPortalPorts[team]}</strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/teams/$team/admin')({
  component: TeamRedirectPage,
});
