import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getPrescriptionItemsByPrescriptionId } from '@/db/queries/prescription-items';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const prescriptionId = parseInt(id);

    if (isNaN(prescriptionId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid prescription ID' },
        { status: 400 }
      );
    }

    const items = await getPrescriptionItemsByPrescriptionId(prescriptionId);

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching prescription items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prescription items' },
      { status: 500 }
    );
  }
}
