import { prescriptionItem } from '@/db/migrations/schema';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type PrescriptionItem = InferSelectModel<typeof prescriptionItem>;
export type NewPrescriptionItem = InferInsertModel<typeof prescriptionItem>;

// Extended type for prescription items with joined data (used in PDF generation)
export interface PrescriptionItemWithDetails extends PrescriptionItem {
  drugName: string | null;
  drugDosageForm: string | null;
  drugStrength: string | null;
  dosageDescription: string | null;
  frequencyDescription: string | null;
}
