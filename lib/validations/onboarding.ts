import { z } from 'zod';

export const onboardingSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val), {
      message: 'Please enter a valid phone number',
    }),

  role: z.string().min(1, 'Please select a role'),

  specialty: z.string().min(1, 'Please select a specialty'),

  documentType: z.string().min(1, 'Please select a document type'),

  documentNumber: z
    .string()
    .min(3, 'Document number must be at least 3 characters')
    .max(50, 'Document number must be less than 50 characters')
    .regex(
      /^[a-zA-Z0-9\-\s]+$/,
      'Document number can only contain letters, numbers, hyphens, and spaces'
    ),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

// Step-specific validation schemas
export const step1Schema = onboardingSchema.pick({ name: true, phone: true });
export const step2Schema = onboardingSchema.pick({ role: true });
export const step3Schema = onboardingSchema.pick({ specialty: true });
export const step4Schema = onboardingSchema.pick({
  documentType: true,
  documentNumber: true,
});

// Validation functions for each step
export const validateStep1 = (data: Partial<OnboardingFormData>) => {
  const result = step1Schema.safeParse(data);
  return result.success
    ? { success: true }
    : { success: false, errors: result.error.flatten().fieldErrors };
};

export const validateStep2 = (data: Partial<OnboardingFormData>) => {
  const result = step2Schema.safeParse(data);
  return result.success
    ? { success: true }
    : { success: false, errors: result.error.flatten().fieldErrors };
};

export const validateStep3 = (data: Partial<OnboardingFormData>) => {
  const result = step3Schema.safeParse(data);
  return result.success
    ? { success: true }
    : { success: false, errors: result.error.flatten().fieldErrors };
};

export const validateStep4 = (data: Partial<OnboardingFormData>) => {
  const result = step4Schema.safeParse(data);
  return result.success
    ? { success: true }
    : { success: false, errors: result.error.flatten().fieldErrors };
};
