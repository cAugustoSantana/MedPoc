import { NextRequest, NextResponse } from "next/server";
import {
  getPrescriptionById,
  updatePrescription,
  deletePrescription
} from "@/db/queries/prescriptions";
import { NewPrescription } from "@/types/prescription";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid prescription ID" },
        { status: 400 },
      );
    }

    const prescription = await getPrescriptionById(id);

    if (!prescription) {
      return NextResponse.json(
        { success: false, error: "Prescription not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: prescription });
  } catch (error) {
    console.error(`Error fetching prescription ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch prescription" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid prescription ID" },
        { status: 400 },
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
      updateData.appointmentId = body.appointmentId ? parseInt(body.appointmentId) : null;
    }
    if (body.prescribedAt !== undefined) {
      updateData.prescribedAt = body.prescribedAt;
    }
    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    const updatedPrescription = await updatePrescription(id, updateData);

    return NextResponse.json({ success: true, data: updatedPrescription });
  } catch (error) {
    console.error(`Error updating prescription ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to update prescription" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid prescription ID" },
        { status: 400 },
      );
    }

    await deletePrescription(id);

    return NextResponse.json(
      { success: true, message: "Prescription deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(`Error deleting prescription ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to delete prescription" },
      { status: 500 },
    );
  }
} 