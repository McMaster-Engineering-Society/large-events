

import { useState, useEffect } from 'react';
import { useTeamWidget } from '../hooks/useTeamWidget';

export default function TeamCWidget() {
  const { isLoading, error, loadRemote, fallbackUrl } = useTeamWidget('team-c-admin');
  const [RemoteComponent, setRemoteComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    async function loadTeamCComponent() {
      try {
        const remote = await loadRemote('TeamCAdminDashboard');
        setRemoteComponent(() => remote);
      } catch (err) {
        console.warn('Failed to load Team C admin component:', err);
      }
    }

    loadTeamCComponent();
  }, [loadRemote]);

  if (error && !RemoteComponent) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Team C Admin</h2>
          <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Offline</span>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Unable to load Team C Admin widget</p>
          <button
            onClick={() => window.open('/teams/teamC/admin/', '_blank')}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Open Team C Admin Portal
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && !RemoteComponent) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Team C Admin</h2>
          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">Loading...</span>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Team C Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Team C Admin</h2>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Live</span>
          <a
            href="/teams/teamC/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
          >
            Team C Admin →
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
            title="Team C Admin Dashboard"
            className="rounded border-0"
          />
        )}
      </div>
    </div>
  );
}