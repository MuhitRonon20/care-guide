"use client";

import React, { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDoctorByIdApi } from "@/lib/api/doctors";
import { deletePatientApi } from "@/lib/api/patients";
import { Patient } from "@/types";
import { DoctorProfileHeader } from "@/components/doctors/doctor-profile-header";
import { DoctorPatientList } from "@/components/doctors/doctor-patient-list";
import { EditDoctorDialog } from "@/components/doctors/edit-doctor-dialog";
import { AddPatientDialog } from "@/components/patients/add-patient-dialog";
import { EditPatientDialog } from "@/components/patients/edit-patient-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { MotionFade } from "@/components/shared/motion-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { toast } from "sonner";

interface DoctorDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function DoctorDetailsPage({ params }: DoctorDetailsPageProps) {
  const resolvedParams = use(params);
  const doctorId = resolvedParams.id;
  const queryClient = useQueryClient();

  // State for dialogs
  const [isEditDoctorOpen, setIsEditDoctorOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);

  // Fetch doctor data including associated patients
  const {
    data: doctor,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["doctors", doctorId],
    queryFn: () => getDoctorByIdApi(doctorId),
  });

  // Delete patient mutation
  const deletePatientMutation = useMutation({
    mutationFn: (patientId: string) => deletePatientApi(patientId),
    onSuccess: () => {
      toast.success("Patient Removed", {
        description: `${deletingPatient?.name} has been removed from this doctor's patient list.`,
      });
      setDeletingPatient(null);
      queryClient.invalidateQueries({ queryKey: ["doctors", doctorId] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (err) => {
      toast.error("Failed to Remove Patient", {
        description: err instanceof Error ? err.message : "An error occurred.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-52 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !doctor) {
    return (
      <div className="py-8">
        <ErrorState
          title="Doctor Not Found"
          message="Could not find a physician matching the requested identifier."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <MotionFade className="space-y-6">
      {/* Profile Header Card */}
      <DoctorProfileHeader
        doctor={doctor}
        onEdit={() => setIsEditDoctorOpen(true)}
        onAddPatient={() => setIsAddPatientOpen(true)}
      />

      {/* Associated Patients Caseload */}
      <DoctorPatientList
        doctorName={doctor.name}
        patients={doctor.patients || []}
        onAddPatient={() => setIsAddPatientOpen(true)}
        onEditPatient={(patient) => setEditingPatient(patient)}
        onDeletePatient={(patient) => setDeletingPatient(patient)}
      />

      {/* Edit Doctor Dialog */}
      <EditDoctorDialog
        doctor={doctor}
        open={isEditDoctorOpen}
        onOpenChange={setIsEditDoctorOpen}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["doctors", doctorId] });
          queryClient.invalidateQueries({ queryKey: ["doctors"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }}
      />

      {/* Add Patient under Doctor Dialog */}
      <AddPatientDialog
        open={isAddPatientOpen}
        onOpenChange={setIsAddPatientOpen}
        defaultDoctorId={doctor.id}
        defaultDoctorName={doctor.name}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["doctors", doctorId] });
          queryClient.invalidateQueries({ queryKey: ["doctors"] });
          queryClient.invalidateQueries({ queryKey: ["patients"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }}
      />

      {/* Edit Patient Dialog */}
      <EditPatientDialog
        patient={editingPatient}
        open={!!editingPatient}
        onOpenChange={(open) => !open && setEditingPatient(null)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["doctors", doctorId] });
          queryClient.invalidateQueries({ queryKey: ["doctors"] });
          queryClient.invalidateQueries({ queryKey: ["patients"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }}
      />

      {/* Delete Patient Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingPatient}
        onOpenChange={(open) => !open && setDeletingPatient(null)}
        title="Remove Patient from Doctor"
        description={`Are you sure you want to remove patient ${deletingPatient?.name} from ${doctor.name}'s care list?`}
        confirmLabel="Yes, Remove Patient"
        onConfirm={() => {
          if (deletingPatient) {
            deletePatientMutation.mutate(deletingPatient.id);
          }
        }}
        isLoading={deletePatientMutation.isPending}
      />
    </MotionFade>
  );
}

