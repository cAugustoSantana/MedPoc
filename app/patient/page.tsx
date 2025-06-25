import React from "react";
import PatientTable from "@/components/patient-table";
import { getAllPatients } from "@/db/queries/patients";
import { PatientActions } from "@/components/patient-actions";

export default async function PatientPage() {
  const patientsData = await getAllPatients();

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
