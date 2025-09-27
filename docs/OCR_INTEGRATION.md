# OCR Integration Guide

This document explains how to integrate real OCR services with the MedPoc application for automatic test result extraction.

## Current Implementation

The current implementation uses a **mock OCR service** for **server-side processing** with **bilingual support (English + Spanish)**. This simulates real text extraction from uploaded PDFs and images for testing and development purposes.

**Important**: This is currently a mock implementation that simulates OCR processing. For production, you would integrate with a real OCR service like Google Cloud Vision API, AWS Textract, or Azure Computer Vision.

## Supported File Types

- PDF files (`.pdf`)
- Image files (`.png`, `.jpg`, `.jpeg`)

## File Size Limits

- Maximum file size: 10MB
- Files larger than 10MB will be rejected with an error message

## Integration Options

### 1. Google Cloud Vision API

To integrate with Google Cloud Vision API:

1. Set up a Google Cloud project and enable the Vision API
2. Create a service account and download the credentials
3. Add the credentials to your environment variables
4. Update the `processFileWithGoogleVision` function in `lib/ocr-service.ts`

```typescript
// Example implementation
const response = await fetch(
  'https://vision.googleapis.com/v1/images:annotate',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GOOGLE_CLOUD_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          image: { content: base64 },
          features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
        },
      ],
    }),
  }
);
```

### 2. AWS Textract

To integrate with AWS Textract:

1. Set up AWS credentials
2. Install the AWS SDK: `npm install aws-sdk`
3. Create a new function in `lib/ocr-server-service.ts`

```typescript
import AWS from 'aws-sdk';

const textract = new AWS.Textract({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function processFileWithAWS(
  file: File
): Promise<OCRProcessingResult> {
  // Implementation here
}
```

### 3. Azure Computer Vision

To integrate with Azure Computer Vision:

1. Create an Azure Computer Vision resource
2. Get your endpoint and API key
3. Create a new function in `lib/ocr-server-service.ts`

```typescript
export async function processFileWithAzure(
  file: File
): Promise<OCRProcessingResult> {
  const response = await fetch(
    `${process.env.AZURE_VISION_ENDPOINT}/vision/v3.2/read/analyze`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_VISION_KEY,
        'Content-Type': 'application/octet-stream',
      },
      body: file,
    }
  );
  // Process response
}
```

### 4. Mock OCR Service (Currently Implemented)

The application currently uses a mock OCR service for server-side processing:

1. **Server-side processing**: OCR processing happens on the server
2. **Mock implementation**: Simulates real OCR for testing and development
3. **Easy to extend**: Simple to replace with real OCR service later

```typescript
// Current implementation in lib/ocr-server-service.ts (Mock OCR)
// Simulates OCR processing with realistic delays and data
console.log('📊 OCR Progress: 25%');
await new Promise((resolve) => setTimeout(resolve, 500));
console.log('📊 OCR Progress: 100%');

// Returns mock extracted text based on file type
const mockExtractedText = `
  LABORATORY REPORT
  Date: 12/15/2024
  Ordering Physician: Dr. Smith
  Laboratory: City Medical Lab
  
  Test Results:
  Glucose 95 mg/dL (70-100)
  Cholesterol 180 mg/dL (<200)
  HDL 45 mg/dL (>40)
`;
```

## Text Extraction Patterns

The system uses regex patterns to extract test data from OCR text. The patterns are defined in `extractTestDataFromText` function and can be customized based on your lab's report format.

### Common Patterns (English + Spanish)

- **Test Type**:
  - English: "test type", "examination", "procedure"
  - Spanish: "tipo de prueba", "examen", "procedimiento"
- **Date**:
  - English: "date", "collected", "drawn"
  - Spanish: "fecha", "recolectado", "extraído"
- **Physician**:
  - English: "physician", "doctor", "ordering physician"
  - Spanish: "médico", "doctor", "médico ordenante"
- **Lab Name**:
  - English: "laboratory", "lab", "facility"
  - Spanish: "laboratorio", "lab", "instalación"
- **Test Results**: Extracts parameter, value, unit, and reference range in both languages

### Customizing Patterns

To add support for your lab's specific format, modify the regex patterns in `extractTestDataFromText`:

```typescript
// Add new test type patterns
const testTypePatterns = [
  // ... existing patterns
  /(?:your lab's specific pattern):\s*([^\n\r]+)/i,
];

// Add new date patterns
const datePatterns = [
  // ... existing patterns
  /(?:your date format):\s*([^\n\r]+)/i,
];
```

## Error Handling

The system includes comprehensive error handling for:

- Unsupported file types
- Files too large
- OCR processing failures
- No data extracted
- Network errors

## Testing

To test the OCR integration:

1. Upload a PDF or image file with test results
2. The system will show a loading state while processing
3. Extracted data will be populated in step 2
4. Users can review and edit the extracted data before saving

## Performance Considerations

- OCR processing can take 2-5 seconds depending on file size and service
- Consider implementing progress indicators for large files
- Cache results to avoid re-processing the same files
- Implement retry logic for failed requests

## Security

- Files are processed in memory and not stored permanently
- Sensitive data should be handled according to HIPAA requirements
- Consider encrypting files before sending to OCR services
- Implement proper access controls and audit logging

## Cost Optimization

- Different OCR services have different pricing models
- Consider using cheaper services for simple text extraction
- Implement fallback mechanisms if primary service fails
- Monitor usage to optimize costs

## Future Enhancements

- Support for more file formats (DOCX, TXT)
- Batch processing for multiple files
- Machine learning for better pattern recognition
- Integration with lab information systems
- Real-time processing status updates
