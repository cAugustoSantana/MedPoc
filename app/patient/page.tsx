// app/page.tsx
import React from 'react';
import { patient } from '../patient/data.json';
import TableBlock from '@/components/comp-485';
import { getAllPatients } from '@/db/queries/patients';

const patientsData = await getAllPatients();

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Patients</h1>
        <TableBlock />
      </div>
    </main>
  );
}
