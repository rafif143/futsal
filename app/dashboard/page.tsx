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
      <p className="mb-6 text-gray-600">
        Welcome to the Futsal Tournament Management System
      </p>
      
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
    </DashboardLayout>
  );
}
