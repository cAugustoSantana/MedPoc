import { getPatientById } from "@/db/queries/patients";
import { notFound } from "next/navigation";

export default async function PatientDetailPage({
  params,
}: {
  params: { uuid: string };
}) {
  const { uuid } = params;

  try {
    const patient = await getPatientById(uuid);

    return (
      <main className="min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            {patient.name}
          </h1>
          <div className="space-y-2 bg-white p-4 rounded-md shadow">
            <p>
              <span className="font-semibold">Email:</span> {patient.email ?? "N/A"}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {patient.phone ?? "N/A"}
            </p>
            <p>
              <span className="font-semibold">Address:</span> {patient.address ?? "N/A"}
            </p>
            <p>
              <span className="font-semibold">Date of Birth:</span> {patient.dob ?? "N/A"}
            </p>
            <p>
              <span className="font-semibold">Gender:</span> {patient.gender ?? "N/A"}
            </p>
          </div>
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}

