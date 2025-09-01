import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';
import PatientDetail from '@/components/patient-detail';
import { getPatientById } from '@/db/queries/patients'; // Adjust this import path to match where your function is located
import { getCurrentDoctorId } from '@/lib/auth-utils';

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export default async function PatientPage({ params }: PageProps) {
  const { uuid } = await params;
  const doctorId = await getCurrentDoctorId();

  if (!doctorId) {
    return NextResponse.json(
      { success: false, error: 'Doctor not found' },
      { status: 403 }
    );
  }

  try {
    const patient = await getPatientById(uuid, doctorId);
    return <PatientDetail patient={patient} />;
  } catch (error) {
    console.error('Error fetching patient:', error);
    notFound();
  }
}
