'use client';
import AppointmentWidget from '@/components/patient-detail-widget/appoinmentsWidget';
import TestsWidget from './patient-detail-widget/testsWidget';
import MedicalRecordsWidget from './patient-detail-widget/medicalRecordsWidget';
import EditPatientDialog from './edit-patient-dialog';
import { useState, useEffect, useCallback } from 'react';
import { Phone, Mail, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Patient } from '@/types/patient';
import { toast } from 'sonner';

interface PatientDetailProps {
  patientId: string;
}

export default function PatientDetail({ patientId }: PatientDetailProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const loadPatient = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/patient/${patientId}`);
      const result = await response.json();

      if (response.ok) {
        setPatient(result);
      } else {
        if (response.status === 404) {
          setError('Patient not found');
        } else {
          setError('Failed to load patient data');
        }
        toast.error('Failed to load patient', {
          description: result.error || 'Please refresh the page and try again.',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error loading patient:', error);
      setError('Failed to load patient data');
      toast.error('Failed to load patient', {
        description: 'Please check your connection and try again.',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const handlePatientUpdated = (updatedPatient: Patient) => {
    setPatient(updatedPatient);
  };

  useEffect(() => {
    if (patientId) {
      loadPatient();
    }
  }, [patientId, loadPatient]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Patient Details
          </h1>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading patient...</div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !patient) {
    return (
      <main className="min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Patient Details
          </h1>
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">{error || 'Patient not found'}</div>
          </div>
        </div>
      </main>
    );
  }

  // Calculate age from date of birth
  const calculateAge = (dob: string | null) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Patient Details
        </h1>

        <div className="space-y-6">
          {/* Patient Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">
                  Patient Details
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  Edit Patient
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="text-xl font-semibold">{patient.name}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">Age</p>
                      <p className="text-lg">
                        {calculateAge(patient.dob)} years
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Gender
                      </p>
                      <p className="text-lg capitalize">
                        {patient.gender || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Date of Birth
                      </p>
                      <p className="text-lg">
                        {patient.dob
                          ? new Date(patient.dob).toLocaleDateString()
                          : 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {patient.phone || 'Not provided'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {patient.email || 'Not provided'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {patient.address || 'Not provided'}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="font-medium text-sm text-muted-foreground">
                      Record Info
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created:{' '}
                      {patient.createdAt
                        ? new Date(patient.createdAt).toLocaleDateString()
                        : 'Unknown'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated:{' '}
                      {patient.updatedAt
                        ? new Date(patient.updatedAt).toLocaleDateString()
                        : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 space-y-6">
          <MedicalRecordsWidget />
          {/* Appointments Section */}
          <AppointmentWidget />
          {/* Tests Section */}
          <TestsWidget />
        </div>
      </div>

      <EditPatientDialog
        patient={patient}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onPatientUpdated={handlePatientUpdated}
      />
    </main>
  );
}
