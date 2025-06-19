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
    location: patient.address ?? '',
    flag: patient.gender ?? '',
    status: 'Active',
    balance: 0,
  }));
  return patientsData;
}