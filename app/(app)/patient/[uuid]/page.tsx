import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PatientDetail from '@/components/patient-detail';

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export default async function PatientPage({ params }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const { uuid } = await params;
  return <PatientDetail patientId={uuid} />;
}
