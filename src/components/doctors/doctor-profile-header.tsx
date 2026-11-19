"use client";

import React from "react";
import Link from "next/link";
import { Doctor } from "@/types";
import { Button } from "@/components/ui/button";
import { DoctorStatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";

interface DoctorProfileHeaderProps {
  doctor: Doctor;
  onEdit: () => void;
  onAddPatient: () => void;
}

export function DoctorProfileHeader({
  doctor,
  onEdit,
  onAddPatient,
}: DoctorProfileHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-slate-600 hover:text-slate-900 gap-1 text-xs"
        >
          <Link href="/doctors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Doctors Directory
          </Link>
        </Button>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-sky-700 text-white font-bold text-xl shadow-md">
              {doctor.name.replace(/^(Dr\.|Prof\.)\s*/, "")[0] || "D"}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {doctor.name}
                </h1>
                <DoctorStatusBadge status={doctor.status || "Active"} />
              </div>

              <p className="text-sm font-semibold text-primary">
                {doctor.specialization}
              </p>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 pt-1 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  {doctor.hospital}
                </span>

                {doctor.roomNumber && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {doctor.roomNumber}
                  </span>
                )}

                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Enrolled: {formatDate(doctor.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="h-9 gap-1.5 text-xs text-slate-700"
            >
              <Edit3 className="h-3.5 w-3.5 text-slate-500" />
              Edit Profile
            </Button>

            <Button
              size="sm"
              onClick={onAddPatient}
              className="h-9 gap-1.5 text-xs shadow-sm shadow-primary/20"
            >
              <Users className="h-3.5 w-3.5" />
              Assign Patient
            </Button>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] text-muted-foreground block mb-0.5 font-medium">Direct Phone</span>
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span>{doctor.phone}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] text-muted-foreground block mb-0.5 font-medium">Work Email</span>
            <div className="flex items-center gap-2 font-semibold text-slate-800 truncate" title={doctor.email}>
              <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{doctor.email}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] text-muted-foreground block mb-0.5 font-medium">Active Caseload</span>
            <div className="flex items-center gap-2 font-bold text-teal-700">
              <Users className="h-3.5 w-3.5 text-teal-600" />
              <span>{doctor.patientCount || 0} Patients Assigned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
