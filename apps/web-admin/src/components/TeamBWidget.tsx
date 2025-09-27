

import { useState, useEffect } from 'react';
import { useTeamWidget } from '../hooks/useTeamWidget';

export default function TeamBWidget() {
  const { isLoading, error, loadRemote, fallbackUrl } = useTeamWidget('team-b-admin');
  const [RemoteComponent, setRemoteComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    async function loadTeamBComponent() {
      try {
        const remote = await loadRemote('TeamBAdminDashboard');
        setRemoteComponent(() => remote);
      } catch (err) {
        console.warn('Failed to load Team B admin component:', err);
      }
    }

    loadTeamBComponent();
  }, [loadRemote]);

  if (error && !RemoteComponent) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Team B Admin</h2>
          <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Offline</span>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Unable to load Team B Admin widget</p>
          <button
            onClick={() => window.open('/teams/teamB/admin/', '_blank')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Open Team B Admin Portal
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && !RemoteComponent) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Team B Admin</h2>
          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Loading...</span>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Team B Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Team B Admin</h2>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Live</span>
          <a
            href="/teams/teamB/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-600 hover:text-green-800 transition-colors"
          >
            Team B Admin →
          </a>
        </div>
      </div>
      <div className="min-h-[300px]">
        {RemoteComponent ? (
          <RemoteComponent />
        ) : (
          <iframe
            src={fallbackUrl}
            width="100%"
            height="300"
            frameBorder="0"
            title="Team B Admin Dashboard"
            className="rounded border-0"
          />
        )}
      </div>
    </div>
  );
}