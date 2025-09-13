ALTER TABLE "prescription_item" DROP CONSTRAINT IF EXISTS "prescription_item_dosage_detail_id_fkey";
--> statement-breakpoint
ALTER TABLE "prescription_item" DROP CONSTRAINT IF EXISTS "prescription_item_drug_id_fkey";
--> statement-breakpoint
ALTER TABLE "prescription_item" DROP CONSTRAINT IF EXISTS "prescription_item_frequency_detail_id_fkey";
--> statement-breakpoint
ALTER TABLE "prescription_item" ADD COLUMN IF NOT EXISTS "drug_name" varchar;--> statement-breakpoint
ALTER TABLE "prescription_item" ADD COLUMN IF NOT EXISTS "dosage" varchar;--> statement-breakpoint
ALTER TABLE "prescription_item" ADD COLUMN IF NOT EXISTS "frequency" varchar;--> statement-breakpoint
ALTER TABLE "prescription_item" DROP COLUMN IF EXISTS "drug_id";--> statement-breakpoint
ALTER TABLE "prescription_item" DROP COLUMN IF EXISTS "dosage_detail_id";--> statement-breakpoint
ALTER TABLE "prescription_item" DROP COLUMN IF EXISTS "frequency_detail_id";