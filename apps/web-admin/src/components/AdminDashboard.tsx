"use client";

import { useAuth } from "../contexts/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const teamPortalPorts: Record<string, number> = {
    teamA: 3021,
    teamB: 3022,
    teamC: 3023,
    teamD: 3024,
  };

  const generateTeamPortalUrl = (teamName: string, token?: string) => {
    const port = teamPortalPorts[teamName];
    const baseUrl = `http://localhost:${port}`;
    return token ? `${baseUrl}?auth=${encodeURIComponent(token)}` : baseUrl;
  };

  const openTeamPortal = async (teamName: string) => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        const tokenResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.user.email })
        });

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          const url = generateTeamPortalUrl(teamName, tokenData.token);
          window.open(url, '_blank');
        }
      }
    } catch (error) {
      console.error('Error opening team portal:', error);
      window.open(generateTeamPortalUrl(teamName), '_blank');
    }
  };

  const teams = [
    {
      name: 'Team A',
      key: 'teamA',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      shadowColor: 'shadow-blue-200'
    },
    {
      name: 'Team B',
      key: 'teamB',
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      shadowColor: 'shadow-green-200'
    },
    {
      name: 'Team C',
      key: 'teamC',
      bgColor: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      shadowColor: 'shadow-orange-200'
    },
    {
      name: 'Team D',
      key: 'teamD',
      bgColor: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      shadowColor: 'shadow-purple-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome, {user?.email} - Select a team portal to manage
            </p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {teams.map((team) => (
            <div
              key={team.key}
              onClick={() => openTeamPortal(team.key)}
              className={`
                ${team.bgColor} ${team.hoverColor} ${team.shadowColor}
                rounded-2xl p-8 text-white cursor-pointer
                transform transition-all duration-200
                hover:scale-105 hover:shadow-lg
                flex flex-col items-center justify-center
                min-h-[200px] text-center
              `}
            >
              <h2 className="text-2xl font-bold mb-2">{team.name}</h2>
              <p className="text-white/90 mb-4">Admin Portal</p>
              <div className="text-white/80 text-sm">
                localhost:{teamPortalPorts[team.key]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
