# Frontend-to-Backend Integration Requirement Matrix
**Project**: Doctor Tracker | Care Guide BD Administrative Portal  
**Document**: Frontend-to-Backend Integration Specification & Audit  
**Date**: November 2026  

---

## 1. Executive Summary & Audit Overview

The **Doctor Tracker** frontend is an enterprise-grade administrative healthcare SaaS portal developed using Next.js 15 (App Router), TypeScript, Tailwind CSS, TanStack Query, React Hook Form, and Zod.

The frontend operates in two modes controlled by environment variables:
- **Mock Mode**: `NEXT_PUBLIC_USE_MOCK=true` (simulates API with localized storage).
- **Production Mode**: `NEXT_PUBLIC_USE_MOCK=false` and `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api` (communicates with this standalone Node.js/Express backend via HTTP REST endpoints with `credentials: "include"`).

This document establishes the authoritative contract between the existing Next.js frontend and the standalone Express + TypeScript + MongoDB backend.

---

## 2. Frontend-to-Backend Requirement Matrix

| Frontend Page / Component | User Action | Required Data / Form Fields | Required API Endpoint | HTTP Method | Expected Request Payload | Expected Backend Response |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Login Page** (`/login`) <br>`LoginForm` | Admin submits credentials | `email` (string, email)<br>`password` (string, min 6)<br>`rememberMe` (boolean, optional) | `/api/auth/login` | `POST` | `{ email, password, rememberMe }` | `User` object (`id`, `email`, `name`, `role`, `avatarUrl`, `createdAt`) + sets `jwt` / session HttpOnly cookie |
| **App Shell / Header** <br>`AuthProvider` | Verify active session on page mount | Session cookie | `/api/auth/me` | `GET` | *None* (Cookie sent via `credentials: "include"`) | `User` object (`id`, `email`, `name`, `role`, `avatarUrl`, `createdAt`) or `401 Unauthorized` |
| **App Shell / Header / Sidebar** | Admin logs out | None | `/api/auth/logout` | `POST` | *None* | `{ success: true, message: "Logged out successfully" }` + clears cookie |
| **Dashboard** (`/dashboard`) <br>`StatCard` grid | Page loads overview KPIs | None | `/api/dashboard/overview` | `GET` | *None* | `DashboardOverview` (`totalDoctors`, `totalPatients`, `patientsPerDoctor`, `activePatients`, `criticalCases`, `recentRegistrationsCount`) |
| **Dashboard** (`/dashboard`) <br>`PatientTrendChart` | Loads registration timeline | None | `/api/dashboard/patient-trends` | `GET` | *None* | Array of `PatientTrendPoint` (`date`, `formattedDate`, `newPatients`, `cumulativeTotal`) |
| **Dashboard** (`/dashboard`) <br>`PatientsPerDoctorChart` | Loads doctor caseload bar chart | None | `/api/dashboard/patients-per-doctor` | `GET` | *None* | Array of `PatientsPerDoctorMetric` (`doctorId`, `doctorName`, `specialization`, `hospital`, `patientCount`) |
| **Dashboard** (`/dashboard`) <br>`ConditionDistributionChart` | Loads clinical diagnoses donut chart | None | `/api/dashboard/condition-distribution` | `GET` | *None* | Array of `ConditionDistributionMetric` (`condition`, `count`, `percentage`, `color`) |
| **Dashboard** (`/dashboard`) <br>`SpecializationBreakdownChart` | Loads department staffing vs demand | None | `/api/dashboard/specialization-breakdown` | `GET` | *None* | Array of `SpecializationMetric` (`specialization`, `doctorCount`, `patientCount`) |
| **Doctors Page** (`/doctors`) <br>`DoctorTable`, `DoctorToolbar` | View doctors list, search, filter, paginate | `page`, `limit`, `search`, `specialization`, `startDate`, `endDate` | `/api/doctors` | `GET` | Query params | `PaginatedResponse<Doctor>` (`data: Doctor[]`, `pagination: { page, limit, totalPages, totalRecords, hasNextPage, hasPrevPage }`) |
| **Doctors Page** (`/doctors`) <br>`AddDoctorDialog` | Admin registers new doctor | `name`, `specialization`, `hospital`, `phone`, `email`, `roomNumber` (opt) | `/api/doctors` | `POST` | `DoctorFormData` | Created `Doctor` object (`id`, `name`, `specialization`, `hospital`, `phone`, `email`, `roomNumber`, `status: "Active"`, `patientCount: 0`, `createdAt`) |
| **Doctors Page** (`/doctors`) <br>`EditDoctorDialog` | Admin updates doctor details | `name`, `specialization`, `hospital`, `phone`, `email`, `roomNumber` (opt) | `/api/doctors/:id` | `PATCH` | Partial `DoctorFormData` | Updated `Doctor` object |
| **Doctors Page** (`/doctors`) <br>`ConfirmDialog` | Admin deletes doctor | `id` in URL | `/api/doctors/:id` | `DELETE` | *None* | `{ success: true, message: "Doctor record removed" }` |
| **Doctor Details** (`/doctors/[id]`) <br>`DoctorProfileHeader` | View doctor profile & patient list | `id` in URL | `/api/doctors/:id` | `GET` | *None* | `Doctor & { patients: Patient[] }` |
| **Doctor Details** (`/doctors/[id]`) <br>`DoctorPatientList` | View assigned patient caseload | `id` in URL | `/api/doctors/:id/patients` | `GET` | *None* | Array of `Patient[]` |
| **Doctor Details** (`/doctors/[id]`) <br>`AddPatientDialog` | Assign patient to this doctor | `name`, `doctorId` (locked), `condition`, `phone`, `email`, `age`, `gender`, `status`, `bloodGroup`, `notes` | `/api/patients` | `POST` | `PatientFormData` | Created `Patient` object (`id`, `name`, `doctorId`, `doctorName`, `doctorSpecialization`, `condition`, `phone`, `email`, `age`, `gender`, `status`, `bloodGroup`, `notes`, `createdAt`) |
| **Doctor Details** (`/doctors/[id]`) <br>`ConfirmDialog` | Remove/delete patient from doctor care | `id` in URL | `/api/patients/:id` | `DELETE` | *None* | `{ success: true, message: "Patient removed" }` |
| **Patients Page** (`/patients`) <br>`PatientTable`, `PatientToolbar` | View all patients, search, filter, paginate | `page`, `limit`, `search`, `doctorId`, `condition`, `status`, `startDate`, `endDate` | `/api/patients` | `GET` | Query params | `PaginatedResponse<Patient>` (`data: Patient[]`, `pagination: { page, limit, totalPages, totalRecords, hasNextPage, hasPrevPage }`) |
| **Patients Page** (`/patients`) <br>`AddPatientDialog` | Register general patient with doctor select | `name`, `doctorId`, `condition`, `phone`, `email`, `age`, `gender`, `status`, `bloodGroup`, `notes` | `/api/patients` | `POST` | `PatientFormData` | Created `Patient` object |
| **Patients Page** (`/patients`) <br>`EditPatientDialog` | Update patient record or reassign doctor | `name`, `doctorId`, `condition`, `phone`, `email`, `age`, `gender`, `status`, `bloodGroup`, `notes` | `/api/patients/:id` | `PATCH` | Partial `PatientFormData` | Updated `Patient` object with resolved `doctorName` & `doctorSpecialization` |
| **Patients Page** (`/patients`) <br>`ConfirmDialog` | Permanently delete patient | `id` in URL | `/api/patients/:id` | `DELETE` | *None* | `{ success: true, message: "Patient deleted" }` |

---

## 3. Data Schema Contracts

### A. Admin / User Contract
```typescript
export interface User {
  id: string;             // MongoDB ObjectId string
  email: string;          // Lowercase email
  name: string;           // Admin full name
  role: "admin" | "staff";// Fixed to "admin"
  avatarUrl?: string;     // Profile avatar image URL
  createdAt: string;      // ISO 8601 UTC
}
```

### B. Doctor Contract
```typescript
export interface Doctor {
  id: string;             // MongoDB ObjectId string
  name: string;           // e.g. "Dr. Rafiqul Islam"
  specialization: string; // e.g. "Cardiology"
  hospital: string;       // e.g. "Square Hospitals Ltd, Dhaka"
  phone: string;          // e.g. "+880 1711-234567"
  email: string;          // e.g. "rafiqul.islam@squarehospital.com"
  patientCount?: number;  // Aggregated count of assigned patients
  status?: "Active" | "On Leave" | "Retired";
  roomNumber?: string;    // e.g. "Room 402, Block A"
  createdAt: string;      // ISO 8601 UTC
  updatedAt?: string;     // ISO 8601 UTC
}
```

### C. Patient Contract
```typescript
export type PatientStatus = "Active" | "Under Observation" | "Recovered" | "Critical";

export interface Patient {
  id: string;                   // MongoDB ObjectId string
  name: string;                 // Patient full name
  doctorId: string;             // Associated Doctor ObjectId string
  doctorName?: string;          // Populated/cached Doctor name
  doctorSpecialization?: string;// Populated/cached Doctor specialization
  condition: string;            // Medical condition / clinical diagnosis
  phone: string;                // Contact phone
  email?: string;               // Email address (optional)
  age: number;                  // Integer age (0 - 130)
  gender: "Male" | "Female" | "Other";
  status: PatientStatus;        // "Active" | "Under Observation" | "Recovered" | "Critical"
  bloodGroup?: string;          // "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
  notes?: string;               // Optional clinical case notes
  createdAt: string;            // ISO 8601 UTC
  updatedAt?: string;           // ISO 8601 UTC
}
```

### D. Generic Paginated Response Contract
```typescript
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
```

---

## 4. Dashboard Calculations Specification

1. **`totalDoctors`**: `await Doctor.countDocuments()`
2. **`totalPatients`**: `await Patient.countDocuments()`
3. **`patientsPerDoctor`**: `totalDoctors > 0 ? Number((totalPatients / totalDoctors).toFixed(1)) : 0`
4. **`activePatients`**: `await Patient.countDocuments({ status: { $in: ["Active", "Under Observation"] } })`
5. **`criticalCases`**: `await Patient.countDocuments({ status: "Critical" })`
6. **`recentRegistrationsCount`**: `await Patient.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } })`
7. **`patients-per-doctor`**: Aggregated lookup matching doctors, counting their associated patients, sorted by `patientCount` descending. Doctors with 0 patients must be included.
8. **`patient-trends`**: Date-based aggregation grouped by calendar day (`YYYY-MM-DD`), sorted chronologically with `newPatients` and `cumulativeTotal`.
9. **`condition-distribution`**: Categorization of patient diagnoses into primary clinical specialties (Cardiovascular, Neurology, Endocrinology, Orthopedics, Pediatrics, Oncology, Dermatology, Pulmonology, General Medicine) with `count` and `percentage`.
10. **`specialization-breakdown`**: Grouping by `specialization` with `doctorCount` and `patientCount` across hospital departments.

---

## 5. Security & Session Contract

- **Protocol**: REST over HTTPS in production, HTTP for local testing.
- **Session mechanism**: Secure JWT signed with `JWT_SECRET`, transmitted via HttpOnly, SameSite cookie named `doctor_tracker_token`.
- **CORS configuration**:
  - `origin`: Strict match for `FRONTEND_URL` (e.g. `http://localhost:8080` in local dev).
  - `credentials: true`.
- **Authorization**: Protected routes require `authMiddleware` that verifies the JWT from cookie or `Authorization: Bearer <token>` header, attaching `req.user`.
- **Error handling**: Uniform `{ message: string, errors?: Record<string, string[]> }` with appropriate HTTP status codes (400, 401, 403, 404, 409, 500).
