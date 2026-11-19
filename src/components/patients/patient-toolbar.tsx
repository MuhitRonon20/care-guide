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
import { useQuery } from "@tanstack/react-query";
import { getDoctorsApi } from "@/lib/api/doctors";

const COMMON_CONDITIONS = [
  "All Conditions",
  "Cardiology",
  "Hypertension",
  "Diabetes",
  "Neurology",
  "Stroke",
  "Orthopedic",
  "Pediatric",
  "Oncology",
  "Pulmonology",
  "Dermatology",
];

interface PatientToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  condition: string;
  onConditionChange: (cond: string) => void;
  doctorId: string;
  onDoctorChange: (docId: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  startDate?: string;
  endDate?: string;
  onDateChange: (start?: string, end?: string) => void;
  onResetFilters: () => void;
  totalResults?: number;
  isLoading?: boolean;
}

export function PatientToolbar({
  search,
  onSearchChange,
  condition,
  onConditionChange,
  doctorId,
  onDoctorChange,
  status,
  onStatusChange,
  startDate,
  endDate,
  onDateChange,
  onResetFilters,
  totalResults,
  isLoading,
}: PatientToolbarProps) {
  const { data: doctorsData } = useQuery({
    queryKey: ["doctors", "dropdown-filter"],
    queryFn: () => getDoctorsApi({ limit: 100 }),
  });

  const hasActiveFilters = !!(
    search ||
    (condition && condition !== "all") ||
    (doctorId && doctorId !== "all") ||
    (status && status !== "all") ||
    startDate ||
    endDate
  );

  return (
    <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="flex-1 max-w-sm">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="Search patient, phone, doctor, condition..."
            isLoading={isLoading}
          />
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Condition Filter */}
          <div className="w-[160px]">
            <Select value={condition || "all"} onValueChange={onConditionChange}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Conditions" />
              </SelectTrigger>
              <SelectContent>
                {COMMON_CONDITIONS.map((c) => (
                  <SelectItem key={c} value={c === "All Conditions" ? "all" : c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Attending Doctor Filter */}
          <div className="w-[180px]">
            <Select value={doctorId || "all"} onValueChange={onDoctorChange}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Doctors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                {doctorsData?.data.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-[140px]">
            <Select value={status || "all"} onValueChange={onStatusChange}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Under Observation">Observation</SelectItem>
                <SelectItem value="Recovered">Recovered</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
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
              Showing <strong className="text-slate-800">{totalResults}</strong> matching{" "}
              {totalResults === 1 ? "patient" : "patients"}
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

