"use client";

import React, { useMemo, useState } from "react";
import { Patient } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/shared/search-input";
import { PatientStatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { DataPagination } from "@/components/shared/data-pagination";
import { formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Trash2,
  Edit,
  UserPlus,
  Phone,
  User,
  HeartPulse,
} from "lucide-react";

interface DoctorPatientListProps {
  doctorName: string;
  patients: Patient[];
  onAddPatient: () => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (patient: Patient) => void;
}

export function DoctorPatientList({
  doctorName,
  patients,
  onAddPatient,
  onEditPatient,
  onDeletePatient,
}: DoctorPatientListProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const filtered = useMemo(() => {
    let result = [...patients];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.condition.toLowerCase().includes(q) ||
          p.phone.toLowerCase().includes(q)
      );
    }
    return result;
  }, [patients, search]);

  const totalRecords = filtered.length;
  const totalPages = Math.ceil(totalRecords / limit) || 1;
  const paginatedPatients = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-4">
      {/* Section Header & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-primary" />
            Assigned Patient Caseload
          </h2>
          <p className="text-xs text-slate-500">
            Patients receiving primary care under {doctorName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search patients by name or condition..."
            className="w-full sm:w-64"
          />

          <Button
            size="sm"
            onClick={onAddPatient}
            className="h-9 gap-1 text-xs shrink-0 shadow-sm shadow-primary/20"
          >
            <UserPlus className="h-3.5 w-3.5" />
            New Patient
          </Button>
        </div>
      </div>

      {/* Table Container */}
      {patients.length === 0 ? (
        <EmptyState
          icon={User}
          title="No Patients Assigned"
          description={`There are currently no patients assigned to ${doctorName}.`}
          actionLabel="Assign First Patient"
          onAction={onAddPatient}
        />
      ) : paginatedPatients.length === 0 ? (
        <EmptyState
          icon={User}
          title="No Matching Patients"
          description="No patients match your current search criteria."
          actionLabel="Clear Search"
          onAction={() => setSearch("")}
        />
      ) : (
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[240px]">Patient Name</TableHead>
                <TableHead>Condition / Diagnosis</TableHead>
                <TableHead>Demographics</TableHead>
                <TableHead>Contact Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedPatients.map((patient) => (
                <TableRow key={patient.id} className="group">
                  {/* Name */}
                  <TableCell>
                    <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                      {patient.name}
                    </div>
                    {patient.email && (
                      <span className="text-[11px] text-muted-foreground truncate block">
                        {patient.email}
                      </span>
                    )}
                  </TableCell>

                  {/* Condition */}
                  <TableCell>
                    <span className="inline-block max-w-[260px] text-xs font-medium text-slate-700 truncate" title={patient.condition}>
                      {patient.condition}
                    </span>
                  </TableCell>

                  {/* Demographics (Age / Gender / Blood) */}
                  <TableCell>
                    <div className="text-xs text-slate-600">
                      <span>{patient.age} yrs</span> · <span>{patient.gender}</span>
                      {patient.bloodGroup && (
                        <span className="ml-1 text-[11px] font-semibold text-rose-600">
                          ({patient.bloodGroup})
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Phone */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Phone className="h-3 w-3 text-slate-400" />
                      <span>{patient.phone}</span>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <PatientStatusBadge status={patient.status} />
                  </TableCell>

                  {/* Created Date */}
                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(patient.createdAt)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-slate-900"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          onClick={() => onEditPatient(patient)}
                          className="flex items-center gap-2 cursor-pointer text-xs"
                        >
                          <Edit className="h-3.5 w-3.5 text-slate-500" />
                          Edit Patient Info
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDeletePatient(patient)}
                          className="flex items-center gap-2 cursor-pointer text-xs text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete From Doctor
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <DataPagination
            page={page}
            limit={limit}
            totalRecords={totalRecords}
            totalPages={totalPages}
            onPageChange={setPage}
            onLimitChange={(l) => {
              setLimit(l);
              setPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
}
