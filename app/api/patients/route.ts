import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getCurrentDoctorId } from '@/lib/auth-utils';
import { getAllPatients } from '@/db/queries/patients';

export async function GET() {
  try {
    // Check authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
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

    const patients = await getAllPatients(doctorId);
    return NextResponse.json({ success: true, data: patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}
