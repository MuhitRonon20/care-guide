"use client";

import React from "react";
import Link from "next/link";
import { Doctor } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
  Eye,
  Edit,
  Trash2,
  Stethoscope,
  Phone,
  Mail,
  Building2,
  Users,
} from "lucide-react";

interface DoctorTableProps {
  doctors: Doctor[];
  isLoading: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
  onAddNewDoctor: () => void;
}

export function DoctorTable({
  doctors,
  isLoading,
  onEdit,
  onDelete,
  onAddNewDoctor,
}: DoctorTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <EmptyState
        icon={Stethoscope}
        title="No Doctors Found"
        description="No doctor records matched your search query or filter criteria."
        actionLabel="Add New Doctor"
        onAction={onAddNewDoctor}
      />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white shadow-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[280px]">Doctor Name</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Hospital Affiliation</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead className="text-center">Assigned Patients</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor.id} className="group">
              {/* Doctor Name & Room */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                    {doctor.name.replace(/^(Dr\.|Prof\.)\s*/, "")[0] || "D"}
                  </div>
                  <div>
                    <Link
                      href={`/doctors/${doctor.id}`}
                      className="font-semibold text-slate-900 hover:text-primary hover:underline text-xs sm:text-sm block"
                    >
                      {doctor.name}
                    </Link>
                    {doctor.roomNumber && (
                      <span className="text-[11px] text-muted-foreground">
                        {doctor.roomNumber}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* Specialization */}
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                  {doctor.specialization}
                </span>
              </TableCell>

              {/* Hospital */}
              <TableCell>
                <div className="flex items-center gap-1.5 text-xs text-slate-700 max-w-[200px] truncate" title={doctor.hospital}>
                  <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{doctor.hospital}</span>
                </div>
              </TableCell>

              {/* Contact (Phone & Email) */}
              <TableCell>
                <div className="space-y-0.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-slate-400" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Mail className="h-3 w-3 text-slate-400" />
                    <span className="truncate max-w-[150px]" title={doctor.email}>{doctor.email}</span>
                  </div>
                </div>
              </TableCell>

              {/* Assigned Patients Count */}
              <TableCell className="text-center">
                <Link
                  href={`/doctors/${doctor.id}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors font-semibold text-xs"
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>{doctor.patientCount ?? 0}</span>
                </Link>
              </TableCell>

              {/* Created Date */}
              <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                {formatDate(doctor.createdAt)}
              </TableCell>

              {/* Actions Dropdown */}
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
                    <DropdownMenuItem asChild>
                      <Link href={`/doctors/${doctor.id}`} className="flex items-center gap-2 cursor-pointer">
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        View Profile & Patients
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onEdit(doctor)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5 text-slate-500" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(doctor)}
                      className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete Doctor
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
