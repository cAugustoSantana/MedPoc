'use client';

import React, { useState, useEffect } from 'react';
import PatientTable from '@/components/patient-table';
import { PatientActions } from '@/components/patient-actions';
import { Patient } from '@/types/patient';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/use-translations';
import { useOnboardingCheck } from '@/hooks/use-onboarding-check';

export default function PatientPage() {
  const { isReady } = useOnboardingCheck();
  const [patientsData, setPatientsData] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslations();

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

  // Load patients when ready
  useEffect(() => {
    if (isReady) {
      loadPatients();
    }
  }, [isReady]);

  const handlePatientAdded = () => {
    // Refresh the patient list when a new patient is added
    loadPatients();
  };

  // Don't render anything while checking authentication or onboarding
  if (!isReady) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground"> {t('common.loading')}</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('patient.title')}</h1>
            <p className="text-muted-foreground">{t('patient.subheader')}</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">
            {t('common.Loading.patients')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('patient.title')}</h1>
          <p className="text-muted-foreground">{t('patient.subheader')}</p>
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
