import { patient } from "@/db/migrations/schema";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

// Use Drizzle's inferred types
export type Patient = InferSelectModel<typeof patient>;
export type NewPatient = InferInsertModel<typeof patient>;

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends unknown, TValue> {
    align?: "left" | "center" | "right";
  }
}
