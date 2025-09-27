const TEAM_URLS = {
  'team-a-user': process.env.TEAM_A_WEB_URL || 'http://localhost:3011',
  'team-b-user': process.env.TEAM_B_WEB_URL || 'http://localhost:3012',
  'team-c-user': process.env.TEAM_C_WEB_URL || 'http://localhost:3013',
  'team-d-user': process.env.TEAM_D_WEB_URL || 'http://localhost:3014',
};

export function useTeamWidget(remoteName: keyof typeof TEAM_URLS) {
  return {
    teamUrl: TEAM_URLS[remoteName],
  };
}