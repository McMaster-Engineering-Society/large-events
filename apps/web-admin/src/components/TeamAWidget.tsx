

import { useState, useEffect } from 'react';
import { useTeamWidget } from '../hooks/useTeamWidget';

export default function TeamAWidget() {
  const { isLoading, error, loadRemote, fallbackUrl } = useTeamWidget('team-a-admin');
  const [RemoteComponent, setRemoteComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    async function loadTeamAComponent() {
      try {
        const remote = await loadRemote('TeamAAdminDashboard');
        setRemoteComponent(() => remote);
      } catch (err) {
        console.warn('Failed to load Team A admin component:', err);
      }
    }

    loadTeamAComponent();
  }, [loadRemote]);

  if (error && !RemoteComponent) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Team A Admin</h2>
          <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Offline</span>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Unable to load Team A Admin widget</p>
          <button
            onClick={() => window.open('/teams/teamA/admin/', '_blank')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Open Team A Admin Portal
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && !RemoteComponent) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Team A Admin</h2>
          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Loading...</span>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Team A Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Team A Management</h2>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Live</span>
          <a
            href="/teams/teamA/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Team A Admin →
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
            title="Team A Admin Dashboard"
            className="rounded border-0"
          />
        )}
      </div>
    </div>
  );
}