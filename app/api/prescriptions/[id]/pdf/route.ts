import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generatePrescriptionPDF } from '@/lib/pdf/prescription-generator';
import { getPrescriptionById } from '@/db/queries/prescriptions';
import { getPrescriptionItemsByPrescriptionId } from '@/db/queries/prescription-items';
import { getPatientByPatientId } from '@/db/queries/patients';
import { getDoctorById } from '@/db/queries/doctors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const prescriptionId = parseInt(id);

    if (isNaN(prescriptionId)) {
      return NextResponse.json(
        { error: 'Invalid prescription ID' },
        { status: 400 }
      );
    }

    // Fetch prescription data
    const prescription = await getPrescriptionById(prescriptionId);

    if (!prescription) {
      return NextResponse.json(
        { error: 'Prescription not found' },
        { status: 404 }
      );
    }

    // Fetch prescription items
    const prescriptionItems =
      await getPrescriptionItemsByPrescriptionId(prescriptionId);

    // Fetch patient data
    const patientData = prescription.patientId
      ? await getPatientByPatientId(prescription.patientId)
      : null;

    // Fetch doctor data
    const doctorData = prescription.appUserId
      ? await getDoctorById(prescription.appUserId)
      : null;

    // Generate PDF
    const pdfBuffer = await generatePrescriptionPDF({
      prescription,
      prescriptionItems,
      patient: patientData,
      doctor: doctorData,
    });

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="prescription-${prescriptionId}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating prescription PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate prescription PDF' },
      { status: 500 }
    );
  }
}
