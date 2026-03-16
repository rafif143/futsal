'use client';

import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TeamStanding } from '@/data/types';

interface StandingsTableProps {
  group: string;
  teams: TeamStanding[];
  sortBy?: 'points' | 'goalDifference' | 'goalsFor';
}

function sortTeams(teams: TeamStanding[]): TeamStanding[] {
  return [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return a.disciplinaryPoints - b.disciplinaryPoints; // Lower disciplinary points = better
  });
}

export function StandingsTable({ group, teams, sortBy }: StandingsTableProps) {
  const sorted = useMemo(() => sortTeams(teams), [teams]);

  return (
    <div className="rounded-lg border-2 border-gray-300 bg-white shadow-sm">
      {/* Group Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-gray-300">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F7A63] text-white text-sm font-bold">
          {group}
        </div>
        <span className="font-semibold text-sm text-gray-900">Grup {group}</span>
      </div>

      {/* Scrollable table wrapper for mobile */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead className="w-8 text-center">#</TableHead>
              <TableHead className="min-w-[140px]">Tim</TableHead>
              <TableHead className="text-center w-10">M</TableHead>
              <TableHead className="text-center w-10">W</TableHead>
              <TableHead className="text-center w-10">D</TableHead>
              <TableHead className="text-center w-10">L</TableHead>
              <TableHead className="text-center w-10">GF</TableHead>
              <TableHead className="text-center w-10">GA</TableHead>
              <TableHead className="text-center w-10">GD</TableHead>
              <TableHead className="text-center w-10 font-bold text-gray-900">Pts</TableHead>
              <TableHead className="text-center w-10">
                <span className="text-yellow-500">YC</span>
              </TableHead>
              <TableHead className="text-center w-10">
                <span className="text-red-500">RC</span>
              </TableHead>
              <TableHead className="text-center w-12">
                <span className="text-orange-600 text-xs font-bold">DP</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="text-center text-muted-foreground py-6 text-sm">
                  Belum ada data tim
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((standing, index) => {
                const rank = index + 1;
                const isQualified = rank <= 2;

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
                        <span className="text-muted-foreground">{rank}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Team logo / initial */}
                        <div className="h-7 w-7 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-primary border border-border overflow-hidden">
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
                    <TableCell className="text-center text-sm">
                      <span className={standing.yellowCards > 0 ? 'text-yellow-600 font-medium' : 'text-muted-foreground'}>
                        {standing.yellowCards}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      <span className={standing.redCards > 0 ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                        {standing.redCards}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      <span className={standing.disciplinaryPoints > 0 ? 'text-orange-600 font-bold' : 'text-muted-foreground'}>
                        {standing.disciplinaryPoints}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}
