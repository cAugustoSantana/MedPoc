import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card";

import { Calendar } from '@/components/ui/calendar-rac'
import { getAllPatients } from '@/db/queries/patients';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const patientsData = await getAllPatients();

export default function Home() {
  return (
    <div className="min-h-screen bg-white-100 p-6 flex flex-col space-y-6">
      
      {/* Horizontal stack of cards */}
      <div className="flex flex-row gap-6">
        
        {/* Card 1: Calendar */}
        <div className="w-fit">
          <Card className="rounded-2xl shadow-md bg-white inline-block">
            <CardHeader>
              <h2 className="text-xl font-semibold text-center  ">Schedule</h2>
            </CardHeader>
            <CardContent>
              <Calendar />
            </CardContent>
          </Card>
        </div>

        {/* Card 2: Patients Table */}
        <div className="flex-1">
          <Card className="rounded-2xl shadow-md bg-white w-full">
            <CardHeader>
              <h2 className="text-xl font-semibold text-center">Patients</h2>
            </CardHeader>
            <CardContent>
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
                      <TableCell className="text-center">{patient.flag}</TableCell>
                      <TableCell className="text-center">{patient.email}</TableCell>
                      <TableCell className="text-center">{patient.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Card 3: Placeholder */}
        <div className="w-64">
          <Card className="rounded-2xl shadow-md bg-white h-full">
            <CardHeader>
              <h2 className="text-xl font-semibold">Placeholder</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">This space is reserved.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom full-width stacked card */}
      <div className="w-full">
        <Card className="rounded-2xl shadow-md bg-white w-full">
          <CardHeader>
            <h2 className="text-xl font-semibold">Extra Info</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">This card is vertically stacked and full width.</p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
