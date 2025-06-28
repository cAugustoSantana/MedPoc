"use server";

import { revalidatePath } from "next/cache";
import {
  createAppointment,
  getAppointmentsByDate,
  getAppointmentsWithDetails,
  convertFormDataToAppointment
} from "@/db/queries/appointments";

export async function createAppointmentAction(formData: any) {
  try {
    // Get the patient ID from the form data
    const patientId = parseInt(formData.patientId);
    const doctorId = 1; // This should come from auth context

    // Strip phone formatting if present (store only digits)
    if (formData.phone) {
      formData.phone = formData.phone.replace(/\D/g, '');
    }

    // Convert form data to database format
    const newAppointment = convertFormDataToAppointment(formData, patientId, doctorId);

    // Create the appointment in the database
    const createdAppointment = await createAppointment(newAppointment);

    console.log("Created appointment:", createdAppointment);

    // Revalidate the appointments page to show the new appointment
    revalidatePath("/appointments");

    return { success: true, data: createdAppointment };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return { success: false, error: "Failed to create appointment" };
  }
}

export async function getAppointmentsByDateAction(date: string) {
  try {
    const appointments = await getAppointmentsByDate(new Date(date));
    return { success: true, data: appointments };
  } catch (error) {
    console.error("Error fetching appointments by date:", error);
    return { success: false, error: "Failed to fetch appointments" };
  }
}

export async function getAllAppointmentsAction() {
  try {
    const appointments = await getAppointmentsWithDetails();
    return { success: true, data: appointments };
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    return { success: false, error: "Failed to fetch appointments" };
  }
}