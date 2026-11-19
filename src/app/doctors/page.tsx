"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDoctorsApi, deleteDoctorApi } from "@/lib/api/doctors";
import { Doctor, DoctorQueryParams } from "@/types";
import { DoctorToolbar } from "@/components/doctors/doctor-toolbar";
import { DoctorTable } from "@/components/doctors/doctor-table";
import { AddDoctorDialog } from "@/components/doctors/add-doctor-dialog";
import { EditDoctorDialog } from "@/components/doctors/edit-doctor-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataPagination } from "@/components/shared/data-pagination";
import { Button } from "@/components/ui/button";
import { MotionFade } from "@/components/shared/motion-wrapper";
import { ErrorState } from "@/components/shared/error-state";
import { toast } from "sonner";
import { Plus, Stethoscope } from "lucide-react";

export default function DoctorsPage() {
  const queryClient = useQueryClient();

  // Query Params state
  const [params, setParams] = useState<DoctorQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    specialization: "all",
    startDate: undefined,
    endDate: undefined,
  });

  // Dialog states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deletingDoctor, setDeletingDoctor] = useState<Doctor | null>(null);

  // TanStack Query for Doctors
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["doctors", params],
    queryFn: () => getDoctorsApi(params),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDoctorApi(id),
    onSuccess: () => {
      toast.success("Doctor Deleted", {
        description: `${deletingDoctor?.name} has been removed from the directory.`,
      });
      setDeletingDoctor(null);
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (err) => {
      toast.error("Failed to Delete Doctor", {
        description: err instanceof Error ? err.message : "An error occurred.",
      });
    },
  });

  const handleSearchChange = (search: string) => {
    setParams((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleSpecializationChange = (specialization: string) => {
    setParams((prev) => ({ ...prev, specialization, page: 1 }));
  };

  const handleDateChange = (startDate?: string, endDate?: string) => {
    setParams((prev) => ({ ...prev, startDate, endDate, page: 1 }));
  };

  const handleResetFilters = () => {
    setParams({
      page: 1,
      limit: 10,
      search: "",
      specialization: "all",
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
            <Stethoscope className="h-7 w-7 text-primary" />
            Doctor Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage certified medical practitioners, departmental affiliations, and allocated patient caseloads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="h-9 gap-1.5 text-xs shadow-sm shadow-primary/20"
          >
            <Plus className="h-4 w-4" />
            Add Doctor
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <DoctorToolbar
        search={params.search || ""}
        onSearchChange={handleSearchChange}
        specialization={params.specialization || "all"}
        onSpecializationChange={handleSpecializationChange}
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
          title="Failed to Load Doctors"
          message="Could not retrieve doctor records. Please check the network integration."
          onRetry={() => refetch()}
        />
      ) : (
        <div className="space-y-4">
          <DoctorTable
            doctors={data?.data || []}
            isLoading={isLoading}
            onEdit={(doc) => setEditingDoctor(doc)}
            onDelete={(doc) => setDeletingDoctor(doc)}
            onAddNewDoctor={() => setIsAddOpen(true)}
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

      {/* Add Doctor Dialog */}
      <AddDoctorDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["doctors"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }}
      />

      {/* Edit Doctor Dialog */}
      <EditDoctorDialog
        doctor={editingDoctor}
        open={!!editingDoctor}
        onOpenChange={(open) => !open && setEditingDoctor(null)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["doctors"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingDoctor}
        onOpenChange={(open) => !open && setDeletingDoctor(null)}
        title="Delete Doctor Record"
        description={`Are you sure you want to delete ${deletingDoctor?.name}? This action will permanently remove this physician profile from the roster.`}
        confirmLabel="Yes, Delete Doctor"
        onConfirm={() => {
          if (deletingDoctor) {
            deleteMutation.mutate(deletingDoctor.id);
          }
        }}
        isLoading={deleteMutation.isPending}
      />
    </MotionFade>
  );
}
