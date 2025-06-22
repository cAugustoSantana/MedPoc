// app/patients/[id]/page.tsx
import { getPatientById } from '@/db/queries/patients';
import { notFound } from 'next/navigation';



type Props = {
  params: { id: string };
};


export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = await getPatientById(params.id); // id = uuid

  if (!patient) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{patient.name}</h1>
      <p>Email: {patient.email}</p>
      <p>Gender: {patient.flag}</p>
      <p>DOB: {patient.location}</p>
    </div>
  );
}
