import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentDoctorId } from '@/lib/auth-utils';
import { getPatientById } from '@/db/queries/patients'; // Adjust this import path to match where your actual function is located

export async function GET(
  request: NextRequest,
  { params }: { params: { uuid: string } }
) {
  try {
    const { uuid } = params;
    const doctorId = await getCurrentDoctorId();
    if (!doctorId) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 403 }
      );
    }

    const patient = await getPatientById(uuid, doctorId);

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
