'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Shield } from 'lucide-react';
import { KnockoutMatch, Team } from '@/data/types';

export interface KnockoutBracketProps {
  matches: KnockoutMatch[];
  onMatchClick?: (matchId: string) => void;
}

// ─── Match Card ────────────────────────────────────────────────────────────────

interface MatchSlotProps {
  match: KnockoutMatch;
  onClick?: () => void;
}

function TeamRow({
  team,
  score,
  isWinner,
}: {
  team?: Team;
  score?: number;
  isWinner: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded ${
        isWinner ? 'bg-[#1F7A63]/10' : ''
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="h-6 w-6 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-primary border border-border overflow-hidden">
          {team ? team.schoolName.charAt(0).toUpperCase() : '?'}
        </div>
        <span
          className={`text-xs truncate max-w-[90px] ${
            isWinner ? 'font-semibold text-[#1F7A63]' : 'text-foreground'
          } ${!team ? 'text-muted-foreground italic' : ''}`}
        >
          {team ? team.schoolName : 'TBD'}
        </span>
      </div>
      <span
        className={`text-xs font-bold flex-shrink-0 w-5 text-center ${
          isWinner ? 'text-[#1F7A63]' : 'text-muted-foreground'
        }`}
      >
        {score !== undefined ? score : score === 0 ? '0' : '-'}
      </span>
    </div>
  );
}

function MatchSlot({ match, onClick }: MatchSlotProps) {
  const hasResult = match.score1 !== undefined && match.score2 !== undefined;

  return (
    <Card
      onClick={onClick}
      className={`w-44 border shadow-sm transition-shadow ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${hasResult ? 'border-[#1F7A63]/30' : 'border-border'}`}
    >
      <div className="p-1 space-y-0.5">
        <TeamRow
          team={match.team1}
          score={match.score1}
          isWinner={!!match.winner && match.winner.id === match.team1?.id}
        />
        <div className="border-t border-dashed border-border/60 mx-2" />
        <TeamRow
          team={match.team2}
          score={match.score2}
          isWinner={!!match.winner && match.winner.id === match.team2?.id}
        />
      </div>
      {hasResult && match.winner && (
        <div className="px-3 pb-1.5">
          <Badge
            variant="outline"
            className="text-[9px] px-1 py-0 border-[#1F7A63] text-[#1F7A63] h-4"
          >
            Menang: {match.winner.schoolName}
          </Badge>
        </div>
      )}
    </Card>
  );
}

// ─── Round Column ──────────────────────────────────────────────────────────────

interface RoundColumnProps {
  label: string;
  matches: KnockoutMatch[];
  onMatchClick?: (matchId: string) => void;
  icon?: React.ReactNode;
}

function RoundColumn({ label, matches, onMatchClick, icon }: RoundColumnProps) {
  return (
    <div className="flex flex-col items-center gap-3 min-w-[11rem]">
      {/* Round header */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1F7A63]/10 border border-[#1F7A63]/20">
        {icon}
        <span className="text-xs font-semibold text-[#1F7A63] whitespace-nowrap">{label}</span>
      </div>

      {/* Matches */}
      <div className="flex flex-col gap-4 justify-around flex-1">
        {matches.length === 0 ? (
          <div className="w-44 h-16 rounded-lg border border-dashed border-border flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Belum ada pertandingan</span>
          </div>
        ) : (
          matches.map((match) => (
            <MatchSlot
              key={match.id}
              match={match}
              onClick={onMatchClick ? () => onMatchClick(match.id) : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Connector Lines (decorative) ─────────────────────────────────────────────

function Connector({ count }: { count: number }) {
  if (count === 0) return <div className="w-6" />;
  return (
    <div className="flex flex-col justify-around flex-1 w-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center h-full">
          <div className="w-full border-t border-dashed border-[#1F7A63]/30" />
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function KnockoutBracket({ matches, onMatchClick }: KnockoutBracketProps) {
  const round16 = matches.filter((m) => m.round === 'round16');
  const quarter = matches.filter((m) => m.round === 'quarter');
  const semi = matches.filter((m) => m.round === 'semi');
  const final = matches.filter((m) => m.round === 'final');
  // No third place match - losers of semi-final share 3rd place

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex items-start gap-0 min-w-max px-2 py-4">
        {/* Round of 16 */}
        <RoundColumn
          label="Babak 16 Besar"
          matches={round16}
          onMatchClick={onMatchClick}
        />

        <Connector count={round16.length} />

        {/* Quarter Finals */}
        <RoundColumn
          label="Perempat Final"
          matches={quarter}
          onMatchClick={onMatchClick}
        />

        <Connector count={quarter.length} />

        {/* Semi Finals */}
        <RoundColumn
          label="Semi Final"
          matches={semi}
          onMatchClick={onMatchClick}
        />

        <Connector count={semi.length} />

        {/* Final */}
        <RoundColumn
          label="Final"
          matches={final}
          onMatchClick={onMatchClick}
          icon={<Trophy className="h-3 w-3 text-[#1F7A63]" />}
        />
      </div>
    </div>
  );
}
