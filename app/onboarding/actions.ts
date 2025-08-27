'use server';

import { getCurrentUserId } from '@/lib/auth-utils';
import { db } from '@/db';
import { appUser } from '@/db/migrations/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { OnboardingFormData } from '@/lib/validations/onboarding';

type OnboardingData = OnboardingFormData;

export async function completeOnboardingAction(data: OnboardingData) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    // Update the user's profile with onboarding data
    await db
      .update(appUser)
      .set({
        name: data.name,
        phone: data.phone || null,
        roleId: parseInt(data.role),
        specialty: data.specialty,
        documentTypeId: data.documentType ? parseInt(data.documentType) : null,
        documentNumber: data.documentNumber || null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(appUser.appUserId, userId));

    revalidatePath('/dashboard');
    revalidatePath('/onboarding');

    return { success: true };
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return { success: false, error: 'Failed to complete onboarding' };
  }
}
