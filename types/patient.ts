import { patient } from "@/db/migrations/schema";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

// Use Drizzle's inferred types
export type Patient = InferSelectModel<typeof patient>;
export type NewPatient = InferInsertModel<typeof patient>;

// Frontend-friendly type (if you need the id as string)
export type PatientForFrontend = {
  id: string;
  name: string;
  email: string;
  dob: string;
  gender: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

// Module augmentation for @tanstack/react-table to allow custom meta properties
import { ColumnMeta } from '@tanstack/react-table';
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends unknown, TValue> {
    align?: 'left' | 'center' | 'right';
  }
}