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
import { createPatientApi } from "@/lib/api/patients";
import { useQuery } from "@tanstack/react-query";
import { getDoctorsApi } from "@/lib/api/doctors";
import { PatientStatus } from "@/types";
import { toast } from "sonner";
import { HeartPulse, Stethoscope, User, Phone, Mail } from "lucide-react";

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDoctorId?: string;
  defaultDoctorName?: string;
  onSuccess?: () => void;
}

const COMMON_CONDITIONS = [
  "Coronary Artery Disease",
  "Hypertensive Heart Disease",
  "Type 2 Diabetes Mellitus",
  "Ischemic Stroke Rehabilitation",
  "Chronic Refractory Migraine",
  "Severe Knee Osteoarthritis",
  "Lumbar Disc Herniation",
  "Childhood Asthma Exacerbation",
  "Acute Bronchiolitis",
  "Colorectal Adenocarcinoma",
  "Invasive Ductal Breast Carcinoma",
  "Plaque Psoriasis",
  "Chronic Obstructive Pulmonary Disease",
  "Pulmonary Tuberculosis",
];

export function AddPatientDialog({
  open,
  onOpenChange,
  defaultDoctorId,
  defaultDoctorName,
  onSuccess,
}: AddPatientDialogProps) {
  // Fetch doctors list for doctor selector dropdown
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
    defaultValues: {
      name: "",
      doctorId: defaultDoctorId || "",
      condition: "",
      phone: "",
      email: "",
      age: 40,
      gender: "Male",
      status: "Active",
      bloodGroup: "O+",
      notes: "",
    },
  });

  const selectedDoctorId = watch("doctorId");
  const selectedGender = watch("gender");
  const selectedStatus = watch("status");

  useEffect(() => {
    if (defaultDoctorId) {
      setValue("doctorId", defaultDoctorId);
    }
  }, [defaultDoctorId, setValue]);

  const onSubmit = async (data: PatientFormData) => {
    try {
      await createPatientApi(data);
      toast.success("Patient Registered", {
        description: `${data.name} has been enrolled into clinical tracking.`,
      });
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error("Registration Failed", {
        description: err instanceof Error ? err.message : "Could not create patient.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900">
            <HeartPulse className="h-5 w-5 text-primary" />
            {defaultDoctorName ? `Assign Patient to ${defaultDoctorName}` : "Register New Patient"}
          </DialogTitle>
          <DialogDescription>
            Record patient demographics, medical condition diagnosis, and doctor assignment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Patient Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-slate-400" />
              Patient Full Name <span className="text-destructive">*</span>
            </label>
            <Input placeholder="e.g. Mohammad Jahangir" error={!!errors.name} {...register("name")} />
            {errors.name && (
              <p className="text-[11px] font-medium text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Assigned Doctor Selection */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Stethoscope className="h-3.5 w-3.5 text-slate-400" />
              Attending Physician <span className="text-destructive">*</span>
            </label>
            {defaultDoctorId && defaultDoctorName ? (
              <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium flex items-center justify-between">
                <span>{defaultDoctorName}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Locked</span>
              </div>
            ) : (
              <Select
                value={selectedDoctorId}
                onValueChange={(val) => setValue("doctorId", val, { shouldValidate: true })}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select a physician..." />
                </SelectTrigger>
                <SelectContent>
                  {doctorsData?.data.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.name} ({doc.specialization})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.doctorId && (
              <p className="text-[11px] font-medium text-destructive">{errors.doctorId.message}</p>
            )}
          </div>

          {/* Clinical Condition */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <HeartPulse className="h-3.5 w-3.5 text-slate-400" />
                Medical Condition / Diagnosis <span className="text-destructive">*</span>
              </label>
              <span className="text-[10px] text-muted-foreground">Select or type custom</span>
            </div>
            <Input
              placeholder="e.g. Hypertensive Heart Disease"
              list="conditions-list"
              error={!!errors.condition}
              {...register("condition")}
            />
            <datalist id="conditions-list">
              {COMMON_CONDITIONS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {errors.condition && (
              <p className="text-[11px] font-medium text-destructive">{errors.condition.message}</p>
            )}
          </div>

          {/* Age, Gender & Status */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Age <span className="text-destructive">*</span></label>
              <Input
                type="number"
                min="0"
                max="130"
                error={!!errors.age}
                {...register("age", { valueAsNumber: true })}
              />
              {errors.age && (
                <p className="text-[10px] font-medium text-destructive">{errors.age.message}</p>
              )}
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
              <label className="text-xs font-semibold text-slate-700">Clinical Status</label>
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
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                Contact Phone <span className="text-destructive">*</span>
              </label>
              <Input placeholder="+880 1711-000000" error={!!errors.phone} {...register("phone")} />
              {errors.phone && (
                <p className="text-[11px] font-medium text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                Email Address <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
              </label>
              <Input type="email" placeholder="patient@example.com" {...register("email")} />
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
              Enroll Patient
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
