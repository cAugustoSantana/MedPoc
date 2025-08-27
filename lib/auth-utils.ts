import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/db';
import { appUser } from '@/db/migrations/schema';
import { eq } from 'drizzle-orm';

export async function getCurrentUserId(): Promise<number | null> {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return null;
    }

    // Find the app_user record that matches the Clerk user ID
    let userRecord = await db
      .select({ appUserId: appUser.appUserId })
      .from(appUser)
      .where(eq(appUser.clerkUserId, userId))
      .limit(1);

    // If user doesn't exist in our database, create them automatically
    if (userRecord.length === 0) {
      const newUser = await db
        .insert(appUser)
        .values({
          clerkUserId: userId,
          name:
            `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
            'Unknown User',
          email: user.emailAddresses[0]?.emailAddress,
          roleId: 1, // Default to doctor role, will be updated during onboarding
        })
        .returning({ appUserId: appUser.appUserId });

      userRecord = newUser;
    }

    return userRecord[0].appUserId;
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
    const userId = await getCurrentUserId();

    if (!userId) {
      return false;
    }

    // Check if user has completed onboarding (has specialty)
    const userRecord = await db
      .select({ specialty: appUser.specialty })
      .from(appUser)
      .where(eq(appUser.appUserId, userId))
      .limit(1);

    return !userRecord[0]?.specialty;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

export async function getCurrentUserRole(): Promise<number | null> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return null;
    }

    const userRecord = await db
      .select({ roleId: appUser.roleId })
      .from(appUser)
      .where(eq(appUser.appUserId, userId))
      .limit(1);

    return userRecord[0]?.roleId || null;
  } catch (error) {
    console.error('Error getting current user role:', error);
    return null;
  }
}
