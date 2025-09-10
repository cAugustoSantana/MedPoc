import {
  pgTable,
  foreignKey,
  unique,
  serial,
  uuid,
  integer,
  timestamp,
  varchar,
  text,
  doublePrecision,
  date,
  boolean,
} from 'drizzle-orm/pg-core';
// sql import removed as it's not used

export const doctorPatient = pgTable(
  'doctor_patient',
  {
    doctorPatientId: serial('doctor_patient_id').primaryKey().notNull(),
    uuid: uuid(),
    doctorId: integer('doctor_id'),
    patientId: integer('patient_id'),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.doctorId],
      foreignColumns: [appUser.appUserId],
      name: 'doctor_patient_doctor_id_fkey',
    }),
    foreignKey({
      columns: [table.patientId],
      foreignColumns: [patient.patientId],
      name: 'doctor_patient_patient_id_fkey',
    }),
    unique('doctor_patient_uuid_key').on(table.uuid),
  ]
);

export const dosageDetail = pgTable(
  'dosage_detail',
  {
    dosageDetailId: serial('dosage_detail_id').primaryKey().notNull(),
    uuid: uuid(),
    description: varchar(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [unique('dosage_detail_uuid_key').on(table.uuid)]
);

export const doctorAssistant = pgTable(
  'doctor_assistant',
  {
    doctorAssistantId: serial('doctor_assistant_id').primaryKey().notNull(),
    uuid: uuid(),
    doctorId: integer('doctor_id'),
    assistantId: integer('assistant_id'),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.assistantId],
      foreignColumns: [appUser.appUserId],
      name: 'doctor_assistant_assistant_id_fkey',
    }),
    foreignKey({
      columns: [table.doctorId],
      foreignColumns: [appUser.appUserId],
      name: 'doctor_assistant_doctor_id_fkey',
    }),
    unique('doctor_assistant_uuid_key').on(table.uuid),
  ]
);

export const documentType = pgTable(
  'document_type',
  {
    documentTypeId: serial('document_type_id').primaryKey().notNull(),
    uuid: uuid(),
    name: varchar().notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [unique('document_type_uuid_key').on(table.uuid)]
);

export const drug = pgTable(
  'drug',
  {
    drugId: serial('drug_id').primaryKey().notNull(),
    uuid: uuid(),
    name: varchar(),
    dosageForm: varchar('dosage_form'),
    strength: varchar(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => [unique('drug_uuid_key').on(table.uuid)]
);

export const frequencyDetail = pgTable(
  'frequency_detail',
  {
    frequencyDetailId: serial('frequency_detail_id').primaryKey().notNull(),
    uuid: uuid(),
    description: varchar(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [unique('frequency_detail_uuid_key').on(table.uuid)]
);

export const appointment = pgTable(
  'appointment',
  {
    appointmentId: serial('appointment_id').primaryKey().notNull(),
    uuid: uuid(),
    appUserId: integer('app_user_id'),
    patientId: integer('patient_id'),
    scheduledAt: timestamp('scheduled_at', { mode: 'string' }),
    reason: text(),
    status: varchar(),
    duration: integer(),
    notes: text(),
    location: varchar(),
    priority: varchar(),
    confirmed: boolean().default(false),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => [
    foreignKey({
      columns: [table.appUserId],
      foreignColumns: [appUser.appUserId],
      name: 'appointment_app_user_id_fkey',
    }),
    foreignKey({
      columns: [table.patientId],
      foreignColumns: [patient.patientId],
      name: 'appointment_patient_id_fkey',
    }),
    unique('appointment_uuid_key').on(table.uuid),
  ]
);

export const disease = pgTable(
  'disease',
  {
    diseaseId: serial('disease_id').primaryKey().notNull(),
    uuid: uuid(),
    name: varchar(),
    description: text(),
    icdCode: varchar('icd_code'),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => [unique('disease_uuid_key').on(table.uuid)]
);

export const insuranceCompany = pgTable(
  'insurance_company',
  {
    insuranceId: serial('insurance_id').primaryKey().notNull(),
    uuid: uuid(),
    name: varchar().notNull(),
    phone: varchar(),
    email: varchar(),
    address: text(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => [unique('insurance_company_uuid_key').on(table.uuid)]
);

export const labTestResult = pgTable(
  'lab_test_result',
  {
    labTestResultId: serial('lab_test_result_id').primaryKey().notNull(),
    uuid: uuid(),
    labTestId: integer('lab_test_id'),
    parameter: varchar(),
    resultValue: varchar('result_value'),
    unit: varchar(),
    referenceRange: varchar('reference_range'),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.labTestId],
      foreignColumns: [labTest.labTestId],
      name: 'lab_test_result_lab_test_id_fkey',
    }),
    unique('lab_test_result_uuid_key').on(table.uuid),
  ]
);

export const labTest = pgTable(
  'lab_test',
  {
    labTestId: serial('lab_test_id').primaryKey().notNull(),
    uuid: uuid(),
    medicalRecordId: integer('medical_record_id'),
    testType: varchar('test_type'),
    requestedBy: integer('requested_by'),
    requestedAt: timestamp('requested_at', { mode: 'string' }),
    performedAt: timestamp('performed_at', { mode: 'string' }),
    fileUrl: varchar('file_url'),
    notes: text(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => [
    foreignKey({
      columns: [table.medicalRecordId],
      foreignColumns: [medicalRecord.recordId],
      name: 'lab_test_medical_record_id_fkey',
    }),
    foreignKey({
      columns: [table.requestedBy],
      foreignColumns: [appUser.appUserId],
      name: 'lab_test_requested_by_fkey',
    }),
    unique('lab_test_uuid_key').on(table.uuid),
  ]
);

export const medicalRecord = pgTable(
  'medical_record',
  {
    recordId: serial('record_id').primaryKey().notNull(),
    uuid: uuid(),
    patientId: integer('patient_id'),
    appUserId: integer('app_user_id'),
    appointmentId: integer('appointment_id'),
    notes: text(),
    diagnosis: text(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => [
    foreignKey({
      columns: [table.appUserId],
      foreignColumns: [appUser.appUserId],
      name: 'medical_record_app_user_id_fkey',
    }),
    foreignKey({
      columns: [table.appointmentId],
      foreignColumns: [appointment.appointmentId],
      name: 'medical_record_appointment_id_fkey',
    }),
    foreignKey({
      columns: [table.patientId],
      foreignColumns: [patient.patientId],
      name: 'medical_record_patient_id_fkey',
    }),
    unique('medical_record_uuid_key').on(table.uuid),
  ]
);

export const imagingTestImage = pgTable(
  'imaging_test_image',
  {
    imagingTestImageId: serial('imaging_test_image_id').primaryKey().notNull(),
    uuid: uuid(),
    imagingTestId: integer('imaging_test_id'),
    imageFileUrl: varchar('image_file_url'),
    description: text(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.imagingTestId],
      foreignColumns: [imagingTest.imagingTestId],
      name: 'imaging_test_image_imaging_test_id_fkey',
    }),
    unique('imaging_test_image_uuid_key').on(table.uuid),
  ]
);

export const prescriptionItem = pgTable(
  'prescription_item',
  {
    itemId: serial('item_id').primaryKey().notNull(),
    uuid: uuid(),
    prescriptionId: integer('prescription_id'),
    drugName: varchar('drug_name'),
    dosage: varchar(),
    frequency: varchar(),
    duration: varchar(),
    instructions: text(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.prescriptionId],
      foreignColumns: [prescription.prescriptionId],
      name: 'prescription_item_prescription_id_fkey',
    }),
    unique('prescription_item_uuid_key').on(table.uuid),
  ]
);

export const prescription = pgTable(
  'prescription',
  {
    prescriptionId: serial('prescription_id').primaryKey().notNull(),
    uuid: uuid(),
    appUserId: integer('app_user_id'),
    patientId: integer('patient_id'),
    appointmentId: integer('appointment_id'),
    prescribedAt: timestamp('prescribed_at', { mode: 'string' }),
    notes: text(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => [
    foreignKey({
      columns: [table.appUserId],
      foreignColumns: [appUser.appUserId],
      name: 'prescription_app_user_id_fkey',
    }),
    foreignKey({
      columns: [table.appointmentId],
      foreignColumns: [appointment.appointmentId],
      name: 'prescription_appointment_id_fkey',
    }),
    foreignKey({
      columns: [table.patientId],
      foreignColumns: [patient.patientId],
      name: 'prescription_patient_id_fkey',
    }),
    unique('prescription_uuid_key').on(table.uuid),
  ]
);

export const role = pgTable(
  'role',
  {
    roleId: serial('role_id').primaryKey().notNull(),
    uuid: uuid(),
    name: varchar().notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [unique('role_uuid_key').on(table.uuid)]
);

export const vitalSign = pgTable(
  'vital_sign',
  {
    vitalSignId: serial('vital_sign_id').primaryKey().notNull(),
    uuid: uuid(),
    patientId: integer('patient_id'),
    appointmentId: integer('appointment_id'),
    weightKg: doublePrecision('weight_kg'),
    heightCm: doublePrecision('height_cm'),
    temperatureC: doublePrecision('temperature_c'),
    heartRateBpm: integer('heart_rate_bpm'),
    respiratoryRateBpm: integer('respiratory_rate_bpm'),
    bpSystolic: integer('bp_systolic'),
    bpDiastolic: integer('bp_diastolic'),
    measuredAt: timestamp('measured_at', { mode: 'string' }),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.appointmentId],
      foreignColumns: [appointment.appointmentId],
      name: 'vital_sign_appointment_id_fkey',
    }),
    foreignKey({
      columns: [table.patientId],
      foreignColumns: [patient.patientId],
      name: 'vital_sign_patient_id_fkey',
    }),
    unique('vital_sign_uuid_key').on(table.uuid),
  ]
);

export const imagingTest = pgTable(
  'imaging_test',
  {
    imagingTestId: serial('imaging_test_id').primaryKey().notNull(),
    uuid: uuid(),
    medicalRecordId: integer('medical_record_id'),
    imagingType: varchar('imaging_type'),
    requestedBy: integer('requested_by'),
    requestedAt: timestamp('requested_at', { mode: 'string' }),
    performedAt: timestamp('performed_at', { mode: 'string' }),
    reportFileUrl: varchar('report_file_url'),
    notes: text(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => [
    foreignKey({
      columns: [table.medicalRecordId],
      foreignColumns: [medicalRecord.recordId],
      name: 'imaging_test_medical_record_id_fkey',
    }),
    foreignKey({
      columns: [table.requestedBy],
      foreignColumns: [appUser.appUserId],
      name: 'imaging_test_requested_by_fkey',
    }),
    unique('imaging_test_uuid_key').on(table.uuid),
  ]
);

export const appUser = pgTable(
  'app_user',
  {
    appUserId: serial('app_user_id').primaryKey().notNull(),
    uuid: uuid().defaultRandom(),
    clerkUserId: varchar('clerk_user_id'),
    name: varchar().notNull(),
    email: varchar(),
    phone: varchar(),
    roleId: integer('role_id'),
    specialty: varchar(),
    documentTypeId: integer('document_type_id'),
    documentNumber: varchar('document_number'),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => [
    foreignKey({
      columns: [table.documentTypeId],
      foreignColumns: [documentType.documentTypeId],
      name: 'app_user_document_type_id_fkey',
    }),
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [role.roleId],
      name: 'app_user_role_id_fkey',
    }),
    unique('app_user_uuid_key').on(table.uuid),
    unique('app_user_clerk_user_id_key').on(table.clerkUserId),
  ]
);

export const medicalRecordDisease = pgTable(
  'medical_record_disease',
  {
    recordDiseaseId: serial('record_disease_id').primaryKey().notNull(),
    uuid: uuid(),
    recordId: integer('record_id'),
    diseaseId: integer('disease_id'),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.diseaseId],
      foreignColumns: [disease.diseaseId],
      name: 'medical_record_disease_disease_id_fkey',
    }),
    foreignKey({
      columns: [table.recordId],
      foreignColumns: [medicalRecord.recordId],
      name: 'medical_record_disease_record_id_fkey',
    }),
    unique('medical_record_disease_uuid_key').on(table.uuid),
  ]
);

export const patient = pgTable(
  'patient',
  {
    patientId: serial('patient_id').primaryKey().notNull(),
    uuid: uuid().defaultRandom(),
    name: varchar().notNull(),
    dob: date(),
    gender: varchar(),
    email: varchar(),
    phone: varchar(),
    address: text(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => [unique('patient_uuid_key').on(table.uuid)]
);

export const patientInsurance = pgTable(
  'patient_insurance',
  {
    patientInsuranceId: serial('patient_insurance_id').primaryKey().notNull(),
    uuid: uuid(),
    patientId: integer('patient_id'),
    insuranceId: integer('insurance_id'),
    policyNumber: varchar('policy_number'),
    validFrom: date('valid_from'),
    validTo: date('valid_to'),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => [
    foreignKey({
      columns: [table.insuranceId],
      foreignColumns: [insuranceCompany.insuranceId],
      name: 'patient_insurance_insurance_id_fkey',
    }),
    foreignKey({
      columns: [table.patientId],
      foreignColumns: [patient.patientId],
      name: 'patient_insurance_patient_id_fkey',
    }),
    unique('patient_insurance_uuid_key').on(table.uuid),
  ]
);

export const userInsuranceAffiliateCode = pgTable(
  'user_insurance_affiliate_code',
  {
    userInsuranceAffiliateCodeId: serial('user_insurance_affiliate_code_id')
      .primaryKey()
      .notNull(),
    uuid: uuid(),
    appUserId: integer('app_user_id'),
    insuranceId: integer('insurance_id'),
    affiliateCode: varchar('affiliate_code'),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => [
    foreignKey({
      columns: [table.appUserId],
      foreignColumns: [appUser.appUserId],
      name: 'user_insurance_affiliate_code_app_user_id_fkey',
    }),
    foreignKey({
      columns: [table.insuranceId],
      foreignColumns: [insuranceCompany.insuranceId],
      name: 'user_insurance_affiliate_code_insurance_id_fkey',
    }),
    unique('user_insurance_affiliate_code_uuid_key').on(table.uuid),
  ]
);
