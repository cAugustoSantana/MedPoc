import { db } from '@/db';
import { role } from '@/db/migrations/schema';
import { eq, asc } from 'drizzle-orm';

export interface Role {
  roleId: number;
  name: string;
  uuid: string | null;
  createdAt: string | null;
}

export async function getAllRoles(): Promise<Role[]> {
  try {
    const roles = await db
      .select({
        roleId: role.roleId,
        name: role.name,
        uuid: role.uuid,
        createdAt: role.createdAt,
      })
      .from(role)
      .orderBy(asc(role.roleId));

    return roles;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw new Error('Failed to fetch roles');
  }
}

export async function getRoleById(roleId: number): Promise<Role | null> {
  try {
    const roles = await db
      .select({
        roleId: role.roleId,
        name: role.name,
        uuid: role.uuid,
        createdAt: role.createdAt,
      })
      .from(role)
      .where(eq(role.roleId, roleId))
      .limit(1);

    return roles[0] || null;
  } catch (error) {
    console.error('Error fetching role by ID:', error);
    throw new Error('Failed to fetch role');
  }
}
