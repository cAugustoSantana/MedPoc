// Mock OCR service for server-side processing (simulates real OCR)

export interface ExtractedTestData {
  testType?: string;
  testDate?: string;
  orderingPhysician?: string;
  labName?: string;
  results: {
    parameter: string;
    value: string;
    unit: string;
    referenceRange: string;
    status: 'normal' | 'high' | 'low' | 'critical';
  }[];
}

export interface OCRProcessingResult {
  success: boolean;
  data?: ExtractedTestData;
  error?: string;
  confidence?: number;
  rawText?: string;
}

// Enhanced text extraction with better pattern matching
export function extractTestDataFromText(text: string): ExtractedTestData {
  const extractedData: ExtractedTestData = {
    results: [],
  };

  // Clean and normalize text
  const cleanText = text.replace(/\s+/g, ' ').trim();

  // Extract test type with more comprehensive patterns (English + Spanish)
  const testTypePatterns = [
    // English patterns
    /(?:test type|test name|examination|procedure):\s*([^\n\r]+)/i,
    /(?:blood test|lab test|laboratory test|clinical test):\s*([^\n\r]+)/i,
    /(?:complete blood count|cbc|basic metabolic panel|bmp|comprehensive metabolic panel|cmp|lipid panel|thyroid panel)/i,
    /(?:chemistry panel|chemistry profile|metabolic panel)/i,
    // Spanish patterns
    /(?:tipo de prueba|nombre de prueba|examen|procedimiento):\s*([^\n\r]+)/i,
    /(?:prueba de sangre|prueba de laboratorio|prueba clínica):\s*([^\n\r]+)/i,
    /(?:hemograma completo|biometría hemática|perfil metabólico básico|perfil lipídico|perfil tiroideo)/i,
    /(?:panel de química|perfil de química|perfil metabólico)/i,
  ];

  for (const pattern of testTypePatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      extractedData.testType = (match[1] || match[0]).trim();
      break;
    }
  }

  // Extract test date with multiple formats (English + Spanish)
  const datePatterns = [
    // English patterns
    /(?:date|collected|drawn|specimen date):\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(?:date|collected|drawn|specimen date):\s*(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/i,
    /(?:date|collected|drawn|specimen date):\s*([a-zA-Z]+\s+\d{1,2},?\s+\d{4})/i,
    // Spanish patterns
    /(?:fecha|recolectado|extraído|fecha de muestra):\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(?:fecha|recolectado|extraído|fecha de muestra):\s*(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/i,
    /(?:fecha|recolectado|extraído|fecha de muestra):\s*([a-zA-Záéíóúñ]+\s+\d{1,2},?\s+\d{4})/i,
    // Generic date patterns
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
    /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,
    /([a-zA-Záéíóúñ]+\s+\d{1,2},?\s+\d{4})/,
  ];

  for (const pattern of datePatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      extractedData.testDate = match[1];
      break;
    }
  }

  // Extract physician name (English + Spanish)
  const physicianPatterns = [
    // English patterns
    /(?:physician|doctor|dr\.?|ordering physician|ordering doctor):\s*([^\n\r]+)/i,
    /(?:ordered by|requested by|attending):\s*([^\n\r]+)/i,
    /(?:signature|signed by):\s*([^\n\r]+)/i,
    // Spanish patterns
    /(?:médico|doctor|dr\.?|médico ordenante|doctor ordenante):\s*([^\n\r]+)/i,
    /(?:ordenado por|solicitado por|médico tratante):\s*([^\n\r]+)/i,
    /(?:firma|firmado por):\s*([^\n\r]+)/i,
  ];

  for (const pattern of physicianPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      extractedData.orderingPhysician = match[1].trim();
      break;
    }
  }

  // Extract lab name (English + Spanish)
  const labPatterns = [
    // English patterns
    /(?:laboratory|lab|facility|performing lab):\s*([^\n\r]+)/i,
    /(?:performed at|analyzed at|processed at):\s*([^\n\r]+)/i,
    /(?:reporting lab|reporting laboratory):\s*([^\n\r]+)/i,
    // Spanish patterns
    /(?:laboratorio|lab|instalación|laboratorio ejecutor):\s*([^\n\r]+)/i,
    /(?:realizado en|analizado en|procesado en):\s*([^\n\r]+)/i,
    /(?:laboratorio reportante|laboratorio de reporte):\s*([^\n\r]+)/i,
  ];

  for (const pattern of labPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      extractedData.labName = match[1].trim();
      break;
    }
  }

  // Extract test results with improved pattern matching
  const resultLines = cleanText.split(/[\n\r]+/).filter((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine.length < 3) return false;

    // Look for lines that contain common lab parameters or numeric values (English + Spanish)
    const commonParams = [
      // English parameters
      'glucose',
      'cholesterol',
      'hdl',
      'ldl',
      'triglycerides',
      'hemoglobin',
      'hematocrit',
      'wbc',
      'rbc',
      'platelets',
      'sodium',
      'potassium',
      'chloride',
      'bun',
      'creatinine',
      'alt',
      'ast',
      'alkaline phosphatase',
      'bilirubin',
      'protein',
      'albumin',
      'calcium',
      'phosphorus',
      'magnesium',
      'co2',
      'anion gap',
      'osmolality',
      'urea',
      'uric acid',
      // Spanish parameters
      'glucosa',
      'colesterol',
      'hdl',
      'ldl',
      'triglicéridos',
      'hemoglobina',
      'hematocrito',
      'leucocitos',
      'glóbulos blancos',
      'eritrocitos',
      'glóbulos rojos',
      'plaquetas',
      'sodio',
      'potasio',
      'cloruro',
      'nitrógeno ureico',
      'creatinina',
      'alt',
      'ast',
      'fosfatasa alcalina',
      'bilirrubina',
      'proteína',
      'albúmina',
      'calcio',
      'fósforo',
      'magnesio',
      'co2',
      'brecha aniónica',
      'osmolalidad',
      'urea',
      'ácido úrico',
    ];

    const hasCommonParam = commonParams.some((param) =>
      trimmedLine.toLowerCase().includes(param.toLowerCase())
    );

    // Also look for lines with numeric values that might be test results
    const hasNumericValue = /\d+\.?\d*\s*[a-zA-Z%\/]*\s*(?:\([^)]+\))?/.test(
      trimmedLine
    );

    return hasCommonParam || hasNumericValue;
  });

  for (const line of resultLines) {
    // Enhanced regex for extracting test results
    // This pattern looks for: parameter name, value, unit, and reference range
    const resultMatch = line.match(
      /([a-zA-Z\s\-]+?)\s+([\d.]+)\s*([a-zA-Z%\/]*)\s*(?:\(([^)]+)\))?/
    );

    if (resultMatch) {
      const parameter = resultMatch[1].trim();
      const value = resultMatch[2];
      const unit = resultMatch[3] || '';
      const referenceRange = resultMatch[4] || '';

      // Determine status based on value and reference range
      let status: 'normal' | 'high' | 'low' | 'critical' = 'normal';

      if (referenceRange) {
        // Parse reference range (e.g., "70-100", "<200", ">40")
        const rangeMatch = referenceRange.match(
          /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/
        );
        const lessThanMatch = referenceRange.match(/<(\d+(?:\.\d+)?)/);
        const greaterThanMatch = referenceRange.match(/>(\d+(?:\.\d+)?)/);

        const numValue = parseFloat(value);

        if (rangeMatch) {
          const min = parseFloat(rangeMatch[1]);
          const max = parseFloat(rangeMatch[2]);

          if (numValue < min) status = 'low';
          else if (numValue > max) status = 'high';
          else status = 'normal';
        } else if (lessThanMatch) {
          const threshold = parseFloat(lessThanMatch[1]);
          if (numValue >= threshold) status = 'high';
          else status = 'normal';
        } else if (greaterThanMatch) {
          const threshold = parseFloat(greaterThanMatch[1]);
          if (numValue <= threshold) status = 'low';
          else status = 'normal';
        }
      }

      // Only add if we have a meaningful parameter name
      if (parameter.length > 2) {
        extractedData.results.push({
          parameter,
          value,
          unit,
          referenceRange,
          status,
        });
      }
    }
  }

  return extractedData;
}

// Server-side OCR processing using Tesseract.js with proper configuration
export async function processFileWithServerOCR(
  file: File
): Promise<OCRProcessingResult> {
  try {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Unsupported file type. Please upload PDF or image files.',
      };
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File too large. Please upload files smaller than 10MB.',
      };
    }

    console.log('🔍 Starting server-side OCR processing...');
    console.log('📄 File details:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    });

    // Simulate OCR processing delay
    console.log('📊 OCR Progress: 25%');
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('📊 OCR Progress: 50%');
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('📊 OCR Progress: 75%');
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('📊 OCR Progress: 100%');

    // Mock extracted text based on file type
    let mockExtractedText = '';

    if (file.type === 'application/pdf') {
      mockExtractedText = `
        LABORATORY REPORT
        Patient: John Doe
        Date: 12/15/2024
        Ordering Physician: Dr. Smith
        Laboratory: City Medical Lab
        
        Test Results:
        Glucose 95 mg/dL (70-100)
        Cholesterol 180 mg/dL (<200)
        HDL 45 mg/dL (>40)
        LDL 110 mg/dL (<100)
        Triglycerides 150 mg/dL (<150)
        Hemoglobin 14.2 g/dL (12-16)
        Hematocrit 42% (36-46)
        WBC 7.2 K/uL (4.5-11.0)
        RBC 4.8 M/uL (4.0-5.2)
        Platelets 250 K/uL (150-450)
        Sodium 140 mEq/L (136-145)
        Potassium 4.2 mEq/L (3.5-5.0)
        Chloride 102 mEq/L (98-107)
        BUN 15 mg/dL (7-20)
        Creatinine 1.0 mg/dL (0.6-1.2)
      `;
    } else if (file.type.startsWith('image/')) {
      mockExtractedText = `
        LAB RESULTS
        Date: 12/15/2024
        Dr. Smith
        City Medical Lab
        
        Glucose: 95 mg/dL (70-100)
        Cholesterol: 180 mg/dL (<200)
        HDL: 45 mg/dL (>40)
        LDL: 110 mg/dL (<100)
        Triglycerides: 150 mg/dL (<150)
      `;
    }

    const text = mockExtractedText;
    const confidence = 85;

    console.log('✅ OCR completed successfully!');
    console.log('📝 Raw extracted text:');
    console.log('='.repeat(50));
    console.log(text);
    console.log('='.repeat(50));
    console.log('🎯 Confidence score:', confidence);

    // Extract test data from the OCR text
    console.log('🔍 Starting data extraction...');
    const extractedData = extractTestDataFromText(text);

    console.log('📊 Extracted Test Data:');
    console.log('='.repeat(50));
    console.log('Test Type:', extractedData.testType);
    console.log('Test Date:', extractedData.testDate);
    console.log('Ordering Physician:', extractedData.orderingPhysician);
    console.log('Lab Name:', extractedData.labName);
    console.log('Number of Results:', extractedData.results.length);
    console.log('Results:');
    extractedData.results.forEach((result, index) => {
      console.log(
        `  ${index + 1}. ${result.parameter}: ${result.value} ${result.unit} (${result.referenceRange}) - ${result.status}`
      );
    });
    console.log('='.repeat(50));

    // Validate that we extracted some meaningful data
    if (
      !extractedData.results.length &&
      !extractedData.testType &&
      !extractedData.testDate
    ) {
      return {
        success: false,
        error:
          'No test data could be extracted from the file. Please ensure the file contains readable lab results.',
      };
    }

    return {
      success: true,
      data: extractedData,
      confidence: confidence / 100,
      rawText: text,
    };
  } catch (error) {
    console.error('❌ Server-side OCR processing error:', error);
    return {
      success: false,
      error:
        'Failed to process file with server-side OCR. Please try again or ensure the file is readable.',
    };
  }
}
