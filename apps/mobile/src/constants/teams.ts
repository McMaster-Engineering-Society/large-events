export interface TeamConfig {
  id: string;
  name: string;
  color: string;
  icon: string;
  package: string;
  userUrl: string;
  adminUrl: string;
}

/**
 * Team configuration for all four teams
 * Colors match the web-user portal theme
 */
export const TEAMS: TeamConfig[] = [
  {
    id: 'teamA',
    name: 'Team A',
    color: '#3b82f6', // blue-500
    icon: '🔷',
    package: '@teamA/mobile',
    userUrl: 'http://localhost/teams/teamA/user/',
    adminUrl: 'http://localhost/teams/teamA/admin/',
  },
  {
    id: 'teamB',
    name: 'Team B',
    color: '#10b981', // green-500
    icon: '🟢',
    package: '@teamB/mobile',
    userUrl: 'http://localhost/teams/teamB/user/',
    adminUrl: 'http://localhost/teams/teamB/admin/',
  },
  {
    id: 'teamC',
    name: 'Team C',
    color: '#f97316', // orange-500
    icon: '🟠',
    package: '@teamC/mobile',
    userUrl: 'http://localhost/teams/teamC/user/',
    adminUrl: 'http://localhost/teams/teamC/admin/',
  },
  {
    id: 'teamD',
    name: 'Team D',
    color: '#a855f7', // purple-500
    icon: '🟣',
    package: '@teamD/mobile-components',
    userUrl: 'http://localhost/teams/teamD/user/',
    adminUrl: 'http://localhost/teams/teamD/admin/',
  },
];

/**
 * Get team configuration by ID
 */
export function getTeamById(id: string): TeamConfig | undefined {
  return TEAMS.find((team) => team.id === id);
}

/**
 * Get team configuration by name
 */
export function getTeamByName(name: string): TeamConfig | undefined {
  return TEAMS.find((team) => team.name === name);
}
