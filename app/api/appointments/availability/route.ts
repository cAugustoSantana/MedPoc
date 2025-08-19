import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getBookedTimesForDate } from '@/db/queries/appointments';

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const date = req.nextUrl.searchParams.get('date');
    if (!date) {
      return NextResponse.json(
        { success: false, error: 'Date is required' },
        { status: 400 }
      );
    }

    const times = await getBookedTimesForDate(date);
    console.log('Booked times for', date, ':', times);
    return NextResponse.json({ success: true, data: times });
  } catch (error) {
    console.error('Error in /api/appointments/availability:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
