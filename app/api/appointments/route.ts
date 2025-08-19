import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
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

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    let appointments;

    if (date) {
      // Get appointments for specific date
      appointments = await getAppointmentsByDate(new Date(date));
    } else {
      // Get all appointments
      appointments = await getAppointmentsWithDetails();
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
