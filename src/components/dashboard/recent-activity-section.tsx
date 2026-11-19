import React from "react";
import Link from "next/link";
import { Doctor, Patient } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PatientStatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import { ArrowUpRight, Stethoscope, UserPlus } from "lucide-react";

interface RecentActivitySectionProps {
  recentPatients: Patient[];
  recentDoctors: Doctor[];
}

export function RecentActivitySection({
  recentPatients,
  recentDoctors,
}: RecentActivitySectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Latest Patients Card */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              Latest Patient Admissions
            </CardTitle>
            <CardDescription className="text-xs">
              Recently assigned clinical cases
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="h-8 text-xs text-primary gap-1">
            <Link href="/patients">
              View All
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-slate-100">
            {recentPatients.slice(0, 5).map((patient) => (
              <div
                key={patient.id}
                className="py-3 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{patient.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">
                    Assigned to: {patient.doctorName || "General Ward"}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <PatientStatusBadge status={patient.status} />
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    {formatDate(patient.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hospital Medical Providers */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-teal-600" />
              Active Medical Specialists
            </CardTitle>
            <CardDescription className="text-xs">
              Healthcare providers on duty
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="h-8 text-xs text-primary gap-1">
            <Link href="/doctors">
              View All
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-slate-100">
            {recentDoctors.slice(0, 5).map((doc) => (
              <div
                key={doc.id}
                className="py-3 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <Link
                    href={`/doctors/${doc.id}`}
                    className="font-semibold text-slate-900 hover:text-primary hover:underline truncate block"
                  >
                    {doc.name}
                  </Link>
                  <p className="text-[11px] text-slate-500 truncate">
                    {doc.specialization} · {doc.hospital}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-semibold text-[11px]">
                    {doc.patientCount || 0} Patients
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
