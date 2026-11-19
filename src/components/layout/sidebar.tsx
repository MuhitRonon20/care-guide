"use client";

import React from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  LogOut,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onItemClick?: () => void;
  className?: string;
}

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    label: "Doctors",
    href: "/doctors",
    icon: Stethoscope,
    badge: null,
  },
  {
    label: "Patients",
    href: "/patients",
    icon: Users,
    badge: null,
  },
];

export function Sidebar({ onItemClick, className }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col justify-between border-r border-slate-200/80 bg-white text-slate-800",
        className
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sky-700 text-white shadow-md shadow-primary/20">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-slate-900">
                Doctor Tracker
              </span>
              <span className="rounded bg-sky-100 px-1.5 py-0.2 text-[10px] font-semibold text-sky-800">
                PRO
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500">Care Guide BD Admin</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-4">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Main Portal
          </p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <NextLink
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-primary text-white shadow-sm shadow-primary/25"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-transform group-hover:scale-105",
                        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                  )}
                </NextLink>
              );
            })}
          </nav>

          <div className="mt-8 px-3">
            <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mb-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                HIPAA & BD Health
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Role-based clinical record access enforced.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile & Logout Area */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/60 shadow-subtle mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "AD"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-900">
                {user?.name || "Administrator"}
              </p>
              <p className="truncate text-[10px] text-slate-500">
                {user?.email || "admin@careguide.bd"}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout()}
          className="w-full justify-start text-xs text-red-600 hover:bg-red-50 hover:text-red-700 font-medium"
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          Sign Out of Portal
        </Button>
      </div>
    </aside>
  );
}
