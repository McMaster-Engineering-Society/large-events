

import { useState, useEffect } from 'react';
import { useTeamWidget } from '../hooks/useTeamWidget';

export default function TeamBWidget() {
  const { isLoading, error, loadRemote, fallbackUrl } = useTeamWidget('team-b-user');
  const [RemoteComponent, setRemoteComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    async function loadTeamBComponent() {
      try {
        const remote = await loadRemote('TeamBDashboard');
        setRemoteComponent(() => remote);
      } catch (err) {
        console.warn('Failed to load Team B remote component:', err);
      }
    }

    loadTeamBComponent();
  }, [loadRemote]);

  if (error && !RemoteComponent) {
    return (
      <div className="widget-container">
        <div className="widget-header">
          <h2>Team B User</h2>
        </div>
        <div className="widget-content">
          <div className="error-state">
            <p className="mb-4">Unable to load Team B User widget</p>
            <button
              onClick={() => window.open('/teams/teamB/user/', '_blank')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Open Team B User Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && !RemoteComponent) {
    return (
      <div className="widget-container">
        <div className="widget-header">
          <h2>Team B User</h2>
        </div>
        <div className="widget-content">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading Team B User...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h2>Team B User</h2>
        <a
          href="/teamB"
          className="text-sm text-green-600 hover:text-green-800 transition-colors"
        >
          View All Team B User →
        </a>
      </div>
      <div className="widget-content">
        {RemoteComponent ? (
          <RemoteComponent />
        ) : (
          <iframe
            src={fallbackUrl}
            width="100%"
            height="400"
            frameBorder="0"
            title="Team B Dashboard"
            className="rounded border-0"
          />
        )}
      </div>
    </div>
  );
}