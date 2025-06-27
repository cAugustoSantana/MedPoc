import React from "react";
import PatientTable from "@/components/patient-table";
import { getAllPatients } from "@/db/queries/patients";
import { PatientActions } from "@/components/patient-actions";
import { Patient } from "@/types/patient";

export default async function PatientPage() {
  let patientsData: Patient[] = [];

  try {
    patientsData = await getAllPatients();
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    // Continue with empty data instead of crashing
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Patients</h1>
        <PatientTable
          data={patientsData}
          addPatientComponent={<PatientActions />}
        />
      </div>
    </main>
  );
}
