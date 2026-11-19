import { DoctorFormData } from "@/lib/validations/doctor";
import { mockDb } from "@/mock/mock-db";
import { Doctor, DoctorQueryParams, PaginatedResponse, Patient } from "@/types";
import { apiClient, IS_MOCK_MODE, simulateLatency } from "./client";

export async function getDoctorsApi(params: DoctorQueryParams = {}): Promise<PaginatedResponse<Doctor>> {
  if (IS_MOCK_MODE) {
    await simulateLatency(200);
    return mockDb.queryDoctors(params);
  }

  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.specialization && params.specialization !== "all") {
    query.set("specialization", params.specialization);
  }
  if (params.startDate) query.set("startDate", params.startDate);
  if (params.endDate) query.set("endDate", params.endDate);

  return apiClient<PaginatedResponse<Doctor>>(`/doctors?${query.toString()}`);
}

export async function getDoctorByIdApi(id: string): Promise<Doctor & { patients: Patient[] }> {
  if (IS_MOCK_MODE) {
    await simulateLatency(180);
    const doc = mockDb.getDoctorById(id);
    if (!doc) throw new Error("Doctor record not found");
    return doc;
  }

  return apiClient<Doctor & { patients: Patient[] }>(`/doctors/${id}`);
}

export async function createDoctorApi(data: DoctorFormData): Promise<Doctor> {
  if (IS_MOCK_MODE) {
    await simulateLatency(250);
    return mockDb.createDoctor(data);
  }

  return apiClient<Doctor>("/doctors", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateDoctorApi(id: string, data: Partial<DoctorFormData>): Promise<Doctor> {
  if (IS_MOCK_MODE) {
    await simulateLatency(220);
    return mockDb.updateDoctor(id, data);
  }

  return apiClient<Doctor>(`/doctors/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteDoctorApi(id: string): Promise<boolean> {
  if (IS_MOCK_MODE) {
    await simulateLatency(200);
    return mockDb.deleteDoctor(id);
  }

  await apiClient<{ success: boolean }>(`/doctors/${id}`, {
    method: "DELETE",
  });
  return true;
}

export async function getDoctorPatientsApi(id: string): Promise<Patient[]> {
  if (IS_MOCK_MODE) {
    await simulateLatency(180);
    const doc = mockDb.getDoctorById(id);
    return doc ? doc.patients : [];
  }

  return apiClient<Patient[]>(`/doctors/${id}/patients`);
}

