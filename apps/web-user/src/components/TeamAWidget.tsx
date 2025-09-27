'use client';

import { useTeamWidget } from '../hooks/useTeamWidget';

export default function TeamAWidget() {
  const { teamUrl } = useTeamWidget('team-a-user');

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h2>Team A User</h2>
        <a
          href="/teamA"
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All Team A User →
        </a>
      </div>
      <div className="widget-content">
        <iframe
          src={teamUrl}
          width="100%"
          height="400"
          frameBorder="0"
          title="Team A Dashboard"
          className="rounded border-0"
        />
      </div>
    </div>
  );
}