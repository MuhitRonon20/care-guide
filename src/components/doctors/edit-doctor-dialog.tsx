"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doctorFormSchema, DoctorFormData } from "@/lib/validations/doctor";
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
import { updateDoctorApi } from "@/lib/api/doctors";
import { Doctor } from "@/types";
import { toast } from "sonner";
import { Edit3 } from "lucide-react";

interface EditDoctorDialogProps {
  doctor: Doctor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditDoctorDialog({
  doctor,
  open,
  onOpenChange,
  onSuccess,
}: EditDoctorDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorFormSchema),
  });

  useEffect(() => {
    if (doctor) {
      reset({
        name: doctor.name,
        specialization: doctor.specialization,
        hospital: doctor.hospital,
        phone: doctor.phone,
        email: doctor.email,
        roomNumber: doctor.roomNumber || "",
      });
    }
  }, [doctor, reset]);

  const onSubmit = async (data: DoctorFormData) => {
    if (!doctor) return;
    try {
      await updateDoctorApi(doctor.id, data);
      toast.success("Doctor Updated", {
        description: `Information for ${data.name} has been updated.`,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error("Update Failed", {
        description: err instanceof Error ? err.message : "Could not update doctor.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900">
            <Edit3 className="h-5 w-5 text-primary" />
            Edit Doctor Details
          </DialogTitle>
          <DialogDescription>
            Modify professional details and contact information for this doctor.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Doctor Full Name</label>
            <Input error={!!errors.name} {...register("name")} />
            {errors.name && (
              <p className="text-[11px] font-medium text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Specialization</label>
              <Input error={!!errors.specialization} {...register("specialization")} />
              {errors.specialization && (
                <p className="text-[11px] font-medium text-destructive">
                  {errors.specialization.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Hospital Affiliation</label>
              <Input error={!!errors.hospital} {...register("hospital")} />
              {errors.hospital && (
                <p className="text-[11px] font-medium text-destructive">
                  {errors.hospital.message}
                </p>
              )}
            </div>
          </div>

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
              <Input type="email" error={!!errors.email} {...register("email")} />
              {errors.email && (
                <p className="text-[11px] font-medium text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Room / Chamber Suite</label>
            <Input {...register("roomNumber")} />
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
