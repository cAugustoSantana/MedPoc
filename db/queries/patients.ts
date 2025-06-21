import { Patient } from "@/types/patient";
import { db } from "../index";
import { patient } from "../migrations/schema";
import { eq } from "drizzle-orm";

export async function getAllPatients(): Promise<Patient[]> {
  const patients = await db.select().from(patient);
  console.log("Fetched patients:", patients);
  const patientsData: Patient[] = patients.map((patient) => ({
    id: patient.patientId.toString(),
    name: patient.name,
    email: patient.email ?? '',
    dob: patient.dob ?? '',
    gender: patient.gender ?? '',
    phone: patient.phone ?? '',
    address: patient.address ?? '',
    createdAt: patient.createdAt ?? '',
    updatedAt: patient.updatedAt ?? '',
  }));
  return patientsData;
}

export async function createPatient(newPatient: Patient): Promise<Patient> {
  const parsedPatient = {
    name: newPatient.name,
    email: newPatient.email,
    dob: newPatient.dob,
    gender: newPatient.gender,
    phone: newPatient.phone,
    address: newPatient.address,
  };
  const createdPatient = await db.insert(patient).values(parsedPatient).returning();
  console.log("Created patient:", createdPatient);
  const patientData: Patient = {
    id: createdPatient[0].patientId.toString(),
    name: createdPatient[0].name,
    email: createdPatient[0].email ?? '',
    dob: createdPatient[0].dob ?? '',
    gender: createdPatient[0].gender ?? '',
    phone: createdPatient[0].phone ?? '',
    address: createdPatient[0].address ?? '',
    createdAt: createdPatient[0].createdAt ?? '',
    updatedAt: createdPatient[0].updatedAt ?? '',
  }
  return patientData;
}

export async function updatePatient(id: number, updatedPatient: Patient): Promise<Patient> {
  const parsedPatient = {
    name: updatedPatient.name,
    email: updatedPatient.email,
    dob: updatedPatient.dob,
    gender: updatedPatient.gender,
    phone: updatedPatient.phone,
    address: updatedPatient.address,
  }
  const updatePatient = await db.update(patient).set(parsedPatient).where(eq(patient.patientId, id)).returning();
  console.log("Updated patient:", updatePatient);
  const patientData: Patient = {
    id: updatePatient[0].patientId.toString(),
    name: updatePatient[0].name,
    email: updatePatient[0].email ?? '',
    dob: updatePatient[0].dob ?? '',
    gender: updatePatient[0].gender ?? '',
    phone: updatePatient[0].phone ?? '',
    address: updatePatient[0].address ?? '',
    createdAt: updatePatient[0].createdAt ?? '',
    updatedAt: updatePatient[0].updatedAt ?? '',
  }
  return patientData;
}
