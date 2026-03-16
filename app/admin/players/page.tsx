"use client";

import { useState, useMemo } from "react";
import { Target, Square, Search, ArrowUpDown } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useTournament } from "@/contexts/TournamentContext";
import { mockPlayers } from "@/data/mock-players";
import { Player } from "@/data/types";
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
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

type SortField = 'goals' | 'yellowCards' | 'redCards' | 'name';
type SortDirection = 'asc' | 'desc';

interface PlayerWithStats extends Player {
  actualGoals: number;
  actualYellowCards: number;
  actualRedCards: number;
}

export default function PlayersPage() {
  const { teams, matches } = useTournament();
  const [selectedTeamId, setSelectedTeamId] = useState<string>("all");
  const [teamSearch, setTeamSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('goals');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Calculate actual player stats from match events
  const playersWithStats = useMemo((): PlayerWithStats[] => {
    return mockPlayers.map(player => {
      // Get all completed matches
      const completedMatches = matches.filter(m => m.status === 'completed');
      
      // Calculate stats from match events
      let actualGoals = 0;
      let actualYellowCards = 0;
      let actualRedCards = 0;

      completedMatches.forEach(match => {
        match.events.forEach(event => {
          if (event.playerId === player.id) {
            switch (event.type) {
              case 'goal':
                actualGoals++;
                break;
              case 'yellowCard':
                actualYellowCards++;
                break;
              case 'redCard':
                actualRedCards++;
                break;
            }
          }
        });
      });

      return {
        ...player,
        actualGoals,
        actualYellowCards,
        actualRedCards,
      };
    });
  }, [matches]);

  const filteredPlayers = useMemo(() => {
    if (selectedTeamId === "all") return playersWithStats;
    return playersWithStats.filter((p) => p.teamId === selectedTeamId);
  }, [selectedTeamId, playersWithStats]);

  // Sort players
  const sortedPlayers = useMemo(() => {
    return [...filteredPlayers].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case 'goals':
          aValue = a.actualGoals;
          bValue = b.actualGoals;
          break;
        case 'yellowCards':
          aValue = a.actualYellowCards;
          bValue = b.actualYellowCards;
          break;
        case 'redCards':
          aValue = a.actualRedCards;
          bValue = b.actualRedCards;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      const numA = aValue as number;
      const numB = bValue as number;
      
      return sortDirection === 'asc' ? numA - numB : numB - numA;
    });
  }, [filteredPlayers, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedPlayers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPlayers = sortedPlayers.slice(startIndex, endIndex);

  const filteredTeams = useMemo(() => {
    if (!teamSearch) return teams;
    return teams.filter((t) =>
      t.schoolName.toLowerCase().includes(teamSearch.toLowerCase())
    );
  }, [teamSearch, teams]);

  const getTeamName = (teamId: string): string => {
    return teams.find((t) => t.id === teamId)?.schoolName ?? teamId;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTeamChange = (teamId: string) => {
    setSelectedTeamId(teamId);
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to desc for stats, asc for name
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    return (
      <ArrowUpDown 
        className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`} 
      />
    );
  };

  return (
    <DashboardLayout title="Players Management" breadcrumb={["Admin", "Players"]}>
      <div className="flex flex-col gap-6 w-full h-full pb-10">
        
        {/* HERO BANNER SECTION */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden w-full shrink-0">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#1F7A63] opacity-20 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="flex items-center gap-6 z-10 w-full md:w-auto">
            <div className="h-16 w-16 bg-[#1F7A63] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(31,122,99,0.4)] shrink-0">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1">Players Management</h1>
              <p className="text-gray-400 text-sm md:text-base font-medium">Pantau statistik dan data semua pemain dalam turnamen.</p>
            </div>
          </div>

          <div className="z-10 flex w-full md:w-auto">
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm shadow-inner w-full md:w-auto">
              <div className="p-2.5 bg-[#1F7A63]/20 rounded-lg">
                <Target className="h-6 w-6 text-[#29a889]" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">Total Players</p>
                <p className="text-xl md:text-2xl font-black text-white">{playersWithStats.length} Pemain</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1F7A63]/10 rounded-lg">
                <Target className="h-5 w-5 text-[#1F7A63]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Goals</p>
                <p className="text-xl font-bold text-gray-900">
                  {sortedPlayers.reduce((sum, p) => sum + p.actualGoals, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Square className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Yellow Cards</p>
                <p className="text-xl font-bold text-gray-900">
                  {sortedPlayers.reduce((sum, p) => sum + p.actualYellowCards, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Square className="h-5 w-5 fill-red-500 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Red Cards</p>
                <p className="text-xl font-bold text-gray-900">
                  {sortedPlayers.reduce((sum, p) => sum + p.actualRedCards, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white p-4 rounded-xl border-2 border-gray-300 shadow-sm">
          <div className="flex items-center gap-3 flex-1">
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
              {sortedPlayers.length} player{sortedPlayers.length !== 1 ? "s" : ""}
            </span>
          </div>
          
          {/* Sync Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1F7A63]/10 border border-[#1F7A63]/20 rounded-lg">
            <div className="h-2 w-2 bg-[#1F7A63] rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-[#1F7A63]">
              Stats synced with match results
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border-2 border-gray-300 bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('name')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Player Name {getSortIcon('name')}
                </Button>
              </TableHead>
              <TableHead className="w-28 text-center">Jersey #</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="w-24 text-center">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('goals')}
                  className="h-auto p-0 font-semibold hover:bg-transparent flex items-center justify-center gap-1"
                >
                  <Target className="h-4 w-4 text-[#1F7A63]" />
                  Goals {getSortIcon('goals')}
                </Button>
              </TableHead>
              <TableHead className="w-32 text-center">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('yellowCards')}
                  className="h-auto p-0 font-semibold hover:bg-transparent flex items-center justify-center gap-1"
                >
                  <Square className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  Yellow {getSortIcon('yellowCards')}
                </Button>
              </TableHead>
              <TableHead className="w-28 text-center">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('redCards')}
                  className="h-auto p-0 font-semibold hover:bg-transparent flex items-center justify-center gap-1"
                >
                  <Square className="h-4 w-4 fill-red-500 text-red-500" />
                  Red {getSortIcon('redCards')}
                </Button>
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
                    {player.actualGoals}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-semibold text-yellow-500">
                    {player.actualYellowCards}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-semibold text-red-500">
                    {player.actualRedCards}
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
      </div>
    </DashboardLayout>
  );
}
