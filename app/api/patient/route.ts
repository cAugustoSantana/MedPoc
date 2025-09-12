import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentDoctorId } from '@/lib/auth-utils';
import { getPatientById, updatePatient } from '@/db/queries/patients';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;

    const doctorId = await getCurrentDoctorId();
    if (!doctorId) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 403 }
      );
    }

    let payload: Record<string, unknown>;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    // Optional: prevent updating a different record than the URL
    if (payload?.uuid && payload.uuid !== uuid) {
      return NextResponse.json(
        { success: false, error: 'UUID in path and body do not match' },
        { status: 409 }
      );
    }

    // (Optional) ensure patient exists & belongs to this doctor
    const existing = await getPatientById(uuid, doctorId).catch(() => null);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      );
    }

    // Implement this to perform the update in your DB layer.
    // Signature suggestion: updatePatientById(uuid: string, doctorId: string, data: Record<string, unknown>)
    const updated = await updatePatient(uuid, doctorId, payload);

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
