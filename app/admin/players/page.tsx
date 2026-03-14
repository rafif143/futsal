"use client";

import { useState, useMemo } from "react";
import { Target, Square, Search } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useTournament } from "@/contexts/TournamentContext";
import { mockPlayers } from "@/data/mock-players";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

export default function PlayersPage() {
  const { teams } = useTournament();
  const [selectedTeamId, setSelectedTeamId] = useState<string>("all");
  const [teamSearch, setTeamSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPlayers = useMemo(() => {
    if (selectedTeamId === "all") return mockPlayers;
    return mockPlayers.filter((p) => p.teamId === selectedTeamId);
  }, [selectedTeamId]);

  const totalPages = Math.ceil(filteredPlayers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPlayers = filteredPlayers.slice(startIndex, endIndex);

  const filteredTeams = useMemo(() => {
    if (!teamSearch) return teams;
    return teams.filter((t) =>
      t.name.toLowerCase().includes(teamSearch.toLowerCase())
    );
  }, [teamSearch, teams]);

  const getTeamName = (teamId: string): string => {
    return teams.find((t) => t.id === teamId)?.name ?? teamId;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTeamChange = (teamId: string) => {
    setSelectedTeamId(teamId);
    setCurrentPage(1);
  };

  return (
    <DashboardLayout title="Players Management" breadcrumb={["Admin", "Players"]}>
      {/* Filter */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600">Filter by Team:</span>
        <Select value={selectedTeamId} onValueChange={handleTeamChange}>
          <SelectTrigger className="w-56 text-gray-900">
            <SelectValue placeholder="All Teams" />
          </SelectTrigger>
          <SelectContent className="bg-white text-gray-900">
            {/* Search input */}
            <div className="flex items-center border-b px-3 pb-2">
              <Search className="h-4 w-4 text-gray-400 mr-2" />
              <Input
                placeholder="Cari tim..."
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
                className="h-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              />
            </div>
            {/* Scrollable list with max 5 visible */}
            <div className="max-h-[200px] overflow-y-auto">
              <SelectItem value="all" className="text-gray-900">All Teams</SelectItem>
              {filteredTeams.map((team) => (
                <SelectItem key={team.id} value={team.id} className="text-gray-900">
                  {team.schoolName}
                </SelectItem>
              ))}
              {filteredTeams.length === 0 && (
                <div className="py-6 text-center text-sm text-gray-400">
                  Tidak ada tim ditemukan
                </div>
              )}
            </div>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-400">
          {filteredPlayers.length} player{filteredPlayers.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player Name</TableHead>
              <TableHead className="w-28 text-center">Jersey #</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="w-24 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Target className="h-4 w-4 text-[#1F7A63]" />
                  Goals
                </div>
              </TableHead>
              <TableHead className="w-32 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Square className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  Yellow
                </div>
              </TableHead>
              <TableHead className="w-28 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Square className="h-4 w-4 fill-red-500 text-red-500" />
                  Red
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPlayers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Target className="h-10 w-10 opacity-30" />
                    <p className="text-sm font-medium">Tidak ada pemain ditemukan</p>
                    <p className="text-xs">Coba pilih tim lain atau tambahkan pemain terlebih dahulu.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedPlayers.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="font-medium text-gray-900">{player.name}</TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {player.jerseyNumber}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {getTeamName(player.teamId)}
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-semibold text-[#1F7A63]">
                    {player.goals}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-semibold text-yellow-500">
                    {player.yellowCards}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-semibold text-red-500">
                    {player.redCards}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </DashboardLayout>
  );
}
