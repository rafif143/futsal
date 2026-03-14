'use client';

import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StandingsTable } from '@/components/features/standings';
import { KnockoutBracket } from '@/components/features/knockout';
import { MatchCard } from '@/components/features/matches';
import { useTournament } from '@/contexts/TournamentContext';
import { calculateGroupStandings } from '@/lib/standings';
import { advanceWinners } from '@/lib/knockout';
import {
  mockRound16Matches,
  mockQuarterMatches,
  mockSemiMatches,
  mockFinalMatch,
  mockThirdPlaceMatch,
} from '@/data/mock-knockout';
import { mockPlayers } from '@/data/mock-players';
import { KnockoutMatch, Team } from '@/data/types';
import { Trophy } from 'lucide-react';

const GROUP_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'] as const;

function buildKnockoutMatches(): KnockoutMatch[] {
  const round16: KnockoutMatch[] = mockRound16Matches.map((m) => ({
    id: m.id,
    round: 'round16' as const,
  }));
  const quarter: KnockoutMatch[] = mockQuarterMatches.map((m) => ({
    id: m.id,
    round: 'quarter' as const,
  }));
  const semi: KnockoutMatch[] = mockSemiMatches.map((m) => ({
    id: m.id,
    round: 'semi' as const,
  }));
  const final: KnockoutMatch = { id: mockFinalMatch.id, round: 'final' };
  // No third place match - losers of semi-final share 3rd place
  return advanceWinners([...round16, ...quarter, ...semi, final]);
}

export default function PublicViewPage() {
  const { teams, matches, groups } = useTournament();
  const knockoutMatches = useMemo(() => buildKnockoutMatches(), []);

  const teamMap = useMemo(() => {
    return new Map<string, Team>(teams.map((t) => [t.id, t]));
  }, [teams]);

  const groupStandings = useMemo(() =>
    GROUP_LETTERS.map((letter) => {
      const groupAssignment = groups.find((g) => g.group === letter);
      const teamsInGroup =
        groupAssignment && groupAssignment.teams.length > 0
          ? groupAssignment.teams
          : teams.filter((t) => t.group === letter);
      return {
        letter,
        standings: calculateGroupStandings(letter, teamsInGroup, matches, mockPlayers),
      };
    }),
  [teams, matches, groups]);

  const completedMatches = useMemo(
    () => matches.filter((m) => m.status === 'completed'),
    [matches]
  );

  const pendingMatches = useMemo(
    () => matches.filter((m) => m.status === 'pending'),
    [matches]
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F7A63] text-white">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Turnamen Futsal</h1>
            <p className="text-xs text-gray-600">Tampilan Publik — Hanya Baca</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="standings">
          <TabsList className="mb-6">
            <TabsTrigger value="standings">Klasemen Grup</TabsTrigger>
            <TabsTrigger value="bracket">Bracket Knockout</TabsTrigger>
            <TabsTrigger value="results">Hasil Pertandingan</TabsTrigger>
          </TabsList>

          {/* Group Standings */}
          <TabsContent value="standings">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {groupStandings.map(({ letter, standings }) => (
                <StandingsTable key={letter} group={letter} teams={standings} />
              ))}
            </div>
          </TabsContent>

          {/* Knockout Bracket */}
          <TabsContent value="bracket">
            <div className="rounded-lg border bg-white p-4 shadow-sm overflow-x-auto">
              <KnockoutBracket matches={knockoutMatches} />
            </div>
          </TabsContent>

          {/* Match Results */}
          <TabsContent value="results">
            <div className="space-y-6">
              {/* Completed matches */}
              <section>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Pertandingan Selesai ({completedMatches.length})
                </h2>
                {completedMatches.length === 0 ? (
                  <p className="text-sm text-gray-600 py-6 text-center">
                    Belum ada pertandingan yang selesai.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {completedMatches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        team1Name={teamMap.get(match.team1Id)?.schoolName ?? match.team1Id}
                        team2Name={teamMap.get(match.team2Id)?.schoolName ?? match.team2Id}
                        showScore
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Upcoming matches */}
              <section>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Pertandingan Mendatang ({pendingMatches.length})
                </h2>
                {pendingMatches.length === 0 ? (
                  <p className="text-sm text-gray-600 py-6 text-center">
                    Tidak ada pertandingan yang dijadwalkan.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {pendingMatches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        team1Name={teamMap.get(match.team1Id)?.schoolName ?? match.team1Id}
                        team2Name={teamMap.get(match.team2Id)?.schoolName ?? match.team2Id}
                        showScore={false}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
