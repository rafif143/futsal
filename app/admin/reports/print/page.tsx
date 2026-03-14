'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';
import { StandingsTable } from '@/components/features/standings/StandingsTable';
import { KnockoutBracket } from '@/components/features/knockout/KnockoutBracket';
import { calculateGroupStandings } from '@/lib/standings';
import { advanceWinners } from '@/lib/knockout';
import { mockTeams } from '@/data/mock-teams';
import { mockMatches } from '@/data/mock-matches';
import { mockGroups } from '@/data/mock-groups';
import { mockPlayers } from '@/data/mock-players';
import {
  mockRound16Matches,
  mockQuarterMatches,
  mockSemiMatches,
  mockFinalMatch,
  mockThirdPlaceMatch,
} from '@/data/mock-knockout';
import { KnockoutMatch, Team } from '@/data/types';

const GROUP_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const;

function buildKnockoutMatches(): KnockoutMatch[] {
  const round16: KnockoutMatch[] = mockRound16Matches.map((m) => ({ id: m.id, round: 'round16' as const }));
  const quarter: KnockoutMatch[] = mockQuarterMatches.map((m) => ({ id: m.id, round: 'quarter' as const }));
  const semi: KnockoutMatch[] = mockSemiMatches.map((m) => ({ id: m.id, round: 'semi' as const }));
  const final: KnockoutMatch = { id: mockFinalMatch.id, round: 'final' };
  const third: KnockoutMatch = { id: mockThirdPlaceMatch.id, round: 'third' };
  return advanceWinners([...round16, ...quarter, ...semi, final, third]);
}

const teamMap = new Map<string, Team>(mockTeams.map((t) => [t.id, t]));

// ─── Schedule Report ───────────────────────────────────────────────────────────

function ScheduleReport() {
  const groupMatches = useMemo(() => {
    return GROUP_LETTERS.map((letter) => {
      const matches = mockMatches.filter((m) => m.group === letter);
      return { letter, matches };
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6 print:text-xl">Jadwal Pertandingan Grup</h1>
      <div className="space-y-6">
        {groupMatches.map(({ letter, matches }) => (
          <div key={letter} className="break-inside-avoid">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 flex items-center justify-center rounded-full bg-[#1F7A63] text-white text-sm font-bold">
                {letter}
              </div>
              <h2 className="font-semibold text-base">Grup {letter}</h2>
            </div>
            {matches.length === 0 ? (
              <p className="text-sm text-gray-400 pl-9">Belum ada pertandingan</p>
            ) : (
              <table className="w-full text-sm border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50 text-xs">
                    <th className="border border-gray-200 px-3 py-2 text-left">No</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Tim 1</th>
                    <th className="border border-gray-200 px-3 py-2 text-center">Skor</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Tim 2</th>
                    <th className="border border-gray-200 px-3 py-2 text-center">Status</th>
                    <th className="border border-gray-200 px-3 py-2 text-center">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match, idx) => {
                    const team1 = teamMap.get(match.team1Id);
                    const team2 = teamMap.get(match.team2Id);
                    const score =
                      match.status === 'completed'
                        ? `${match.team1Score ?? 0} - ${match.team2Score ?? 0}`
                        : 'vs';
                    return (
                      <tr key={match.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-200 px-3 py-2 text-center">{idx + 1}</td>
                        <td className="border border-gray-200 px-3 py-2">{team1?.name ?? match.team1Id}</td>
                        <td className="border border-gray-200 px-3 py-2 text-center font-mono font-semibold">{score}</td>
                        <td className="border border-gray-200 px-3 py-2">{team2?.name ?? match.team2Id}</td>
                        <td className="border border-gray-200 px-3 py-2 text-center">
                          <span className={match.status === 'completed' ? 'text-green-600' : 'text-gray-400'}>
                            {match.status === 'completed' ? 'Selesai' : 'Belum'}
                          </span>
                        </td>
                        <td className="border border-gray-200 px-3 py-2 text-center text-gray-500">
                          {match.date ?? '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Bracket Report ────────────────────────────────────────────────────────────

function BracketReport() {
  const matches = useMemo(() => buildKnockoutMatches(), []);
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6 print:text-xl">Bracket Knockout</h1>
      <KnockoutBracket matches={matches} />
    </div>
  );
}

// ─── Standings Report ──────────────────────────────────────────────────────────

function StandingsReport() {
  const groupStandings = useMemo(() =>
    GROUP_LETTERS.map((letter) => {
      const groupAssignment = mockGroups.find((g) => g.group === letter);
      const teamsInGroup =
        groupAssignment && groupAssignment.teams.length > 0
          ? groupAssignment.teams
          : mockTeams.filter((t) => t.group === letter);
      return {
        letter,
        standings: calculateGroupStandings(letter, teamsInGroup, mockMatches, mockPlayers),
      };
    }),
    []
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6 print:text-xl">Klasemen Semua Grup</h1>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 print:grid-cols-2">
        {groupStandings.map(({ letter, standings }) => (
          <div key={letter} className="break-inside-avoid">
            <StandingsTable group={letter} teams={standings} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

type ReportType = 'schedule' | 'bracket' | 'standings';

const REPORT_TITLES: Record<ReportType, string> = {
  schedule: 'Jadwal Pertandingan',
  bracket: 'Bracket Knockout',
  standings: 'Klasemen Grup',
};

function PrintPreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = (searchParams.get('type') ?? 'schedule') as ReportType;
  const title = REPORT_TITLES[type] ?? 'Laporan';

  return (
    <div className="min-h-screen bg-white">
      {/* Toolbar — hidden when printing */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b px-6 py-3 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <span className="text-sm font-medium text-gray-600">{title}</span>
        </div>
        <Button size="sm" onClick={() => window.print()} className="gap-2">
          <Printer className="w-4 h-4" />
          Cetak
        </Button>
      </div>

      {/* Report content */}
      <div className="max-w-5xl mx-auto px-6 py-8 print:px-4 print:py-4">
        {type === 'schedule' && <ScheduleReport />}
        {type === 'bracket' && <BracketReport />}
        {type === 'standings' && <StandingsReport />}
      </div>
    </div>
  );
}

export default function PrintPreviewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Memuat...</div>}>
      <PrintPreviewContent />
    </Suspense>
  );
}
