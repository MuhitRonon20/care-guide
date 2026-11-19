"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormSchema, PatientFormData } from "@/lib/validations/patient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updatePatientApi } from "@/lib/api/patients";
import { useQuery } from "@tanstack/react-query";
import { getDoctorsApi } from "@/lib/api/doctors";
import { Patient, PatientStatus } from "@/types";
import { toast } from "sonner";
import { Edit3 } from "lucide-react";

interface EditPatientDialogProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditPatientDialog({
  patient,
  open,
  onOpenChange,
  onSuccess,
}: EditPatientDialogProps) {
  const { data: doctorsData } = useQuery({
    queryKey: ["doctors", "dropdown-list"],
    queryFn: () => getDoctorsApi({ limit: 100 }),
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
  });

  const selectedDoctorId = watch("doctorId");
  const selectedGender = watch("gender");
  const selectedStatus = watch("status");

  useEffect(() => {
    if (patient) {
      reset({
        name: patient.name,
        doctorId: patient.doctorId,
        condition: patient.condition,
        phone: patient.phone,
        email: patient.email || "",
        age: patient.age,
        gender: patient.gender,
        status: patient.status,
        bloodGroup: patient.bloodGroup || "O+",
        notes: patient.notes || "",
      });
    }
  }, [patient, reset]);

  const onSubmit = async (data: PatientFormData) => {
    if (!patient) return;
    try {
      await updatePatientApi(patient.id, data);
      toast.success("Patient Updated", {
        description: `Clinical profile for ${data.name} has been updated.`,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error("Update Failed", {
        description: err instanceof Error ? err.message : "Could not update patient.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900">
            <Edit3 className="h-5 w-5 text-primary" />
            Edit Patient Information
          </DialogTitle>
          <DialogDescription>
            Update clinical condition, attending doctor allocation, or contact details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Patient Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Patient Full Name</label>
            <Input error={!!errors.name} {...register("name")} />
            {errors.name && (
              <p className="text-[11px] font-medium text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Assigned Doctor */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Assigned Physician</label>
            <Select
              value={selectedDoctorId}
              onValueChange={(val) => setValue("doctorId", val, { shouldValidate: true })}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select doctor..." />
              </SelectTrigger>
              <SelectContent>
                {doctorsData?.data.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>
                    {doc.name} ({doc.specialization})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.doctorId && (
              <p className="text-[11px] font-medium text-destructive">{errors.doctorId.message}</p>
            )}
          </div>

          {/* Condition */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Clinical Condition</label>
            <Input error={!!errors.condition} {...register("condition")} />
            {errors.condition && (
              <p className="text-[11px] font-medium text-destructive">{errors.condition.message}</p>
            )}
          </div>

          {/* Age, Gender & Status */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Age</label>
              <Input
                type="number"
                min="0"
                max="130"
                error={!!errors.age}
                {...register("age", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Gender</label>
              <Select
                value={selectedGender}
                onValueChange={(val) => setValue("gender", val as "Male" | "Female" | "Other")}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Status</label>
              <Select
                value={selectedStatus}
                onValueChange={(val) => setValue("status", val as PatientStatus)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Under Observation">Under Observation</SelectItem>
                  <SelectItem value="Recovered">Recovered</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Phone</label>
              <Input error={!!errors.phone} {...register("phone")} />
              {errors.phone && (
                <p className="text-[11px] font-medium text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email</label>
              <Input type="email" {...register("email")} />
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
