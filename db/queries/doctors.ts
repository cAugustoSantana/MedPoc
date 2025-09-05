import { db } from '../index';
import { appUser } from '../migrations/schema';
import { eq } from 'drizzle-orm';
import { InferSelectModel } from 'drizzle-orm';

export type Doctor = InferSelectModel<typeof appUser>;

export async function getDoctorById(appUserId: number): Promise<Doctor | null> {
  try {
    const doctors = await db
      .select()
      .from(appUser)
      .where(eq(appUser.appUserId, appUserId))
      .limit(1);

    return doctors[0] || null;
  } catch (error) {
    console.error(`Error fetching doctor with id ${appUserId}:`, error);
    throw new Error(`Failed to fetch doctor with id ${appUserId}`);
  }
}

export async function getAllDoctors(): Promise<Doctor[]> {
  try {
    const doctors = await db.select().from(appUser);
    return doctors;
  } catch (error) {
    console.error('Error fetching all doctors:', error);
    throw new Error('Failed to fetch doctors');
  }
}
