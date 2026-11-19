"use client";

import React from "react";
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
import { createDoctorApi } from "@/lib/api/doctors";
import { toast } from "sonner";
import { Building2, Mail, Phone, Stethoscope, User } from "lucide-react";

interface AddDoctorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddDoctorDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddDoctorDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: "",
      specialization: "",
      hospital: "",
      phone: "",
      email: "",
      roomNumber: "",
    },
  });

  const onSubmit = async (data: DoctorFormData) => {
    try {
      await createDoctorApi(data);
      toast.success("Doctor Added", {
        description: `${data.name} has been added to the hospital roster.`,
      });
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error("Failed to Add Doctor", {
        description: err instanceof Error ? err.message : "An unexpected error occurred.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900">
            <Stethoscope className="h-5 w-5 text-primary" />
            Add New Doctor
          </DialogTitle>
          <DialogDescription>
            Register a physician profile into the hospital administration database.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-slate-400" />
              Doctor Full Name <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g. Dr. Mohammad Masud"
              error={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-[11px] font-medium text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Specialization & Hospital */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5 text-slate-400" />
                Specialization <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g. Cardiology"
                error={!!errors.specialization}
                {...register("specialization")}
              />
              {errors.specialization && (
                <p className="text-[11px] font-medium text-destructive">
                  {errors.specialization.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                Hospital Affiliation <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g. Square Hospital"
                error={!!errors.hospital}
                {...register("hospital")}
              />
              {errors.hospital && (
                <p className="text-[11px] font-medium text-destructive">
                  {errors.hospital.message}
                </p>
              )}
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                Phone Number <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g. +880 1711-000000"
                error={!!errors.phone}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-[11px] font-medium text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                Email Address <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                placeholder="doctor@hospital.com"
                error={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-[11px] font-medium text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Room / Chamber (Optional) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Room / Consultation Suite <span className="text-slate-400 text-[10px]">(Optional)</span>
            </label>
            <Input
              placeholder="e.g. Room 402, Block A"
              {...register("roomNumber")}
            />
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
              Create Doctor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

