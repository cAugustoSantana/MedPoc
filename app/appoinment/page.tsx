// app/page.tsx
import React from 'react';

import Calendar from '@/components/comp-488';
// import TableBlock from '@/components/patient-table';
// import { Table } from '@/components/ui/table';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Appointments</h1>
        <Calendar />
      </div>
      {/* <TableBlock /> */}
    </main>
  );
}
