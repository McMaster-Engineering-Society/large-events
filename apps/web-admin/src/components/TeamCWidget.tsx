import { useTeamWidget } from '../hooks/useTeamWidget';

export function TeamCWidget() {
  const { teamUrl } = useTeamWidget('team-c-admin');

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
        <iframe
          src={teamUrl}
          width="100%"
          height="300"
          frameBorder="0"
          title="Team C Admin Dashboard"
          className="rounded border-0"
        />
      </div>
    </div>
  );
}
