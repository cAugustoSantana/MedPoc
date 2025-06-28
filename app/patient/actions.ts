"use server";

import {
  createPatient,
  updatePatient,
  deletePatient,
  getAllPatients,
} from "@/db/queries/patients";
import { revalidatePath } from "next/cache";
import {
  validateCreatePatient,
  validateUpdatePatient,
  CreatePatientData,
  UpdatePatientData,
} from "@/lib/validations/patient";

export async function createPatientAction(patientData: CreatePatientData) {
  try {
    // Validate the input data
    const validation = validateCreatePatient(patientData);

    if (!validation.success) {
      return {
        success: false,
        error: "Validation failed",
        details: validation.errors,
      };
    }

    const patient = await createPatient(validation.data);
    revalidatePath("/patient");
    return { success: true, data: patient };
  } catch (error) {
    console.error("Error creating patient:", error);
    return { success: false, error: "Failed to create patient" };
  }
}

export async function updatePatientAction(
  id: number,
  patientData: UpdatePatientData,
) {
  try {
    // Validate the input data
    const validation = validateUpdatePatient(patientData);

    if (!validation.success) {
      return {
        success: false,
        error: "Validation failed",
        details: validation.errors,
      };
    }

    const patient = await updatePatient(id, validation.data);
    revalidatePath("/patient");
    return { success: true, data: patient };
  } catch (error) {
    console.error("Error updating patient:", error);
    return { success: false, error: "Failed to update patient" };
  }
}

export async function deletePatientAction(patientId: number) {
  try {
    await deletePatient(patientId);
    revalidatePath("/patient");
    revalidatePath("/appoinment");
    return { success: true };
  } catch (error) {
    console.error("Error deleting patient:", error);
    return { success: false, error: "Failed to delete patient" };
  }
}

export async function deleteMultiplePatientsAction(patientIds: number[]) {
  try {
    const deletePromises = patientIds.map((id) => deletePatient(id));
    await Promise.all(deletePromises);
    revalidatePath("/patient");
    revalidatePath("/appoinment");
    return { success: true };
  } catch (error) {
    console.error("Error deleting patients:", error);
    return { success: false, error: "Failed to delete patients" };
  }
}

export async function getAllPatientsAction() {
  try {
    const patients = await getAllPatients();
    return { success: true, data: patients };
  } catch (error) {
    console.error("Error fetching patients:", error);
    return { success: false, error: "Failed to fetch patients" };
  }
}
