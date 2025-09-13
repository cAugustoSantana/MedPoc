ALTER TABLE "appointment" ADD COLUMN IF NOT EXISTS "duration" integer;--> statement-breakpoint
ALTER TABLE "appointment" ADD COLUMN IF NOT EXISTS "notes" text;--> statement-breakpoint
ALTER TABLE "appointment" ADD COLUMN IF NOT EXISTS "location" varchar;--> statement-breakpoint
ALTER TABLE "appointment" ADD COLUMN IF NOT EXISTS "priority" varchar;--> statement-breakpoint
ALTER TABLE "appointment" ADD COLUMN IF NOT EXISTS "confirmed" boolean DEFAULT false;