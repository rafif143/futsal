"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockRegistrations } from "@/data/mock-registrations";
import { Registration } from "@/data/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, CheckCircle, XCircle, ClipboardList, IdCard } from "lucide-react";
import Image from "next/image";
import { Pagination } from "@/components/ui/pagination";

// Unsplash placeholder for student card
const STUDENT_CARD_IMG = "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&q=80";

const ITEMS_PER_PAGE = 10;

function statusBadge(status: Registration["status"]) {
  const map = {
    approved: "default" as const,
    pending: "secondary" as const,
    rejected: "destructive" as const,
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] =
    useState<Registration[]>(mockRegistrations);
  const [selected, setSelected] = useState<Registration | null>(null);
  const [studentCardPlayer, setStudentCardPlayer] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | Registration['status']>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRegistrations = statusFilter === 'all' 
    ? registrations 
    : registrations.filter(r => r.status === statusFilter);

  const totalPages = Math.ceil(filteredRegistrations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRegistrations = filteredRegistrations.slice(startIndex, endIndex);

  const updateStatus = (id: string, status: Registration["status"]) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, isNew: false } : r))
    );
  };

  const markAsViewed = (id: string) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isNew: false } : r))
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when filter changes
  const handleFilterChange = (filter: 'all' | Registration['status']) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  return (
    <DashboardLayout
      title="Registration Management"
      breadcrumb={["Admin", "Registrations"]}
    >
      <div className="flex flex-col gap-6 w-full h-full pb-10">
        
        {/* HERO BANNER SECTION */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden w-full shrink-0">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#1F7A63] opacity-20 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="flex items-center gap-6 z-10 w-full md:w-auto">
            <div className="h-16 w-16 bg-[#1F7A63] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(31,122,99,0.4)] shrink-0">
              <ClipboardList className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1">Registration Management</h1>
              <p className="text-gray-400 text-sm md:text-base font-medium">Kelola dan verifikasi pendaftaran tim turnamen.</p>
            </div>
          </div>

          <div className="z-10 flex w-full md:w-auto">
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm shadow-inner w-full md:w-auto">
              <div className="p-2.5 bg-[#1F7A63]/20 rounded-lg">
                <ClipboardList className="h-6 w-6 text-[#29a889]" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">Total Registrations</p>
                <p className="text-xl md:text-2xl font-black text-white">{registrations.length} Pendaftaran</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 bg-white p-4 rounded-xl border-2 border-gray-300 shadow-sm">
          <span className="text-sm font-medium text-gray-600">Filter by Status:</span>
          <div className="flex gap-2">
          <Button
            size="sm"
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('all')}
            className={statusFilter === 'all' ? 'bg-[#1F7A63] hover:bg-[#16624F]' : ''}
          >
            All ({registrations.length})
          </Button>
          <Button
            size="sm"
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('pending')}
            className={statusFilter === 'pending' ? 'bg-[#1F7A63] hover:bg-[#16624F]' : ''}
          >
            Pending ({registrations.filter(r => r.status === 'pending').length})
          </Button>
          <Button
            size="sm"
            variant={statusFilter === 'approved' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('approved')}
            className={statusFilter === 'approved' ? 'bg-[#1F7A63] hover:bg-[#16624F]' : ''}
          >
            Approved ({registrations.filter(r => r.status === 'approved').length})
          </Button>
          <Button
            size="sm"
            variant={statusFilter === 'rejected' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('rejected')}
            className={statusFilter === 'rejected' ? 'bg-[#1F7A63] hover:bg-[#16624F]' : ''}
          >
            Rejected ({registrations.filter(r => r.status === 'rejected').length})
          </Button>
        </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border-2 border-gray-300 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Logo</TableHead>
              <TableHead>Team Name</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Official Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRegistrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ClipboardList className="h-10 w-10 opacity-30" />
                    <p className="text-sm font-medium">Belum ada pendaftaran</p>
                    <p className="text-xs">Pendaftaran tim yang masuk akan muncul di sini.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedRegistrations.map((reg) => (
              <TableRow key={reg.id}>
                <TableCell>
                  {reg.teamLogo ? (
                    <Image
                      src={reg.teamLogo}
                      alt={reg.teamName}
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-gray-200" />
                  )}
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    {reg.teamName}
                    {reg.isNew && (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600 uppercase tracking-wide">
                        New
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {reg.schoolName}
                </TableCell>
                <TableCell className="text-sm text-gray-900">{reg.officialName}</TableCell>
                <TableCell className="text-sm text-gray-900">{reg.contactNumber}</TableCell>
                <TableCell>{statusBadge(reg.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelected(reg);
                        markAsViewed(reg.id);
                      }}
                      title="View"
                      className="text-gray-700 hover:text-gray-900"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => updateStatus(reg.id, "approved")}
                      disabled={reg.status === "approved"}
                      title="Approve"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => updateStatus(reg.id, "rejected")}
                      disabled={reg.status === "rejected"}
                      title="Reject"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
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

      {/* View Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg bg-white text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Registration Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm text-gray-900">
              <div className="flex items-center gap-3">
                {selected.teamLogo && (
                  <Image
                    src={selected.teamLogo}
                    alt={selected.teamName}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                )}
                <div>
                  <p className="text-base font-semibold text-gray-900">{selected.teamName}</p>
                  <p className="text-gray-500">{selected.schoolName}</p>                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-400">Contact</p>
                  <p className="text-gray-900">{selected.contactNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Registration Status</p>
                  {statusBadge(selected.status)}
                </div>
                <div>
                  <p className="text-xs text-gray-400">Submitted At</p>
                  <p className="text-gray-900">{new Date(selected.submittedAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Players</p>
                  <p className="text-gray-900">{selected.players.length} players</p>
                </div>
              </div>
              {selected.players.length > 0 && (
                <div>
                  <p className="mb-1 text-xs text-gray-400">Daftar Peserta</p>
                  <ul className="divide-y rounded-lg border overflow-hidden">
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
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Pemain ({selected.players.length})</span>
                    </li>
                    {/* Player rows */}
                    {selected.players.map((p, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between px-3 py-2"
                      >
                        <span className="text-gray-900">{p.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">#{p.jerseyNumber}</span>
                          <button
                            onClick={() => setStudentCardPlayer(p.name)}
                            className="flex items-center gap-1 text-xs text-[#1F7A63] hover:text-[#16624F] font-medium"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Lihat Kartu Pelajar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                  onClick={() => {
                    updateStatus(selected.id, "approved");
                    setSelected(null);
                  }}
                  disabled={selected.status === "approved"}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => {
                    updateStatus(selected.id, "rejected");
                    setSelected(null);
                  }}
                  disabled={selected.status === "rejected"}
                >
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Student Card Dialog */}
      <Dialog open={!!studentCardPlayer} onOpenChange={() => setStudentCardPlayer(null)}>
        <DialogContent className="max-w-md bg-white text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900 flex items-center gap-2">
              <IdCard className="h-4 w-4 text-[#1F7A63]" />
              Kartu Pelajar — {studentCardPlayer}
            </DialogTitle>
          </DialogHeader>
          <div className="rounded-lg overflow-hidden border">
            <img
              src={STUDENT_CARD_IMG}
              alt={`Kartu pelajar ${studentCardPlayer}`}
              className="w-full object-cover"
            />
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
