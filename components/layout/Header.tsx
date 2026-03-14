"use client";

import { UserCircle } from "lucide-react";

interface HeaderProps {
  title: string;
  breadcrumb?: string[];
}

export function Header({ title, breadcrumb }: HeaderProps) {
  return (
    <header className="border-b bg-white px-6 py-4 pl-16 lg:pl-6">
      <div className="flex items-center justify-between">
        <div>
          {/* Breadcrumb */}
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className="mb-1 flex items-center gap-2 text-sm text-gray-500">
              {breadcrumb.map((item, index) => (
                <span key={index} className="flex items-center gap-2">
                  {index > 0 && <span>/</span>}
                  <span>{item}</span>
                </span>
              ))}
            </nav>
          )}
          
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>

        {/* Admin Avatar Placeholder */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F7A63] text-white">
            <UserCircle className="h-6 w-6" />
          </div>
        </div>
      </div>
    </header>
  );
}
