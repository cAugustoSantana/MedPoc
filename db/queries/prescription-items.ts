import { db } from '../index';
import {
  PrescriptionItem,
  NewPrescriptionItem,
  PrescriptionItemWithDetails,
} from '@/types/prescription-item';
import {
  prescriptionItem,
  drug,
  dosageDetail,
  frequencyDetail,
} from '../migrations/schema';
import { eq } from 'drizzle-orm';

export async function getPrescriptionItemsByPrescriptionId(
  prescriptionId: number
): Promise<PrescriptionItemWithDetails[]> {
  try {
    const items = await db
      .select({
        itemId: prescriptionItem.itemId,
        uuid: prescriptionItem.uuid,
        prescriptionId: prescriptionItem.prescriptionId,
        drugId: prescriptionItem.drugId,
        dosageDetailId: prescriptionItem.dosageDetailId,
        frequencyDetailId: prescriptionItem.frequencyDetailId,
        duration: prescriptionItem.duration,
        instructions: prescriptionItem.instructions,
        createdAt: prescriptionItem.createdAt,
        drugName: drug.name,
        drugDosageForm: drug.dosageForm,
        drugStrength: drug.strength,
        dosageDescription: dosageDetail.description,
        frequencyDescription: frequencyDetail.description,
      })
      .from(prescriptionItem)
      .leftJoin(drug, eq(prescriptionItem.drugId, drug.drugId))
      .leftJoin(
        dosageDetail,
        eq(prescriptionItem.dosageDetailId, dosageDetail.dosageDetailId)
      )
      .leftJoin(
        frequencyDetail,
        eq(
          prescriptionItem.frequencyDetailId,
          frequencyDetail.frequencyDetailId
        )
      )
      .where(eq(prescriptionItem.prescriptionId, prescriptionId));

    return items;
  } catch (error) {
    console.error(
      `Error fetching prescription items for prescription ${prescriptionId}:`,
      error
    );
    throw new Error(
      `Failed to fetch prescription items for prescription ${prescriptionId}`
    );
  }
}

export async function createPrescriptionItem(
  itemData: NewPrescriptionItem
): Promise<PrescriptionItem> {
  try {
    const [newItem] = await db
      .insert(prescriptionItem)
      .values(itemData)
      .returning();
    return newItem;
  } catch (error) {
    console.error('Error creating prescription item:', error);
    throw new Error('Failed to create prescription item');
  }
}

export async function updatePrescriptionItem(
  id: number,
  itemData: Partial<NewPrescriptionItem>
): Promise<PrescriptionItem> {
  try {
    const [updatedItem] = await db
      .update(prescriptionItem)
      .set(itemData)
      .where(eq(prescriptionItem.itemId, id))
      .returning();

    if (!updatedItem) {
      throw new Error(`Prescription item with id ${id} not found`);
    }

    return updatedItem;
  } catch (error) {
    console.error(`Error updating prescription item with id ${id}:`, error);
    throw new Error(`Failed to update prescription item with id ${id}`);
  }
}

export async function deletePrescriptionItem(id: number): Promise<void> {
  try {
    const [deletedItem] = await db
      .delete(prescriptionItem)
      .where(eq(prescriptionItem.itemId, id))
      .returning();

    if (!deletedItem) {
      throw new Error(`Prescription item with id ${id} not found`);
    }
  } catch (error) {
    console.error(`Error deleting prescription item with id ${id}:`, error);
    throw new Error(`Failed to delete prescription item with id ${id}`);
  }
}

export async function deletePrescriptionItemsByPrescriptionId(
  prescriptionId: number
): Promise<void> {
  try {
    await db
      .delete(prescriptionItem)
      .where(eq(prescriptionItem.prescriptionId, prescriptionId));
  } catch (error) {
    console.error(
      `Error deleting prescription items for prescription ${prescriptionId}:`,
      error
    );
    throw new Error(
      `Failed to delete prescription items for prescription ${prescriptionId}`
    );
  }
}
