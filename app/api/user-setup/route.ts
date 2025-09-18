import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { needsOnboarding } from '@/lib/auth-utils';

export async function GET() {
  try {
    // Check authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user needs onboarding
    const onboardingRequired = await needsOnboarding();

    return NextResponse.json({
      success: true,
      needsOnboarding: onboardingRequired,
    });
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check onboarding status' },
      { status: 500 }
    );
  }
}
