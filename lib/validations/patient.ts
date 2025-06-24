import { z } from "zod";

// Base patient schema for validation
export const patientSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  dob: z.string().optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other"]).optional().or(z.literal("")),
  phone: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => {
      if (!val) return true; // Allow empty
      const digitsOnly = val.replace(/\D/g, ""); // Remove non-digits
      return digitsOnly.length === 10;
    }, "Phone number must be exactly 10 digits"),
  address: z.string().optional().or(z.literal("")),
});

// Schema for creating a new patient (all fields optional except name)
export const createPatientSchema = patientSchema.extend({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
});

// Schema for updating a patient (all fields optional)
export const updatePatientSchema = patientSchema.partial();

// Type inference from schemas
export type PatientFormData = z.infer<typeof patientSchema>;
export type CreatePatientData = z.infer<typeof createPatientSchema>;
export type UpdatePatientData = z.infer<typeof updatePatientSchema>;

// Validation functions
export function validateCreatePatient(
  data: unknown,
):
  | { success: true; data: CreatePatientData }
  | { success: false; errors: string[] } {
  const result = createPatientSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.errors.map((err: any) => err.message),
  };
}

export function validateUpdatePatient(
  data: unknown,
):
  | { success: true; data: UpdatePatientData }
  | { success: false; errors: string[] } {
  const result = updatePatientSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.errors.map((err: any) => err.message),
  };
}
