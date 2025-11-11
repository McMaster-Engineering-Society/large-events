import { useState, useEffect } from 'react';

const TEAM_URLS = {
  'team-a-admin': process.env.TEAM_A_WEB_ADMIN_URL || 'http://localhost:3021',
  'team-b-admin': process.env.TEAM_B_WEB_ADMIN_URL || 'http://localhost:3022',
  'team-c-admin': process.env.TEAM_C_WEB_ADMIN_URL || 'http://localhost:3023',
  'team-d-admin': process.env.TEAM_D_WEB_ADMIN_URL || 'http://localhost:3024',
};

export function useTeamWidget(remoteName: keyof typeof TEAM_URLS) {
  const [teamUrl, setTeamUrl] = useState(TEAM_URLS[remoteName]);

  useEffect(() => {
    const fetchTokenAndUpdateUrl = async () => {
      try {
        const response = await fetch('/api/auth/token', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            const baseUrl = TEAM_URLS[remoteName];
            const urlWithAuth = `${baseUrl}?auth=${data.token}`;
            setTeamUrl(urlWithAuth);
          }
        }
      } catch (error) {
        console.error('Failed to fetch auth token for team widget:', error);
        // Fallback to base URL without auth
        setTeamUrl(TEAM_URLS[remoteName]);
      }
    };

    fetchTokenAndUpdateUrl();
  }, [remoteName]);

  return {
    teamUrl,
  };
}
