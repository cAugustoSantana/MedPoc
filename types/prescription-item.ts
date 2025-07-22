import { prescriptionItem } from "@/db/migrations/schema";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export type PrescriptionItem = InferSelectModel<typeof prescriptionItem>;
export type NewPrescriptionItem = InferInsertModel<typeof prescriptionItem>; 