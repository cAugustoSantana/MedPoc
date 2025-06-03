import { relations } from "drizzle-orm/relations";
import { documentType, appUser, role, doctorPatient, patient, doctorAssistant, userInsuranceAffiliateCode, insuranceCompany, patientInsurance, appointment, vitalSign, medicalRecord, disease, medicalRecordDisease, prescription, dosageDetail, prescriptionItem, drug, frequencyDetail, labTest, labTestResult, imagingTest, imagingTestImage } from "./schema";

export const appUserRelations = relations(appUser, ({one, many}) => ({
	documentType: one(documentType, {
		fields: [appUser.documentTypeId],
		references: [documentType.documentTypeId]
	}),
	role: one(role, {
		fields: [appUser.roleId],
		references: [role.roleId]
	}),
	doctorPatients: many(doctorPatient),
	doctorAssistants_assistantId: many(doctorAssistant, {
		relationName: "doctorAssistant_assistantId_appUser_appUserId"
	}),
	doctorAssistants_doctorId: many(doctorAssistant, {
		relationName: "doctorAssistant_doctorId_appUser_appUserId"
	}),
	userInsuranceAffiliateCodes: many(userInsuranceAffiliateCode),
	appointments: many(appointment),
	medicalRecords: many(medicalRecord),
	prescriptions: many(prescription),
	labTests: many(labTest),
	imagingTests: many(imagingTest),
}));

export const documentTypeRelations = relations(documentType, ({many}) => ({
	appUsers: many(appUser),
}));

export const roleRelations = relations(role, ({many}) => ({
	appUsers: many(appUser),
}));

export const doctorPatientRelations = relations(doctorPatient, ({one}) => ({
	appUser: one(appUser, {
		fields: [doctorPatient.doctorId],
		references: [appUser.appUserId]
	}),
	patient: one(patient, {
		fields: [doctorPatient.patientId],
		references: [patient.patientId]
	}),
}));

export const patientRelations = relations(patient, ({many}) => ({
	doctorPatients: many(doctorPatient),
	patientInsurances: many(patientInsurance),
	appointments: many(appointment),
	vitalSigns: many(vitalSign),
	medicalRecords: many(medicalRecord),
	prescriptions: many(prescription),
}));

export const doctorAssistantRelations = relations(doctorAssistant, ({one}) => ({
	appUser_assistantId: one(appUser, {
		fields: [doctorAssistant.assistantId],
		references: [appUser.appUserId],
		relationName: "doctorAssistant_assistantId_appUser_appUserId"
	}),
	appUser_doctorId: one(appUser, {
		fields: [doctorAssistant.doctorId],
		references: [appUser.appUserId],
		relationName: "doctorAssistant_doctorId_appUser_appUserId"
	}),
}));

export const userInsuranceAffiliateCodeRelations = relations(userInsuranceAffiliateCode, ({one}) => ({
	appUser: one(appUser, {
		fields: [userInsuranceAffiliateCode.appUserId],
		references: [appUser.appUserId]
	}),
	insuranceCompany: one(insuranceCompany, {
		fields: [userInsuranceAffiliateCode.insuranceId],
		references: [insuranceCompany.insuranceId]
	}),
}));

export const insuranceCompanyRelations = relations(insuranceCompany, ({many}) => ({
	userInsuranceAffiliateCodes: many(userInsuranceAffiliateCode),
	patientInsurances: many(patientInsurance),
}));

export const patientInsuranceRelations = relations(patientInsurance, ({one}) => ({
	insuranceCompany: one(insuranceCompany, {
		fields: [patientInsurance.insuranceId],
		references: [insuranceCompany.insuranceId]
	}),
	patient: one(patient, {
		fields: [patientInsurance.patientId],
		references: [patient.patientId]
	}),
}));

export const appointmentRelations = relations(appointment, ({one, many}) => ({
	appUser: one(appUser, {
		fields: [appointment.appUserId],
		references: [appUser.appUserId]
	}),
	patient: one(patient, {
		fields: [appointment.patientId],
		references: [patient.patientId]
	}),
	vitalSigns: many(vitalSign),
	medicalRecords: many(medicalRecord),
	prescriptions: many(prescription),
}));

export const vitalSignRelations = relations(vitalSign, ({one}) => ({
	appointment: one(appointment, {
		fields: [vitalSign.appointmentId],
		references: [appointment.appointmentId]
	}),
	patient: one(patient, {
		fields: [vitalSign.patientId],
		references: [patient.patientId]
	}),
}));

export const medicalRecordRelations = relations(medicalRecord, ({one, many}) => ({
	appUser: one(appUser, {
		fields: [medicalRecord.appUserId],
		references: [appUser.appUserId]
	}),
	appointment: one(appointment, {
		fields: [medicalRecord.appointmentId],
		references: [appointment.appointmentId]
	}),
	patient: one(patient, {
		fields: [medicalRecord.patientId],
		references: [patient.patientId]
	}),
	medicalRecordDiseases: many(medicalRecordDisease),
	labTests: many(labTest),
	imagingTests: many(imagingTest),
}));

export const medicalRecordDiseaseRelations = relations(medicalRecordDisease, ({one}) => ({
	disease: one(disease, {
		fields: [medicalRecordDisease.diseaseId],
		references: [disease.diseaseId]
	}),
	medicalRecord: one(medicalRecord, {
		fields: [medicalRecordDisease.recordId],
		references: [medicalRecord.recordId]
	}),
}));

export const diseaseRelations = relations(disease, ({many}) => ({
	medicalRecordDiseases: many(medicalRecordDisease),
}));

export const prescriptionRelations = relations(prescription, ({one, many}) => ({
	appUser: one(appUser, {
		fields: [prescription.appUserId],
		references: [appUser.appUserId]
	}),
	appointment: one(appointment, {
		fields: [prescription.appointmentId],
		references: [appointment.appointmentId]
	}),
	patient: one(patient, {
		fields: [prescription.patientId],
		references: [patient.patientId]
	}),
	prescriptionItems: many(prescriptionItem),
}));

export const prescriptionItemRelations = relations(prescriptionItem, ({one}) => ({
	dosageDetail: one(dosageDetail, {
		fields: [prescriptionItem.dosageDetailId],
		references: [dosageDetail.dosageDetailId]
	}),
	drug: one(drug, {
		fields: [prescriptionItem.drugId],
		references: [drug.drugId]
	}),
	frequencyDetail: one(frequencyDetail, {
		fields: [prescriptionItem.frequencyDetailId],
		references: [frequencyDetail.frequencyDetailId]
	}),
	prescription: one(prescription, {
		fields: [prescriptionItem.prescriptionId],
		references: [prescription.prescriptionId]
	}),
}));

export const dosageDetailRelations = relations(dosageDetail, ({many}) => ({
	prescriptionItems: many(prescriptionItem),
}));

export const drugRelations = relations(drug, ({many}) => ({
	prescriptionItems: many(prescriptionItem),
}));

export const frequencyDetailRelations = relations(frequencyDetail, ({many}) => ({
	prescriptionItems: many(prescriptionItem),
}));

export const labTestRelations = relations(labTest, ({one, many}) => ({
	medicalRecord: one(medicalRecord, {
		fields: [labTest.medicalRecordId],
		references: [medicalRecord.recordId]
	}),
	appUser: one(appUser, {
		fields: [labTest.requestedBy],
		references: [appUser.appUserId]
	}),
	labTestResults: many(labTestResult),
}));

export const labTestResultRelations = relations(labTestResult, ({one}) => ({
	labTest: one(labTest, {
		fields: [labTestResult.labTestId],
		references: [labTest.labTestId]
	}),
}));

export const imagingTestRelations = relations(imagingTest, ({one, many}) => ({
	medicalRecord: one(medicalRecord, {
		fields: [imagingTest.medicalRecordId],
		references: [medicalRecord.recordId]
	}),
	appUser: one(appUser, {
		fields: [imagingTest.requestedBy],
		references: [appUser.appUserId]
	}),
	imagingTestImages: many(imagingTestImage),
}));

export const imagingTestImageRelations = relations(imagingTestImage, ({one}) => ({
	imagingTest: one(imagingTest, {
		fields: [imagingTestImage.imagingTestId],
		references: [imagingTest.imagingTestId]
	}),
}));