-- Current sql file was generated after introspecting the database
-- Migration to create initial database schema
CREATE TABLE IF NOT EXISTS "doctor_patient" (
	"doctor_patient_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"doctor_id" integer,
	"patient_id" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "doctor_patient_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dosage_detail" (
	"dosage_detail_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"description" varchar,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "dosage_detail_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "doctor_assistant" (
	"doctor_assistant_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"doctor_id" integer,
	"assistant_id" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "doctor_assistant_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "document_type" (
	"document_type_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "document_type_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "drug" (
	"drug_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"name" varchar,
	"dosage_form" varchar,
	"strength" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "drug_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "frequency_detail" (
	"frequency_detail_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"description" varchar,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "frequency_detail_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "appointment" (
	"appointment_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"app_user_id" integer,
	"patient_id" integer,
	"scheduled_at" timestamp,
	"reason" text,
	"status" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "appointment_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "disease" (
	"disease_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"name" varchar,
	"description" text,
	"icd_code" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "disease_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "insurance_company" (
	"insurance_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"name" varchar NOT NULL,
	"phone" varchar,
	"email" varchar,
	"address" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "insurance_company_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lab_test_result" (
	"lab_test_result_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"lab_test_id" integer,
	"parameter" varchar,
	"result_value" varchar,
	"unit" varchar,
	"reference_range" varchar,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "lab_test_result_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lab_test" (
	"lab_test_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"medical_record_id" integer,
	"test_type" varchar,
	"requested_by" integer,
	"requested_at" timestamp,
	"performed_at" timestamp,
	"file_url" varchar,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "lab_test_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medical_record" (
	"record_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"patient_id" integer,
	"app_user_id" integer,
	"appointment_id" integer,
	"notes" text,
	"diagnosis" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "medical_record_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "imaging_test_image" (
	"imaging_test_image_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"imaging_test_id" integer,
	"image_file_url" varchar,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "imaging_test_image_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prescription_item" (
	"item_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"prescription_id" integer,
	"drug_id" integer,
	"dosage_detail_id" integer,
	"frequency_detail_id" integer,
	"duration" varchar,
	"instructions" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "prescription_item_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prescription" (
	"prescription_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"app_user_id" integer,
	"patient_id" integer,
	"appointment_id" integer,
	"prescribed_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "prescription_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "role" (
	"role_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "role_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vital_sign" (
	"vital_sign_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"patient_id" integer,
	"appointment_id" integer,
	"weight_kg" double precision,
	"height_cm" double precision,
	"temperature_c" double precision,
	"heart_rate_bpm" integer,
	"respiratory_rate_bpm" integer,
	"bp_systolic" integer,
	"bp_diastolic" integer,
	"measured_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "vital_sign_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "imaging_test" (
	"imaging_test_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"medical_record_id" integer,
	"imaging_type" varchar,
	"requested_by" integer,
	"requested_at" timestamp,
	"performed_at" timestamp,
	"report_file_url" varchar,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "imaging_test_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app_user" (
	"app_user_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"name" varchar NOT NULL,
	"email" varchar,
	"phone" varchar,
	"role_id" integer,
	"specialty" varchar,
	"document_type_id" integer,
	"document_number" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "app_user_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medical_record_disease" (
	"record_disease_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"record_id" integer,
	"disease_id" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "medical_record_disease_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patient" (
	"patient_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid(),
	"name" varchar NOT NULL,
	"dob" date,
	"gender" varchar,
	"email" varchar,
	"phone" varchar,
	"address" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "patient_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patient_insurance" (
	"patient_insurance_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"patient_id" integer,
	"insurance_id" integer,
	"policy_number" varchar,
	"valid_from" date,
	"valid_to" date,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "patient_insurance_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_insurance_affiliate_code" (
	"user_insurance_affiliate_code_id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid,
	"app_user_id" integer,
	"insurance_id" integer,
	"affiliate_code" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "user_insurance_affiliate_code_uuid_key" UNIQUE("uuid")
);
--> statement-breakpoint
-- -- ALTER TABLE "doctor_patient" ADD CONSTRAINT "doctor_patient_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."app_user"("app_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- -- ALTER TABLE "doctor_patient" ADD CONSTRAINT "doctor_patient_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("patient_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "doctor_assistant" ADD CONSTRAINT "doctor_assistant_assistant_id_fkey" FOREIGN KEY ("assistant_id") REFERENCES "public"."app_user"("app_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "doctor_assistant" ADD CONSTRAINT "doctor_assistant_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."app_user"("app_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "appointment" ADD CONSTRAINT "appointment_app_user_id_fkey" FOREIGN KEY ("app_user_id") REFERENCES "public"."app_user"("app_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "appointment" ADD CONSTRAINT "appointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("patient_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "lab_test_result" ADD CONSTRAINT "lab_test_result_lab_test_id_fkey" FOREIGN KEY ("lab_test_id") REFERENCES "public"."lab_test"("lab_test_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "lab_test" ADD CONSTRAINT "lab_test_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "public"."medical_record"("record_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "lab_test" ADD CONSTRAINT "lab_test_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "public"."app_user"("app_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "medical_record" ADD CONSTRAINT "medical_record_app_user_id_fkey" FOREIGN KEY ("app_user_id") REFERENCES "public"."app_user"("app_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "medical_record" ADD CONSTRAINT "medical_record_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointment"("appointment_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "medical_record" ADD CONSTRAINT "medical_record_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("patient_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "imaging_test_image" ADD CONSTRAINT "imaging_test_image_imaging_test_id_fkey" FOREIGN KEY ("imaging_test_id") REFERENCES "public"."imaging_test"("imaging_test_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "prescription_item" ADD CONSTRAINT IF NOT EXISTS "prescription_item_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "public"."prescription"("prescription_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "prescription" ADD CONSTRAINT "prescription_app_user_id_fkey" FOREIGN KEY ("app_user_id") REFERENCES "public"."app_user"("app_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "prescription" ADD CONSTRAINT "prescription_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointment"("appointment_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "prescription" ADD CONSTRAINT "prescription_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("patient_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "vital_sign" ADD CONSTRAINT "vital_sign_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointment"("appointment_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "vital_sign" ADD CONSTRAINT "vital_sign_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("patient_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "imaging_test" ADD CONSTRAINT "imaging_test_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "public"."medical_record"("record_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "imaging_test" ADD CONSTRAINT "imaging_test_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "public"."app_user"("app_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "app_user" ADD CONSTRAINT "app_user_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "public"."document_type"("document_type_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "app_user" ADD CONSTRAINT "app_user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."role"("role_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "medical_record_disease" ADD CONSTRAINT "medical_record_disease_disease_id_fkey" FOREIGN KEY ("disease_id") REFERENCES "public"."disease"("disease_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "medical_record_disease" ADD CONSTRAINT "medical_record_disease_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "public"."medical_record"("record_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "patient_insurance" ADD CONSTRAINT "patient_insurance_insurance_id_fkey" FOREIGN KEY ("insurance_id") REFERENCES "public"."insurance_company"("insurance_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "patient_insurance" ADD CONSTRAINT "patient_insurance_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("patient_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "user_insurance_affiliate_code" ADD CONSTRAINT "user_insurance_affiliate_code_app_user_id_fkey" FOREIGN KEY ("app_user_id") REFERENCES "public"."app_user"("app_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "user_insurance_affiliate_code" ADD CONSTRAINT "user_insurance_affiliate_code_insurance_id_fkey" FOREIGN KEY ("insurance_id") REFERENCES "public"."insurance_company"("insurance_id") ON DELETE no action ON UPDATE no action;