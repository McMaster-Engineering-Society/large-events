'use client';

import { useTeamWidget } from '../hooks/useTeamWidget';

export function TeamDWidget() {
  const { teamUrl } = useTeamWidget('team-d-user');

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
        <iframe
          src={teamUrl}
          width="100%"
          height="400"
          frameBorder="0"
          title="Team D Dashboard"
          className="rounded border-0"
        />
      </div>
    </div>
  );
}