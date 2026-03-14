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
      {/* Total Teams */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">
          Total Teams: <span className="font-semibold text-gray-900">{teams.length}</span>
        </span>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Logo</TableHead>
              <TableHead>Team Name</TableHead>
              <TableHead>School</TableHead>
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
                        {team.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{team.name}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {team.schoolName}
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
