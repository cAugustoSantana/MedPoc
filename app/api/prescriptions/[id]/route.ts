import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
} from '@/db/queries/prescriptions';
import {
  createPrescriptionItem,
  deletePrescriptionItemsByPrescriptionId,
} from '@/db/queries/prescription-items';
import { NewPrescription } from '@/types/prescription';
import { NewPrescriptionItem } from '@/types/prescription-item';
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

    const prescription = await getPrescriptionById(
      prescriptionId,
      currentUserId
    );

    return NextResponse.json({ success: true, data: prescription });
  } catch (error) {
    console.error(`Error fetching prescription:`, error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch prescription',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const body = await request.json();

    // Only allow updating specific fields (not appUserId for security)
    const updateData: Partial<NewPrescription> = {};

    if (body.patientId !== undefined) {
      updateData.patientId = parseInt(body.patientId);
    }
    if (body.appointmentId !== undefined) {
      updateData.appointmentId = body.appointmentId
        ? parseInt(body.appointmentId)
        : null;
    }
    if (body.prescribedAt !== undefined) {
      updateData.prescribedAt = body.prescribedAt;
    }
    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    const updatedPrescription = await updatePrescription(
      prescriptionId,
      updateData,
      currentUserId
    );

    // Handle medication updates if provided
    if (body.medications && Array.isArray(body.medications)) {
      // Delete existing prescription items
      await deletePrescriptionItemsByPrescriptionId(prescriptionId);

      // Create new prescription items
      const prescriptionItems = [];
      for (const medication of body.medications) {
        if (medication.name && medication.dosage && medication.frequency) {
          const itemData: NewPrescriptionItem = {
            prescriptionId: prescriptionId,
            drugName: medication.name,
            dosage: medication.dosage,
            frequency: medication.frequency,
            duration: medication.duration || null,
            instructions: medication.instructions || null,
          };

          const newItem = await createPrescriptionItem(itemData);
          prescriptionItems.push(newItem);
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          ...updatedPrescription,
          items: prescriptionItems,
        },
      });
    }

    return NextResponse.json({ success: true, data: updatedPrescription });
  } catch (error) {
    console.error(`Error updating prescription:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update prescription' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await deletePrescription(prescriptionId, currentUserId);

    return NextResponse.json(
      { success: true, message: 'Prescription deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting prescription:`, error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to delete prescription',
      },
      { status: 500 }
    );
  }
}
