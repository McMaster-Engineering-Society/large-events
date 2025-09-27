"use client";

import { useState } from "react";
import TeamAWidget from "./TeamAWidget";
import TeamBWidget from "./TeamBWidget";
import TeamCWidget from "./TeamCWidget";
import TeamDWidget from "./TeamDWidget";
export default function AdminDashboard() {
  return (
    <>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Overview of your large event management platform
          </p>
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
