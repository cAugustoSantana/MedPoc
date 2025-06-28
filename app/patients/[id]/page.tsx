// app/patients/[id]/page.tsx



import { getAllPatients, getPatientById } from '@/db/queries/patients';
import { notFound } from 'next/navigation';
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CollapsibleContent } from '@radix-ui/react-collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown } from 'lucide-react';

type Props = {
  params: { id: string }; // UUID
};

const patientsData = await getAllPatients();

export default async function PatientDetailPage({ params }: Props) {
  const patient = await getPatientById(params.id);

  if (!patient) return notFound();

  return (
   <div className="min-h-screen w-full bg-white p-8">
  <div className="w-full bg-gray-50 rounded-xl shadow p-6 mb-6">
    <h1 className="text-3xl font-bold mb-4">{patient.name}</h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
      <DetailItem label="Email" value={patient.email} />
      <DetailItem label="Gender" value={patient.gender} />
      <DetailItem label="Date of Birth" value={patient.dob} />
      <DetailItem label="Phone" value={patient.phone} />
      <DetailItem label="Address" value={patient.address} />
      <DetailItem label="Created At" value={patient.createdAt?.toString()} />
    </div>
  </div>

  {/* Reusable Collapsible Section */}
  {["Medical Record", "Appointments", "Tests"].map((title) => (
    <div
      key={title}
      className="w-full bg-gray-100 border border-gray-300 rounded-xl shadow p-6 mb-6 hover:shadow-md hover:bg-gray-200 transition"
    >
      <Collapsible>
        <CollapsibleTrigger asChild>
          <div className="cursor-pointer flex items-center justify-between">
            <h1 className="text-xl font-bold">{title}</h1>
            <ChevronDown className="opacity-60" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Gender</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Date of Birth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientsData.map((p) => (
                <TableRow key={p.name}>
                  <TableCell className="text-center">{p.name}</TableCell>
                  <TableCell className="text-center">{p.dob}</TableCell>
                  <TableCell className="text-center">{p.email}</TableCell>
                  <TableCell className="text-center">{p.address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ))}
</div>

  );
}

function DetailItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base">{value || '—'}</p>
    </div>
  );
}
