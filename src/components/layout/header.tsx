"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Menu,
  ChevronRight,
  Shield,
  RotateCcw,
  LogOut,
  Calendar,
  CheckCircle2,
} from "lucide-react";

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const { user, logout, resetDemoData } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  const getBreadcrumbs = () => {
    if (pathname === "/dashboard") return [{ label: "Dashboard", href: "/dashboard" }];
    if (pathname === "/doctors") return [{ label: "Doctors", href: "/doctors" }];
    if (pathname.startsWith("/doctors/")) {
      return [
        { label: "Doctors", href: "/doctors" },
        { label: "Doctor Details", href: pathname },
      ];
    }
    if (pathname === "/patients") return [{ label: "Patients", href: "/patients" }];
    return [{ label: "Portal", href: "/" }];
  };

  const breadcrumbs = getBreadcrumbs();
  const currentDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="lg:hidden text-slate-600 hover:text-slate-900"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Dynamic Breadcrumbs */}
        <nav aria-label="Breadcrumbs" className="flex items-center text-xs sm:text-sm">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.href}>
              {idx > 0 && <ChevronRight className="mx-1.5 h-3.5 w-3.5 text-slate-400" />}
              <span
                className={
                  idx === breadcrumbs.length - 1
                    ? "font-semibold text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Date indicator */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200/60">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{currentDate}</span>
        </div>

        {/* Functional Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative h-9 w-9 rounded-lg border-slate-200 text-slate-600 hover:text-slate-900"
              aria-label="View notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-900">Clinical Alerts</span>
              {unreadNotifications > 0 && (
                <button
                  type="button"
                  onClick={() => setUnreadNotifications(0)}
                  className="text-[11px] text-primary hover:underline font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="py-1">
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  New Patient Admitted
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Mohammad Zahirul Haque registered under Dr. Rafiqul Islam.
                </p>
                <span className="text-[10px] text-slate-400">10m ago</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                  <Shield className="h-3.5 w-3.5 text-sky-600" />
                  System Sync Completed
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Hospital staff directory verified for Q4 2024.
                </p>
                <span className="text-[10px] text-slate-400">1h ago</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="User profile menu"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-medium text-xs">
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "AD"}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-slate-900 leading-none">
                  {user?.name || "Dr. Farhana Ahmed"}
                </p>
                <p className="text-xs text-muted-foreground leading-none">
                  {user?.email || "admin@careguide.bd"}
                </p>
                <span className="inline-block mt-1 text-[10px] font-semibold uppercase text-primary">
                  {user?.role || "Administrator"}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={resetDemoData} className="gap-2 cursor-pointer text-xs">
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
              Reset Demo Records
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="gap-2 cursor-pointer text-xs text-destructive focus:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
