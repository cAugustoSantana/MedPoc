import { Patient } from "@/types/patient";
import { db } from "../index";
import { patient } from "../migrations/schema";
import { eq } from 'drizzle-orm';



export async function getAllPatients(): Promise<Patient[]> {
  const patients = await db.select().from(patient);
  console.log("Fetched patients:", patients);
  const patientsData: Patient[] = patients.map((patient) => ({
    id: patient.patientId.toString(),
    uuid: patient.uuid,
    name: patient.name,
    email: patient.email ?? '',
    location: patient.dob ?? '',
    flag: patient.gender ?? '',
    status: 'Active',
    balance: 0,
  }));
  return patientsData;
}
export async function getPatientById(uuid: string): Promise<Patient | null> {
  const result = await db.select().from(patient).where(eq(patient.uuid, uuid));

  if (!result.length) return null;

  const p = result[0];

  const patientData: Patient = {
    id: p.patientId.toString(),
    name: p.name,
    email: p.email ?? '',
    location: p.dob ?? '',
    flag: p.gender ?? '',
    status: 'Active',
    balance: 0,
  };

  return patientData;
}