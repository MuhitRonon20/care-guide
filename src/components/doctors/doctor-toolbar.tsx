"use client";

import React from "react";
import { SearchInput } from "@/components/shared/search-input";
import { DateRangeFilter } from "@/components/shared/date-range-filter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const SPECIALIZATIONS = [
  "All Specializations",
  "Cardiology",
  "Neurology",
  "Endocrinology & Diabetology",
  "Orthopedic Surgery",
  "Pediatrics & Child Health",
  "Oncology",
  "Dermatology & Venereology",
  "Pulmonology & Chest Medicine",
];

interface DoctorToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  specialization: string;
  onSpecializationChange: (spec: string) => void;
  startDate?: string;
  endDate?: string;
  onDateChange: (start?: string, end?: string) => void;
  onResetFilters: () => void;
  totalResults?: number;
  isLoading?: boolean;
}

export function DoctorToolbar({
  search,
  onSearchChange,
  specialization,
  onSpecializationChange,
  startDate,
  endDate,
  onDateChange,
  onResetFilters,
  totalResults,
  isLoading,
}: DoctorToolbarProps) {
  const hasActiveFilters = !!(
    search ||
    (specialization && specialization !== "all") ||
    startDate ||
    endDate
  );

  return (
    <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="Search doctor by name, hospital, phone..."
            isLoading={isLoading}
          />
        </div>

        {/* Specialization Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-full sm:w-[220px]">
            <Select
              value={specialization || "all"}
              onValueChange={onSpecializationChange}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Specializations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {SPECIALIZATIONS.slice(1).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date-wise filter */}
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onDateChange={onDateChange}
          />

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-8 text-xs text-slate-500 hover:text-slate-900 gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Filter status & counter */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-500">
        <div>
          {totalResults !== undefined && (
            <span>
              Found <strong className="text-slate-800">{totalResults}</strong> matching{" "}
              {totalResults === 1 ? "doctor" : "doctors"}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <span className="text-[11px] text-primary font-medium">Filters active</span>
        )}
      </div>
    </div>
  );
}

