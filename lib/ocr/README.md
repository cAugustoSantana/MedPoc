# OCR Service

This directory contains the OCR (Optical Character Recognition) service for extracting test results from uploaded PDF and image files.

## Features

- **Mock OCR Processing**: Simulates real text extraction for testing and development
- **Bilingual Support**: Supports both English and Spanish lab reports
- **Server-side Processing**: OCR processing happens on the server for better performance
- **Smart Data Extraction**: Automatically extracts test type, date, physician, lab name, and results
- **Status Detection**: Automatically determines if values are normal, high, low, or critical
- **File Validation**: Supports PDF and image files up to 10MB

## Usage

**Server-side OCR**: OCR processing is now handled on the server via the `/api/ocr` endpoint.

```typescript
// Client-side usage (in components)
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/ocr', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
if (result.success) {
  console.log('Extracted data:', result.data);
  console.log('Confidence:', result.confidence);
} else {
  console.error('OCR failed:', result.error);
}
```

## Supported File Types

- PDF files (`.pdf`)
- Image files (`.png`, `.jpg`, `.jpeg`)

## File Size Limits

- Maximum file size: 10MB
- Files larger than 10MB will be rejected

## Extracted Data Structure

```typescript
interface ExtractedTestData {
  testType?: string; // e.g., "Complete Blood Count"
  testDate?: string; // e.g., "12/15/2024"
  orderingPhysician?: string; // e.g., "Dr. Smith"
  labName?: string; // e.g., "City Medical Lab"
  results: {
    parameter: string; // e.g., "Glucose"
    value: string; // e.g., "95"
    unit: string; // e.g., "mg/dL"
    referenceRange: string; // e.g., "70-100"
    status: 'normal' | 'high' | 'low' | 'critical';
  }[];
}
```

## Text Extraction Patterns

The service uses regex patterns to extract data from OCR text in both English and Spanish:

- **Test Type**:
  - English: "test type", "examination", "procedure"
  - Spanish: "tipo de prueba", "examen", "procedimiento"
- **Date**: Various date formats (MM/DD/YYYY, YYYY-MM-DD, etc.)
- **Physician**:
  - English: "physician", "doctor", "ordering physician"
  - Spanish: "médico", "doctor", "médico ordenante"
- **Lab Name**:
  - English: "laboratory", "lab", "facility"
  - Spanish: "laboratorio", "lab", "instalación"
- **Test Results**: Parameter names, values, units, and reference ranges in both languages

## Customization

To add support for your lab's specific format, modify the regex patterns in `extractTestDataFromText`:

```typescript
// Add new test type patterns
const testTypePatterns = [
  // ... existing patterns
  /(?:your lab's specific pattern):\s*([^\n\r]+)/i,
];
```

## Error Handling

The service includes comprehensive error handling for:

- Unsupported file types
- Files too large
- OCR processing failures
- No data extracted
- Network errors

## Performance

- OCR processing typically takes 2-5 seconds depending on file size
- Progress is logged to console during processing
- Results include confidence scores for quality assessment

## Testing

Run the tests to verify the text extraction patterns:

```bash
pnpm test lib/__tests__/ocr-service.test.ts
```

## Dependencies

- `tesseract.js@^6.0.1` - OCR processing library
- No external API services required
- No server-side processing needed
