import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRoute, LoginForm } from '@large-event/web-components';
import { useInstanceContext } from '@large-event/api-client';
import { useEffect } from 'react';

function HomePage() {
  const { user, logout, loading, login } = useAuth();
  const { instances } = useInstanceContext();

  // Listen for logout messages from Team D tabs
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'teamd-logout') {
        console.log('[User Portal] Received logout from Team D, reloading...');
        window.location.reload();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const teamUrls: Record<string, string> = {
    'Team A': process.env.TEAM_A_WEB_URL || 'http://localhost:3011',
    'Team B': process.env.TEAM_B_WEB_URL || 'http://localhost:3012',
    'Team C': process.env.TEAM_C_WEB_URL || 'http://localhost:3013',
    'Team D': process.env.TEAM_D_WEB_URL || 'http://localhost:3014',
  };

  const teams = [
    {
      name: 'Team A',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      shadowColor: 'shadow-blue-200',
      icon: '🔷'
    },
    {
      name: 'Team B',
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      shadowColor: 'shadow-green-200',
      icon: '🟢'
    },
    {
      name: 'Team C',
      bgColor: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      shadowColor: 'shadow-orange-200',
      icon: '🟠'
    },
    {
      name: 'Team D',
      bgColor: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      shadowColor: 'shadow-purple-200',
      icon: '🟣'
    }
  ];

  const generateTeamUrl = (teamName: string, token?: string) => {
    const baseUrl = teamUrls[teamName];
    return token ? `${baseUrl}?auth=${encodeURIComponent(token)}` : baseUrl;
  };

  const handleTeamClick = async (teamName: string) => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        const tokenResponse = await fetch('/api/auth/token', {
          method: 'GET',
          credentials: 'include'
        });

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          const url = generateTeamUrl(teamName, tokenData.token);
          window.open(url, '_blank');
        } else {
          window.open(generateTeamUrl(teamName), '_blank');
        }
      } else {
        window.open(generateTeamUrl(teamName), '_blank');
      }
    } catch (error) {
      console.error('Error opening team portal:', error);
      window.open(generateTeamUrl(teamName), '_blank');
    }
  };

  return (
    <ProtectedRoute
      user={user}
      loading={loading}
      unauthorizedComponent={
        <LoginForm title="Large Event User Portal" onLogin={login} />
      }
    >
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 flex justify-between items-center">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to Large Event Platform
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Hello, {user?.email}!
              </p>
              <p className="text-gray-500">
                Choose a team to get started
              </p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>

          {instances.length > 0 && (
            <div className="mb-8 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Instances</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {instances.map((instance) => (
                  <div
                    key={instance.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="font-semibold text-gray-900">{instance.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {instance.ownerOrganization.acronym || instance.ownerOrganization.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Access: <span className="font-medium">{instance.accessLevel}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Total instances: {instances.length}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {teams.map((team) => (
              <div
                key={team.name}
                onClick={() => handleTeamClick(team.name)}
                className={`
                  ${team.bgColor} ${team.hoverColor} ${team.shadowColor}
                  rounded-2xl p-8 text-white cursor-pointer
                  transform transition-all duration-200
                  hover:scale-105 hover:shadow-lg
                  flex flex-col items-center justify-center
                  min-h-[200px] text-center
                `}
              >
                <div className="text-4xl mb-4">{team.icon}</div>
                <h2 className="text-2xl font-bold mb-2">{team.name}</h2>
              </div>
            ))}
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/')({
  component: HomePage,
});
