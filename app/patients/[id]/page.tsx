import { getPatientById } from '@/db/queries/patients';
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string }; // 'id' is the UUID
};

export default async function PatientDetailPage({ params }: Props) {
  const patient = await getPatientById(params.id); // UUID passed via dynamic route

  if (!patient) return notFound();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-4">{patient.name}</h1>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Email:</span> {patient.email}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Gender:</span> {patient.flag}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Date of Birth:</span> {patient.location}
        </p>
      </div>
    </div>
  );
}
