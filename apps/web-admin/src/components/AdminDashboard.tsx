import { useAuth } from "../contexts/AuthContext";
import { useInstanceContext } from "@large-event/api-client";

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const { instances } = useInstanceContext();

  const teamPortalPorts: Record<string, number> = {
    teamA: 3021,
    teamB: 3022,
    teamC: 3023,
    teamD: 3024,
  };

  const openTeamPortal = async (teamName: string) => {
    const port = teamPortalPorts[teamName];
    let url = `http://localhost:${port}`;

    try {
      // Fetch JWT token to pass to team portal
      const tokenResponse = await fetch('/api/auth/token', {
        method: 'GET',
        credentials: 'include'
      });

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        if (tokenData.token) {
          url = `${url}?auth=${encodeURIComponent(tokenData.token)}`;
        }
      }
    } catch (error) {
      console.error('Error fetching auth token:', error);
      // Fallback to base URL without token
    }

    window.open(url, '_blank');
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
              key={team.key}
              className={`
                ${team.bgColor} ${team.shadowColor}
                rounded-2xl p-8 text-white
                flex flex-col items-center justify-center
                min-h-[200px] text-center
              `}
            >
              <h2 className="text-2xl font-bold mb-2">{team.name}</h2>
              <p className="text-white/90 mb-4">Admin Portal</p>

              <button
                onClick={() => openTeamPortal(team.key)}
                className={`
                  mt-4 px-6 py-3 bg-white/20 rounded-lg
                  ${team.hoverColor} hover:bg-white/30
                  transition-colors font-semibold
                `}
              >
                Open Dashboard
              </button>

              <div className="text-white/60 text-xs mt-4">
                localhost:{teamPortalPorts[team.key]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
