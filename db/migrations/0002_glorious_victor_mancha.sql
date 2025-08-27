ALTER TABLE "app_user" ADD COLUMN "clerk_user_id" varchar;--> statement-breakpoint
ALTER TABLE "app_user" ADD CONSTRAINT "app_user_clerk_user_id_key" UNIQUE("clerk_user_id");