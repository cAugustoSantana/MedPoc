import { Patient, NewPatient } from '@/types/patient';
import { db } from '../index';
import { patient, doctorPatient } from '../migrations/schema';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function getAllPatients(doctorId: number): Promise<Patient[]> {
  const patients = await db
    .select({
      patientId: patient.patientId,
      uuid: patient.uuid,
      name: patient.name,
      dob: patient.dob,
      gender: patient.gender,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    })
    .from(patient)
    .innerJoin(doctorPatient, eq(patient.patientId, doctorPatient.patientId))
    .where(eq(doctorPatient.doctorId, doctorId));

  // console.log("Fetched patients:", patients);
  return patients;
}

export async function getPatientById(
  uuid: string,
  doctorId: number
): Promise<Patient> {
  const patients = await db
    .select({
      patientId: patient.patientId,
      uuid: patient.uuid,
      name: patient.name,
      dob: patient.dob,
      gender: patient.gender,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    })
    .from(patient)
    .innerJoin(doctorPatient, eq(patient.patientId, doctorPatient.patientId))
    .where(and(eq(patient.uuid, uuid), eq(doctorPatient.doctorId, doctorId)));
  console.log('Fetched patient by UUID:', patients);

  if (!patients[0]) {
    throw new Error(`Patient with UUID ${uuid} not found or access denied`);
  }

  return patients[0];
}

export async function getPatientByPatientId(
  patientId: number
): Promise<Patient | null> {
  try {
    const patients = await db
      .select()
      .from(patient)
      .where(eq(patient.patientId, patientId))
      .limit(1);

    return patients[0] || null;
  } catch (error) {
    console.error(`Error fetching patient with id ${patientId}:`, error);
    throw new Error(`Failed to fetch patient with id ${patientId}`);
  }
}

export async function createPatient(
  newPatient: NewPatient,
  doctorId: number
): Promise<Patient> {
  // Use a transaction to create patient and doctor-patient relationship
  const result = await db.transaction(async (tx) => {
    // Create the patient
    const createdPatient = await tx
      .insert(patient)
      .values(newPatient)
      .returning();

    // Create the doctor-patient relationship
    await tx.insert(doctorPatient).values({
      uuid: randomUUID(),
      doctorId: doctorId,
      patientId: createdPatient[0].patientId,
    });

    return createdPatient[0];
  });

  console.log('Created patient:', result);
  return result;
}

export async function updatePatient(
  id: number,
  updatedPatient: Partial<NewPatient>,
  doctorId: number
): Promise<Patient> {
  // First verify the patient belongs to this doctor
  const patientCheck = await db
    .select({ patientId: patient.patientId })
    .from(patient)
    .innerJoin(doctorPatient, eq(patient.patientId, doctorPatient.patientId))
    .where(and(eq(patient.patientId, id), eq(doctorPatient.doctorId, doctorId)))
    .limit(1);

  if (!patientCheck.length) {
    throw new Error('Patient not found or access denied');
  }

  const updatedPatientResult = await db
    .update(patient)
    .set(updatedPatient)
    .where(eq(patient.patientId, id))
    .returning();
  console.log('Updated patient:', updatedPatientResult);
  return updatedPatientResult[0];
}

export async function deletePatient(
  id: number,
  doctorId: number
): Promise<Patient> {
  // First verify the patient belongs to this doctor
  const patientCheck = await db
    .select({ patientId: patient.patientId })
    .from(patient)
    .innerJoin(doctorPatient, eq(patient.patientId, doctorPatient.patientId))
    .where(and(eq(patient.patientId, id), eq(doctorPatient.doctorId, doctorId)))
    .limit(1);

  if (!patientCheck.length) {
    throw new Error('Patient not found or access denied');
  }

  // Use a transaction to delete patient and doctor-patient relationship
  const result = await db.transaction(async (tx) => {
    // Delete the doctor-patient relationship first
    await tx.delete(doctorPatient).where(eq(doctorPatient.patientId, id));

    // Delete the patient
    const deletedPatient = await tx
      .delete(patient)
      .where(eq(patient.patientId, id))
      .returning();

    return deletedPatient[0];
  });

  console.log('Deleted patient:', result);
  return result;
}
