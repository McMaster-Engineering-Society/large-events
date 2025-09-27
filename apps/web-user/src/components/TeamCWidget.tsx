

import { useState, useEffect } from 'react';
import { useTeamWidget } from '../hooks/useTeamWidget';

export default function TeamCWidget() {
  const { isLoading, error, loadRemote, fallbackUrl } = useTeamWidget('team-c-user');
  const [RemoteComponent, setRemoteComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    async function loadTeamCComponent() {
      try {
        const remote = await loadRemote('TeamCDashboard');
        setRemoteComponent(() => remote);
      } catch (err) {
        console.warn('Failed to load Team C remote component:', err);
      }
    }

    loadTeamCComponent();
  }, [loadRemote]);

  if (error && !RemoteComponent) {
    return (
      <div className="widget-container">
        <div className="widget-header">
          <h2>Team C User</h2>
        </div>
        <div className="widget-content">
          <div className="error-state">
            <p className="mb-4">Unable to load Team C User widget</p>
            <button
              onClick={() => window.open('/teams/teamC/user/', '_blank')}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Open Team C User Portal
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
          <h2>Team C User Booking</h2>
        </div>
        <div className="widget-content">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading Team C User...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h2>Team C User Booking</h2>
        <a
          href="/teamC"
          className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
        >
          Team C User →
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
            title="Team C Dashboard"
            className="rounded border-0"
          />
        )}
      </div>
    </div>
  );
}