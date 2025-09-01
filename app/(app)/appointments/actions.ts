'use server';

import { revalidatePath } from 'next/cache';
import { AppointmentFormData } from '@/types/appointment';
import { getCurrentDoctorId } from '@/lib/auth-utils';
import {
  getAppointmentsByDate,
  getAppointmentsWithDetails,
  createAppointment,
  convertFormDataToAppointment,
} from '@/db/queries/appointments';

export async function createAppointmentAction(formData: AppointmentFormData) {
  try {
    const doctorId = await getCurrentDoctorId();

    if (!doctorId) {
      return { success: false, error: 'Doctor not authenticated' };
    }

    // Strip phone formatting if present (store only digits)
    if (formData.phone) {
      formData.phone = formData.phone.replace(/\D/g, '');
    }

    // Convert form data to database format
    const patientId = parseInt(formData.patientId);
    const newAppointment = convertFormDataToAppointment(
      formData,
      patientId,
      doctorId
    );

    // Create the appointment in the database
    const createdAppointment = await createAppointment(newAppointment);

    console.log('Created appointment:', createdAppointment);

    // Revalidate the appointments page to show the new appointment
    revalidatePath('/appointments');

    return { success: true, data: createdAppointment };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return { success: false, error: 'Failed to create appointment' };
  }
}

export async function getAppointmentsByDateAction(date: string) {
  try {
    const doctorId = await getCurrentDoctorId();

    if (!doctorId) {
      return { success: false, error: 'Doctor not authenticated' };
    }

    const appointments = await getAppointmentsByDate(new Date(date), doctorId);
    return { success: true, data: appointments };
  } catch (error) {
    console.error('Error fetching appointments by date:', error);
    return { success: false, error: 'Failed to fetch appointments' };
  }
}

export async function getAllAppointmentsAction() {
  try {
    const doctorId = await getCurrentDoctorId();

    if (!doctorId) {
      return { success: false, error: 'Doctor not authenticated' };
    }

    const appointments = await getAppointmentsWithDetails(doctorId);
    return { success: true, data: appointments };
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    return { success: false, error: 'Failed to fetch appointments' };
  }
}
