import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar-rac';
import { getAllPatients } from '@/db/queries/patients';
import { getCurrentDoctorId } from '@/lib/auth-utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Patient } from '@/types/patient';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  let patientsData: Patient[] = [];
  let errorMessage: string | null = null;

  try {
    const doctorId = await getCurrentDoctorId();
    if (doctorId) {
      patientsData = await getAllPatients(doctorId);
    } else {
      errorMessage =
        'Unable to load user profile. Please complete your onboarding.';
    }
  } catch (error: unknown) {
    console.error('Failed to fetch patients:', error);
    errorMessage = 'Failed to load dashboard data. Please try again.';
  }

  // If there's an error, show a user-friendly message
  if (errorMessage) {
    return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Error</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">{errorMessage}</p>
                <Button
                  onClick={() => (window.location.href = '/onboarding')}
                  className="mx-auto"
                >
                  Complete Profile Setup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4 flex-1">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Patients:</span>
                  <span className="font-semibold">{patientsData.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Today&apos;s Appointments:</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Prescriptions:</span>
                  <span className="font-semibold">0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  Add Patient
                </Button>
                <Button className="w-full" variant="outline">
                  Schedule Appointment
                </Button>
                <Button className="w-full" variant="outline">
                  New Prescription
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date of Birth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientsData.length > 0 ? (
                  patientsData.slice(0, 5).map((patient) => (
                    <TableRow key={patient.name}>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.dob}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-gray-500"
                    >
                      No patients found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
