'use client';

import { useTeamWidget } from '../hooks/useTeamWidget';

export default function TeamBWidget() {
  const { teamUrl } = useTeamWidget('team-b-user');

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h2>Team B User</h2>
        <a
          href="/teamB"
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All Team B User →
        </a>
      </div>
      <div className="widget-content">
        <iframe
          src={teamUrl}
          width="100%"
          height="400"
          frameBorder="0"
          title="Team B Dashboard"
          className="rounded border-0"
        />
      </div>
    </div>
  );
}