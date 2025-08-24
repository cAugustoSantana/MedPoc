'use client';

import { AddPatientDialog } from '@/components/add-patient-dialog';

interface PatientActionsProps {
  onPatientAdded?: () => void;
}

export function PatientActions({ onPatientAdded }: PatientActionsProps) {
  const handlePatientAdded = () => {
    // Call the callback if provided
    if (onPatientAdded) {
      onPatientAdded();
    }
  };

  return <AddPatientDialog onPatientAdded={handlePatientAdded} />;
}
