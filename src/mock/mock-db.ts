import {
  ConditionDistributionMetric,
  DashboardOverview,
  Doctor,
  DoctorQueryParams,
  PaginatedResponse,
  Patient,
  PatientQueryParams,
  PatientsPerDoctorMetric,
  PatientTrendPoint,
  SpecializationMetric,
  User,
} from "@/types";
import { INITIAL_DOCTORS, INITIAL_PATIENTS, INITIAL_USER } from "./initial-data";

const STORAGE_KEYS = {
  USER: "doctor_tracker_auth_user",
  AUTH_TOKEN: "doctor_tracker_mock_session",
  DOCTORS: "doctor_tracker_doctors_data",
  PATIENTS: "doctor_tracker_patients_data",
};

class MockDatabase {
  private isClient(): boolean {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  }

  // Auth Operations
  public getCurrentUser(): User | null {
    if (!this.isClient()) return INITIAL_USER;
    const session = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!session) return null;
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userJson) return INITIAL_USER;
    try {
      return JSON.parse(userJson) as User;
    } catch {
      return INITIAL_USER;
    }
  }

  public login(email: string): User {
    const user: User = {
      ...INITIAL_USER,
      email: email.trim().toLowerCase(),
    };
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, "mock_jwt_token_" + Date.now());
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
    return user;
  }

  public logout(): void {
    if (this.isClient()) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }

  // Doctor Operations
  public getRawDoctors(): Doctor[] {
    if (!this.isClient()) return INITIAL_DOCTORS;
    const stored = localStorage.getItem(STORAGE_KEYS.DOCTORS);
    if (!stored) {
      this.saveRawDoctors(INITIAL_DOCTORS);
      return INITIAL_DOCTORS;
    }
    try {
      return JSON.parse(stored) as Doctor[];
    } catch {
      return INITIAL_DOCTORS;
    }
  }

  public saveRawDoctors(doctors: Doctor[]): void {
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
    }
  }

  // Patient Operations
  public getRawPatients(): Patient[] {
    if (!this.isClient()) return INITIAL_PATIENTS;
    const stored = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    if (!stored) {
      this.saveRawPatients(INITIAL_PATIENTS);
      return INITIAL_PATIENTS;
    }
    try {
      return JSON.parse(stored) as Patient[];
    } catch {
      return INITIAL_PATIENTS;
    }
  }

  public saveRawPatients(patients: Patient[]): void {
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    }
  }

  // Query doctors with search, filters, pagination
  public queryDoctors(params: DoctorQueryParams = {}): PaginatedResponse<Doctor> {
    const allDoctors = this.getRawDoctors();
    const allPatients = this.getRawPatients();

    // Dynamically calculate current patient counts
    const doctorsWithCounts = allDoctors.map((doc) => {
      const pCount = allPatients.filter((p) => p.doctorId === doc.id).length;
      return { ...doc, patientCount: pCount };
    });

    let filtered = [...doctorsWithCounts];

    // Search filter (name, hospital, specialization, email)
    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.hospital.toLowerCase().includes(q) ||
          doc.specialization.toLowerCase().includes(q) ||
          doc.email.toLowerCase().includes(q) ||
          doc.phone.toLowerCase().includes(q)
      );
    }

    // Specialization filter
    if (params.specialization && params.specialization !== "all") {
      filtered = filtered.filter((doc) => doc.specialization.toLowerCase() === params.specialization?.toLowerCase());
    }

    // Hospital filter
    if (params.hospital && params.hospital !== "all") {
      filtered = filtered.filter((doc) => doc.hospital.toLowerCase().includes(params.hospital!.toLowerCase()));
    }

    // Date range filter
    if (params.startDate) {
      const start = new Date(params.startDate).getTime();
      filtered = filtered.filter((doc) => new Date(doc.createdAt).getTime() >= start);
    }
    if (params.endDate) {
      const end = new Date(params.endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((doc) => new Date(doc.createdAt).getTime() <= end.getTime());
    }

    // Sorting (default newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Number(params.limit) || 10);
    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / limit) || 1;
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return {
      data,
      pagination: {
        page,
        limit,
        totalPages,
        totalRecords,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  public getDoctorById(id: string): (Doctor & { patients: Patient[] }) | null {
    const doctors = this.getRawDoctors();
    const doc = doctors.find((d) => d.id === id);
    if (!doc) return null;

    const patients = this.getRawPatients().filter((p) => p.doctorId === id);
    return {
      ...doc,
      patientCount: patients.length,
      patients,
    };
  }

  public createDoctor(data: Omit<Doctor, "id" | "createdAt" | "patientCount">): Doctor {
    const doctors = this.getRawDoctors();
    const newDoctor: Doctor = {
      ...data,
      id: "doc_" + Date.now().toString(36),
      patientCount: 0,
      createdAt: new Date().toISOString(),
    };
    doctors.unshift(newDoctor);
    this.saveRawDoctors(doctors);
    return newDoctor;
  }

  public updateDoctor(id: string, updates: Partial<Doctor>): Doctor {
    const doctors = this.getRawDoctors();
    const index = doctors.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error(`Doctor with ID ${id} not found`);
    }
    const updated = {
      ...doctors[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    doctors[index] = updated;
    this.saveRawDoctors(doctors);

    // If doctor name or specialization changed, cascade update to patients
    if (updates.name || updates.specialization) {
      const patients = this.getRawPatients();
      let changed = false;
      const synced = patients.map((p) => {
        if (p.doctorId === id) {
          changed = true;
          return {
            ...p,
            doctorName: updates.name ?? p.doctorName,
            doctorSpecialization: updates.specialization ?? p.doctorSpecialization,
          };
        }
        return p;
      });
      if (changed) {
        this.saveRawPatients(synced);
      }
    }

    return updated;
  }

  public deleteDoctor(id: string): boolean {
    const doctors = this.getRawDoctors();
    const filtered = doctors.filter((d) => d.id !== id);
    if (filtered.length === doctors.length) return false;
    this.saveRawDoctors(filtered);

    // Keep patients or reassign if needed
    return true;
  }

  // Query patients with search, filters, pagination
  public queryPatients(params: PatientQueryParams = {}): PaginatedResponse<Patient> {
    const allPatients = this.getRawPatients();
    let filtered = [...allPatients];

    // Filter by Doctor ID
    if (params.doctorId && params.doctorId !== "all") {
      filtered = filtered.filter((p) => p.doctorId === params.doctorId);
    }

    // Filter by Condition
    if (params.condition && params.condition !== "all") {
      filtered = filtered.filter((p) =>
        p.condition.toLowerCase().includes(params.condition!.toLowerCase())
      );
    }

    // Filter by Status
    if (params.status) {
      filtered = filtered.filter((p) => p.status === params.status);
    }

    // Search filter (patient name, condition, phone, doctor name)
    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.condition.toLowerCase().includes(q) ||
          p.phone.toLowerCase().includes(q) ||
          (p.doctorName && p.doctorName.toLowerCase().includes(q))
      );
    }

    // Date range filter
    if (params.startDate) {
      const start = new Date(params.startDate).getTime();
      filtered = filtered.filter((p) => new Date(p.createdAt).getTime() >= start);
    }
    if (params.endDate) {
      const end = new Date(params.endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((p) => new Date(p.createdAt).getTime() <= end.getTime());
    }

    // Sorting (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Number(params.limit) || 10);
    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / limit) || 1;
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return {
      data,
      pagination: {
        page,
        limit,
        totalPages,
        totalRecords,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  public getPatientById(id: string): Patient | null {
    const patients = this.getRawPatients();
    return patients.find((p) => p.id === id) || null;
  }

  public createPatient(data: Omit<Patient, "id" | "createdAt">): Patient {
    const patients = this.getRawPatients();
    const doctors = this.getRawDoctors();
    const assignedDoc = doctors.find((d) => d.id === data.doctorId);

    const newPatient: Patient = {
      ...data,
      id: "pat_" + Date.now().toString(36),
      doctorName: assignedDoc ? assignedDoc.name : data.doctorName,
      doctorSpecialization: assignedDoc ? assignedDoc.specialization : data.doctorSpecialization,
      createdAt: new Date().toISOString(),
    };

    patients.unshift(newPatient);
    this.saveRawPatients(patients);
    return newPatient;
  }

  public updatePatient(id: string, updates: Partial<Patient>): Patient {
    const patients = this.getRawPatients();
    const index = patients.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Patient with ID ${id} not found`);
    }

    let doctorName = updates.doctorName;
    let doctorSpecialization = updates.doctorSpecialization;
    if (updates.doctorId && updates.doctorId !== patients[index].doctorId) {
      const doc = this.getRawDoctors().find((d) => d.id === updates.doctorId);
      if (doc) {
        doctorName = doc.name;
        doctorSpecialization = doc.specialization;
      }
    }

    const updated: Patient = {
      ...patients[index],
      ...updates,
      doctorName: doctorName ?? patients[index].doctorName,
      doctorSpecialization: doctorSpecialization ?? patients[index].doctorSpecialization,
      updatedAt: new Date().toISOString(),
    };

    patients[index] = updated;
    this.saveRawPatients(patients);
    return updated;
  }

  public deletePatient(id: string): boolean {
    const patients = this.getRawPatients();
    const filtered = patients.filter((p) => p.id !== id);
    if (filtered.length === patients.length) return false;
    this.saveRawPatients(filtered);
    return true;
  }

  // Dashboard Metrics & Visualizations
  public getDashboardOverview(): DashboardOverview {
    const doctors = this.getRawDoctors();
    const patients = this.getRawPatients();

    const totalDoctors = doctors.length;
    const totalPatients = patients.length;
    const patientsPerDoctor = totalDoctors > 0 ? Number((totalPatients / totalDoctors).toFixed(1)) : 0;
    const activePatients = patients.filter((p) => p.status === "Active" || p.status === "Under Observation").length;
    const criticalCases = patients.filter((p) => p.status === "Critical").length;

    // Last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentRegistrationsCount = patients.filter(
      (p) => new Date(p.createdAt).getTime() >= thirtyDaysAgo
    ).length;

    return {
      totalDoctors,
      totalPatients,
      patientsPerDoctor,
      activePatients,
      criticalCases,
      recentRegistrationsCount,
    };
  }

  public getPatientsPerDoctorMetrics(): PatientsPerDoctorMetric[] {
    const doctors = this.getRawDoctors();
    const patients = this.getRawPatients();

    return doctors
      .map((doc) => {
        const count = patients.filter((p) => p.doctorId === doc.id).length;
        return {
          doctorId: doc.id,
          doctorName: doc.name,
          specialization: doc.specialization,
          hospital: doc.hospital,
          patientCount: count,
        };
      })
      .sort((a, b) => b.patientCount - a.patientCount);
  }

  public getPatientRegistrationTrends(): PatientTrendPoint[] {
    const patients = this.getRawPatients();

    // Group registrations by month-day
    const sorted = [...patients].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const dateMap = new Map<string, number>();
    sorted.forEach((p) => {
      const d = new Date(p.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
      dateMap.set(key, (dateMap.get(key) || 0) + 1);
    });

    let runningTotal = 0;
    const trendPoints: PatientTrendPoint[] = [];

    dateMap.forEach((count, key) => {
      runningTotal += count;
      const [year, month, day] = key.split("-").map(Number);
      const dateObj = new Date(year, month - 1, day);
      const formatted = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      trendPoints.push({
        date: key,
        formattedDate: formatted,
        newPatients: count,
        cumulativeTotal: runningTotal,
      });
    });

    return trendPoints;
  }

  public getConditionDistribution(): ConditionDistributionMetric[] {
    const patients = this.getRawPatients();
    if (patients.length === 0) return [];

    // Group conditions into clinical categories
    const categoryKeywords: Record<string, string> = {
      cardiology: "Cardiovascular",
      coronary: "Cardiovascular",
      hypertens: "Cardiovascular",
      arrhythmia: "Cardiovascular",
      stenosis: "Cardiovascular",
      angina: "Cardiovascular",
      pericarditis: "Cardiovascular",
      stroke: "Neurology",
      migraine: "Neurology",
      parkinson: "Neurology",
      epilepsy: "Neurology",
      neuropathy: "Neurology",
      diabet: "Endocrinology",
      thyroid: "Endocrinology",
      pcos: "Endocrinology",
      fracture: "Orthopedics",
      osteoarthritis: "Orthopedics",
      herniation: "Orthopedics",
      tendinopathy: "Orthopedics",
      bronchiolitis: "Pediatrics",
      asthma: "Pediatrics & Pulmonology",
      malnutrition: "Pediatrics",
      hyperbilirubinemia: "Pediatrics",
      carcinoma: "Oncology",
      lymphoma: "Oncology",
      psoriasis: "Dermatology",
      acne: "Dermatology",
      copd: "Pulmonology",
      tuberculosis: "Pulmonology",
      fibrosis: "Pulmonology",
    };

    const countMap: Record<string, number> = {};

    patients.forEach((p) => {
      const condLower = p.condition.toLowerCase();
      let matchedCategory = "General Medicine";

      for (const [key, category] of Object.entries(categoryKeywords)) {
        if (condLower.includes(key)) {
          matchedCategory = category;
          break;
        }
      }

      countMap[matchedCategory] = (countMap[matchedCategory] || 0) + 1;
    });

    const total = patients.length;
    const colors = [
      "#0284C7", // Sky blue
      "#0D9488", // Teal
      "#6366F1", // Indigo
      "#F59E0B", // Amber
      "#EC4899", // Pink
      "#10B981", // Emerald
      "#8B5CF6", // Purple
      "#64748B", // Slate
    ];

    return Object.entries(countMap)
      .map(([condition, count], index) => ({
        condition,
        count,
        percentage: Number(((count / total) * 100).toFixed(1)),
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.count - a.count);
  }

  public getSpecializationBreakdown(): SpecializationMetric[] {
    const doctors = this.getRawDoctors();
    const patients = this.getRawPatients();

    const specMap = new Map<string, { doctorCount: number; patientCount: number }>();

    doctors.forEach((doc) => {
      const spec = doc.specialization;
      const current = specMap.get(spec) || { doctorCount: 0, patientCount: 0 };
      current.doctorCount += 1;
      const assigned = patients.filter((p) => p.doctorId === doc.id).length;
      current.patientCount += assigned;
      specMap.set(spec, current);
    });

    return Array.from(specMap.entries()).map(([specialization, stats]) => ({
      specialization,
      doctorCount: stats.doctorCount,
      patientCount: stats.patientCount,
    }));
  }

  public resetToInitial(): void {
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
    }
  }
}

export const mockDb = new MockDatabase();

