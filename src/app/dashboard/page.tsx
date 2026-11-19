"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  getConditionDistributionApi,
  getDashboardOverviewApi,
  getPatientsPerDoctorApi,
  getPatientTrendsApi,
  getSpecializationBreakdownApi,
} from "@/lib/api/dashboard";
import { getDoctorsApi } from "@/lib/api/doctors";
import { getPatientsApi } from "@/lib/api/patients";
import { StatCard } from "@/components/dashboard/stat-card";
import { PatientTrendChart } from "@/components/dashboard/charts/patient-trend-chart";
import { PatientsPerDoctorChart } from "@/components/dashboard/charts/patients-per-doctor-chart";
import { ConditionDistributionChart } from "@/components/dashboard/charts/condition-distribution-chart";
import { SpecializationBreakdownChart } from "@/components/dashboard/charts/specialization-breakdown-chart";
import { RecentActivitySection } from "@/components/dashboard/recent-activity-section";
import { MotionFade } from "@/components/shared/motion-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/error-state";
import { useAuth } from "@/providers/auth-provider";
import {
  Stethoscope,
  Users,
  UserCheck,
  Activity,
  Plus,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const {
    data: overview,
    isLoading: isLoadingOverview,
    isError: isErrorOverview,
    refetch: refetchOverview,
  } = useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: getDashboardOverviewApi,
  });

  const { data: trendData, isLoading: isLoadingTrends } = useQuery({
    queryKey: ["dashboard", "trends"],
    queryFn: getPatientTrendsApi,
  });

  const { data: patientsPerDocData, isLoading: isLoadingDocData } = useQuery({
    queryKey: ["dashboard", "patientsPerDoctor"],
    queryFn: getPatientsPerDoctorApi,
  });

  const { data: conditionData, isLoading: isLoadingConditions } = useQuery({
    queryKey: ["dashboard", "conditions"],
    queryFn: getConditionDistributionApi,
  });

  const { data: specData, isLoading: isLoadingSpec } = useQuery({
    queryKey: ["dashboard", "specializations"],
    queryFn: getSpecializationBreakdownApi,
  });

  const { data: recentPatientsData } = useQuery({
    queryKey: ["patients", "recent"],
    queryFn: () => getPatientsApi({ limit: 5 }),
  });

  const { data: recentDoctorsData } = useQuery({
    queryKey: ["doctors", "recent"],
    queryFn: () => getDoctorsApi({ limit: 5 }),
  });

  if (isErrorOverview) {
    return (
      <div className="py-8">
        <ErrorState
          title="Dashboard Analytics Error"
          message="Could not retrieve clinical analytics overview from the integration layer."
          onRetry={() => refetchOverview()}
        />
      </div>
    );
  }

  return (
    <MotionFade className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Clinical Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Welcome back, {user?.name || "Dr. Farhana Ahmed"}. Here is your healthcare administration report.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="h-9 gap-1.5 text-xs">
            <Link href="/doctors">
              <Stethoscope className="h-3.5 w-3.5" />
              Manage Doctors
            </Link>
          </Button>

          <Button size="sm" asChild className="h-9 gap-1.5 text-xs shadow-sm">
            <Link href="/patients">
              <Plus className="h-3.5 w-3.5" />
              Manage Patients
            </Link>
          </Button>
        </div>
      </div>

      {/* Primary KPI Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoadingOverview ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))
        ) : overview ? (
          <>
            <StatCard
              title="Total Doctors"
              value={overview.totalDoctors}
              description="Active medical specialists on roster"
              icon={Stethoscope}
              accentColor="blue"
              trend={{ value: "Operational", isPositive: true }}
            />
            <StatCard
              title="Total Patients"
              value={overview.totalPatients}
              description="Total clinical records under supervision"
              icon={Users}
              accentColor="teal"
              trend={{ value: `${overview.recentRegistrationsCount} this month`, isPositive: true }}
            />
            <StatCard
              title="Patients Per Doctor"
              value={overview.patientsPerDoctor}
              description="Average patient load per specialist"
              icon={UserCheck}
              accentColor="indigo"
            />
            <StatCard
              title="Active Clinical Cases"
              value={overview.activePatients}
              description={`${overview.criticalCases} critical cases monitored`}
              icon={Activity}
              accentColor={overview.criticalCases > 0 ? "rose" : "amber"}
            />
          </>
        ) : null}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isLoadingTrends ? (
          <Skeleton className="h-80 col-span-full lg:col-span-2 rounded-xl" />
        ) : (
          <PatientTrendChart data={trendData || []} />
        )}

        {isLoadingDocData ? (
          <Skeleton className="h-80 col-span-full lg:col-span-1 rounded-xl" />
        ) : (
          <PatientsPerDoctorChart data={patientsPerDocData || []} />
        )}
      </div>

      {/* Secondary Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoadingConditions ? (
          <Skeleton className="h-80 rounded-xl" />
        ) : (
          <ConditionDistributionChart data={conditionData || []} />
        )}

        {isLoadingSpec ? (
          <Skeleton className="h-80 rounded-xl" />
        ) : (
          <SpecializationBreakdownChart data={specData || []} />
        )}
      </div>

      {/* Recent Admissions & Staff on Duty */}
      <RecentActivitySection
        recentPatients={recentPatientsData?.data || []}
        recentDoctors={recentDoctorsData?.data || []}
      />
    </MotionFade>
  );
}
