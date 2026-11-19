import { z } from "zod";

export const patientFormSchema = z.object({
  name: z
    .string()
    .min(2, "Patient name must be at least 2 characters")
    .max(100, "Patient name cannot exceed 100 characters"),
  doctorId: z
    .string()
    .min(1, "Please select an assigned doctor"),
  condition: z
    .string()
    .min(2, "Medical condition is required")
    .max(100, "Condition description cannot exceed 100 characters"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 characters")
    .max(20, "Phone number cannot exceed 20 characters")
    .regex(/^[+0-9\s()-]+$/, "Invalid phone number format"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  age: z
    .number()
    .min(0, "Age cannot be negative")
    .max(130, "Age cannot exceed 130"),
  gender: z.enum(["Male", "Female", "Other"]),
  status: z.enum(["Active", "Under Observation", "Recovered", "Critical"]),
  bloodGroup: z.string().optional(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export type PatientFormData = z.infer<typeof patientFormSchema>;
