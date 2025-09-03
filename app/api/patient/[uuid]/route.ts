// app/api/patient/[uuid]/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentDoctorId } from '@/lib/auth-utils';
import { getPatientById } from '@/db/queries/patients';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> } // ⬅️ params is a Promise
) {
  try {
    const { uuid } = await params; // ⬅️ await it

    if (!uuid) {
      return NextResponse.json(
        { success: false, error: 'Missing patient id' },
        { status: 400 }
      );
    }

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
    if (error instanceof Error && /not found/i.test(error.message)) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
