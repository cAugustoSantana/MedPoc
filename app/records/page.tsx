// app/page.tsx
import React from 'react';
import PatientTable from '@/components/patient-table';
import { getAllPatients } from '@/db/queries/patients';

const patientsData = await getAllPatients();

export default function RecordsPage() {
  return (
    <main>
      <h1> Hola</h1>
    </main>
  );
}
