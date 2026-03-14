"use client";

import { useState } from "react";
import { Tv, Calendar, PlayCircle, LayoutGrid, Save } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DrawingBoard } from "@/components/features/drawing/DrawingBoard";
import { LiveDrawingModal } from "@/components/features/drawing/LiveDrawingModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTournament } from "@/contexts/TournamentContext";
import { randomizeGroups, generateRoundRobinMatches } from "@/lib/drawing";
import { GroupAssignment, Match } from "@/data/types";

export default function DrawingPage() {
  const { 
    teams, 
    groups, 
    setGroups, 
    matches, 
    setMatches, 
    isDrawingConfirmed, 
    setDrawingConfirmed 
  } = useTournament();
  
  const [showLiveDrawing, setShowLiveDrawing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSaveConfirmDialog, setShowSaveConfirmDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"drawing" | "schedule">("drawing");

  const handleRandomize = () => {
    const newGroups = randomizeGroups(teams);
    setGroups(newGroups);
    setMatches([]);
  };

  const handleLiveDrawingClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmLiveDrawing = () => {
    setShowConfirmDialog(false);
    setShowLiveDrawing(true);
  };

  const handleLiveDrawingComplete = (newGroups: GroupAssignment[]) => {
    setGroups(newGroups);
    setShowLiveDrawing(false);
    setMatches([]);
  };

  // 1. Trigger Modal Konfirmasi saat klik "Simpan" di Drawing Board
  const handleConfirmRequest = () => {
    setShowSaveConfirmDialog(true);
  };

  // 2. Eksekusi Simpan + Auto Generate Matches
  const processSaveAndGenerateMatches = () => {
    // Kunci state drawing
    setDrawingConfirmed(true);
    
    // Auto-generate jadwal
    const newMatches = generateRoundRobinMatches(groups);
    setMatches(newMatches);
    
    // Tutup modal
    setShowSaveConfirmDialog(false);
  };

  // Build a lookup map for team names
  const teamMap = new Map(teams.map((t) => [t.id, t]));

  // Group matches by group label
  const matchesByGroup = matches.reduce<Record<string, Match[]>>((acc, match) => {
    const g = match.group ?? "?";
    if (!acc[g]) acc[g] = [];
    acc[g].push(match);
    return acc;
  }, {});

  const groupLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];

  return (
    <DashboardLayout
      title="Tournament Control Panel"
      breadcrumb={["Admin", "Drawing & Jadwal"]}
    >
      <div className="flex flex-col gap-6 w-full h-full pb-10">
        
        {/* HERO BANNER SECTION */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden w-full shrink-0">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#1F7A63] opacity-20 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="flex items-center gap-6 z-10 w-full md:w-auto">
            <div className="h-16 w-16 bg-[#1F7A63] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(31,122,99,0.4)] shrink-0">
              <Tv className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1">Live Drawing Stage</h1>
              <p className="text-gray-400 text-sm md:text-base font-medium">Buka layar presentasi penuh untuk dipertontonkan ke tim/peserta saat TM.</p>
            </div>
          </div>

          <div className="z-10 w-full md:w-auto shrink-0">
            <Button
              size="lg"
              onClick={handleLiveDrawingClick}
              disabled={isDrawingConfirmed}
              className="w-full md:w-auto h-14 px-8 bg-[#1F7A63] hover:bg-[#16624F] text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(31,122,99,0.4)] hover:shadow-[0_0_30px_rgba(31,122,99,0.6)] hover:scale-105 transition-all group border border-[#1F7A63]/50 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              <PlayCircle className="h-6 w-6 mr-3 group-hover:animate-pulse" />
              Mulai Live Drawing
            </Button>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex justify-center md:justify-start w-full">
          <div className="bg-gray-100 p-1.5 rounded-xl inline-flex w-full md:w-auto shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab("drawing")}
              className={`flex-1 md:w-48 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-bold text-sm transition-all duration-300 ${
                activeTab === "drawing"
                  ? "bg-white text-[#1F7A63] shadow-md border border-gray-200"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Drawing Board
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`flex-1 md:w-48 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-bold text-sm transition-all duration-300 ${
                activeTab === "schedule"
                  ? "bg-white text-[#1F7A63] shadow-md border border-gray-200"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Jadwal Match
              {matches.length > 0 && (
                <span className="ml-1 bg-[#1F7A63] text-white text-[10px] px-2 py-0.5 rounded-full animate-in zoom-in">
                  {matches.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* =========================================
            TAB 1: DRAWING BOARD
            ========================================= */}
        {activeTab === "drawing" && (
          <div className="bg-white rounded-2xl p-2 md:p-4 shadow-sm border border-gray-100 w-full animate-in fade-in duration-500">
            <DrawingBoard
              groups={groups}
              teams={teams}
              onRandomize={handleRandomize}
              onConfirm={handleConfirmRequest}
              isConfirmed={isDrawingConfirmed}
            />
          </div>
        )}

        {/* =========================================
            TAB 2: JADWAL PERTANDINGAN
            ========================================= */}
        {activeTab === "schedule" && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {matches.length === 0 ? (
              
              /* EMPTY STATE */
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-gray-200 border-dashed w-full shadow-sm">
                <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
                  <Calendar className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Jadwal Belum Tersedia</h3>
                <p className="text-gray-500 text-center max-w-md mb-8">
                  Jadwal pertandingan akan dibuat secara otomatis setelah Anda menyimpan hasil *drawing* grup.
                </p>
                <Button 
                  onClick={() => setActiveTab("drawing")}
                  size="lg"
                  className="bg-[#1F7A63] hover:bg-[#16624F] text-white font-bold px-8 h-12 rounded-xl shadow-md"
                >
                  <LayoutGrid className="h-5 w-5 mr-2" />
                  Kembali ke Drawing Board
                </Button>
              </div>

            ) : (

              /* POPULATED STATE */
              <div className="flex flex-col gap-6 w-full">
                {/* Match List Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl shadow-inner">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-black text-gray-900">Jadwal Pertandingan</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-[#1F7A63]/10 text-[#1F7A63] hover:bg-[#1F7A63]/20 border-none">
                          Round Robin
                        </Badge>
                        <p className="text-gray-500 text-xs md:text-sm font-medium">Total {matches.length} Match</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Matches Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {groupLabels.map((label) => {
                    const groupMatches = matchesByGroup[label];
                    if (!groupMatches || groupMatches.length === 0) return null;
                    
                    return (
                      <Card key={label} className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                        <CardHeader className="bg-gray-50 border-b border-gray-100 py-4 px-6 flex flex-row items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-[#1F7A63] text-white rounded-lg flex items-center justify-center font-black text-xl shadow-inner">
                              {label}
                            </div>
                            <CardTitle className="text-xl font-bold text-gray-900 m-0">
                              Grup {label}
                            </CardTitle>
                          </div>
                          <Badge variant="outline" className="bg-white font-bold text-gray-500 border-gray-300 shadow-sm">
                            {groupMatches.length} Match
                          </Badge>
                        </CardHeader>
                        
                        <CardContent className="p-4 md:p-6 flex flex-col gap-3 md:gap-4 bg-white">
                          {groupMatches.map((match) => {
                            const team1 = teamMap.get(match.team1Id);
                            const team2 = teamMap.get(match.team2Id);
                            
                            return (
                              <div
                                key={match.id}
                                className="flex items-center justify-between rounded-xl border border-gray-200 p-3 md:p-4 bg-gray-50/50 hover:bg-white hover:border-[#1F7A63]/30 hover:shadow-sm transition-all group"
                              >
                                {/* Team 1 */}
                                <div className="flex-1 text-right">
                                  <p className="font-bold text-sm md:text-base text-gray-900 group-hover:text-[#1F7A63] transition-colors line-clamp-2">
                                    {team1?.schoolName ?? match.team1Id}
                                  </p>
                                </div>
                                
                                {/* VS Badge */}
                                <div className="mx-2 md:mx-4 flex flex-col items-center gap-1 shrink-0">
                                  <div className="h-7 md:h-9 px-2 md:px-3 bg-gray-200 text-gray-500 flex items-center justify-center rounded-lg font-black text-xs italic border border-gray-300 shadow-inner">
                                    VS
                                  </div>
                                  <span className="text-[9px] md:text-[10px] font-mono text-gray-400">
                                    {match.id}
                                  </span>
                                </div>
                                
                                {/* Team 2 */}
                                <div className="flex-1 text-left">
                                  <p className="font-bold text-sm md:text-base text-gray-900 group-hover:text-[#1F7A63] transition-colors line-clamp-2">
                                    {team2?.schoolName ?? match.team2Id}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================================
          MODAL 1: KONFIRMASI LIVE DRAWING
          ========================================= */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-white sm:max-w-md p-6 rounded-2xl">
          <DialogHeader className="mb-4">
            <div className="mx-auto w-16 h-16 bg-[#1F7A63]/10 rounded-full flex items-center justify-center mb-4">
              <Tv className="h-8 w-8 text-[#1F7A63]" />
            </div>
            <DialogTitle className="text-2xl font-black text-gray-900 text-center">Mulai Live Drawing?</DialogTitle>
            <DialogDescription className="text-gray-500 text-center text-base mt-2">
              Layar ini akan berubah menjadi mode presentasi (Fullscreen) untuk dipertontonkan saat Technical Meeting.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowConfirmDialog(false)}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-bold h-12 rounded-xl"
            >
              Batal
            </Button>
            <Button
              size="lg"
              onClick={handleConfirmLiveDrawing}
              className="w-full bg-[#1F7A63] hover:bg-[#16624F] text-white font-bold h-12 rounded-xl shadow-lg"
            >
              Ya, Buka Layar Penuh
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================
          MODAL 2: KONFIRMASI SIMPAN HASIL DRAWING
          ========================================= */}
      <Dialog open={showSaveConfirmDialog} onOpenChange={setShowSaveConfirmDialog}>
        <DialogContent className="bg-white sm:max-w-md p-6 rounded-2xl">
          <DialogHeader className="mb-4">
            <div className="mx-auto w-16 h-16 bg-[#1F7A63]/10 rounded-full flex items-center justify-center mb-4">
              <Save className="h-8 w-8 text-[#1F7A63]" />
            </div>
            <DialogTitle className="text-2xl font-black text-gray-900 text-center">Simpan & Buat Jadwal?</DialogTitle>
            <DialogDescription className="text-gray-500 text-center text-base mt-2">
              Setelah disimpan, hasil undian grup <strong>tidak dapat diubah lagi</strong>. Sistem akan langsung meng-generate jadwal pertandingan secara otomatis.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowSaveConfirmDialog(false)}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-bold h-12 rounded-xl"
            >
              Batal
            </Button>
            <Button
              size="lg"
              onClick={processSaveAndGenerateMatches}
              className="w-full bg-[#1F7A63] hover:bg-[#16624F] text-white font-bold h-12 rounded-xl shadow-lg"
            >
              Simpan Hasil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Live Drawing Modal */}
      <LiveDrawingModal
        open={showLiveDrawing}
        onClose={() => setShowLiveDrawing(false)}
        teams={teams}
        onComplete={handleLiveDrawingComplete}
      />
    </DashboardLayout>
  );
}