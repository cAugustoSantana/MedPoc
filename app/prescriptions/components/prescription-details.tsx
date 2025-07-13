'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  User,
  Pill,
  FileText,
  Stethoscope,
  RotateCcw,
} from 'lucide-react';
import { Patient } from '@/types/patient';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface Prescription {
  id: string;
  patientId: string;
  medications: Medication[];
  prescribedDate: string;
  status: 'active' | 'completed' | 'cancelled';
  doctorName: string;
  refills: number;
  diagnosis: string;
  generalInstructions: string;
}

interface PrescriptionDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prescription: Prescription | null;
}

export function PrescriptionDetails({
  open,
  onOpenChange,
  prescription,
}: PrescriptionDetailsProps) {
  const [patients, setPatients] = useState<Patient[]>([]);

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');
      const result = await response.json();

      if (result.success) {
        setPatients(result.data);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    }
  };

  // Helper function to get patient name by ID
  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.patientId.toString() === patientId);
    return patient?.name || 'Unknown Patient';
  };

  if (!prescription) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Prescription Details
          </DialogTitle>
          <DialogDescription>
            Complete prescription information for{' '}
            {getPatientName(prescription.patientId)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">
                {prescription.medications.map((medication) => medication.name)}
              </h3>
              {getStatusBadge(prescription.status)}
            </div>
            <div className="text-sm text-muted-foreground">
              ID: {prescription.id}
            </div>
          </div>

          <Separator />

          {/* Patient Information */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Patient Information
            </h4>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <div className="font-medium">
                  {getPatientName(prescription.patientId)}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Medication Details */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Medications ({prescription.medications.length})
            </h4>
            <div className="space-y-4">
              {prescription.medications.map((medication, index) => (
                <div
                  key={medication.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-base">{medication.name}</h5>
                    <Badge variant="outline">Medication {index + 1}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Dosage:</span>
                      <div className="font-medium">{medication.dosage}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Frequency:</span>
                      <div className="font-medium">{medication.frequency}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <div className="font-medium">{medication.duration}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Instructions:
                      </span>
                      <div className="font-medium">
                        {medication.instructions || 'No specific instructions'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Clinical Information */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Clinical Information
            </h4>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Diagnosis:</span>
                <div className="font-medium">{prescription.diagnosis}</div>
              </div>
              {prescription.generalInstructions && (
                <div>
                  <span className="text-muted-foreground">
                    General Instructions:
                  </span>
                  <div className="font-medium">
                    {prescription.generalInstructions}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Prescription Details */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Prescription Details
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Prescribed Date:</span>
                <div className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(prescription.prescribedDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">
                  Prescribing Doctor:
                </span>
                <div className="font-medium">{prescription.doctorName}</div>
              </div>
              <div>
                <span className="text-muted-foreground">
                  Refills Remaining:
                </span>
                <div className="font-medium flex items-center gap-1">
                  <RotateCcw className="h-3 w-3" />
                  {prescription.refills}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <div className="font-medium">
                  {getStatusBadge(prescription.status)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
