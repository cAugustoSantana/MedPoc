"use client";

import React, { useState, useEffect } from "react";
import PatientTable from "@/components/patient-table";
import { PatientActions } from "@/components/patient-actions";
import { Patient } from "@/types/patient";
import { toast } from "sonner";

export default function PatientPage() {
  const [patientsData, setPatientsData] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/patients");
      const result = await response.json();

      if (result.success) {
        setPatientsData(result.data);
      } else {
        toast.error("Failed to load patients", {
          description: "Please refresh the page and try again.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error loading patients:", error);
      toast.error("Failed to load patients", {
        description: "Please check your connection and try again.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handlePatientAdded = () => {
    // Refresh the patient list when a new patient is added
    loadPatients();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Patients</h1>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading patients...</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Patients</h1>
        <PatientTable
          data={patientsData}
          addPatientComponent={
            <PatientActions onPatientAdded={handlePatientAdded} />
          }
        />
      </div>
    </main>
  );
}
