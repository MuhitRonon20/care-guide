export type UserRole = "admin" | "staff";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  patientCount?: number;
  status?: "Active" | "On Leave" | "Retired";
  roomNumber?: string;
  createdAt: string;
  updatedAt?: string;
}

export type PatientStatus = "Active" | "Under Observation" | "Recovered" | "Critical";

export interface Patient {
  id: string;
  name: string;
  doctorId: string;
  doctorName?: string;
  doctorSpecialization?: string;
  condition: string;
  phone: string;
  email?: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  status: PatientStatus;
  bloodGroup?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

export interface DoctorQueryParams extends PaginationParams {
  specialization?: string;
  hospital?: string;
}

export interface PatientQueryParams extends PaginationParams {
  doctorId?: string;
  condition?: string;
  status?: PatientStatus;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface DashboardOverview {
  totalDoctors: number;
  totalPatients: number;
  patientsPerDoctor: number;
  activePatients: number;
  criticalCases: number;
  recentRegistrationsCount: number;
}

export interface PatientTrendPoint {
  date: string;
  formattedDate: string;
  newPatients: number;
  cumulativeTotal: number;
}

export interface PatientsPerDoctorMetric {
  doctorId: string;
  doctorName: string;
  specialization: string;
  hospital: string;
  patientCount: number;
}

export interface ConditionDistributionMetric {
  condition: string;
  count: number;
  percentage: number;
  color?: string;
}

export interface SpecializationMetric {
  specialization: string;
  doctorCount: number;
  patientCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

