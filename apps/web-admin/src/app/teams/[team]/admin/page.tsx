'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';

const teamPortalPorts: Record<string, number> = {
  teamA: 3021,
  teamB: 3022,
  teamC: 3023,
  teamD: 3024,
};

export default function TeamRedirectPage() {
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const team = params.team as string;
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

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

      if (redirecting) return; // Prevent multiple redirects
      setRedirecting(true);

      try {
        // Get a fresh token for the team portal
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

    // Add a small delay to prevent immediate redirect loops
    const timer = setTimeout(redirectToTeamPortal, 500);
    return () => clearTimeout(timer);
  }, [user, team, authLoading, redirecting]);

  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontSize: '18px'
      }}>
        Loading authentication...
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        {error ? (
          <>
            <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⚠️</div>
            <h1 style={{ color: '#dc3545', marginBottom: '15px', fontSize: '1.5rem' }}>
              Redirect Error
            </h1>
            <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>
                You can try:
              </p>
              <a
                href="/"
                style={{
                  display: 'block',
                  margin: '10px 0',
                  color: '#007bff',
                  textDecoration: 'none'
                }}
              >
                Go back to main portal
              </a>
              <a
                href={`http://localhost:${teamPortalPorts[team]}`}
                style={{
                  display: 'block',
                  margin: '10px 0',
                  color: '#007bff',
                  textDecoration: 'none'
                }}
              >
                Access {team?.toUpperCase()} portal directly
              </a>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '2rem', marginBottom: '20px' }}>🔄</div>
            <h1 style={{ color: '#333', marginBottom: '15px', fontSize: '1.5rem' }}>
              Redirecting to {team?.toUpperCase()} Portal
            </h1>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Please wait while we redirect you to the team portal...
            </p>
            <div style={{
              backgroundColor: '#e9ecef',
              padding: '15px',
              borderRadius: '4px',
              fontSize: '0.9rem',
              color: '#495057'
            }}>
              Target: <strong>http://localhost:{teamPortalPorts[team]}</strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
}