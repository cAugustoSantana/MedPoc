// app/page.tsx
import React from 'react';
import PatientTable from '@/components/patient-table';
import { getAllPatients } from '@/db/queries/patients';

const patientsData = await getAllPatients();

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Patients</h1>
        <PatientTable data={patientsData} />
      </div>
    </main>
  );
}
