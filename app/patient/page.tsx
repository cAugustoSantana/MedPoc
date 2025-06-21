// app/page.tsx
import React from 'react';
import PatientTable from '@/components/patient-table';
import { getAllPatients } from '@/db/queries/patients';
import { PatientActions } from '@/components/patient-actions';

export default async function PatientPage() {
  const patientsData = await getAllPatients();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Patients</h1>
        <PatientTable
          data={patientsData}
          addPatientComponent={<PatientActions />}
        />
      </div>
    </main>
  );
}
