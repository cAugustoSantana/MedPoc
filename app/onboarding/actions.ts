'use server';

import { createUserFromOnboarding } from '@/lib/auth-utils';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/db';
import { appUser } from '@/db/migrations/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { OnboardingFormData } from '@/lib/validations/onboarding';

type OnboardingData = OnboardingFormData;

export async function completeOnboardingAction(data: OnboardingData) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Check if user already exists
    const existingUser = await db
      .select({ appUserId: appUser.appUserId })
      .from(appUser)
      .where(eq(appUser.clerkUserId, userId))
      .limit(1);

    if (existingUser.length > 0) {
      // User exists, update their profile
      await db
        .update(appUser)
        .set({
          name: data.name,
          phone: data.phone || null,
          roleId: parseInt(data.role),
          specialty: data.specialty,
          documentTypeId: data.documentType
            ? parseInt(data.documentType)
            : null,
          documentNumber: data.documentNumber || null,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(appUser.appUserId, existingUser[0].appUserId));
    } else {
      // User doesn't exist, create new user from onboarding data
      const email = user.emailAddresses[0]?.emailAddress;
      if (!email) {
        return { success: false, error: 'Email address not found' };
      }

      const newUserId = await createUserFromOnboarding(userId, email, {
        name: data.name,
        phone: data.phone || undefined,
        roleId: parseInt(data.role),
        specialty: data.specialty,
        documentTypeId: data.documentType
          ? parseInt(data.documentType)
          : undefined,
        documentNumber: data.documentNumber || undefined,
      });

      if (!newUserId) {
        return { success: false, error: 'Failed to create user profile' };
      }
    }

    revalidatePath('/dashboard');
    revalidatePath('/onboarding');

    return { success: true };
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return { success: false, error: 'Failed to complete onboarding' };
  }
}
