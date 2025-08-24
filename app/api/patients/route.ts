import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
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

    const patients = await getAllPatients();
    return NextResponse.json({ success: true, data: patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}
