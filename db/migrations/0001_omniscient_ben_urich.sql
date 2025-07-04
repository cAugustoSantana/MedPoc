ALTER TABLE "appointment" ADD COLUMN "duration" integer;--> statement-breakpoint
ALTER TABLE "appointment" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "appointment" ADD COLUMN "location" varchar;--> statement-breakpoint
ALTER TABLE "appointment" ADD COLUMN "priority" varchar;--> statement-breakpoint
ALTER TABLE "appointment" ADD COLUMN "confirmed" boolean DEFAULT false;