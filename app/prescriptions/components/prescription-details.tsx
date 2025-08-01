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
import { Calendar, User, FileText, Stethoscope, Pill } from 'lucide-react';
import { Patient } from '@/types/patient';
import { Prescription } from '@/types/prescription';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
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
  const [medications, setMedications] = useState<Medication[]>([]);

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  // Mock medications data for now - in a real app, this would come from prescription items
  useEffect(() => {
    if (prescription) {
      // For now, we'll use mock data since we haven't implemented prescription items yet
      setMedications([
        {
          id: '1',
          name: 'Amoxicillin',
          dosage: '500mg',
          frequency: '3 times daily',
          duration: '7 days',
          instructions: 'Take with food',
        },
      ]);
    }
  }, [prescription]);

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
  const getPatientName = (patientId: number | null) => {
    if (!patientId) return 'Unknown Patient';
    const patient = patients.find((p) => p.patientId === patientId);
    return patient?.name || 'Unknown Patient';
  };

  if (!prescription) return null;

  const getStatusBadge = () => {
    // For now, we'll show a default status since the schema doesn't have a status field
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
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
                Prescription #{prescription.prescriptionId}
              </h3>
              {getStatusBadge()}
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
                <span className="text-muted-foreground">Patient Name:</span>
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
              Medications ({medications.length})
            </h4>
            <div className="space-y-4">
              {medications.map((medication, index) => (
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

          {/* Prescription Information */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Prescription Information
            </h4>
            <div className="grid grid-cols-1 gap-4 text-sm">
              {prescription.notes && (
                <div>
                  <span className="text-muted-foreground">General Notes:</span>
                  <div className="font-medium">{prescription.notes}</div>
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
                  {prescription.prescribedAt
                    ? new Date(prescription.prescribedAt).toLocaleDateString()
                    : 'Not specified'}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Created Date:</span>
                <div className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {prescription.createdAt
                    ? new Date(prescription.createdAt).toLocaleDateString()
                    : 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <div className="font-medium">{getStatusBadge()}</div>
              </div>
              {prescription.updatedAt && (
                <div>
                  <span className="text-muted-foreground">Last Updated:</span>
                  <div className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(prescription.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
