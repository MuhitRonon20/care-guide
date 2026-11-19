import React from "react";
import { Badge } from "@/components/ui/badge";
import { PatientStatus } from "@/types";

export function PatientStatusBadge({ status }: { status: PatientStatus }) {
  switch (status) {
    case "Active":
      return (
        <Badge variant="info" className="gap-1 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
          Active
        </Badge>
      );
    case "Under Observation":
      return (
        <Badge variant="warning" className="gap-1 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Under Observation
        </Badge>
      );
    case "Recovered":
      return (
        <Badge variant="success" className="gap-1 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Recovered
        </Badge>
      );
    case "Critical":
      return (
        <Badge variant="destructive" className="gap-1 font-medium bg-red-50 text-red-700 border-red-200">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping" />
          Critical
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export function DoctorStatusBadge({ status = "Active" }: { status?: string }) {
  if (status === "Active") {
    return (
      <Badge variant="success" className="gap-1 text-[11px] font-medium">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Active Staff
      </Badge>
    );
  }
  return <Badge variant="secondary">{status}</Badge>;
}

