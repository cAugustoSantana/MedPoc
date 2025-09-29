import { NextRequest, NextResponse } from 'next/server';
import { processFileWithServerOCR } from '@/lib/ocr-server-service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('🚀 Starting server-side OCR processing...');
    console.log(
      '📁 File:',
      file.name,
      file.type,
      `${(file.size / 1024 / 1024).toFixed(2)} MB`
    );

    // Process file with server-side OCR
    const result = await processFileWithServerOCR(file);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to process file' },
        { status: 500 }
      );
    }

    console.log('✅ Server-side OCR completed successfully!');

    return NextResponse.json({
      success: true,
      data: result.data,
      confidence: result.confidence,
      rawText: result.rawText,
    });
  } catch (error) {
    console.error('❌ Server-side OCR API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process file with server-side OCR' },
      { status: 500 }
    );
  }
}
