import { renderToBuffer } from '@react-pdf/renderer';
import { PrescriptionPDF } from '@/components/pdf/prescription-pdf';
import { Prescription } from '@/types/prescription';
import { PrescriptionItemWithDetails } from '@/types/prescription-item';
import { Patient } from '@/types/patient';
import { InferSelectModel } from 'drizzle-orm';
import { appUser } from '@/db/migrations/schema';

type Doctor = InferSelectModel<typeof appUser>;

export interface PrescriptionPDFData {
  prescription: Prescription;
  prescriptionItems: PrescriptionItemWithDetails[];
  patient: Patient | null;
  doctor: Doctor | null;
}

export async function generatePrescriptionPDF(
  data: PrescriptionPDFData
): Promise<Buffer> {
  try {
    const doc = (
      <PrescriptionPDF
        prescription={data.prescription}
        prescriptionItems={data.prescriptionItems}
        patient={data.patient}
        doctor={data.doctor}
      />
    );
    const pdfBuffer = await renderToBuffer(doc);
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating prescription PDF:', error);
    throw new Error('Failed to generate prescription PDF');
  }
}

export async function generatePrescriptionPDFStream(
  data: PrescriptionPDFData
): Promise<NodeJS.ReadableStream> {
  try {
    const doc = (
      <PrescriptionPDF
        prescription={data.prescription}
        prescriptionItems={data.prescriptionItems}
        patient={data.patient}
        doctor={data.doctor}
      />
    );
    const pdfBuffer = await renderToBuffer(doc);
    const { Readable } = await import('stream');
    return new Readable({
      read() {
        this.push(pdfBuffer);
        this.push(null);
      },
    });
  } catch (error) {
    console.error('Error generating prescription PDF stream:', error);
    throw new Error('Failed to generate prescription PDF stream');
  }
}
