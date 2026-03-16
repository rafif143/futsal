"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, Users } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useTournament } from "@/contexts/TournamentContext";
import { mockPlayers } from "@/data/mock-players";
import { Team } from "@/data/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

function getPlayerCount(teamId: string): number {
  return mockPlayers.filter((p) => p.teamId === teamId).length;
}

export default function TeamsPage() {
  const { teams } = useTournament();
  const [selected, setSelected] = useState<Team | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(teams.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTeams = teams.slice(startIndex, endIndex);

  const selectedPlayers = selected
    ? mockPlayers.filter((p) => p.teamId === selected.id)
    : [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout title="Teams Management" breadcrumb={["Admin", "Teams"]}>
      <div className="flex flex-col gap-6 w-full h-full pb-10">
        
        {/* HERO BANNER SECTION */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden w-full shrink-0">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#1F7A63] opacity-20 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="flex items-center gap-6 z-10 w-full md:w-auto">
            <div className="h-16 w-16 bg-[#1F7A63] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(31,122,99,0.4)] shrink-0">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1">Teams Management</h1>
              <p className="text-gray-400 text-sm md:text-base font-medium">Kelola dan pantau semua tim yang terdaftar dalam turnamen.</p>
            </div>
          </div>

          <div className="z-10 flex w-full md:w-auto">
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm shadow-inner w-full md:w-auto">
              <div className="p-2.5 bg-[#1F7A63]/20 rounded-lg">
                <Users className="h-6 w-6 text-[#29a889]" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">Total Teams</p>
                <p className="text-xl md:text-2xl font-black text-white">{teams.length} Tim</p>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="rounded-xl border-2 border-gray-300 bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Logo</TableHead>
              <TableHead>Nama Sekolah</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Players
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTeams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Users className="h-10 w-10 opacity-30" />
                    <p className="text-sm font-medium">Belum ada tim terdaftar</p>
                    <p className="text-xs">Tim yang mendaftar akan muncul di sini.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedTeams.map((team) => {
              const playerCount = getPlayerCount(team.id);
              return (
                <TableRow key={team.id}>
                  <TableCell>
                    <div className="relative h-9 w-9 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-border">
                      {team.logo && (
                        <Image
                          src={team.logo}
                          alt={`${team.name} logo`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      )}
                      <span className="text-sm font-bold text-primary select-none">
                        {team.schoolName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{team.schoolName}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {team.contactNumber}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {playerCount} pemain
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelected(team)}
                      title="View team details"
                      className="text-gray-700 hover:text-gray-900"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Team Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg bg-white text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Team Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm text-gray-900">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 flex-shrink-0 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-border">
                  {selected.logo && (
                    <Image
                      src={selected.logo}
                      alt={`${selected.name} logo`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                  <span className="text-xl font-bold text-primary select-none">
                    {selected.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">{selected.name}</p>
                  <p className="text-gray-500">{selected.schoolName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-400">Contact</p>
                  <p className="text-gray-900">{selected.contactNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Players</p>
                  <p className="font-medium text-primary">
                    {selectedPlayers.length} pemain
                  </p>
                </div>
                {selected.group && (
                  <div>
                    <p className="text-xs text-gray-400">Group</p>
                    <p className="font-medium text-gray-900">Group {selected.group}</p>
                  </div>
                )}
              </div>

              {selectedPlayers.length > 0 && (
                <div>
                  <p className="mb-1 text-xs text-gray-400">Daftar Peserta</p>
                  <ul className="divide-y rounded-lg border overflow-hidden max-h-64 overflow-y-auto">
                    {/* Official / Coach rows */}
                    <li className="flex items-center justify-between px-3 py-2 bg-[#1F7A63]/8">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-[#1F7A63]/15 px-2 py-0.5 text-[10px] font-semibold text-[#1F7A63] uppercase tracking-wide">Official</span>
                        <span className="text-gray-900 font-medium">{selected.officialName}</span>
                      </div>
                      <span className="text-gray-400 text-xs">Penanggung Jawab</span>
                    </li>
                    <li className="flex items-center justify-between px-3 py-2 bg-[#1F7A63]/8">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-600 uppercase tracking-wide">Coach</span>
                        <span className="text-gray-900 font-medium">{selected.officialName}</span>
                      </div>
                      <span className="text-gray-400 text-xs">Pelatih</span>
                    </li>
                    {/* Divider */}
                    <li className="px-3 py-1.5 bg-gray-50 border-y">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Pemain ({selectedPlayers.length})</span>
                    </li>
                    {/* Player rows */}
                    {selectedPlayers.map((player) => (
                      <li
                        key={player.id}
                        className="flex items-center justify-between px-3 py-2"
                      >
                        <span className="text-gray-900">{player.name}</span>
                        <span className="text-gray-500">
                          #{player.jerseyNumber}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
