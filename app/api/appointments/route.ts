import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getCurrentDoctorId } from '@/lib/auth-utils';
import {
  getAppointmentsByDate,
  getAppointmentsWithDetails,
} from '@/db/queries/appointments';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    let appointments;

    if (date) {
      // Get appointments for specific date
      appointments = await getAppointmentsByDate(new Date(date), doctorId);
    } else {
      // Get all appointments
      appointments = await getAppointmentsWithDetails(doctorId);
    }

    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}
