"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Printer, BarChart2 } from "lucide-react";

const reports = [
  {
    id: "schedule",
    title: "Jadwal Pertandingan",
    description: "Semua pertandingan grup diorganisir per grup, termasuk tim dan status.",
    icon: FileText,
  },
  {
    id: "bracket",
    title: "Bracket Knockout",
    description: "Bracket visual babak knockout dengan hasil pertandingan dan perkembangan.",
    icon: Printer,
  },
  {
    id: "standings",
    title: "Klasemen",
    description: "Tabel klasemen lengkap untuk semua 8 grup dengan poin, gol, dan statistik.",
    icon: BarChart2,
  },
];

export default function ReportsPage() {
  const router = useRouter();

  return (
    <DashboardLayout title="Laporan" breadcrumb={["Admin", "Laporan"]}>
      <div className="space-y-6">
        <p className="text-gray-500 text-sm">
          Buat dan cetak laporan PDF untuk turnamen.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reports.map(({ id, title, description, icon: Icon }) => (
            <Card key={id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                </div>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button
                  onClick={() => router.push(`/admin/reports/print?type=${id}`)}
                  className="w-full gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Pratinjau &amp; Cetak
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
