// app/page.tsx
import React from 'react';
import {patient} from '../patient/data.json';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to My Next.js App
        </h1>
        <p className="text-lg text-gray-600">
          {patient.name}
        </p>
      </div>
    </main>
  );
}
