import { notFound } from 'next/navigation';
import PatientDetail from '@/components/patient-detail';
import { getPatientById } from '@/db/queries/patients'; // Adjust this import path to match where your function is located

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export default async function PatientPage({ params }: PageProps) {
  const { uuid } = await params;

  try {
    const patient = await getPatientById(uuid);
    return <PatientDetail patient={patient} />;
  } catch (error) {
    console.error('Error fetching patient:', error);
    notFound();
  }
}
