import { PatientFormData } from "@/lib/validations/patient";
import { mockDb } from "@/mock/mock-db";
import { PaginatedResponse, Patient, PatientQueryParams } from "@/types";
import { apiClient, IS_MOCK_MODE, simulateLatency } from "./client";

export async function getPatientsApi(params: PatientQueryParams = {}): Promise<PaginatedResponse<Patient>> {
  if (IS_MOCK_MODE) {
    await simulateLatency(200);
    return mockDb.queryPatients(params);
  }

  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.doctorId && params.doctorId !== "all") {
    query.set("doctorId", params.doctorId);
  }
  if (params.condition && params.condition !== "all") {
    query.set("condition", params.condition);
  }
  if (params.status) query.set("status", params.status);
  if (params.startDate) query.set("startDate", params.startDate);
  if (params.endDate) query.set("endDate", params.endDate);

  return apiClient<PaginatedResponse<Patient>>(`/patients?${query.toString()}`);
}

export async function getPatientByIdApi(id: string): Promise<Patient> {
  if (IS_MOCK_MODE) {
    await simulateLatency(180);
    const patient = mockDb.getPatientById(id);
    if (!patient) throw new Error("Patient record not found");
    return patient;
  }

  return apiClient<Patient>(`/patients/${id}`);
}

export async function createPatientApi(data: PatientFormData): Promise<Patient> {
  if (IS_MOCK_MODE) {
    await simulateLatency(250);
    return mockDb.createPatient(data);
  }

  return apiClient<Patient>("/patients", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePatientApi(id: string, data: Partial<PatientFormData>): Promise<Patient> {
  if (IS_MOCK_MODE) {
    await simulateLatency(220);
    return mockDb.updatePatient(id, data);
  }

  return apiClient<Patient>(`/patients/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deletePatientApi(id: string): Promise<boolean> {
  if (IS_MOCK_MODE) {
    await simulateLatency(200);
    return mockDb.deletePatient(id);
  }

  await apiClient<{ success: boolean }>(`/patients/${id}`, {
    method: "DELETE",
  });
  return true;
}

