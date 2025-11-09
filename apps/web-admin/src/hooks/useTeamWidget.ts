const TEAM_URLS = {
  'team-a-admin': process.env.TEAM_A_WEB_ADMIN_URL || 'http://localhost:3021',
  'team-b-admin': process.env.TEAM_B_WEB_ADMIN_URL || 'http://localhost:3022',
  'team-c-admin': process.env.TEAM_C_WEB_ADMIN_URL || 'http://localhost:3023',
  'team-d-admin': process.env.TEAM_D_WEB_ADMIN_URL || 'http://localhost:3024',
};

export function useTeamWidget(remoteName: keyof typeof TEAM_URLS) {
  return {
    teamUrl: TEAM_URLS[remoteName],
  };
}
