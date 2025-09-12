# Prescription PDF Service

This service provides PDF generation functionality for medical prescriptions using `@react-pdf/renderer`.

## Features

- **Beautiful PDF Layout**: Professional medical prescription format
- **Complete Patient Information**: Patient details, medications, and doctor information
- **Responsive Design**: Optimized for A4 paper size
- **Secure Access**: Authentication required for PDF generation

## Usage

### API Endpoint

```
GET /api/prescriptions/[id]/pdf
```

**Authentication**: Required (Clerk)

**Response**: PDF file download

### Frontend Integration

#### From Prescription Details Dialog

```tsx
// PDF download button is automatically included in the prescription details dialog
<PrescriptionDetails
  open={isDetailsOpen}
  onOpenChange={setIsDetailsOpen}
  prescription={selectedPrescription}
/>
```

#### From Prescriptions Table

```tsx
// PDF download button is available in the actions column
<Button
  onClick={() => handleDownloadPDF(prescription.prescriptionId)}
  disabled={downloadingPDF === prescription.prescriptionId}
  title="Download PDF"
>
  <Download className="h-4 w-4" />
</Button>
```

### Programmatic Usage

```typescript
import { generatePrescriptionPDF } from '@/lib/pdf/prescription-generator';

const pdfBuffer = await generatePrescriptionPDF({
  prescription: prescriptionData,
  prescriptionItems: itemsData,
  patient: patientData,
  doctor: doctorData,
});
```

## PDF Structure

The generated PDF includes:

1. **Header**: Clinic information and prescription number
2. **Patient Information**: Name, DOB, gender, contact details
3. **Medications Table**: Drug name, dosage, frequency, duration, instructions
4. **Additional Notes**: Prescription notes if available
5. **Doctor Signature**: Prescribing doctor information
6. **Footer**: Legal disclaimers and emergency information

## Styling

The PDF uses a professional medical document design with:

- Blue color scheme (#2563eb)
- Clean typography (Helvetica)
- Structured layout with proper spacing
- Professional table formatting
- Medical document standards

## Error Handling

- Invalid prescription ID: 400 Bad Request
- Unauthorized access: 401 Unauthorized
- Prescription not found: 404 Not Found
- PDF generation errors: 500 Internal Server Error

## Dependencies

- `@react-pdf/renderer`: PDF generation library
- `@clerk/nextjs`: Authentication
- `drizzle-orm`: Database queries
