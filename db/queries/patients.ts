import { db } from "../index";
import { patient } from "../migrations/schema";

export async function getAllPatients() {
  const patients = await db.select().from(patient);
  console.log("Fetched patients:", patients);
  return patients;
}