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

    const prescription = await getPrescriptionById(prescriptionId);

    if (!prescription) {
      return NextResponse.json(
        { success: false, error: 'Prescription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: prescription });
  } catch (error) {
    console.error(`Error fetching prescription:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prescription' },
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

    const { id } = await params;
    const prescriptionId = parseInt(id);

    if (isNaN(prescriptionId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid prescription ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Only allow updating specific fields
    const updateData: Partial<NewPrescription> = {};

    if (body.patientId !== undefined) {
      updateData.patientId = parseInt(body.patientId);
    }
    if (body.appUserId !== undefined) {
      updateData.appUserId = parseInt(body.appUserId);
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
      updateData
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

    const { id } = await params;
    const prescriptionId = parseInt(id);

    if (isNaN(prescriptionId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid prescription ID' },
        { status: 400 }
      );
    }

    await deletePrescription(prescriptionId);

    return NextResponse.json(
      { success: true, message: 'Prescription deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting prescription:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete prescription' },
      { status: 500 }
    );
  }
}
