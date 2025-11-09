import { useTeamWidget } from '../hooks/useTeamWidget';

export default function TeamDWidget() {
  const { teamUrl } = useTeamWidget('team-d-admin');

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h2>Team D Admin</h2>
        <a
          href="/teamD/admin"
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All Team D Admin →
        </a>
      </div>
      <div className="widget-content">
        <iframe
          src={teamUrl}
          width="100%"
          height="400"
          frameBorder="0"
          title="Team D Admin Dashboard"
          className="rounded border-0"
        />
      </div>
    </div>
  );
}
