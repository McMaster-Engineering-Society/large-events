'use client';

import { useTeamWidget } from '../hooks/useTeamWidget';

export default function TeamCWidget() {
  const { teamUrl } = useTeamWidget('team-c-user');

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h2>Team C User</h2>
        <a
          href="/teamC"
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All Team C User →
        </a>
      </div>
      <div className="widget-content">
        <iframe
          src={teamUrl}
          width="100%"
          height="400"
          frameBorder="0"
          title="Team C Dashboard"
          className="rounded border-0"
        />
      </div>
    </div>
  );
}