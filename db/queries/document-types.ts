import { db } from '@/db';
import { documentType } from '@/db/migrations/schema';
import { asc } from 'drizzle-orm';
import { eq } from 'drizzle-orm';

export interface DocumentType {
  documentTypeId: number;
  name: string;
  uuid: string | null;
  createdAt: string | null;
}

export async function getAllDocumentTypes(): Promise<DocumentType[]> {
  try {
    const documentTypes = await db
      .select({
        documentTypeId: documentType.documentTypeId,
        name: documentType.name,
        uuid: documentType.uuid,
        createdAt: documentType.createdAt,
      })
      .from(documentType)
      .orderBy(asc(documentType.documentTypeId));

    return documentTypes;
  } catch (error) {
    console.error('Error fetching document types:', error);
    throw new Error('Failed to fetch document types');
  }
}

export async function getDocumentTypeById(
  documentTypeId: number
): Promise<DocumentType | null> {
  try {
    const documentTypes = await db
      .select({
        documentTypeId: documentType.documentTypeId,
        name: documentType.name,
        uuid: documentType.uuid,
        createdAt: documentType.createdAt,
      })
      .from(documentType)
      .where(eq(documentType.documentTypeId, documentTypeId))
      .limit(1);

    return documentTypes[0] || null;
  } catch (error) {
    console.error('Error fetching document type by ID:', error);
    throw new Error('Failed to fetch document type');
  }
}
