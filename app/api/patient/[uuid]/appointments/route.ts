import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getCurrentDoctorId } from '@/lib/auth-utils';
import { getAppointmentsByPatient } from '@/db/queries/appointments';
import { getPatientById } from '@/db/queries/patients';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    // Check authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { uuid } = await params;

    if (!uuid) {
      return NextResponse.json(
        { success: false, error: 'Missing patient UUID' },
        { status: 400 }
      );
    }

    // Get current doctor ID
    const doctorId = await getCurrentDoctorId();

    if (!doctorId) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 403 }
      );
    }

    // First verify the patient exists and belongs to this doctor
    const patient = await getPatientById(uuid, doctorId);
    if (!patient) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      );
    }

    // Get appointments for this patient
    const appointments = await getAppointmentsByPatient(
      patient.patientId,
      doctorId
    );

    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch patient appointments' },
      { status: 500 }
    );
  }
}
