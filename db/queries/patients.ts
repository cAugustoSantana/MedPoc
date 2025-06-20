import { Patient } from "@/types/patient";
import { db } from "../index";
import { patient } from "../migrations/schema";

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