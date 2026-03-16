"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/features/dashboard";
import { useTournament } from "@/contexts/TournamentContext";
import { mockPlayers } from "@/data/mock-players";
import { Users, UserCheck, Trophy, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  const { teams, matches } = useTournament();
  
  // Calculate statistics from data
  const totalTeams = teams.length;
  const totalPlayers = mockPlayers.length;
  const totalMatches = matches.length;
  const matchesPlayed = matches.filter(match => match.status === 'completed').length;

  return (
    <DashboardLayout title="Dashboard" breadcrumb={["Home", "Dashboard"]}>
      <div className="flex flex-col gap-6 w-full h-full pb-10">
        
        {/* HERO BANNER SECTION */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden w-full shrink-0">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#1F7A63] opacity-20 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="flex items-center gap-6 z-10 w-full md:w-auto">
            <div className="h-16 w-16 bg-[#1F7A63] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(31,122,99,0.4)] shrink-0">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1">Tournament Dashboard</h1>
              <p className="text-gray-400 text-sm md:text-base font-medium">Selamat datang di Futsal Tournament Management System.</p>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <StatCard
            title="Total Teams"
            value={totalTeams}
            icon={Users}
            color="bg-primary"
          />
          <StatCard
            title="Total Players"
            value={totalPlayers}
            icon={UserCheck}
            color="bg-primary"
          />
          <StatCard
            title="Total Matches"
            value={totalMatches}
            icon={Trophy}
            color="bg-primary"
          />
          <StatCard
            title="Matches Played"
            value={matchesPlayed}
            icon={CheckCircle}
            color="bg-primary"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
