import { z } from "zod";

export const doctorFormSchema = z.object({
  name: z
    .string()
    .min(2, "Doctor name must be at least 2 characters")
    .max(100, "Doctor name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s.,'-]+$/, "Name can only contain letters, spaces, and punctuation"),
  specialization: z
    .string()
    .min(2, "Specialization is required")
    .max(80, "Specialization cannot exceed 80 characters"),
  hospital: z
    .string()
    .min(2, "Hospital name is required")
    .max(120, "Hospital name cannot exceed 120 characters"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 characters")
    .max(20, "Phone number cannot exceed 20 characters")
    .regex(/^[+0-9\s()-]+$/, "Invalid phone number format"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  roomNumber: z.string().max(20).optional(),
});

export type DoctorFormData = z.infer<typeof doctorFormSchema>;

