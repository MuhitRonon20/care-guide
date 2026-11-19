"use client";

import React from "react";
import Link from "next/link";
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
import { PatientStatusBadge } from "@/components/shared/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Phone,
  Stethoscope,
  ExternalLink,
} from "lucide-react";

interface PatientTableProps {
  patients: Patient[];
  isLoading: boolean;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  onAddNewPatient: () => void;
}

export function PatientTable({
  patients,
  isLoading,
  onEdit,
  onDelete,
  onAddNewPatient,
}: PatientTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No Patients Found"
        description="No patient records matched your search terms or filter selection."
        actionLabel="Enroll New Patient"
        onAction={onAddNewPatient}
      />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white shadow-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[220px]">Patient Name</TableHead>
            <TableHead>Condition / Diagnosis</TableHead>
            <TableHead>Attending Doctor</TableHead>
            <TableHead>Demographics</TableHead>
            <TableHead>Contact Phone</TableHead>
            <TableHead>Clinical Status</TableHead>
            <TableHead>Registration Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id} className="group">
              {/* Name & Email */}
              <TableCell>
                <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                  {patient.name}
                </div>
                {patient.email ? (
                  <span className="text-[11px] text-muted-foreground truncate block">
                    {patient.email}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">No email on file</span>
                )}
              </TableCell>

              {/* Condition */}
              <TableCell>
                <span className="inline-block max-w-[240px] text-xs font-medium text-slate-800 truncate" title={patient.condition}>
                  {patient.condition}
                </span>
              </TableCell>

              {/* Attending Doctor */}
              <TableCell>
                <div className="flex items-center gap-1.5 text-xs">
                  <Stethoscope className="h-3.5 w-3.5 text-primary shrink-0" />
                  <Link
                    href={`/doctors/${patient.doctorId}`}
                    className="font-medium text-slate-800 hover:text-primary hover:underline flex items-center gap-1 truncate max-w-[170px]"
                    title={patient.doctorName}
                  >
                    <span className="truncate">{patient.doctorName || "Assigned Specialist"}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </div>
                {patient.doctorSpecialization && (
                  <span className="text-[10px] text-muted-foreground block ml-5">
                    {patient.doctorSpecialization}
                  </span>
                )}
              </TableCell>

              {/* Demographics */}
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

              {/* Contact Phone */}
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

              {/* Registration Date */}
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
                      onClick={() => onEdit(patient)}
                      className="flex items-center gap-2 cursor-pointer text-xs"
                    >
                      <Edit className="h-3.5 w-3.5 text-slate-500" />
                      Edit Information
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/doctors/${patient.doctorId}`}
                        className="flex items-center gap-2 cursor-pointer text-xs"
                      >
                        <Stethoscope className="h-3.5 w-3.5 text-slate-500" />
                        View Doctor Roster
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(patient)}
                      className="flex items-center gap-2 cursor-pointer text-xs text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete Patient
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
