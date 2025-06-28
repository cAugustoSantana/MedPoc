import { appointment } from "@/db/migrations/schema";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

// Use Drizzle's inferred types - this is the recommended approach
export type Appointment = InferSelectModel<typeof appointment>;
export type NewAppointment = InferInsertModel<typeof appointment>;

// Appointment form data type for the dialog
export interface AppointmentFormData {
  patientId: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  phone: string;
  notes: string;
  status: string;
}

// Type for appointments with joined data (when we need patient/doctor names)
export type AppointmentWithDetails = Appointment & {
  patientName: string | null;
  doctorName: string | null;
};

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends unknown, TValue> {
    align?: "left" | "center" | "right";
  }
}
