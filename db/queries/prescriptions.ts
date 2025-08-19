import { db } from '../index';
import { Prescription, NewPrescription } from '@/types/prescription';
import { prescription } from '../migrations/schema';
import { eq } from 'drizzle-orm';

export async function getAllPrescriptions(): Promise<Prescription[]> {
  try {
    const prescriptions = await db.select().from(prescription);
    return prescriptions;
  } catch (error) {
    console.error('Error fetching all prescriptions:', error);
    throw new Error('Failed to fetch prescriptions');
  }
}

export async function getPrescriptionById(id: number): Promise<Prescription> {
  try {
    const getPrescription = await db
      .select()
      .from(prescription)
      .where(eq(prescription.prescriptionId, id));
    return getPrescription[0];
  } catch (error) {
    console.error(`Error fetching prescription with id ${id}:`, error);
    throw new Error(`Failed to fetch prescription with id ${id}`);
  }
}

export async function createPrescription(
  prescriptionData: NewPrescription
): Promise<Prescription> {
  try {
    const [newPrescription] = await db
      .insert(prescription)
      .values(prescriptionData)
      .returning();
    return newPrescription;
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw new Error('Failed to create prescription');
  }
}

export async function updatePrescription(
  id: number,
  prescriptionData: Partial<NewPrescription>
): Promise<Prescription> {
  try {
    const [updatedPrescription] = await db
      .update(prescription)
      .set({ ...prescriptionData, updatedAt: new Date().toISOString() })
      .where(eq(prescription.prescriptionId, id))
      .returning();

    if (!updatedPrescription) {
      throw new Error(`Prescription with id ${id} not found`);
    }

    return updatedPrescription;
  } catch (error) {
    console.error(`Error updating prescription with id ${id}:`, error);
    throw new Error(`Failed to update prescription with id ${id}`);
  }
}

export async function deletePrescription(id: number): Promise<void> {
  try {
    const [deletedPrescription] = await db
      .delete(prescription)
      .where(eq(prescription.prescriptionId, id))
      .returning();

    if (!deletedPrescription) {
      throw new Error(`Prescription with id ${id} not found`);
    }
  } catch (error) {
    console.error(`Error deleting prescription with id ${id}:`, error);
    throw new Error(`Failed to delete prescription with id ${id}`);
  }
}

export async function getPrescriptionsByPatientId(
  patientId: number
): Promise<Prescription[]> {
  try {
    const prescriptions = await db
      .select()
      .from(prescription)
      .where(eq(prescription.patientId, patientId));
    return prescriptions;
  } catch (error) {
    console.error(
      `Error fetching prescriptions for patient ${patientId}:`,
      error
    );
    throw new Error(`Failed to fetch prescriptions for patient ${patientId}`);
  }
}

export async function getPrescriptionsByDoctorId(
  doctorId: number
): Promise<Prescription[]> {
  try {
    const prescriptions = await db
      .select()
      .from(prescription)
      .where(eq(prescription.appUserId, doctorId));
    return prescriptions;
  } catch (error) {
    console.error(`Error fetching prescriptions by doctor ${doctorId}:`, error);
    throw new Error(`Failed to fetch prescriptions by doctor ${doctorId}`);
  }
}
