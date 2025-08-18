import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Combobox } from '@/components/ui/combobox';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface PrescriptionFormData {
  patientId: string;
  prescribedAt?: string;
  notes?: string;
  medications: Medication[];
}

interface PrescriptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (prescription: PrescriptionFormData) => void;
  initialData?: Prescription | null;
  mode: 'create' | 'edit';
}

export function PrescriptionForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: PrescriptionFormProps) {
  const [formData, setFormData] = useState<PrescriptionFormData>({
    patientId: '',
    prescribedAt: new Date().toISOString().split('T')[0],
    notes: '',
    medications: [
      {
        id: '1',
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      },
    ],
  });
  const [date, setDate] = useState<Date>(new Date());
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);

  // Fetch patients when dialog opens
  useEffect(() => {
    if (open) {
      fetchPatients();
    }
  }, [open]);

  const fetchPatients = async () => {
    setPatientsLoading(true);
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
    } finally {
      setPatientsLoading(false);
    }
  };

  // Convert patients to combobox options
  const patientOptions = patients.map((patient) => ({
    value: patient.patientId.toString(),
    label: patient.name,
  }));

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        patientId: initialData.patientId?.toString() || '',
        prescribedAt:
          initialData.prescribedAt || new Date().toISOString().split('T')[0],
        notes: initialData.notes || '',
        medications: [
          {
            id: '1',
            name: '',
            dosage: '',
            frequency: '',
            duration: '',
            instructions: '',
          },
        ],
      });
      setDate(
        initialData.prescribedAt
          ? new Date(initialData.prescribedAt)
          : new Date(),
      );
    } else {
      setFormData({
        patientId: '',
        prescribedAt: new Date().toISOString().split('T')[0],
        notes: '',
        medications: [
          {
            id: '1',
            name: '',
            dosage: '',
            frequency: '',
            duration: '',
            instructions: '',
          },
        ],
      });
      setDate(new Date());
    }
  }, [initialData, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      prescribedAt: date.toISOString().split('T')[0],
    });
  };

  const handleInputChange = (
    field: keyof Omit<PrescriptionFormData, 'medications' | 'patientId'>,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePatientChange = (patientId: string) => {
    setFormData((prev) => ({ ...prev, patientId }));
  };

  const handleMedicationChange = (
    index: number,
    field: keyof Medication,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med,
      ),
    }));
  };

  const addMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
    };
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, newMedication],
    }));
  };

  const removeMedication = (index: number) => {
    if (formData.medications.length > 1) {
      setFormData((prev) => ({
        ...prev,
        medications: prev.medications.filter((_, i) => i !== index),
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Prescription' : 'New Prescription'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? 'Update the prescription details below.'
              : 'Fill in the details to create a new prescription.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient *</Label>
                <Combobox
                  options={patientOptions}
                  value={formData.patientId}
                  onValueChange={handlePatientChange}
                  placeholder="Select patient..."
                  searchPlaceholder="Search patients..."
                  emptyText="No patients found."
                  disabled={patientsLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Medications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Medications</CardTitle>
                <Button type="button" onClick={addMedication} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.medications.map((medication, index) => (
                <div
                  key={medication.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Medication {index + 1}</h4>
                    {formData.medications.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedication(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`medication-${index}`}>
                        Medication Name *
                      </Label>
                      <Input
                        id={`medication-${index}`}
                        value={medication.name}
                        onChange={(e) =>
                          handleMedicationChange(index, 'name', e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`dosage-${index}`}>Dosage *</Label>
                      <Input
                        id={`dosage-${index}`}
                        placeholder="e.g., 500mg"
                        value={medication.dosage}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            'dosage',
                            e.target.value,
                          )
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`frequency-${index}`}>Frequency *</Label>
                      <Select
                        value={medication.frequency}
                        onValueChange={(value) =>
                          handleMedicationChange(index, 'frequency', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Once daily">Once daily</SelectItem>
                          <SelectItem value="Twice daily">
                            Twice daily
                          </SelectItem>
                          <SelectItem value="3 times daily">
                            3 times daily
                          </SelectItem>
                          <SelectItem value="4 times daily">
                            4 times daily
                          </SelectItem>
                          <SelectItem value="Every 4 hours">
                            Every 4 hours
                          </SelectItem>
                          <SelectItem value="Every 6 hours">
                            Every 6 hours
                          </SelectItem>
                          <SelectItem value="Every 8 hours">
                            Every 8 hours
                          </SelectItem>
                          <SelectItem value="As needed">As needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`duration-${index}`}>Duration *</Label>
                      <Input
                        id={`duration-${index}`}
                        placeholder="e.g., 7 days, 30 days"
                        value={medication.duration}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            'duration',
                            e.target.value,
                          )
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`instructions-${index}`}>
                      Specific Instructions
                    </Label>
                    <Textarea
                      id={`instructions-${index}`}
                      placeholder="Specific instructions for this medication..."
                      value={medication.instructions}
                      onChange={(e) =>
                        handleMedicationChange(
                          index,
                          'instructions',
                          e.target.value,
                        )
                      }
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Prescription Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prescription Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Prescribed Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-transparent"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(date, 'MMM d, yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">General Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter general prescription notes..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'edit' ? 'Update Prescription' : 'Create Prescription'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
