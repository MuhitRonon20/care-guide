"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPatientsApi, deletePatientApi } from "@/lib/api/patients";
import { Patient, PatientQueryParams, PatientStatus } from "@/types";
import { PatientToolbar } from "@/components/patients/patient-toolbar";
import { PatientTable } from "@/components/patients/patient-table";
import { AddPatientDialog } from "@/components/patients/add-patient-dialog";
import { EditPatientDialog } from "@/components/patients/edit-patient-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataPagination } from "@/components/shared/data-pagination";
import { Button } from "@/components/ui/button";
import { MotionFade } from "@/components/shared/motion-wrapper";
import { ErrorState } from "@/components/shared/error-state";
import { toast } from "sonner";
import { Plus, Users } from "lucide-react";

export default function PatientsPage() {
  const queryClient = useQueryClient();

  // Query Params state
  const [params, setParams] = useState<PatientQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    condition: "all",
    doctorId: "all",
    status: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  // Dialog states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);

  // TanStack Query for Patients
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["patients", params],
    queryFn: () => getPatientsApi(params),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePatientApi(id),
    onSuccess: () => {
      toast.success("Patient Record Deleted", {
        description: `${deletingPatient?.name} has been removed from the registry.`,
      });
      setDeletingPatient(null);
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (err) => {
      toast.error("Deletion Failed", {
        description: err instanceof Error ? err.message : "An error occurred.",
      });
    },
  });

  const handleSearchChange = (search: string) => {
    setParams((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleConditionChange = (condition: string) => {
    setParams((prev) => ({ ...prev, condition, page: 1 }));
  };

  const handleDoctorChange = (doctorId: string) => {
    setParams((prev) => ({ ...prev, doctorId, page: 1 }));
  };

  const handleStatusChange = (status: string) => {
    setParams((prev) => ({
      ...prev,
      status: status === "all" ? undefined : (status as PatientStatus),
      page: 1,
    }));
  };

  const handleDateChange = (startDate?: string, endDate?: string) => {
    setParams((prev) => ({ ...prev, startDate, endDate, page: 1 }));
  };

  const handleResetFilters = () => {
    setParams({
      page: 1,
      limit: 10,
      search: "",
      condition: "all",
      doctorId: "all",
      status: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  return (
    <MotionFade className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl flex items-center gap-2.5">
            <Users className="h-7 w-7 text-primary" />
            Patient Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Centralized registry of admitted patients, clinical condition tracking, and physician assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="h-9 gap-1.5 text-xs shadow-sm shadow-primary/20"
          >
            <Plus className="h-4 w-4" />
            Enroll Patient
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <PatientToolbar
        search={params.search || ""}
        onSearchChange={handleSearchChange}
        condition={params.condition || "all"}
        onConditionChange={handleConditionChange}
        doctorId={params.doctorId || "all"}
        onDoctorChange={handleDoctorChange}
        status={params.status || "all"}
        onStatusChange={handleStatusChange}
        startDate={params.startDate}
        endDate={params.endDate}
        onDateChange={handleDateChange}
        onResetFilters={handleResetFilters}
        totalResults={data?.pagination.totalRecords}
        isLoading={isLoading}
      />

      {/* Table / Error State */}
      {isError ? (
        <ErrorState
          title="Failed to Load Patients"
          message="Could not retrieve patient records. Please check the network integration."
          onRetry={() => refetch()}
        />
      ) : (
        <div className="space-y-4">
          <PatientTable
            patients={data?.data || []}
            isLoading={isLoading}
            onEdit={(p) => setEditingPatient(p)}
            onDelete={(p) => setDeletingPatient(p)}
            onAddNewPatient={() => setIsAddOpen(true)}
          />

          {data && (
            <DataPagination
              page={data.pagination.page}
              limit={data.pagination.limit}
              totalRecords={data.pagination.totalRecords}
              totalPages={data.pagination.totalPages}
              onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
              onLimitChange={(limit) => setParams((prev) => ({ ...prev, limit, page: 1 }))}
              isLoading={isLoading}
            />
          )}
        </div>
      )}

      {/* Add Patient Dialog */}
      <AddPatientDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["patients"] });
          queryClient.invalidateQueries({ queryKey: ["doctors"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }}
      />

      {/* Edit Patient Dialog */}
      <EditPatientDialog
        patient={editingPatient}
        open={!!editingPatient}
        onOpenChange={(open) => !open && setEditingPatient(null)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["patients"] });
          queryClient.invalidateQueries({ queryKey: ["doctors"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingPatient}
        onOpenChange={(open) => !open && setDeletingPatient(null)}
        title="Delete Patient Record"
        description={`Are you sure you want to permanently delete the clinical record for ${deletingPatient?.name}? This action cannot be undone.`}
        confirmLabel="Yes, Delete Record"
        onConfirm={() => {
          if (deletingPatient) {
            deleteMutation.mutate(deletingPatient.id);
          }
        }}
        isLoading={deleteMutation.isPending}
      />
    </MotionFade>
  );
}

