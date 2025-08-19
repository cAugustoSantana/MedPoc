import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  getAllPrescriptions,
  createPrescription,
  getPrescriptionsByPatientId,
  getPrescriptionsByDoctorId
} from "@/db/queries/prescriptions";
import { NewPrescription } from "@/types/prescription";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');

    let prescriptions;

    if (patientId) {
      prescriptions = await getPrescriptionsByPatientId(parseInt(patientId));
    } else if (doctorId) {
      prescriptions = await getPrescriptionsByDoctorId(parseInt(doctorId));
    } else {
      prescriptions = await getAllPrescriptions();
    }

    return NextResponse.json({ success: true, data: prescriptions });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch prescriptions" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.patientId) {
      return NextResponse.json(
        { success: false, error: "Patient ID is required" },
        { status: 400 },
      );
    }

    const prescriptionData: NewPrescription = {
      patientId: parseInt(body.patientId),
      appUserId: body.appUserId ? parseInt(body.appUserId) : null, // Optional, can be set by system
      appointmentId: body.appointmentId ? parseInt(body.appointmentId) : null,
      prescribedAt: body.prescribedAt || new Date().toISOString(),
      notes: body.notes || null,
    };

    const newPrescription = await createPrescription(prescriptionData);

    return NextResponse.json(
      { success: true, data: newPrescription },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating prescription:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create prescription" },
      { status: 500 },
    );
  }
}
