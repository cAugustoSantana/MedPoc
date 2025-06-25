// app/patients/[id]/page.tsx

import { getAllPatients, getPatientById } from '@/db/queries/patients';
import { notFound } from 'next/navigation';
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CollapsibleContent } from '@radix-ui/react-collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Props = {
  params: { id: string }; // UUID
};

const patientsData = await getAllPatients();

export default async function PatientDetailPage({ params }: Props) {
  const patient = await getPatientById(params.id);

  if (!patient) return notFound();

  return (
    <div className="min-h-screen max-w-10/10 p-8 bg-white">
      <div className="max-w-10/10 mx-auto bg-gray-50 rounded-xl shadow p-6 m-5">
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
      <div className="max-w-10/10 mx-auto bg-gray-50 rounded-xl shadow p-6 m-5">
      <Collapsible>
        <CollapsibleTrigger><h1>Medical Records</h1></CollapsibleTrigger>
         <CollapsibleContent>
          <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Gender</TableHead>
                    <TableHead className="text-center">Email</TableHead>
                    <TableHead className="text-center">Date of Birth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patientsData.map((patient) => (
                    <TableRow key={patient.name}>
                      <TableCell className="text-center">{patient.name}</TableCell>
                      <TableCell className="text-center">{patient.dob}</TableCell>
                      <TableCell className="text-center">{patient.email}</TableCell>
                      <TableCell className="text-center">{patient.address}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
          </Table>
        </CollapsibleContent>
      </Collapsible> 
      </div>
       <div className="max-w-10/10 mx-auto bg-gray-50 rounded-xl shadow p-6 m-5">
      <Collapsible>
        <CollapsibleTrigger><h1>Appoinments</h1></CollapsibleTrigger>
         <CollapsibleContent>
          <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Gender</TableHead>
                    <TableHead className="text-center">Email</TableHead>
                    <TableHead className="text-center">Date of Birth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patientsData.map((patient) => (
                    <TableRow key={patient.name}>
                      <TableCell className="text-center">{patient.name}</TableCell>
                      <TableCell className="text-center">{patient.dob}</TableCell>
                      <TableCell className="text-center">{patient.email}</TableCell>
                      <TableCell className="text-center">{patient.address}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
          </Table>
        </CollapsibleContent>
      </Collapsible> 
      </div>
      <div className="max-w-10/10 mx-auto bg-gray-50 rounded-xl shadow p-6 m-5">
      <Collapsible>
        <CollapsibleTrigger><h1>Tests</h1></CollapsibleTrigger>
         <CollapsibleContent>
          <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Gender</TableHead>
                    <TableHead className="text-center">Email</TableHead>
                    <TableHead className="text-center">Date of Birth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patientsData.map((patient) => (
                    <TableRow key={patient.name}>
                      <TableCell className="text-center">{patient.name}</TableCell>
                      <TableCell className="text-center">{patient.dob}</TableCell>
                      <TableCell className="text-center">{patient.email}</TableCell>
                      <TableCell className="text-center">{patient.address}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
          </Table>
        </CollapsibleContent>
      </Collapsible> 
      </div>
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
