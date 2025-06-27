// app/patients/[id]/page.tsx

import { getPatientById } from "@/db/queries/patients";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string }; // UUID
};

export default async function PatientDetailPage({ params }: Props) {
  const patient = await getPatientById(params.id);

  if (!patient) return notFound();

  return (
    <div className="min-h-screen p-8 bg-white">
      <div className="max-w-3xl mx-auto bg-gray-50 rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-4">{patient.name}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <DetailItem label="Email" value={patient.email} />
          <DetailItem label="Gender" value={patient.gender} />
          <DetailItem label="Date of Birth" value={patient.dob} />
          <DetailItem label="Phone" value={patient.phone} />
          <DetailItem label="Address" value={patient.address} />
          <DetailItem
            label="Created At"
            value={patient.created_at?.toString()}
          />
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base">{value || "—"}</p>
    </div>
  );
}
