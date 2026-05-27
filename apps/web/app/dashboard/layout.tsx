"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  FileText,
  Database,
  BarChart3,
  Copy,
  Users,
  Settings,
  Bell,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { id: "forms", label: "Forms", icon: FileText, path: "/dashboard/forms" },
  { id: "submissions", label: "Submissions", icon: Database, path: "/dashboard/submissions" },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
  { id: "templates", label: "Templates", icon: Copy, path: "#" },
  { id: "team", label: "Team", icon: Users, path: "#" },
  { id: "settings", label: "Settings", icon: Settings, path: "#" },
];

function getActiveNavId(pathname: string): string {
  if (pathname === "/dashboard") return "overview";
  if (pathname.startsWith("/dashboard/analytics")) return "analytics";
  if (pathname.startsWith("/dashboard/submissions")) return "submissions";
  if (pathname.startsWith("/dashboard/forms")) return "forms";
  return "overview";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const activeNavId = getActiveNavId(pathname);

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] relative overflow-hidden flex font-sans selection:bg-[#E94B35]/30">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines z-0" />
      <div className="absolute inset-0 opacity-3 pointer-events-none scanlines z-0" />

      {/* ─── Collapsible Sidebar ─── */}
      <aside
        className={`bg-[#0D0D0D] border-r border-white/5 transition-all duration-300 relative z-20 flex flex-col justify-between ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-white/5">
            {!sidebarCollapsed && (
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <h1 className="text-sm font-bold tracking-widest uppercase mono text-white">
                  MIRAI<span className="text-[#E94B35]">FORMS</span>
                </h1>
              </Link>
            )}
            {sidebarCollapsed && (
              <div className="text-[#E94B35] font-black mono text-base mx-auto">MF</div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeNavId === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded text-xs mono uppercase tracking-wider transition-all hover:bg-white/5 group relative ${
                    isActive
                      ? "text-white bg-white/5 font-extrabold border-l-2 border-[#E94B35]"
                      : "text-[#6E6E6E] hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-4.5 w-4.5 transition-colors group-hover:text-[#E94B35] ${
                      isActive ? "text-[#E94B35]" : "text-[#6E6E6E]"
                    }`}
                  />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Widget */}
        <div className="p-4 border-t border-white/5">
          {!sidebarCollapsed ? (
            <div className="bg-black/40 border border-white/5 p-4 rounded text-center">
              <div className="flex justify-between items-center mb-1 text-[9px] mono text-[#6E6E6E] uppercase font-bold">
                <span>Plan</span>
                <span className="text-white">Pro Plan</span>
              </div>
              <div className="text-xs font-bold text-white mono mb-2 text-left">
                2,430 / 10,000
              </div>
              {/* Progress bar */}
              <div className="w-full h-1 bg-white/5 rounded overflow-hidden mb-3">
                <div className="h-full bg-gradient-to-r from-[#E94B35] to-[#FF3B30] w-[24.3%]" />
              </div>
              <Button
                variant="outline"
                className="w-full text-[9px] uppercase mono border-white/10 text-white hover:bg-white/5 py-1.5 h-7 rounded"
              >
                Upgrade
              </Button>
            </div>
          ) : (
            <div className="text-center font-bold text-xs text-[#E94B35] mono">24%</div>
          )}

          {/* Collapse Controller */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full mt-3 flex items-center justify-center p-1 border border-white/5 rounded text-[#6E6E6E] hover:text-white hover:bg-white/5 transition-all text-[10px] mono uppercase cursor-pointer"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <div className="flex-1 overflow-y-auto relative z-10 flex flex-col min-h-screen">
        {/* Top Header Navigation Utility Bar */}
        <header className="sticky top-0 z-40 bg-[#080808]/80 backdrop-blur-md border-b border-white/5 h-16 flex items-center justify-between px-8">
          <div className="flex items-center gap-6">
            <div>
              <h2 className="heading-brutalist text-lg text-white uppercase tracking-wider">
                {NAV_ITEMS.find((n) => n.id === activeNavId)?.label || "Dashboard"}
              </h2>
              <p className="text-[9px] mono text-[#6E6E6E] uppercase tracking-wider">
                MIRAI_SYS // CONTROL_PANEL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Date Picker Button */}
            <button className="flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded bg-[#0D0D0D] hover:border-white/20 transition-all text-xs font-bold text-neutral-300 mono uppercase cursor-pointer">
              <Calendar className="h-3.5 w-3.5 text-[#E94B35]" />
              <span>Today</span>
              <ChevronDown className="h-3 w-3 text-[#6E6E6E]" />
            </button>

            {/* Notification Bell */}
            <button className="relative w-8 h-8 rounded border border-white/10 bg-[#0D0D0D] flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer group">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF3B30] border border-[#080808] animate-pulse" />
            </button>

            {/* User Button */}
            <div className="flex items-center gap-2 border-l border-white/5 pl-4">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "h-8 w-8 border border-white/10 hover:border-[#E94B35]/50 transition-colors",
                  },
                }}
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full relative">
          {children}
        </main>
      </div>
    </div>
  );
}
