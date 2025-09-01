import { NextResponse } from 'next/server';
import { getAllRoles } from '@/db/queries/roles';

export async function GET() {
  try {
    const roles = await getAllRoles();

    return NextResponse.json({
      success: true,
      data: roles,
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch roles',
      },
      { status: 500 }
    );
  }
}
