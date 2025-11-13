import { useTeamWidget } from '../hooks/useTeamWidget';

export function TeamAWidget() {
  const { teamUrl } = useTeamWidget('team-a-admin');

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
        <iframe
          src={teamUrl}
          width="100%"
          height="300"
          frameBorder="0"
          title="Team A Admin Dashboard"
          className="rounded border-0"
        />
      </div>
    </div>
  );
}
