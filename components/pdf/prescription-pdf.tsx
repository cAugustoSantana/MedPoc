import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Prescription } from '@/types/prescription';
import { PrescriptionItemWithDetails } from '@/types/prescription-item';
import { Patient } from '@/types/patient';
import { InferSelectModel } from 'drizzle-orm';
import { appUser } from '@/db/migrations/schema';

type Doctor = InferSelectModel<typeof appUser>;

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  clinicInfo: {
    flexDirection: 'column',
  },
  clinicName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
  },
  clinicDetails: {
    fontSize: 10,
    color: '#6b7280',
  },
  prescriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1f2937',
  },
  patientSection: {
    backgroundColor: '#f8fafc',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#374151',
  },
  patientInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  patientDetails: {
    fontSize: 11,
    color: '#4b5563',
  },
  medicationsTable: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    padding: 8,
    fontWeight: 'bold',
    fontSize: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    padding: 8,
    fontSize: 9,
  },
  medicationName: {
    width: '25%',
    fontWeight: 'bold',
  },
  dosage: {
    width: '20%',
  },
  frequency: {
    width: '20%',
  },
  duration: {
    width: '15%',
  },
  instructions: {
    width: '20%',
  },
  doctorSignature: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: 200,
    marginTop: 30,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#6b7280',
  },
  notes: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#92400e',
  },
  notesText: {
    fontSize: 10,
    color: '#78350f',
  },
});

interface PrescriptionData {
  prescription: Prescription;
  prescriptionItems: PrescriptionItemWithDetails[];
  patient: Patient | null;
  doctor: Doctor | null;
}

export const PrescriptionPDF: React.FC<PrescriptionData> = ({
  prescription,
  prescriptionItems,
  patient,
  doctor,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.clinicInfo}>
          <Text style={styles.clinicName}>MedPoc Clinic</Text>
          <Text style={styles.clinicDetails}>
            123 Medical Street{'\n'}
            Healthcare City, HC 12345{'\n'}
            Phone: (555) 123-4567{'\n'}
            Email: info@medpoc.com
          </Text>
        </View>
        <View>
          <Text style={styles.clinicDetails}>
            Prescription #{prescription.prescriptionId}
            {'\n'}
            Date:{' '}
            {prescription.prescribedAt
              ? new Date(prescription.prescribedAt).toLocaleDateString()
              : new Date().toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Prescription Title */}
      <Text style={styles.prescriptionTitle}>PRESCRIPTION</Text>

      {/* Patient Information */}
      <View style={styles.patientSection}>
        <Text style={styles.sectionTitle}>Patient Information</Text>
        <View style={styles.patientInfo}>
          <View>
            <Text style={styles.patientDetails}>
              <Text style={{ fontWeight: 'bold' }}>Name:</Text>{' '}
              {patient?.name || 'N/A'}
            </Text>
            <Text style={styles.patientDetails}>
              <Text style={{ fontWeight: 'bold' }}>DOB:</Text>{' '}
              {patient?.dob || 'N/A'}
            </Text>
            <Text style={styles.patientDetails}>
              <Text style={{ fontWeight: 'bold' }}>Gender:</Text>{' '}
              {patient?.gender || 'N/A'}
            </Text>
          </View>
          <View>
            <Text style={styles.patientDetails}>
              <Text style={{ fontWeight: 'bold' }}>Phone:</Text>{' '}
              {patient?.phone || 'N/A'}
            </Text>
            <Text style={styles.patientDetails}>
              <Text style={{ fontWeight: 'bold' }}>Email:</Text>{' '}
              {patient?.email || 'N/A'}
            </Text>
            <Text style={styles.patientDetails}>
              <Text style={{ fontWeight: 'bold' }}>Address:</Text>{' '}
              {patient?.address || 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      {/* Medications */}
      <View style={styles.medicationsTable}>
        <Text style={styles.sectionTitle}>Prescribed Medications</Text>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.medicationName}>Medication</Text>
          <Text style={styles.dosage}>Dosage</Text>
          <Text style={styles.frequency}>Frequency</Text>
          <Text style={styles.duration}>Duration</Text>
          <Text style={styles.instructions}>Instructions</Text>
        </View>

        {/* Table Rows */}
        {prescriptionItems && prescriptionItems.length > 0 ? (
          prescriptionItems.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.medicationName}>
                {item.drugName || 'Unknown Medication'}{' '}
                {item.drugStrength ? `(${item.drugStrength})` : ''}
              </Text>
              <Text style={styles.dosage}>
                {item.dosageDescription || 'N/A'}
              </Text>
              <Text style={styles.frequency}>
                {item.frequencyDescription || 'N/A'}
              </Text>
              <Text style={styles.duration}>{item.duration || 'N/A'}</Text>
              <Text style={styles.instructions}>
                {item.instructions || 'As directed'}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.medicationName,
                { width: '100%', textAlign: 'center' },
              ]}
            >
              No medications prescribed
            </Text>
          </View>
        )}
      </View>

      {/* Prescription Notes */}
      {prescription.notes && (
        <View style={styles.notes}>
          <Text style={styles.notesTitle}>Additional Notes</Text>
          <Text style={styles.notesText}>{prescription.notes}</Text>
        </View>
      )}

      {/* Doctor Signature */}
      <View style={styles.doctorSignature}>
        <View>
          <Text style={styles.patientDetails}>
            <Text style={{ fontWeight: 'bold' }}>Prescribed by:</Text>
          </Text>
          <Text style={styles.patientDetails}>
            Dr. {doctor?.name || 'Unknown Doctor'}
          </Text>
          <Text style={styles.patientDetails}>
            {doctor?.specialty || 'General Practice'}
          </Text>
          <View style={styles.signatureLine} />
          <Text
            style={[
              styles.patientDetails,
              { textAlign: 'center', marginTop: 5 },
            ]}
          >
            Doctor&apos;s Signature
          </Text>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        This prescription is valid for 30 days from the date of issue.{'\n'}
        Please consult your pharmacist for any questions about your medications.
        {'\n'}
        For medical emergencies, call 911 or visit your nearest emergency room.
      </Text>
    </Page>
  </Document>
);
