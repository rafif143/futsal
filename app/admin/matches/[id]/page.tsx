"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MatchInput } from "@/components/features/matches/MatchInput";
import { mockMatches } from "@/data/mock-matches";
import { mockTeams } from "@/data/mock-teams";
import { mockPlayers } from "@/data/mock-players";
import { applyMatchResult, updatePlayerStats } from "@/lib/match-utils";
import { Match, Player, MatchResult } from "@/data/types";

export default function MatchInputPage() {
  const params = useParams();
  const id = params.id as string;

  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [players, setPlayers] = useState<Player[]>(mockPlayers);

  const match = matches.find((m) => m.id === id);

  if (!match) {
    return (
      <DashboardLayout
        title="Input Pertandingan"
        breadcrumb={["Admin", "Pertandingan", "Input"]}
      >
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <p className="text-xl font-semibold text-gray-700">Match not found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Pertandingan dengan ID &quot;{id}&quot; tidak ditemukan.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const team1 = mockTeams.find((t) => t.id === match.team1Id)!;
  const team2 = mockTeams.find((t) => t.id === match.team2Id)!;
  const team1Players = players.filter((p) => p.teamId === match.team1Id);
  const team2Players = players.filter((p) => p.teamId === match.team2Id);

  function handleSave(result: MatchResult) {
    setMatches((prev) => applyMatchResult(result, prev));
    setPlayers((prev) => updatePlayerStats(result, prev));
  }

  const matchLabel = match.group
    ? `Grup ${match.group} — ${team1?.name ?? match.team1Id} vs ${team2?.name ?? match.team2Id}`
    : `${team1?.name ?? match.team1Id} vs ${team2?.name ?? match.team2Id}`;

  return (
    <DashboardLayout
      title="Input Pertandingan"
      breadcrumb={["Admin", "Pertandingan", matchLabel]}
    >
      <div className="max-w-3xl mx-auto w-full">
        <MatchInput
          match={match}
          team1={team1}
          team2={team2}
          team1Players={team1Players}
          team2Players={team2Players}
          onSave={handleSave}
        />
      </div>
    </DashboardLayout>
  );
}
