'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Team, GroupAssignment } from '@/data/types';
import { 
  X, Sparkles, Trophy, Users, Maximize, Minimize, 
  ChevronLeft, ChevronRight, Play, CheckCircle2,
  Swords, ArrowLeft
} from 'lucide-react';

interface LiveDrawingModalProps {
  open: boolean;
  onClose: () => void;
  teams: Team[];
  onComplete: (groups: GroupAssignment[]) => void;
}

const GROUP_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

export function LiveDrawingModal({ open, onClose, teams, onComplete }: LiveDrawingModalProps) {
  const router = useRouter();
  const [currentGroupIndex, setCurrentGroupIndex] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isWaitingNext, setIsWaitingNext] = useState(false); 
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [shuffledTeams, setShuffledTeams] = useState<Team[]>([]);
  const [displayTeam, setDisplayTeam] = useState<Team | null>(null);
  const [groups, setGroups] = useState<GroupAssignment[]>(
    GROUP_LABELS.map(label => ({ group: label as any, teams: [] }))
  );
  const [availableTeams, setAvailableTeams] = useState<Team[]>(teams);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const startGroupDrawing = (groupIndex: number) => {
    const remaining = [...availableTeams];
    const shuffled: Team[] = [];
    
    for (let i = 0; i < 3 && remaining.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * remaining.length);
      shuffled.push(remaining[randomIndex]);
      remaining.splice(randomIndex, 1);
    }
    
    setShuffledTeams(shuffled);
    setCurrentGroupIndex(groupIndex);
    setIsDrawing(true);
    setIsShuffling(true);
    setIsWaitingNext(false);
    setCurrentTeamIndex(0);
  };

  useEffect(() => {
    if (!isShuffling || !isDrawing || currentGroupIndex === null) return;

    const interval = setInterval(() => {
      if (availableTeams.length > 0) {
        const randomTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
        setDisplayTeam(randomTeam);
      }
    }, 80); 

    const timeout = setTimeout(() => {
      setIsShuffling(false);
      clearInterval(interval);
      
      const selectedTeam = shuffledTeams[currentTeamIndex];
      setDisplayTeam(selectedTeam); 

      setGroups(prev => {
        const newGroups = [...prev];
        newGroups[currentGroupIndex] = {
          ...newGroups[currentGroupIndex],
          teams: [...newGroups[currentGroupIndex].teams, selectedTeam]
        };
        return newGroups;
      });

      setAvailableTeams(prev => prev.filter(t => t.id !== selectedTeam.id));
      setIsWaitingNext(true);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isShuffling, isDrawing, availableTeams, shuffledTeams, currentTeamIndex, currentGroupIndex]);

  const handleNextSlot = () => {
    setCurrentTeamIndex(prev => prev + 1);
    setIsShuffling(true);
    setIsWaitingNext(false);
  };

  const handleFinishGroup = () => {
    setIsDrawing(false);
    setCurrentGroupIndex(null);
    setDisplayTeam(null);
    setIsWaitingNext(false);
    
    const allFilled = groups.every(g => g.teams.length === 3);
    if (allFilled) {
      setTimeout(() => {
        onComplete(groups);
      }, 500);
    }
  };

  const handleClose = () => {
    if (!isDrawing) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-none w-screen h-screen !rounded-none border-none !p-0 !m-0 bg-[#0B1120] flex flex-col overflow-hidden font-sans data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:max-w-none">
        <DialogTitle className="sr-only">Live Drawing - Undian Grup</DialogTitle>
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 md:px-8 py-4 bg-[#0B1120]/90 backdrop-blur-md border-b border-gray-800 z-10 shrink-0 shadow-lg">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="border-[#1F7A63] text-white hover:bg-[#1F7A63] hover:text-white transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="relative">
              <div className="absolute inset-0 bg-[#1F7A63] blur-md opacity-50 rounded-full"></div>
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-[#1F7A63] to-[#0f4033] flex items-center justify-center relative border border-[#1F7A63]/50 shadow-[0_0_15px_rgba(31,122,99,0.5)]">
                <Trophy className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-wider">
                Official Live Draw
              </h1>
              <div className="flex items-center gap-2 mt-0.5 md:mt-1">
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                <p className="text-[10px] md:text-xs font-semibold text-red-500 uppercase tracking-widest">Live Broadcast</p>
                <span className="text-gray-500 text-xs mx-1 md:mx-2">|</span>
                <p className="text-[10px] md:text-xs text-gray-400">
                  {availableTeams.length} Tim Tersisa
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleFullScreen} 
              className="text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
            {!isDrawing && (
              <Button variant="ghost" size="icon" onClick={handleClose} className="text-gray-500 hover:text-white hover:bg-red-500/20 rounded-full transition-all">
                <X className="h-6 w-6" />
              </Button>
            )}
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex-1 flex overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-[#0B1120] to-[#050810]">
          
          {/* LEFT SIDEBAR */}
          <div className="relative flex shrink-0 border-r border-gray-800/60 z-20">
            <div className={`transition-all duration-500 ease-in-out flex flex-col bg-[#0B1120]/80 backdrop-blur-md overflow-hidden
              ${isSidebarOpen ? 'w-[280px] lg:w-[320px] opacity-100' : 'w-0 opacity-0'}`}>
              <div className="p-4 md:p-5 border-b border-gray-800/60 flex items-center justify-between sticky top-0 bg-[#0B1120] z-10 w-[280px] lg:w-[320px]">
                <div className="flex items-center gap-3 text-white font-bold">
                  <div className="p-2 bg-[#1F7A63]/20 rounded-lg">
                    <Users className="h-4 w-4 md:h-5 md:w-5 text-[#1F7A63]" />
                  </div>
                  <h3 className="tracking-wide uppercase text-sm md:text-base">Daftar Tim</h3>
                </div>
                <span className="bg-[#1F7A63] text-white text-xs px-3 py-1 rounded-md font-mono font-bold shadow-[0_0_10px_rgba(31,122,99,0.3)]">
                  {availableTeams.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 custom-scrollbar w-[280px] lg:w-[320px]">
                {availableTeams.map((team) => (
                  <div key={team.id} className="p-3 rounded-xl bg-gray-800/30 border border-gray-700/50 text-white transition-all hover:bg-gray-700/60 hover:border-[#1F7A63]/50 flex items-center gap-3 group">
                    <div className="h-8 w-8 md:h-10 md:w-10 shrink-0 rounded-full bg-gray-900 border border-gray-700 group-hover:border-[#1F7A63] flex items-center justify-center text-xs md:text-sm font-bold text-gray-300 group-hover:text-[#29a889] transition-colors shadow-inner">
                      {team.schoolName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs md:text-sm truncate">{team.schoolName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Collapse Toggle */}
            <div className="absolute -right-5 md:-right-6 top-1/2 -translate-y-1/2 z-30">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="h-14 md:h-16 w-5 md:w-6 bg-gray-800 border border-gray-700 rounded-r-xl flex items-center justify-center hover:bg-[#1F7A63] hover:border-[#1F7A63] transition-all text-gray-400 hover:text-white shadow-[4px_0_15px_rgba(0,0,0,0.5)]"
              >
                {isSidebarOpen ? <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" /> : <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />}
              </button>
            </div>
          </div>

          {/* RIGHT MAIN AREA */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            
            {/* --- MODE DRAWING: FULL VIEW --- */}
            {isDrawing && currentGroupIndex !== null ? (
              <div className="absolute inset-0 flex flex-col xl:flex-row p-4 md:p-6 lg:p-8 gap-4 lg:gap-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-[#0B1120] to-[#0B1120] animate-in fade-in duration-500">
                
                {/* KIRI: Animasi Jumbotron Raksasa */}
                <div className="flex-1 flex flex-col justify-center items-center relative border border-gray-800/60 bg-gray-900/30 rounded-3xl overflow-hidden p-4 md:p-8 shadow-2xl backdrop-blur-sm min-h-0">
                  <div className="absolute top-0 right-0 w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-[#1F7A63] opacity-5 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-[#1F7A63] opacity-5 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>

                  <div className="text-center mb-4 md:mb-8 z-10 shrink-0">
                    <p className={`font-mono font-bold tracking-[0.2em] md:tracking-[0.3em] mb-2 text-xs md:text-sm lg:text-lg transition-colors ${isShuffling ? 'text-[#1F7A63] animate-pulse' : 'text-gray-400'}`}>
                      {isShuffling ? 'MENGACAK TIM...' : 'TIM TERPILIH UNTUK'}
                    </p>
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white italic tracking-tighter drop-shadow-2xl">
                      GRUP {GROUP_LABELS[currentGroupIndex]}
                    </h2>
                  </div>

                  {/* Giant Team Card */}
                  <div className="w-full max-w-xl lg:max-w-2xl z-10 flex flex-col justify-center min-h-0">
                    <div className={`relative transition-all duration-300 w-full ${isShuffling ? 'scale-95 blur-[2px] opacity-80' : 'scale-100 opacity-100'}`}>
                      {!isShuffling && displayTeam && (
                        <div className="absolute inset-0 bg-[#1F7A63] blur-xl lg:blur-3xl opacity-20 rounded-3xl animate-pulse"></div>
                      )}
                      <div className={`relative p-6 lg:p-10 rounded-2xl lg:rounded-3xl border-2 backdrop-blur-xl flex flex-col items-center gap-4 md:gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${
                        isShuffling ? 'bg-gray-800/80 border-gray-600' : 'bg-gradient-to-b from-gray-800 to-gray-900 border-[#1F7A63]'
                      }`}>
                        {displayTeam ? (
                          <>
                            <div className={`h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 shrink-0 rounded-2xl flex items-center justify-center text-5xl md:text-6xl lg:text-7xl font-black shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)] ${
                              isShuffling ? 'bg-gray-700 text-gray-500' : 'bg-gradient-to-br from-[#1F7A63] to-[#0f4033] text-white border-2 border-[#1F7A63]/50'
                            }`}>
                              {displayTeam.schoolName.charAt(0)}
                            </div>
                            <div className="text-center w-full px-2 md:px-4">
                              <h3 className={`text-2xl md:text-4xl lg:text-5xl font-black mb-2 md:mb-3 leading-tight ${isShuffling ? 'text-gray-400' : 'text-white drop-shadow-lg'}`}
                                  style={{ 
                                    wordBreak: 'break-word',
                                    hyphens: 'auto',
                                    fontSize: displayTeam.schoolName.length > 30 ? 'clamp(1.5rem, 3vw, 2.5rem)' : undefined
                                  }}>
                                {displayTeam.schoolName}
                              </h3>
                            </div>
                          </>
                        ) : (
                          <div className="h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 rounded-2xl bg-gray-700/50 animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons (Lanjut/Selesai) */}
                  <div className={`mt-6 md:mt-8 z-10 shrink-0 transition-all duration-700 ${isWaitingNext ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95 pointer-events-none'}`}>
                    {currentTeamIndex < 2 ? (
                      <Button 
                        onClick={handleNextSlot}
                        className="bg-[#1F7A63] hover:bg-[#16624F] text-white font-extrabold px-6 py-6 md:px-8 md:py-8 lg:px-10 rounded-xl lg:rounded-2xl shadow-[0_0_20px_rgba(31,122,99,0.5)] hover:shadow-[0_0_40px_rgba(31,122,99,0.7)] hover:scale-105 transition-all flex items-center gap-2 md:gap-4 text-sm md:text-xl lg:text-2xl uppercase tracking-wider"
                      >
                        <Play className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 fill-current" />
                        Lanjut Undi Slot {currentTeamIndex + 2}
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleFinishGroup}
                        className="bg-green-600 hover:bg-green-500 text-white font-extrabold px-6 py-6 md:px-8 md:py-8 lg:px-10 rounded-xl lg:rounded-2xl shadow-[0_0_20px_rgba(22,163,74,0.5)] hover:shadow-[0_0_40px_rgba(22,163,74,0.7)] hover:scale-105 transition-all flex items-center gap-2 md:gap-4 text-sm md:text-xl lg:text-2xl uppercase tracking-wider"
                      >
                        <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8" />
                        Selesai Grup {GROUP_LABELS[currentGroupIndex]}
                      </Button>
                    )}
                  </div>
                </div>

                {/* KANAN: Tabel Klasemen Grup (Live) */}
                <div className="w-full xl:w-[400px] 2xl:w-[450px] flex flex-col bg-gray-900/40 border border-gray-800/80 rounded-3xl shadow-2xl backdrop-blur-md overflow-hidden shrink-0">
                  <div className="bg-gradient-to-r from-[#1F7A63]/20 to-transparent p-4 md:p-6 border-b border-[#1F7A63]/30 flex items-center gap-3 md:gap-4">
                    <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl bg-[#1F7A63] flex items-center justify-center text-white text-xl md:text-2xl font-black shadow-lg">
                      {GROUP_LABELS[currentGroupIndex]}
                    </div>
                    <div>
                      <h3 className="text-gray-400 text-xs md:text-sm font-bold tracking-widest uppercase mb-0.5 md:mb-1">Live Table</h3>
                      <h2 className="text-xl md:text-3xl font-black text-white uppercase">Grup {GROUP_LABELS[currentGroupIndex]}</h2>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6 flex-1 flex flex-col gap-3 md:gap-4">
                    {[0, 1, 2].map((slotIndex) => {
                      const team = groups[currentGroupIndex].teams[slotIndex];
                      const isCurrentlyDrawing = isDrawing && slotIndex === currentTeamIndex;
                      
                      return (
                        <div key={slotIndex} className={`relative flex-1 rounded-2xl border-2 flex items-center px-4 md:px-6 gap-4 md:gap-6 transition-all duration-500 overflow-hidden ${
                          team 
                            ? 'bg-gray-800 border-gray-600 shadow-lg' 
                            : isCurrentlyDrawing
                              ? 'bg-[#1F7A63]/10 border-[#1F7A63]/60 border-dashed animate-pulse'
                              : 'bg-gray-900/50 border-gray-800 border-dashed'
                        }`}>
                          {team ? (
                            <>
                              <div className="absolute left-0 top-0 bottom-0 w-1.5 md:w-2 bg-[#1F7A63]"></div>
                              <div className="text-xl md:text-2xl font-black text-gray-600 w-4 md:w-6">{slotIndex + 1}</div>
                              <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center text-white text-xl md:text-2xl font-black shadow-inner shrink-0">
                                {team.schoolName.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-base md:text-xl font-bold text-white truncate">{team.schoolName}</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className={`text-xl md:text-2xl font-black w-4 md:w-6 ${isCurrentlyDrawing ? 'text-[#1F7A63]' : 'text-gray-700'}`}>{slotIndex + 1}</div>
                              <div className="flex-1 flex items-center justify-center">
                                <p className={`text-sm md:text-lg font-bold tracking-widest uppercase ${isCurrentlyDrawing ? 'text-[#1F7A63]' : 'text-gray-600'}`}>
                                  {isCurrentlyDrawing ? 'Mengundi...' : 'Kosong'}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              
              /* --- MODE STANDBY: GRID SEMUA GRUP --- */
              <div className="absolute inset-0 flex flex-col p-6 md:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 shrink-0 gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Overview Undian</h2>
                    <p className="text-gray-400 mt-1 text-xs md:text-sm font-medium">Pilih grup kosong untuk memulai penarikan tim.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-xl border border-gray-800 self-start sm:self-auto">
                    <Swords className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <span className="text-white font-bold text-sm md:text-base">{groups.filter(g => g.teams.length === 3).length} / 11</span>
                    <span className="text-gray-500 text-xs md:text-sm">Grup Selesai</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 md:pr-4">
                  <div className={`grid gap-4 md:gap-6 pb-8 transition-all duration-300 ${isSidebarOpen ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5'}`}>
                    {groups.map((group, groupIndex) => {
                      const isComplete = group.teams.length === 3;
                      const canDraw = !isDrawing && !isComplete && availableTeams.length >= 3;
                      
                      return (
                        <div key={group.group} className="relative bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800/60 hover:border-gray-700 transition-all duration-300 flex flex-col hover:shadow-xl group">
                          
                          {/* Header Tabel Grid */}
                          <div className="p-3 md:p-4 border-b border-gray-800/60 flex items-center justify-between bg-gray-800/20">
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-gray-800 flex items-center justify-center font-black text-lg md:text-xl text-gray-300 border border-gray-700 shadow-inner shrink-0">
                                {group.group}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-white text-sm md:text-lg truncate">Grup {group.group}</p>
                                <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest">{group.teams.length}/3 Terisi</p>
                              </div>
                            </div>
                            {isComplete && <div className="text-[10px] md:text-xs font-bold text-green-400 bg-green-400/10 px-2 md:px-3 py-1 md:py-1.5 rounded-md border border-green-400/20 flex items-center gap-1 shrink-0"><CheckCircle2 className="h-3 w-3 hidden sm:block"/> FULL</div>}
                          </div>

                          {/* Slot List */}
                          <div className="p-3 md:p-4 flex-1 flex flex-col gap-2 md:gap-3">
                            {[0, 1, 2].map((slotIndex) => {
                              const team = group.teams[slotIndex];
                              return (
                                <div key={slotIndex} className={`h-12 md:h-14 rounded-xl border flex items-center px-3 md:px-4 gap-2 md:gap-3 transition-all duration-500 ${
                                    team 
                                    ? 'bg-gray-800/80 border-gray-700 shadow-sm' 
                                    : 'bg-transparent border-gray-800 border-dashed'
                                  }`}
                                >
                                  {team ? (
                                    <>
                                      <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg flex-shrink-0 bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-300 text-[10px] md:text-xs font-bold shadow-inner">
                                        {team.schoolName.charAt(0)}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-xs md:text-sm font-bold text-gray-200 truncate">{team.schoolName}</p>
                                      </div>
                                    </>
                                  ) : (
                                    <p className="text-[10px] md:text-xs text-gray-600 font-bold uppercase tracking-widest w-full text-center">Slot {slotIndex + 1}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Tombol Undi */}
                          <div className="px-3 md:px-4 pb-3 md:pb-4 mt-auto">
                            {canDraw ? (
                              <Button
                                onClick={() => startGroupDrawing(groupIndex)}
                                className="w-full bg-[#1F7A63]/10 hover:bg-[#1F7A63] text-[#29a889] hover:text-white border border-[#1F7A63]/30 transition-all h-10 md:h-12 rounded-xl group-hover:shadow-[0_0_15px_rgba(31,122,99,0.3)]"
                              >
                                <Sparkles className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                                <span className="text-xs md:text-sm font-bold tracking-widest uppercase truncate">Undi Grup {group.group}</span>
                              </Button>
                            ) : isComplete ? (
                              <div className="h-10 md:h-12 w-full flex items-center justify-center bg-gray-800/30 rounded-xl border border-gray-800/50">
                                <span className="text-xs md:text-sm font-bold text-gray-600 tracking-widest uppercase flex items-center gap-2">
                                  Selesai
                                </span>
                              </div>
                            ) : (
                              <div className="h-10 md:h-12 w-full flex items-center justify-center bg-gray-800/10 rounded-xl border border-gray-800/30 border-dashed">
                                <span className="text-[9px] md:text-[10px] font-medium text-gray-600 uppercase text-center leading-tight">Menunggu Tim<br/>Tersedia</span>
                              </div> 
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(11, 17, 32, 0.5);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #1F7A63;
            border-radius: 10px;
            border: 2px solid rgba(11, 17, 32, 1);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #29a889;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}