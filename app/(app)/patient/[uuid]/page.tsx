import PatientDetail from '../../../../components/patient-detail';

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export default async function PatientPage({ params }: PageProps) {
  const { uuid } = await params;

  return <PatientDetail patientId={uuid} />;
}
