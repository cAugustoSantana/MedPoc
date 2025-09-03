import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/db';
import { appUser } from '@/db/migrations/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function getCurrentUserId(): Promise<number | null> {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return null;
    }

    // Check if user already exists in our database
    const existingUser = await db
      .select({ appUserId: appUser.appUserId })
      .from(appUser)
      .where(eq(appUser.clerkUserId, userId))
      .limit(1);

    if (existingUser.length > 0) {
      return existingUser[0].appUserId;
    }

    // User doesn't exist yet - they need to complete onboarding first
    return null;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
}

// Keep the old function name for backward compatibility
export async function getCurrentDoctorId(): Promise<number | null> {
  return getCurrentUserId();
}

export async function getCurrentUserInfo() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return null;
    }

    // Get both Clerk user info and app_user info
    const userRecord = await db
      .select()
      .from(appUser)
      .where(eq(appUser.clerkUserId, userId))
      .limit(1);

    return {
      clerkUser: user,
      appUser: userRecord[0] || null,
    };
  } catch (error) {
    console.error('Error getting current user info:', error);
    return null;
  }
}

export async function needsOnboarding(): Promise<boolean> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return false;
    }

    // Check if user exists in our database
    const existingUser = await db
      .select({
        appUserId: appUser.appUserId,
        name: appUser.name,
        specialty: appUser.specialty,
        roleId: appUser.roleId,
        documentTypeId: appUser.documentTypeId,
        documentNumber: appUser.documentNumber,
      })
      .from(appUser)
      .where(eq(appUser.clerkUserId, userId))
      .limit(1);

    // If no user exists, they need onboarding
    if (!existingUser[0]) {
      return true;
    }

    const user = existingUser[0];

    // Check if user has a proper name (not "Unknown User")
    if (!user.name || user.name === 'Unknown User') {
      return true;
    }

    // Check if user has selected a role
    if (!user.roleId) {
      return true;
    }

    // Check if user has a specialty (required for medical staff)
    if (!user.specialty) {
      return true;
    }

    // Check if user has provided document information
    if (!user.documentTypeId || !user.documentNumber) {
      return true;
    }

    // If all checks pass, onboarding is complete
    return false;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    // If there's an error checking, assume onboarding is needed for safety
    return true;
  }
}

export async function getCurrentUserRole(): Promise<number | null> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    const userRecord = await db
      .select({ roleId: appUser.roleId })
      .from(appUser)
      .where(eq(appUser.clerkUserId, userId))
      .limit(1);

    return userRecord[0]?.roleId || null;
  } catch (error) {
    console.error('Error getting current user role:', error);
    return null;
  }
}

export async function createUserFromOnboarding(
  clerkUserId: string,
  email: string,
  onboardingData: {
    name: string;
    phone?: string;
    roleId: number;
    specialty: string;
    documentTypeId?: number;
    documentNumber?: string;
  }
): Promise<number | null> {
  try {
    const userRecord = await db
      .insert(appUser)
      .values({
        uuid: randomUUID(),
        clerkUserId,
        name: onboardingData.name,
        email,
        phone: onboardingData.phone || null,
        roleId: onboardingData.roleId,
        specialty: onboardingData.specialty,
        documentTypeId: onboardingData.documentTypeId || null,
        documentNumber: onboardingData.documentNumber || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning({ appUserId: appUser.appUserId });

    return userRecord[0].appUserId;
  } catch (error) {
    console.error('Error creating user from onboarding:', error);
    return null;
  }
}
