import PatientDetail from "@/components/patient-detail"

type Props = {
  params: { uuid: string }
}

export default function PatientPage({ params }: Props) {
  return <PatientDetail patientId={params.uuid} />
}
