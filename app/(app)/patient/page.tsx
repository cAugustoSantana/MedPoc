'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import PatientTable from '@/components/patient-table';
import { PatientActions } from '@/components/patient-actions';
import { Patient } from '@/types/patient';
import { toast } from 'sonner';

export default function PatientPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [patientsData, setPatientsData] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/patients');
      const result = await response.json();

      if (result.success) {
        setPatientsData(result.data);
      } else {
        toast.error('Failed to load patients', {
          description: 'Please refresh the page and try again.',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load patients', {
        description: 'Please check your connection and try again.',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Check authentication
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Load patients when authenticated
  useEffect(() => {
    if (isSignedIn) {
      loadPatients();
    }
  }, [isSignedIn]);

  const handlePatientAdded = () => {
    // Refresh the patient list when a new patient is added
    loadPatients();
  };

  // Don't render anything while checking authentication
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Patients</h1>
            <p className="text-muted-foreground">
              Manage your patient records and information
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading patients...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-muted-foreground">
            Manage your patient records and information
          </p>
        </div>
      </div>
      <PatientTable
        data={patientsData}
        addPatientComponent={
          <PatientActions onPatientAdded={handlePatientAdded} />
        }
      />
    </div>
  );
}
