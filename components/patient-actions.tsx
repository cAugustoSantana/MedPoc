"use client";

import { AddPatientDialog } from "@/components/add-patient-dialog";

export function PatientActions() {
  const handlePatientAdded = () => {
    // Server action handles revalidation automatically
    // No need to manually refresh
  };

  return <AddPatientDialog onPatientAdded={handlePatientAdded} />;
}
