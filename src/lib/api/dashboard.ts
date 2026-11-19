import { mockDb } from "@/mock/mock-db";
import {
  ConditionDistributionMetric,
  DashboardOverview,
  PatientsPerDoctorMetric,
  PatientTrendPoint,
  SpecializationMetric,
} from "@/types";
import { apiClient, IS_MOCK_MODE, simulateLatency } from "./client";

export async function getDashboardOverviewApi(): Promise<DashboardOverview> {
  if (IS_MOCK_MODE) {
    await simulateLatency(150);
    return mockDb.getDashboardOverview();
  }

  return apiClient<DashboardOverview>("/dashboard/overview");
}

export async function getPatientsPerDoctorApi(): Promise<PatientsPerDoctorMetric[]> {
  if (IS_MOCK_MODE) {
    await simulateLatency(160);
    return mockDb.getPatientsPerDoctorMetrics();
  }

  return apiClient<PatientsPerDoctorMetric[]>("/dashboard/patients-per-doctor");
}

export async function getPatientTrendsApi(): Promise<PatientTrendPoint[]> {
  if (IS_MOCK_MODE) {
    await simulateLatency(180);
    return mockDb.getPatientRegistrationTrends();
  }

  return apiClient<PatientTrendPoint[]>("/dashboard/patient-trends");
}

export async function getConditionDistributionApi(): Promise<ConditionDistributionMetric[]> {
  if (IS_MOCK_MODE) {
    await simulateLatency(170);
    return mockDb.getConditionDistribution();
  }

  return apiClient<ConditionDistributionMetric[]>("/dashboard/condition-distribution");
}

export async function getSpecializationBreakdownApi(): Promise<SpecializationMetric[]> {
  if (IS_MOCK_MODE) {
    await simulateLatency(170);
    return mockDb.getSpecializationBreakdown();
  }

  return apiClient<SpecializationMetric[]>("/dashboard/specialization-breakdown");
}

