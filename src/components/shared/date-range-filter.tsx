"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, X } from "lucide-react";

interface DateRangeFilterProps {
  startDate?: string;
  endDate?: string;
  onDateChange: (start?: string, end?: string) => void;
  className?: string;
}

export function DateRangeFilter({
  startDate,
  endDate,
  onDateChange,
  className,
}: DateRangeFilterProps) {
  const hasFilter = !!(startDate || endDate);

  const handlePreset = (preset: "all" | "30d" | "90d" | "thisYear") => {
    const now = new Date();
    if (preset === "all") {
      onDateChange(undefined, undefined);
    } else if (preset === "30d") {
      const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      onDateChange(past.toISOString().split("T")[0], now.toISOString().split("T")[0]);
    } else if (preset === "90d") {
      const past = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      onDateChange(past.toISOString().split("T")[0], now.toISOString().split("T")[0]);
    } else if (preset === "thisYear") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      onDateChange(startOfYear.toISOString().split("T")[0], now.toISOString().split("T")[0]);
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className || ""}`}>
      <div className="flex items-center gap-1.5 bg-white border border-input rounded-md px-2 py-1 shadow-subtle text-xs">
        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        <span className="text-muted-foreground text-[11px] hidden sm:inline">From:</span>
        <input
          type="date"
          value={startDate || ""}
          onChange={(e) => onDateChange(e.target.value || undefined, endDate)}
          className="text-xs bg-transparent focus:outline-none text-slate-800"
          title="Start Date"
        />
        <span className="text-muted-foreground text-[11px] hidden sm:inline">To:</span>
        <input
          type="date"
          value={endDate || ""}
          onChange={(e) => onDateChange(startDate, e.target.value || undefined)}
          className="text-xs bg-transparent focus:outline-none text-slate-800"
          title="End Date"
        />

        {hasFilter && (
          <button
            type="button"
            onClick={() => onDateChange(undefined, undefined)}
            className="p-0.5 text-slate-400 hover:text-slate-600 ml-1"
            title="Clear date filter"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="hidden lg:flex items-center gap-1">
        <Button
          type="button"
          variant={!hasFilter ? "secondary" : "ghost"}
          size="sm"
          className="h-7 text-[11px] px-2"
          onClick={() => handlePreset("all")}
        >
          All
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-[11px] px-2"
          onClick={() => handlePreset("30d")}
        >
          30d
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-[11px] px-2"
          onClick={() => handlePreset("90d")}
        >
          90d
        </Button>
      </div>
    </div>
  );
}

