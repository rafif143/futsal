"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  UserCircle,
  Grid3x3,
  Trophy,
  BarChart3,
  Zap,
  Eye,
  FileText,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "registration-management",
    label: "Registration Management",
    icon: ClipboardList,
    path: "/admin/registrations",
  },
  {
    id: "teams",
    label: "Teams",
    icon: Users,
    path: "/admin/teams",
  },
  {
    id: "players",
    label: "Players",
    icon: UserCircle,
    path: "/admin/players",
  },
  {
    id: "drawing-table",
    label: "Drawing Table",
    icon: Grid3x3,
    path: "/admin/drawing",
  },
  {
    id: "matches",
    label: "Matches",
    icon: Trophy,
    path: "/admin/matches",
  },
  {
    id: "standings",
    label: "Standings",
    icon: BarChart3,
    path: "/admin/standings",
  },
  {
    id: "knockout-stage",
    label: "Knockout Stage",
    icon: Zap,
    path: "/admin/knockout",
  },
  {
    id: "public-view",
    label: "Public View",
    icon: Eye,
    path: "/public-view",
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileText,
    path: "/admin/reports",
  },
];

interface SidebarContentProps {
  pathname: string;
  onNavigate?: () => void;
}

function SidebarContent({ pathname, onNavigate }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo/Title */}
      <div className="border-b px-6 py-4">
        <h1 className="text-xl font-bold text-[#1F7A63]">Futsal Tournament</h1>
        <p className="text-sm text-gray-500">Management System</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#1F7A63] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed left-4 top-4 z-50 lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white shadow-md"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent
              pathname={pathname}
              onNavigate={() => setIsOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-white">
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  );
}
