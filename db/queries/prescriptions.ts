import { db } from '../index';
import { Prescription, NewPrescription } from '@/types/prescription';
import { prescription } from '../migrations/schema';
import { eq } from 'drizzle-orm';
import { deletePrescriptionItemsByPrescriptionId } from './prescription-items';

export async function getAllPrescriptions(
  doctorId: number
): Promise<Prescription[]> {
  try {
    const prescriptions = await db
      .select()
      .from(prescription)
      .where(eq(prescription.appUserId, doctorId));
    return prescriptions;
  } catch (error) {
    console.error('Error fetching all prescriptions:', error);
    throw new Error('Failed to fetch prescriptions');
  }
}

export async function getPrescriptionById(
  id: number,
  doctorId: number
): Promise<Prescription> {
  try {
    const prescriptions = await db
      .select()
      .from(prescription)
      .where(eq(prescription.prescriptionId, id))
      .limit(1);

    if (prescriptions.length === 0) {
      throw new Error(`Prescription with id ${id} not found`);
    }

    const prescriptionRecord = prescriptions[0];

    // Check if the prescription belongs to the current doctor
    if (prescriptionRecord.appUserId !== doctorId) {
      throw new Error(
        `Access denied: Prescription with id ${id} does not belong to this doctor`
      );
    }

    return prescriptionRecord;
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
  prescriptionData: Partial<NewPrescription>,
  doctorId: number
): Promise<Prescription> {
  try {
    // First check if the prescription exists and belongs to the doctor
    await getPrescriptionById(id, doctorId);

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
    // Re-throw the original error if it's from getPrescriptionById validation
    if (
      error instanceof Error &&
      (error.message.includes('not found') ||
        error.message.includes('Access denied'))
    ) {
      throw error;
    }
    throw new Error(`Failed to update prescription with id ${id}`);
  }
}

export async function deletePrescription(
  id: number,
  doctorId: number
): Promise<void> {
  try {
    // First check if the prescription exists and belongs to the doctor
    await getPrescriptionById(id, doctorId);

    // First, delete all prescription items associated with this prescription
    await deletePrescriptionItemsByPrescriptionId(id);

    // Then delete the prescription itself
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
  patientId: number,
  doctorId: number
): Promise<Prescription[]> {
  try {
    const prescriptions = await db
      .select()
      .from(prescription)
      .where(eq(prescription.patientId, patientId));

    // Filter to only return prescriptions that belong to the current doctor
    return prescriptions.filter(
      (prescription) => prescription.appUserId === doctorId
    );
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
