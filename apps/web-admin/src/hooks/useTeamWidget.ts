import { useState, useCallback } from 'react';

interface TeamWidgetHook {
  isLoading: boolean;
  error: string | null;
  loadRemote: (componentName: string) => Promise<React.ComponentType>;
  fallbackUrl: string;
}

const FALLBACK_URLS = {
  'team-a-admin': process.env.TEAM_A_WEB_ADMIN_URL || 'http://localhost:3021',
  'team-b-admin': process.env.TEAM_B_WEB_ADMIN_URL || 'http://localhost:3022',
  'team-c-admin': process.env.TEAM_C_WEB_ADMIN_URL || 'http://localhost:3023',
  'team-d-admin': process.env.TEAM_D_WEB_ADMIN_URL || 'http://localhost:3024',
};

export function useTeamWidget(remoteName: keyof typeof FALLBACK_URLS): TeamWidgetHook {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRemote = useCallback(async (componentName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Dynamically import the remote component using Module Federation
      const remote = await import(remoteName);

      if (remote[componentName]) {
        setIsLoading(false);
        return remote[componentName];
      } else {
        throw new Error(`Component ${componentName} not found in remote ${remoteName}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load remote component';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [remoteName]);

  return {
    isLoading,
    error,
    loadRemote,
    fallbackUrl: FALLBACK_URLS[remoteName],
  };
}