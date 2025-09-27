"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import TeamAWidget from "./TeamAWidget";
import TeamBWidget from "./TeamBWidget";
import TeamCWidget from "./TeamCWidget";
import TeamDWidget from "./TeamDWidget";

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

  return (
    <>
      <div className="space-y-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome, {user?.email} - Overview of your large event management platform
            </p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Team Portal Links */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-3">Team Admin Portals</h2>
          <p className="text-blue-700 text-sm mb-3">
            Click to open authenticated team portals (opens in new tab)
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => openTeamPortal('teamA')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Team A Portal
            </button>
            <button
              onClick={() => openTeamPortal('teamB')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Team B Portal
            </button>
            <button
              onClick={() => openTeamPortal('teamC')}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
            >
              Team C Portal
            </button>
            <button
              onClick={() => openTeamPortal('teamD')}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Team D Portal
            </button>
          </div>
          <div className="border-t border-blue-200 pt-3">
            <p className="text-blue-600 text-xs mb-2">Direct portal URLs (for reference):</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-white px-2 py-1 rounded border">TeamA: localhost:3021</span>
              <span className="bg-white px-2 py-1 rounded border">TeamB: localhost:3022</span>
              <span className="bg-white px-2 py-1 rounded border">TeamC: localhost:3023</span>
              <span className="bg-white px-2 py-1 rounded border">TeamD: localhost:3024</span>
            </div>
          </div>
        </div>

        {/* Team Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* Team A Section */}
          <div className="lg:col-span-2 xl:col-span-1">
            <TeamAWidget />
          </div>

          {/* Team B Section */}
          <div className="lg:col-span-1 xl:col-span-1">
            <TeamBWidget />
          </div>

          {/* Team C Section */}
          <div className="lg:col-span-1 xl:col-span-1">
            <TeamCWidget />
          </div>

          {/* Team D Section */}
          <div className="lg:col-span-2 xl:col-span-1">
            <TeamDWidget />
          </div>
        </div>
      </div>
    </>
  );
}
