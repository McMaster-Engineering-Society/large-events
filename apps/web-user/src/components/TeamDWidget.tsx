
import { useState, useEffect } from 'react';
import { useTeamWidget } from '../hooks/useTeamWidget';

export default function TeamDWidget() {
  const { isLoading, error, loadRemote, fallbackUrl } = useTeamWidget('team-d-user');
  const [RemoteComponent, setRemoteComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    async function loadTeamDComponent() {
      try {
        const remote = await loadRemote('TeamDDashboard');
        setRemoteComponent(() => remote);
      } catch (err) {
        console.warn('Failed to load Team D remote component:', err);
      }
    }

    loadTeamDComponent();
  }, [loadRemote]);

  if (error && !RemoteComponent) {
    return (
      <div className="widget-container">
        <div className="widget-header">
          <h2>Team D User</h2>
        </div>
        <div className="widget-content">
          <div className="error-state">
            <p className="mb-4">Unable to load Team D User widget</p>
            <button
              onClick={() => window.open('/teams/teamD/user/', '_blank')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Open Team D User Portal
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
          <h2>Team D User</h2>
        </div>
        <div className="widget-content">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading Team D User...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h2>Team D User</h2>
        <a
          href="/teamD"
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All Team D User →
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
            title="Team D Dashboard"
            className="rounded border-0"
          />
        )}
      </div>
    </div>
  );
}