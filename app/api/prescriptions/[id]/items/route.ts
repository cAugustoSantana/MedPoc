import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getPrescriptionItemsByPrescriptionId } from '@/db/queries/prescription-items';
import { getPrescriptionById } from '@/db/queries/prescriptions';
import { getCurrentUserId } from '@/lib/auth-utils';

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

    // Get the current user's ID from authentication
    const currentUserId = await getCurrentUserId();

    if (!currentUserId) {
      return NextResponse.json(
        { success: false, error: 'User not found or onboarding incomplete' },
        { status: 403 }
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

    // First verify that the prescription belongs to the current doctor
    await getPrescriptionById(prescriptionId, currentUserId);

    const items = await getPrescriptionItemsByPrescriptionId(prescriptionId);

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching prescription items:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch prescription items',
      },
      { status: 500 }
    );
  }
}
