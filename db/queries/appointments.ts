import {
  Appointment,
  NewAppointment,
  AppointmentWithDetails,
} from '@/types/appointment';
import { db } from '@/db';
import { appointment, patient, appUser } from '../migrations/schema';
import { eq, and, gte, lte, desc, asc, not } from 'drizzle-orm';

export async function getAllAppointments(): Promise<Appointment[]> {
  const appointments = await db.select().from(appointment);
  console.log('Fetched appointments:', appointments);
  return appointments;
}

export async function getAppointmentsWithDetails(): Promise<
  AppointmentWithDetails[]
> {
  const appointments = await db
    .select({
      appointmentId: appointment.appointmentId,
      uuid: appointment.uuid,
      appUserId: appointment.appUserId,
      patientId: appointment.patientId,
      scheduledAt: appointment.scheduledAt,
      reason: appointment.reason,
      status: appointment.status,
      duration: appointment.duration,
      notes: appointment.notes,
      location: appointment.location,
      priority: appointment.priority,
      confirmed: appointment.confirmed,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
      patientName: patient.name,
      doctorName: appUser.name,
    })
    .from(appointment)
    .leftJoin(patient, eq(appointment.patientId, patient.patientId))
    .leftJoin(appUser, eq(appointment.appUserId, appUser.appUserId))
    .orderBy(asc(appointment.scheduledAt));

  return appointments;
}

export async function getAppointmentsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<AppointmentWithDetails[]> {
  const appointments = await db
    .select({
      appointmentId: appointment.appointmentId,
      uuid: appointment.uuid,
      appUserId: appointment.appUserId,
      patientId: appointment.patientId,
      scheduledAt: appointment.scheduledAt,
      reason: appointment.reason,
      status: appointment.status,
      duration: appointment.duration,
      notes: appointment.notes,
      location: appointment.location,
      priority: appointment.priority,
      confirmed: appointment.confirmed,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
      patientName: patient.name,
      doctorName: appUser.name,
    })
    .from(appointment)
    .leftJoin(patient, eq(appointment.patientId, patient.patientId))
    .leftJoin(appUser, eq(appointment.appUserId, appUser.appUserId))
    .where(
      and(
        gte(appointment.scheduledAt, startDate.toISOString()),
        lte(appointment.scheduledAt, endDate.toISOString())
      )
    )
    .orderBy(asc(appointment.scheduledAt));

  return appointments;
}

export async function getAppointmentsByDate(
  date: Date
): Promise<AppointmentWithDetails[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return getAppointmentsByDateRange(startOfDay, endOfDay);
}

export async function getAppointmentsByPatient(
  patientId: number
): Promise<AppointmentWithDetails[]> {
  const appointments = await db
    .select({
      appointmentId: appointment.appointmentId,
      uuid: appointment.uuid,
      appUserId: appointment.appUserId,
      patientId: appointment.patientId,
      scheduledAt: appointment.scheduledAt,
      reason: appointment.reason,
      status: appointment.status,
      duration: appointment.duration,
      notes: appointment.notes,
      location: appointment.location,
      priority: appointment.priority,
      confirmed: appointment.confirmed,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
      patientName: patient.name,
      doctorName: appUser.name,
    })
    .from(appointment)
    .leftJoin(patient, eq(appointment.patientId, patient.patientId))
    .leftJoin(appUser, eq(appointment.appUserId, appUser.appUserId))
    .where(eq(appointment.patientId, patientId))
    .orderBy(desc(appointment.scheduledAt));

  return appointments;
}

export async function getAppointmentsByDoctor(
  doctorId: number
): Promise<AppointmentWithDetails[]> {
  const appointments = await db
    .select({
      appointmentId: appointment.appointmentId,
      uuid: appointment.uuid,
      appUserId: appointment.appUserId,
      patientId: appointment.patientId,
      scheduledAt: appointment.scheduledAt,
      reason: appointment.reason,
      status: appointment.status,
      duration: appointment.duration,
      notes: appointment.notes,
      location: appointment.location,
      priority: appointment.priority,
      confirmed: appointment.confirmed,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
      patientName: patient.name,
      doctorName: appUser.name,
    })
    .from(appointment)
    .leftJoin(patient, eq(appointment.patientId, patient.patientId))
    .leftJoin(appUser, eq(appointment.appUserId, appUser.appUserId))
    .where(eq(appointment.appUserId, doctorId))
    .orderBy(desc(appointment.scheduledAt));

  return appointments;
}

export async function createAppointment(
  newAppointment: NewAppointment
): Promise<Appointment> {
  const createdAppointment = await db
    .insert(appointment)
    .values(newAppointment)
    .returning();
  console.log('Created appointment:', createdAppointment);
  return createdAppointment[0];
}

export async function updateAppointment(
  id: number,
  updatedAppointment: Partial<NewAppointment>
): Promise<Appointment> {
  const updatedAppointmentResult = await db
    .update(appointment)
    .set({
      ...updatedAppointment,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(appointment.appointmentId, id))
    .returning();
  console.log('Updated appointment:', updatedAppointmentResult);
  return updatedAppointmentResult[0];
}

export async function deleteAppointment(id: number): Promise<Appointment> {
  const deletedAppointment = await db
    .delete(appointment)
    .where(eq(appointment.appointmentId, id))
    .returning();
  console.log('Deleted appointment:', deletedAppointment);
  return deletedAppointment[0];
}

export async function getAppointmentById(
  id: number
): Promise<AppointmentWithDetails | null> {
  const result = await db
    .select({
      appointmentId: appointment.appointmentId,
      uuid: appointment.uuid,
      appUserId: appointment.appUserId,
      patientId: appointment.patientId,
      scheduledAt: appointment.scheduledAt,
      reason: appointment.reason,
      status: appointment.status,
      duration: appointment.duration,
      notes: appointment.notes,
      location: appointment.location,
      priority: appointment.priority,
      confirmed: appointment.confirmed,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
      patientName: patient.name,
      doctorName: appUser.name,
    })
    .from(appointment)
    .leftJoin(patient, eq(appointment.patientId, patient.patientId))
    .leftJoin(appUser, eq(appointment.appUserId, appUser.appUserId))
    .where(eq(appointment.appointmentId, id));

  if (!result.length) return null;
  return result[0];
}

export async function getAppointmentByUuid(
  uuid: string
): Promise<AppointmentWithDetails | null> {
  const result = await db
    .select({
      appointmentId: appointment.appointmentId,
      uuid: appointment.uuid,
      appUserId: appointment.appUserId,
      patientId: appointment.patientId,
      scheduledAt: appointment.scheduledAt,
      reason: appointment.reason,
      status: appointment.status,
      duration: appointment.duration,
      notes: appointment.notes,
      location: appointment.location,
      priority: appointment.priority,
      confirmed: appointment.confirmed,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
      patientName: patient.name,
      doctorName: appUser.name,
    })
    .from(appointment)
    .leftJoin(patient, eq(appointment.patientId, patient.patientId))
    .leftJoin(appUser, eq(appointment.appUserId, appUser.appUserId))
    .where(eq(appointment.uuid, uuid));

  if (!result.length) return null;
  return result[0];
}

// Utility function to convert form data to database format
export function convertFormDataToAppointment(
  formData: Record<string, unknown>,
  patientId: number,
  doctorId: number
): NewAppointment {
  const [hours, minutes] = formData.time.split(':');

  // Create date in local timezone to avoid timezone conversion issues
  const [year, month, day] = formData.date.split('-').map(Number);
  const appointmentDate = new Date(
    year,
    month - 1,
    day,
    parseInt(hours),
    parseInt(minutes)
  );

  return {
    appUserId: doctorId,
    patientId: patientId,
    scheduledAt: appointmentDate.toISOString(),
    reason: formData.notes || null,
    status: formData.status,
  };
}

// Get upcoming appointments (next 7 days)
export async function getUpcomingAppointments(): Promise<
  AppointmentWithDetails[]
> {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  return getAppointmentsByDateRange(today, nextWeek);
}

// Get today's appointments
export async function getTodayAppointments(): Promise<
  AppointmentWithDetails[]
> {
  return getAppointmentsByDate(new Date());
}

// Get appointments by status
export async function getAppointmentsByStatus(
  status: string
): Promise<AppointmentWithDetails[]> {
  const appointments = await db
    .select({
      appointmentId: appointment.appointmentId,
      uuid: appointment.uuid,
      appUserId: appointment.appUserId,
      patientId: appointment.patientId,
      scheduledAt: appointment.scheduledAt,
      reason: appointment.reason,
      status: appointment.status,
      duration: appointment.duration,
      notes: appointment.notes,
      location: appointment.location,
      priority: appointment.priority,
      confirmed: appointment.confirmed,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
      patientName: patient.name,
      doctorName: appUser.name,
    })
    .from(appointment)
    .leftJoin(patient, eq(appointment.patientId, patient.patientId))
    .leftJoin(appUser, eq(appointment.appUserId, appUser.appUserId))
    .where(eq(appointment.status, status))
    .orderBy(asc(appointment.scheduledAt));

  return appointments;
}

export async function getBookedTimesForDate(date: string): Promise<string[]> {
  // Build start and end of the day in local time
  const [year, month, day] = date.split('-').map(Number);
  const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

  const results = await db
    .select({
      scheduledAt: appointment.scheduledAt,
      status: appointment.status,
    })
    .from(appointment)
    .where(
      and(
        gte(appointment.scheduledAt, startOfDay.toISOString()),
        lte(appointment.scheduledAt, endOfDay.toISOString()),
        // Only include confirmed and pending appointments, exclude cancelled ones and null status
        not(eq(appointment.status, 'cancelled'))
      )
    );

  console.log('Raw appointment results for', date, ':', results);

  return results
    .filter((r) => r.status && r.status !== 'cancelled') // Additional filter for safety
    .map((r) => r.scheduledAt)
    .filter((dt): dt is string => typeof dt === 'string')
    .map((dt) => {
      const d = new Date(dt);
      return d.toTimeString().slice(0, 5); // 'HH:mm' in local time
    });
}
