import { type NextRequest, NextResponse } from 'next/server';

import { getPatientById } from '@/db/queries/patients';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;

    const patient = await getPatientById(uuid);

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
