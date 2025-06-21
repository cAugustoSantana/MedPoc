'use server';

import { createPatient, updatePatient, deletePatient } from '@/db/queries/patients';
import { NewPatient } from '@/types/patient';
import { revalidatePath } from 'next/cache';

export async function createPatientAction(patientData: NewPatient) {
  try {
    const patient = await createPatient(patientData);
    revalidatePath('/patient');
    return { success: true, data: patient };
  } catch (error) {
    console.error('Error creating patient:', error);
    return { success: false, error: 'Failed to create patient' };
  }
}

export async function updatePatientAction(id: number, patientData: Partial<NewPatient>) {
  try {
    const patient = await updatePatient(id, patientData);
    revalidatePath('/patient');
    return { success: true, data: patient };
  } catch (error) {
    console.error('Error updating patient:', error);
    return { success: false, error: 'Failed to update patient' };
  }
}

export async function deletePatientAction(id: number) {
  try {
    const patient = await deletePatient(id);
    revalidatePath('/patient');
    return { success: true, data: patient };
  } catch (error) {
    console.error('Error deleting patient:', error);
    return { success: false, error: 'Failed to delete patient' };
  }
} 