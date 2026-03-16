"use client";

import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useTournament } from "@/contexts/TournamentContext";
import { Calendar, Edit2, Save, X, CheckCircle2, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  VisuallyHidden,
} from "@/components/ui/dialog";
import { Match, Player, MatchEvent } from "@/data/types";
import { mockPlayers } from "@/data/mock-players";

const MATCHES_PER_DAY = 6;

interface PlayerStats {
  player: Player;
  goals: number;
  yellowCards: number;
  redCards: number;
}

export default function MatchesPageContent() {
  const { matches, teams, updateMatch } = useTournament();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Player stats for the selected match
  const [team1Stats, setTeam1Stats] = useState<PlayerStats[]>([]);
  const [team2Stats, setTeam2Stats] = useState<PlayerStats[]>([]);
  
  const teamMap = useMemo(() => {
    return new Map(teams.map((t) => [t.id, t]));
  }, [teams]);

  // Get all group matches
  const groupMatches = useMemo(() => {
    return matches.filter((m) => m.stage === "group");
  }, [matches]);

  const completedMatchesCount = groupMatches.filter(m => m.status === 'completed').length;

  // Split matches into days (6 matches per day)
  const matchesByDay = useMemo(() => {
    const days: Match[][] = [];
    for (let i = 0; i < groupMatches.length; i += MATCHES_PER_DAY) {
      days.push(groupMatches.slice(i, i + MATCHES_PER_DAY));
    }
    return days;
  }, [groupMatches]);

  const [activeDay, setActiveDay] = useState(0);

  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match);
    
    // Get players for both teams
    const team1Players = mockPlayers.filter(p => p.teamId === match.team1Id);
    const team2Players = mockPlayers.filter(p => p.teamId === match.team2Id);
    
    // Initialize stats from match events
    const initTeam1Stats: PlayerStats[] = team1Players.map(player => {
      const goals = match.events.filter(e => e.playerId === player.id && e.type === 'goal').length;
      const yellowCards = match.events.filter(e => e.playerId === player.id && e.type === 'yellowCard').length;
      const redCards = match.events.filter(e => e.playerId === player.id && e.type === 'redCard').length;
      return { player, goals, yellowCards, redCards };
    });
    
    const initTeam2Stats: PlayerStats[] = team2Players.map(player => {
      const goals = match.events.filter(e => e.playerId === player.id && e.type === 'goal').length;
      const yellowCards = match.events.filter(e => e.playerId === player.id && e.type === 'yellowCard').length;
      const redCards = match.events.filter(e => e.playerId === player.id && e.type === 'redCard').length;
      return { player, goals, yellowCards, redCards };
    });
    
    setTeam1Stats(initTeam1Stats);
    setTeam2Stats(initTeam2Stats);
    setShowEditModal(true);
  };

  const updatePlayerStat = (
    teamNum: 1 | 2,
    playerId: string,
    stat: 'goals' | 'yellowCards' | 'redCards',
    value: string
  ) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    const setStats = teamNum === 1 ? setTeam1Stats : setTeam2Stats;
    setStats(prev => prev.map(ps => {
      if (ps.player.id === playerId) {
        return { ...ps, [stat]: numValue };
      }
      return ps;
    }));
  };

  const handleSaveMatch = () => {
    if (!selectedMatch) return;
    
    // Calculate total scores
    const team1Score = team1Stats.reduce((sum, ps) => sum + ps.goals, 0);
    const team2Score = team2Stats.reduce((sum, ps) => sum + ps.goals, 0);
    
    // Build events array
    const events: MatchEvent[] = [];
    
    [...team1Stats, ...team2Stats].forEach(ps => {
      for (let i = 0; i < ps.goals; i++) {
        events.push({
          id: `event-${selectedMatch.id}-${ps.player.id}-goal-${i}`,
          matchId: selectedMatch.id,
          playerId: ps.player.id,
          teamId: ps.player.teamId,
          minute: 0,
          type: 'goal',
        });
      }
      for (let i = 0; i < ps.yellowCards; i++) {
        events.push({
          id: `event-${selectedMatch.id}-${ps.player.id}-yellow-${i}`,
          matchId: selectedMatch.id,
          playerId: ps.player.id,
          teamId: ps.player.teamId,
          minute: 0,
          type: 'yellowCard',
        });
      }
      for (let i = 0; i < ps.redCards; i++) {
        events.push({
          id: `event-${selectedMatch.id}-${ps.player.id}-red-${i}`,
          matchId: selectedMatch.id,
          playerId: ps.player.id,
          teamId: ps.player.teamId,
          minute: 0,
          type: 'redCard',
        });
      }
    });
    
    // Update match
    updateMatch(selectedMatch.id, {
      team1Score,
      team2Score,
      status: 'completed',
      events,
    });
    
    setShowEditModal(false);
    setSelectedMatch(null);
  };

  if (groupMatches.length === 0) {
    return (
      <DashboardLayout
        title="Jadwal & Hasil Pertandingan"
        breadcrumb={["Admin", "Match Control"]}
      >
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-slate-200 border-dashed shadow-sm">
          <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
            <Calendar className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Belum Ada Jadwal</h3>
          <p className="text-slate-500 text-center max-w-md">
            Jadwal pertandingan akan muncul setelah Anda menyelesaikan proses *drawing* grup dan men-generate jadwal.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const currentDayMatches = matchesByDay[activeDay] || [];
  const team1 = selectedMatch ? teamMap.get(selectedMatch.team1Id) : null;
  const team2 = selectedMatch ? teamMap.get(selectedMatch.team2Id) : null;

  return (
    <DashboardLayout
      title="Jadwal & Hasil Pertandingan"
      breadcrumb={["Admin", "Match Control"]}
    >
      <div className="flex flex-col gap-8 w-full h-full pb-10">
        
        {/* HERO BANNER SECTION */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden w-full shrink-0">
          <div className="absolute right-0 top-0 w-72 h-72 bg-[#1F7A63] opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="flex items-center gap-6 z-10 w-full md:w-auto">
            <div className="h-16 w-16 bg-gradient-to-br from-[#1F7A63] to-[#0f4033] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(31,122,99,0.4)] border border-[#1F7A63]/50 shrink-0">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1">Match Control Panel</h1>
              <p className="text-slate-400 text-sm md:text-base font-medium">Input hasil skor dan detail event (gol/kartu) setiap pertandingan.</p>
            </div>
          </div>

          <div className="z-10 flex gap-4 w-full md:w-auto">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm shadow-inner flex-1 md:flex-none">
              <div className="p-2.5 bg-[#1F7A63]/20 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-[#29a889]" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest">Match Selesai</p>
                <div className="flex items-end gap-1">
                  <p className="text-xl md:text-2xl font-black text-white leading-none">{completedMatchesCount}</p>
                  <p className="text-sm text-slate-500 font-bold leading-none mb-0.5">/ {groupMatches.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DAY NAVIGATION (PILL TABS) */}
        {matchesByDay.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
            {matchesByDay.map((_, dayIndex) => (
              <button
                key={dayIndex}
                onClick={() => setActiveDay(dayIndex)}
                className={`flex flex-col items-center justify-center px-6 py-2.5 rounded-xl transition-all whitespace-nowrap border-2 shrink-0 ${
                  activeDay === dayIndex
                    ? 'bg-[#1F7A63]/10 border-[#1F7A63] shadow-sm'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span className={`text-xs font-bold uppercase tracking-widest ${activeDay === dayIndex ? 'text-[#1F7A63]' : 'text-slate-400'}`}>
                  Matchday
                </span>
                <span className={`text-lg font-black ${activeDay === dayIndex ? 'text-slate-900' : 'text-slate-600'}`}>
                  {dayIndex + 1}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* MATCHES LIST (Modern Card Layout instead of Table) */}
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {currentDayMatches.map((match) => {
            const team1 = teamMap.get(match.team1Id);
            const team2 = teamMap.get(match.team2Id);
            const team1Name = team1?.schoolName ?? match.team1Id;
            const team2Name = team2?.schoolName ?? match.team2Id;
            const isCompleted = match.status === "completed";

            return (
              <div 
                key={match.id} 
                className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Info & Badge Kiri */}
                <div className="flex items-center justify-between w-full md:w-32 shrink-0">
                  <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold border-none shadow-none">
                    Grup {match.group}
                  </Badge>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 md:hidden">
                    {match.id}
                  </span>
                </div>

                {/* Area Utama VS & Skor */}
                <div className="flex-1 flex items-center justify-center w-full gap-2 md:gap-6">
                  {/* Tim 1 */}
                  <div className="flex-1 flex justify-end">
                    <span className="text-sm md:text-lg font-bold text-slate-900 text-right line-clamp-2">{team1Name}</span>
                  </div>

                  {/* Kotak Skor / VS */}
                  <div className="shrink-0 flex flex-col items-center gap-1 mx-2">
                    {isCompleted ? (
                      <div className="bg-[#1F7A63] text-white px-4 md:px-6 py-2 rounded-xl font-black text-lg md:text-2xl shadow-[0_4px_10px_rgba(31,122,99,0.3)] min-w-[80px] text-center tracking-widest">
                        {match.team1Score} - {match.team2Score}
                      </div>
                    ) : (
                      <div className="bg-slate-100 text-slate-400 px-4 py-2 rounded-xl font-black text-sm md:text-base border border-slate-200 shadow-inner min-w-[60px] text-center italic">
                        VS
                      </div>
                    )}
                  </div>

                  {/* Tim 2 */}
                  <div className="flex-1 flex justify-start">
                    <span className="text-sm md:text-lg font-bold text-slate-900 text-left line-clamp-2">{team2Name}</span>
                  </div>
                </div>

                {/* Area Kanan (ID & Action) */}
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 md:gap-6 shrink-0 border-t border-slate-100 pt-3 md:border-none md:pt-0">
                  <span className="text-[10px] md:text-xs font-mono text-slate-400 hidden md:block">
                    {match.id}
                  </span>
                  <Button
                    onClick={() => handleEditMatch(match)}
                    className={`w-full md:w-auto font-bold rounded-xl transition-all ${
                      isCompleted 
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                        : 'bg-[#1F7A63] hover:bg-[#16624F] text-white shadow-md'
                    }`}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    {isCompleted ? 'Edit Hasil' : 'Input Skor'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          MODAL EDIT PERTANDINGAN
          ========================================================= */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-white max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-2xl border-none">
          <VisuallyHidden>
            <DialogTitle>
              Edit Match: {team1?.schoolName} vs {team2?.schoolName}
            </DialogTitle>
          </VisuallyHidden>
          
          {/* Header Modal - VS Display */}
          <div className="bg-slate-900 p-6 flex flex-col gap-4 shrink-0 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-[#1F7A63] opacity-20 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="flex items-center justify-between z-10">
              <Badge variant="outline" className="text-slate-300 border-slate-700 font-mono bg-slate-800/50">
                {selectedMatch?.id} • Grup {selectedMatch?.group}
              </Badge>
              <Button variant="ghost" size="icon" onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full h-8 w-8">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 z-10 w-full mt-2">
              <h2 className="flex-1 text-right text-xl md:text-3xl font-black text-white truncate px-2">{team1?.schoolName}</h2>
              <div className="shrink-0 bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl">
                <span className="font-black text-slate-400 italic">VS</span>
              </div>
              <h2 className="flex-1 text-left text-xl md:text-3xl font-black text-white truncate px-2">{team2?.schoolName}</h2>
            </div>
          </div>

          {/* Body Modal - Sticky Headers + Scrollable Tables */}
          <div className="flex-1 overflow-hidden p-4 md:p-6 bg-slate-50 flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-4">
              
              {/* --- TEAM 1 HEADER (STICKY) --- */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-black">H</div>
                  <div>
                    <h3 className="font-bold text-slate-900">Home Team</h3>
                    <p className="text-xs text-slate-500 truncate max-w-[150px]">{team1?.schoolName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Gol</p>
                  <p className="text-3xl font-black text-[#1F7A63] leading-none">{team1Stats.reduce((sum, ps) => sum + ps.goals, 0)}</p>
                </div>
              </div>

              {/* --- TEAM 2 HEADER (STICKY) --- */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center font-black">A</div>
                  <div>
                    <h3 className="font-bold text-slate-900">Away Team</h3>
                    <p className="text-xs text-slate-500 truncate max-w-[150px]">{team2?.schoolName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Gol</p>
                  <p className="text-3xl font-black text-indigo-600 leading-none">{team2Stats.reduce((sum, ps) => sum + ps.goals, 0)}</p>
                </div>
              </div>
            </div>

            {/* Scrollable Tables Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                
                {/* --- TEAM 1 TABLE --- */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead className="bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-10">#</th>
                        <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama Pemain</th>
                        <th className="px-2 py-3 text-center text-[10px] font-bold text-emerald-600 uppercase tracking-wider w-16">Gol</th>
                        <th className="px-2 py-3 text-center text-[10px] font-bold text-amber-600 uppercase tracking-wider w-16">YC</th>
                        <th className="px-2 py-3 text-center text-[10px] font-bold text-rose-600 uppercase tracking-wider w-16">RC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {team1Stats.map((ps) => (
                        <tr key={ps.player.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-3 py-2">
                            <span className="text-xs font-bold text-slate-400">{ps.player.jerseyNumber}</span>
                          </td>
                          <td className="px-3 py-2">
                            <span className="text-sm font-semibold text-slate-700">{ps.player.name}</span>
                          </td>
                          <td className="px-2 py-2">
                            <Input
                              type="number"
                              min="0"
                              value={ps.goals || ''}
                              placeholder="0"
                              onChange={(e) => updatePlayerStat(1, ps.player.id, 'goals', e.target.value)}
                              className="h-9 w-full text-center font-bold text-emerald-700 bg-emerald-50/50 border-emerald-200 focus-visible:ring-emerald-500 hide-arrows"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <Input
                              type="number"
                              min="0"
                              max="2"
                              value={ps.yellowCards || ''}
                              placeholder="0"
                              onChange={(e) => updatePlayerStat(1, ps.player.id, 'yellowCards', e.target.value)}
                              className="h-9 w-full text-center font-bold text-amber-700 bg-amber-50/50 border-amber-200 focus-visible:ring-amber-500 hide-arrows"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <Input
                              type="number"
                              min="0"
                              max="1"
                              value={ps.redCards || ''}
                              placeholder="0"
                              onChange={(e) => updatePlayerStat(1, ps.player.id, 'redCards', e.target.value)}
                              className="h-9 w-full text-center font-bold text-rose-700 bg-rose-50/50 border-rose-200 focus-visible:ring-rose-500 hide-arrows"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* --- TEAM 2 TABLE --- */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead className="bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-10">#</th>
                        <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama Pemain</th>
                        <th className="px-2 py-3 text-center text-[10px] font-bold text-emerald-600 uppercase tracking-wider w-16">Gol</th>
                        <th className="px-2 py-3 text-center text-[10px] font-bold text-amber-600 uppercase tracking-wider w-16">YC</th>
                        <th className="px-2 py-3 text-center text-[10px] font-bold text-rose-600 uppercase tracking-wider w-16">RC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {team2Stats.map((ps) => (
                        <tr key={ps.player.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-3 py-2">
                            <span className="text-xs font-bold text-slate-400">{ps.player.jerseyNumber}</span>
                          </td>
                          <td className="px-3 py-2">
                            <span className="text-sm font-semibold text-slate-700">{ps.player.name}</span>
                          </td>
                          <td className="px-2 py-2">
                            <Input
                              type="number"
                              min="0"
                              value={ps.goals || ''}
                              placeholder="0"
                              onChange={(e) => updatePlayerStat(2, ps.player.id, 'goals', e.target.value)}
                              className="h-9 w-full text-center font-bold text-emerald-700 bg-emerald-50/50 border-emerald-200 focus-visible:ring-emerald-500 hide-arrows"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <Input
                              type="number"
                              min="0"
                              max="2"
                              value={ps.yellowCards || ''}
                              placeholder="0"
                              onChange={(e) => updatePlayerStat(2, ps.player.id, 'yellowCards', e.target.value)}
                              className="h-9 w-full text-center font-bold text-amber-700 bg-amber-50/50 border-amber-200 focus-visible:ring-amber-500 hide-arrows"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <Input
                              type="number"
                              min="0"
                              max="1"
                              value={ps.redCards || ''}
                              placeholder="0"
                              onChange={(e) => updatePlayerStat(2, ps.player.id, 'redCards', e.target.value)}
                              className="h-9 w-full text-center font-bold text-rose-700 bg-rose-50/50 border-rose-200 focus-visible:ring-rose-500 hide-arrows"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>

          <DialogFooter className="bg-white border-t border-slate-200 p-4 md:p-6 shrink-0 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowEditModal(false)}
              className="w-full sm:w-auto border-2 border-slate-300 bg-white text-gray-900 hover:bg-white hover:text-gray-900 font-bold rounded-xl"
            >
              Batal
            </Button>
            <Button
              size="lg"
              onClick={handleSaveMatch}
              className="w-full sm:w-auto bg-[#1F7A63] hover:bg-[#16624F] text-white font-bold rounded-xl shadow-lg"
            >
              <Save className="h-5 w-5 mr-2" />
              Simpan Hasil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Global CSS buat ngilangin panah atas/bawah di input number & custom scrollbar */}
      <style jsx global>{`
        .hide-arrows::-webkit-outer-spin-button,
        .hide-arrows::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .hide-arrows {
          -moz-appearance: textfield;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </DashboardLayout>
  );
}