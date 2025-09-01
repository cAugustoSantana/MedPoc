import { NextResponse } from 'next/server';
import { getAllDocumentTypes } from '@/db/queries/document-types';

export async function GET() {
  try {
    const documentTypes = await getAllDocumentTypes();

    return NextResponse.json({
      success: true,
      data: documentTypes,
    });
  } catch (error) {
    console.error('Error fetching document types:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch document types',
      },
      { status: 500 }
    );
  }
}
