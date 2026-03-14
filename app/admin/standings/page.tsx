'use client';

import { useState, useMemo } from 'react';
import { Trophy, Medal, Search, Award } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StandingsTable } from '@/components/features/standings/StandingsTable';
import { useTournament } from '@/contexts/TournamentContext';
import { calculateGroupStandings } from '@/lib/standings';
import { mockPlayers } from '@/data/mock-players';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TeamStanding } from '@/data/types';

const GROUP_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'] as const;

export default function StandingsPage() {
  const { teams, matches, groups } = useTournament();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'groups' | 'runners' | 'qualified'>('groups');
  
  // Calculate all group standings
  const allGroupStandings = useMemo(() => {
    return GROUP_LETTERS.map((letter) => {
      const groupAssignment = groups.find((g) => g.group === letter);
      const teamsInGroup =
        groupAssignment && groupAssignment.teams.length > 0
          ? groupAssignment.teams
          : teams.filter((t) => t.group === letter);

      return {
        group: letter,
        standings: calculateGroupStandings(letter, teamsInGroup, matches, mockPlayers)
      };
    });
  }, [teams, matches, groups]);

  // Get all runner-ups and sort them
  const sortedRunnerUps = useMemo(() => {
    const runnerUps: (TeamStanding & { group: string })[] = [];
    
    allGroupStandings.forEach(({ group, standings }) => {
      if (standings[1]) { // Get 2nd place
        runnerUps.push({ ...standings[1], group });
      }
    });

    // Sort by points, goal difference, goals for
    return runnerUps.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
  }, [allGroupStandings]);

  // Get group winners (1st place from each group)
  const groupWinners = useMemo(() => {
    return allGroupStandings
      .map(({ group, standings }) => {
        if (standings[0]) {
          return { ...standings[0], group };
        }
        return null;
      })
      .filter(Boolean) as (TeamStanding & { group: string })[];
  }, [allGroupStandings]);

  // Get top 5 runner-ups for qualification
  const top5RunnerUps = useMemo(() => {
    return sortedRunnerUps.slice(0, 5);
  }, [sortedRunnerUps]);
  
  // Filter groups based on search query
  const filteredGroups = GROUP_LETTERS.filter((letter) => {
    if (!searchQuery) return true;
    
    // Get teams for this group
    const groupAssignment = groups.find((g) => g.group === letter);
    const teamsInGroup =
      groupAssignment && groupAssignment.teams.length > 0
        ? groupAssignment.teams
        : teams.filter((t) => t.group === letter);
    
    // Check if any team name matches search query
    return teamsInGroup.some((team) =>
      team.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
    ) || letter.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  return (
    <DashboardLayout title="Klasemen Turnamen" breadcrumb={['Admin', 'Standings']}>
      <div className="flex flex-col gap-8 w-full h-full pb-10">
        
        {/* HERO BANNER SECTION */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden w-full shrink-0">
          {/* Efek Glow Hijau di Background */}
          <div className="absolute right-0 top-0 w-72 h-72 bg-[#1F7A63] opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="flex items-center gap-6 z-10 w-full md:w-auto">
            <div className="h-16 w-16 bg-gradient-to-br from-[#1F7A63] to-[#0f4033] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(31,122,99,0.4)] border border-[#1F7A63]/50 shrink-0">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1">Klasemen Fase Grup</h1>
              <p className="text-gray-400 text-sm md:text-base font-medium">Pantau perolehan poin, selisih gol, dan peringkat tim secara <span className="text-white font-bold italic">real-time</span>.</p>
            </div>
          </div>

          {/* Mini Stats Card di Kanan (Tanpa Status Live) */}
          <div className="z-10 flex w-full md:w-auto">
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm shadow-inner w-full md:w-auto">
              <div className="p-2.5 bg-[#1F7A63]/20 rounded-lg">
                <Medal className="h-6 w-6 text-[#29a889]" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">Total Grup</p>
                <p className="text-xl md:text-2xl font-black text-white">{GROUP_LETTERS.length} Grup</p>
              </div>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex items-center gap-2 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all border-b-2 -mb-[2px] ${
              activeTab === 'groups'
                ? 'border-[#1F7A63] text-[#1F7A63]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Trophy className="h-4 w-4" />
            Klasemen Grup
          </button>
          <button
            onClick={() => setActiveTab('runners')}
            className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all border-b-2 -mb-[2px] ${
              activeTab === 'runners'
                ? 'border-[#1F7A63] text-[#1F7A63]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Award className="h-4 w-4" />
            Runner Up Terbaik
          </button>
          <button
            onClick={() => setActiveTab('qualified')}
            className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all border-b-2 -mb-[2px] ${
              activeTab === 'qualified'
                ? 'border-[#1F7A63] text-[#1F7A63]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Medal className="h-4 w-4" />
            Pot Knock Out
          </button>
        </div>

        {/* GROUPS TAB CONTENT */}
        {activeTab === 'groups' && (
          <>
            {/* SEARCH BAR */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari grup atau nama sekolah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-gray-900 border-2 border-gray-300 focus-visible:ring-[#1F7A63] rounded-xl"
              />
            </div>

            {/* STANDINGS GRID */}
            <div className="grid grid-cols-1 gap-6 md:gap-8 w-full">
              {filteredGroups.length === 0 ? (
                <div className="bg-white rounded-xl border-2 border-gray-300 p-8 text-center">
                  <p className="text-gray-500">Tidak ada grup atau tim yang cocok dengan pencarian "{searchQuery}"</p>
                </div>
              ) : (
                filteredGroups.map((letter) => {
                  // Get teams for this group: prefer groups assignment, fall back to team.group field
                  const groupAssignment = groups.find((g) => g.group === letter);
                  const teamsInGroup =
                    groupAssignment && groupAssignment.teams.length > 0
                      ? groupAssignment.teams
                      : teams.filter((t) => t.group === letter);

                  const standings = calculateGroupStandings(
                    letter,
                    teamsInGroup,
                    matches,
                    mockPlayers
                  );

                  return (
                    <div 
                      key={letter} 
                      className="animate-in fade-in zoom-in-95 duration-500 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <StandingsTable group={letter} teams={standings} />
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* RUNNER UPS TAB CONTENT */}
        {activeTab === 'runners' && (
          <div className="bg-white rounded-xl border-2 border-gray-300 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-gray-300 bg-gray-50">
              <Award className="h-5 w-5 text-[#1F7A63]" />
              <span className="font-semibold text-sm text-gray-900">Peringkat Runner Up (Juara 2 Grup)</span>
              <span className="ml-auto text-xs text-gray-600">5 Teratas Lolos ke Babak 16 Besar</span>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="text-xs">
                    <TableHead className="w-8 text-center">#</TableHead>
                    <TableHead className="w-16 text-center">Grup</TableHead>
                    <TableHead className="min-w-[200px]">Tim</TableHead>
                    <TableHead className="text-center w-10">M</TableHead>
                    <TableHead className="text-center w-10">W</TableHead>
                    <TableHead className="text-center w-10">D</TableHead>
                    <TableHead className="text-center w-10">L</TableHead>
                    <TableHead className="text-center w-10">GF</TableHead>
                    <TableHead className="text-center w-10">GA</TableHead>
                    <TableHead className="text-center w-10">GD</TableHead>
                    <TableHead className="text-center w-10 font-bold text-gray-900">Pts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRunnerUps.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center text-gray-500 py-6 text-sm">
                        Belum ada data runner up
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedRunnerUps.map((standing, index) => {
                      const rank = index + 1;
                      const isQualified = rank <= 5;

                      return (
                        <TableRow
                          key={standing.team.id}
                          className={isQualified ? 'bg-[#1F7A63]/8' : undefined}
                        >
                          <TableCell className="text-center text-sm font-medium">
                            {isQualified ? (
                              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1F7A63] text-white text-xs font-bold">
                                {rank}
                              </span>
                            ) : (
                              <span className="text-gray-500">{rank}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1F7A63] text-white text-xs font-bold">
                              {standing.group}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 border border-gray-300 overflow-hidden">
                                {standing.team.schoolName.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {standing.team.schoolName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-sm text-gray-900">{standing.played}</TableCell>
                          <TableCell className="text-center text-sm text-gray-900">{standing.won}</TableCell>
                          <TableCell className="text-center text-sm text-gray-900">{standing.drawn}</TableCell>
                          <TableCell className="text-center text-sm text-gray-900">{standing.lost}</TableCell>
                          <TableCell className="text-center text-sm text-gray-900">{standing.goalsFor}</TableCell>
                          <TableCell className="text-center text-sm text-gray-900">{standing.goalsAgainst}</TableCell>
                          <TableCell className="text-center text-sm">
                            <span className={standing.goalDifference > 0 ? 'text-[#1F7A63]' : standing.goalDifference < 0 ? 'text-red-500' : ''}>
                              {standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}
                            </span>
                          </TableCell>
                          <TableCell className="text-center text-sm font-bold text-gray-900">{standing.points}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {sortedRunnerUps.length > 0 && (
              <div className="flex items-center gap-3 px-4 py-2 border-t-2 border-gray-300 text-xs text-gray-600 bg-gray-50">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-[#1F7A63]" />
                  <span className="font-bold text-gray-900">5 Teratas Lolos ke Babak 16 Besar</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* QUALIFIED TEAMS TAB CONTENT */}
        {activeTab === 'qualified' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GROUP WINNERS */}
            <div className="bg-white rounded-xl border-2 border-gray-300 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-gray-300 bg-gradient-to-r from-amber-50 to-yellow-50">
                <Trophy className="h-5 w-5 text-amber-600" />
                <span className="font-semibold text-sm text-gray-900">Juara Grup (11 Tim)</span>
              </div>
              <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
                {groupWinners.length === 0 ? (
                  <p className="text-center text-gray-500 py-6 text-sm">Belum ada juara grup</p>
                ) : (
                  groupWinners.map((standing) => (
                    <div
                      key={standing.team.id}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50/50 to-yellow-50/50 rounded-lg border border-amber-200 hover:shadow-sm transition-shadow"
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white text-sm font-bold shadow-sm">
                        {standing.group}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{standing.team.schoolName}</p>
                        <p className="text-xs text-gray-600">
                          {standing.points} Pts • {standing.won}W {standing.drawn}D {standing.lost}L • GD: {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-bold">Juara Grup</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* TOP 5 RUNNER UPS */}
            <div className="bg-white rounded-xl border-2 border-gray-300 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-gray-300 bg-gradient-to-r from-emerald-50 to-green-50">
                <Award className="h-5 w-5 text-[#1F7A63]" />
                <span className="font-semibold text-sm text-gray-900">Runner Up Terbaik (5 Tim)</span>
              </div>
              <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
                {top5RunnerUps.length === 0 ? (
                  <p className="text-center text-gray-500 py-6 text-sm">Belum ada runner up terbaik</p>
                ) : (
                  top5RunnerUps.map((standing, index) => (
                    <div
                      key={standing.team.id}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50/50 to-green-50/50 rounded-lg border border-emerald-200 hover:shadow-sm transition-shadow"
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1F7A63] text-white text-sm font-bold shadow-sm">
                        {index + 1}
                      </span>
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-white text-xs font-bold">
                        {standing.group}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{standing.team.schoolName}</p>
                        <p className="text-xs text-gray-600">
                          {standing.points} Pts • {standing.won}W {standing.drawn}D {standing.lost}L • GD: {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-bold">Runner Up</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* LEGEND - Single legend for all tables */}
        <div className="bg-white rounded-xl border-2 border-gray-300 p-4 shadow-sm">
          <p className="text-xs text-gray-600">
            <span className="font-bold text-gray-900">Keterangan:</span> M=Main • W=Menang • D=Seri • L=Kalah • GF=Gol Masuk • GA=Gol Kemasukan • GD=Selisih Gol • Pts=Poin • YC=Kartu Kuning • RC=Kartu Merah
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}