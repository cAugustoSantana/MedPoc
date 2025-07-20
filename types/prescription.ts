import { prescription } from "@/db/migrations/schema";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export type Prescription = InferSelectModel<typeof prescription>;
export type NewPrescription = InferInsertModel<typeof prescription>;

export interface PrescriptionFormData {
  patientId: string;
  doctorId: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
}

