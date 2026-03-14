'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KnockoutBracket } from '@/components/features/knockout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Swords, RotateCcw, CheckCircle2, ShieldAlert, GitBranch } from 'lucide-react';
import { mockTeams } from '@/data/mock-teams';
import { mockRound16Matches, mockQuarterMatches, mockSemiMatches, mockFinalMatch, mockThirdPlaceMatch } from '@/data/mock-knockout';
import { advanceWinners } from '@/lib/knockout';
import { KnockoutMatch, Team } from '@/data/types';

// Build initial KnockoutMatch array from mock data (all rounds)
function buildInitialMatches(): KnockoutMatch[] {
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
  const third: KnockoutMatch = { id: mockThirdPlaceMatch.id, round: 'third' };

  return [...round16, ...quarter, ...semi, final, third];
}

const SLOT_COUNT = 16; // 8 matches × 2 teams

export default function KnockoutPage() {
  const [selectedTeams, setSelectedTeams] = useState<(string | undefined)[]>(
    Array(SLOT_COUNT).fill(undefined)
  );
  const [bracketConfirmed, setBracketConfirmed] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Build KnockoutMatch array with selected teams applied
  const knockoutMatches = useMemo<KnockoutMatch[]>(() => {
    const base = buildInitialMatches();

    const round16 = base.filter((m) => m.round === 'round16');
    round16.forEach((match, i) => {
      const team1Id = selectedTeams[i * 2];
      const team2Id = selectedTeams[i * 2 + 1];
      match.team1 = team1Id ? mockTeams.find((t) => t.id === team1Id) : undefined;
      match.team2 = team2Id ? mockTeams.find((t) => t.id === team2Id) : undefined;
    });

    return advanceWinners(base);
  }, [selectedTeams]);

  const handleTeamSelect = (slotIndex: number, teamId: string) => {
    setSelectedTeams((prev) => {
      const next = [...prev];
      next[slotIndex] = teamId === 'none' ? undefined : teamId;
      return next;
    });
  };

  const handleConfirmRequest = () => {
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    setBracketConfirmed(true);
    setShowConfirmModal(false);
  };

  const handleReset = () => {
    if (confirm("Yakin ingin mereset semua pilihan tim?")) {
      setSelectedTeams(Array(SLOT_COUNT).fill(undefined));
      setBracketConfirmed(false);
    }
  };

  const usedTeamIds = new Set(selectedTeams.filter(Boolean) as string[]);
  const filledSlots = selectedTeams.filter(Boolean).length;
  const allFilled = filledSlots === SLOT_COUNT;

  return (
    <DashboardLayout
      title="Babak Knockout"
      breadcrumb={['Admin', 'Babak Knockout']}
    >
      <div className="flex flex-col gap-8 w-full h-full pb-10">
        
        {/* HERO BANNER SECTION */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden w-full shrink-0">
          <div className="absolute right-0 top-0 w-72 h-72 bg-[#1F7A63] opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="flex items-center gap-6 z-10 w-full md:w-auto">
            <div className="h-16 w-16 bg-gradient-to-br from-[#1F7A63] to-[#0f4033] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(31,122,99,0.4)] border border-[#1F7A63]/50 shrink-0">
              <GitBranch className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1">Fase Knockout</h1>
              <p className="text-slate-400 text-sm md:text-base font-medium">Atur *matchup* babak 16 besar dan pantau bagan turnamen hingga Final.</p>
            </div>
          </div>

          <div className="z-10 flex gap-4 w-full md:w-auto">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm shadow-inner flex-1 md:flex-none">
              <div className="p-2.5 bg-[#1F7A63]/20 rounded-lg">
                <Users className="h-6 w-6 text-[#29a889]" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest">Tim Terpilih</p>
                <div className="flex items-end gap-1">
                  <p className="text-xl md:text-2xl font-black text-white leading-none">{filledSlots}</p>
                  <p className="text-sm text-slate-500 font-bold leading-none mb-0.5">/ {SLOT_COUNT}</p>
                </div>
              </div>
            </div>
            
            {allFilled && !bracketConfirmed && (
              <div className="hidden sm:flex bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 items-center gap-3 backdrop-blur-sm shadow-inner animate-in fade-in">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                <div>
                  <p className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-widest">Status</p>
                  <p className="text-sm font-black text-emerald-400">Siap Kunci</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================
            SECTION 1: SELEKSI TIM (Sembunyi kalau udah dikonfirmasi) 
            ========================================================= */}
        {!bracketConfirmed && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Swords className="h-5 w-5 text-[#1F7A63]" />
                <h2 className="text-xl font-black text-slate-900">Builder 16 Besar</h2>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReset}
                className="text-slate-500 hover:text-red-600 hover:bg-red-50 border-slate-200"
              >
                <RotateCcw className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Reset Pilihan</span>
              </Button>
            </div>

            {/* Grid Kartu Matchup */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }, (_, matchIdx) => {
                const isMatchComplete = selectedTeams[matchIdx * 2] && selectedTeams[matchIdx * 2 + 1];
                
                return (
                  <div 
                    key={matchIdx} 
                    className={`bg-white rounded-2xl p-4 md:p-5 flex flex-col gap-3 transition-all duration-300 border-2 ${
                      isMatchComplete 
                        ? 'border-[#1F7A63]/30 shadow-[0_4px_20px_rgba(31,122,99,0.08)] bg-emerald-50/10' 
                        : 'border-slate-100 shadow-sm hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold border-none">
                        Match {matchIdx + 1}
                      </Badge>
                      {isMatchComplete && <CheckCircle2 className="h-4 w-4 text-emerald-500 animate-in zoom-in" />}
                    </div>

                    {/* Slot 1 */}
                    <TeamSlotSelect
                      label="Kandang (Home)"
                      value={selectedTeams[matchIdx * 2]}
                      usedIds={usedTeamIds}
                      currentId={selectedTeams[matchIdx * 2]}
                      onChange={(id) => handleTeamSelect(matchIdx * 2, id)}
                    />
                    
                    {/* Pemisah VS */}
                    <div className="relative flex items-center justify-center py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 border-dashed"></div>
                      </div>
                      <div className="relative bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 shadow-inner">
                        <span className="text-[10px] font-black text-slate-400 italic">VS</span>
                      </div>
                    </div>

                    {/* Slot 2 */}
                    <TeamSlotSelect
                      label="Tandang (Away)"
                      value={selectedTeams[matchIdx * 2 + 1]}
                      usedIds={usedTeamIds}
                      currentId={selectedTeams[matchIdx * 2 + 1]}
                      onChange={(id) => handleTeamSelect(matchIdx * 2 + 1, id)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Tombol Aksi Bawah */}
            <div className="mt-4 flex justify-end">
              <Button
                size="lg"
                className={`h-14 px-8 font-bold text-lg rounded-xl transition-all duration-300 ${
                  allFilled 
                    ? 'bg-[#1F7A63] hover:bg-[#16624F] text-white shadow-[0_0_20px_rgba(31,122,99,0.4)] hover:shadow-[0_0_30px_rgba(31,122,99,0.6)] hover:scale-105' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
                onClick={handleConfirmRequest}
                disabled={!allFilled}
              >
                Kunci & Buat Bracket
              </Button>
            </div>
          </div>
        )}

        {/* =========================================================
            SECTION 2: BAGAN BRACKET (Tampil full kalau confirmed) 
            ========================================================= */}
        <div className={`flex flex-col gap-4 transition-all duration-700 w-full ${bracketConfirmed ? 'animate-in fade-in slide-in-from-bottom-8' : ''}`}>
          {/* Header Bagan dibungkus div biasa, bukan div yang hilang saat diklik */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl shadow-inner">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900">Bagan Turnamen</h2>
                <p className="text-slate-500 text-xs md:text-sm font-medium">Update otomatis sesuai hasil pertandingan</p>
              </div>
            </div>
            
            {/* Tombol Edit Ulang (Muncul cuma kalau udah dikunci) */}
            {bracketConfirmed && (
              <Button 
                variant="outline" 
                className="border-slate-300 text-slate-700 hover:bg-slate-50 font-bold"
                onClick={() => setBracketConfirmed(false)}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Edit Matchup
              </Button>
            )}
          </div>

          <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-slate-50/50">
            <CardContent className="p-0 overflow-x-auto custom-scrollbar">
              <div className="min-w-[800px] p-6 md:p-8">
                <KnockoutBracket matches={knockoutMatches} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MODAL KONFIRMASI KUNCI BRACKET */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="bg-white sm:max-w-md p-6 rounded-2xl">
          <DialogHeader className="mb-4">
            <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="h-8 w-8 text-amber-600" />
            </div>
            <DialogTitle className="text-2xl font-black text-slate-900 text-center">Kunci Bagan Knockout?</DialogTitle>
            <DialogDescription className="text-slate-500 text-center text-base mt-2">
              Pastikan semua pasangan tim sudah benar. Setelah dikunci, bagan turnamen akan diaktifkan untuk publik.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowConfirmModal(false)}
              className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 font-bold h-12 rounded-xl"
            >
              Cek Lagi
            </Button>
            <Button
              size="lg"
              onClick={handleConfirm}
              className="w-full bg-[#1F7A63] hover:bg-[#16624F] text-white font-bold h-12 rounded-xl shadow-lg"
            >
              Ya, Kunci Bagan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 1); /* slate-100 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1F7A63;
          border-radius: 10px;
          opacity: 0.5;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #16624F;
        }
      `}</style>
    </DashboardLayout>
  );
}

// ─── Team Slot Select ──────────────────────────────────────────────────────────

interface TeamSlotSelectProps {
  label: string;
  value: string | undefined;
  usedIds: Set<string>;
  currentId: string | undefined;
  onChange: (teamId: string) => void;
}

function TeamSlotSelect({ label, value, usedIds, currentId, onChange }: TeamSlotSelectProps) {
  // Available teams: all teams minus those already used (except the current slot's own selection)
  const availableTeams = mockTeams.filter(
    (t) => !usedIds.has(t.id) || t.id === currentId
  );

  // Cari data tim yang lagi kepilih biar bisa nampilin inisial/logonya
  const selectedTeamData = mockTeams.find((t) => t.id === value);

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
      <Select value={value ?? 'none'} onValueChange={onChange}>
        <SelectTrigger className={`h-10 md:h-12 w-full transition-all rounded-xl border-slate-200 focus:ring-[#1F7A63]/50 focus:border-[#1F7A63] ${value ? 'bg-white border-[#1F7A63]/30 shadow-sm' : 'bg-slate-50'}`}>
          <SelectValue placeholder="Pilih tim...">
            {value && value !== 'none' && selectedTeamData ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 md:h-6 md:w-6 rounded bg-slate-800 text-white flex items-center justify-center text-[9px] md:text-[10px] font-black shrink-0">
                  {selectedTeamData.schoolName.charAt(0)}
                </div>
                <span className="font-bold text-slate-900 text-xs md:text-sm truncate">
                  {selectedTeamData.schoolName}
                </span>
              </div>
            ) : (
              <span className="text-slate-400 text-xs md:text-sm">Pilih tim...</span>
            )}
          </SelectValue>
        </SelectTrigger>
        {/* INI FIX-NYA BRO: Ditambah bg-white sama z-50 di SelectContent */}
        <SelectContent className="bg-white z-50 rounded-xl border-slate-200 shadow-2xl max-h-[300px]">
          <SelectItem value="none" className="text-slate-400 italic font-medium cursor-pointer">
            — Kosongkan Slot —
          </SelectItem>
          {availableTeams.map((team) => (
            <SelectItem key={team.id} value={team.id} className="cursor-pointer font-medium text-slate-700 focus:bg-emerald-50 focus:text-[#1F7A63]">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                  {team.schoolName.charAt(0)}
                </div>
                {team.schoolName}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}