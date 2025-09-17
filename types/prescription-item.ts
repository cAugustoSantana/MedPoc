import { prescriptionItem } from '@/db/migrations/schema';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type PrescriptionItem = InferSelectModel<typeof prescriptionItem>;
export type NewPrescriptionItem = InferInsertModel<typeof prescriptionItem>;

// Type alias for prescription items with details (used in PDF generation)
// Since we simplified the schema, this is now just an alias for PrescriptionItem
export type PrescriptionItemWithDetails = PrescriptionItem;
