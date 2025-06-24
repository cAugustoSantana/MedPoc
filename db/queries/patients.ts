import { Patient, NewPatient, PatientForFrontend } from "@/types/patient";
import { db } from "../index";
import { patient } from "../migrations/schema";
import { eq } from "drizzle-orm";

export async function getAllPatients(): Promise<Patient[]> {
  const patients = await db.select().from(patient);
  console.log("Fetched patients:", patients);
  return patients;
}

export async function createPatient(newPatient: NewPatient): Promise<Patient> {
  const createdPatient = await db.insert(patient).values(newPatient).returning();
  console.log("Created patient:", createdPatient);
  return createdPatient[0];
}

export async function updatePatient(id: number, updatedPatient: Partial<NewPatient>): Promise<Patient> {
  const updatedPatientResult = await db.update(patient).set(updatedPatient).where(eq(patient.patientId, id)).returning();
  console.log("Updated patient:", updatedPatientResult);
  return updatedPatientResult[0];
}

export async function deletePatient(id: number): Promise<Patient> {
  const deletedPatient = await db.delete(patient).where(eq(patient.patientId, id)).returning();
  console.log("Deleted patient:", deletedPatient);
  return deletedPatient[0];
}

// If you need a frontend-friendly version with string ID, you can add this utility function
export function toFrontendPatient(dbPatient: Patient): PatientForFrontend {
  return {
    id: dbPatient.patientId.toString(),
    name: dbPatient.name,
    email: dbPatient.email ?? '',
    dob: dbPatient.dob?.toString() ?? '',
    gender: dbPatient.gender ?? '',
    phone: dbPatient.phone ?? '',
    address: dbPatient.address ?? '',
    createdAt: dbPatient.createdAt ?? '',
    updatedAt: dbPatient.updatedAt ?? '',
  };
}
