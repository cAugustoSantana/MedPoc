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
import { useTranslations } from '@/hooks/use-translations';

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
  appointmentId?: number | null;
  patientId?: number | null;
}

export function PrescriptionForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
  appointmentId,
  patientId,
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
  const { t } = useTranslations();
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
      console.error(t('common.lastUpdate'), error);
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
          : new Date()
      );
    } else {
      setFormData({
        patientId: patientId?.toString() || '',
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
  }, [initialData, mode, open, patientId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      prescribedAt: date.toISOString().split('T')[0],
    });
  };

  const handleInputChange = (
    field: keyof Omit<PrescriptionFormData, 'medications' | 'patientId'>,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePatientChange = (patientId: string) => {
    setFormData((prev) => ({ ...prev, patientId }));
  };

  const handleMedicationChange = (
    index: number,
    field: keyof Medication,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
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
            {mode === 'edit'
              ? t('prescription.editPrescription')
              : t('prescription.newPrescription')}
            {appointmentId && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({t('appointment.fromAppointment')} #{appointmentId})
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? t('prescription.editPrescriptionHeader')
              : appointmentId
                ? t('prescription.newPrescriptionHeaderPreSelect')
                : t('prescription.newPrescriptionHeader')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t('common.patientInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient">{t('common.patient')}*</Label>
                <Combobox
                  options={patientOptions}
                  value={formData.patientId}
                  onValueChange={handlePatientChange}
                  placeholder={t('common.Select.patient')}
                  searchPlaceholder={t('common.Search.patients')}
                  emptyText={t('NotFound.patients')}
                  disabled={
                    patientsLoading ||
                    (appointmentId !== null && appointmentId !== undefined)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Medications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{t('common.patient')}</CardTitle>
                <Button type="button" onClick={addMedication} size="sm">
                  <Plus className="h-4 w-4 mr-0" />
                  {t('prescription.addMedication')}
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
                    <h4 className="font-medium">
                      {t('common.medication')} {index + 1}
                    </h4>
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
                        {t('common.medicationName')}*
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
                      <Label htmlFor={`dosage-${index}`}>
                        {t('common.dosage')}*
                      </Label>
                      <Input
                        id={`dosage-${index}`}
                        placeholder="e.g., 500mg"
                        value={medication.dosage}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            'dosage',
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`frequency-${index}`}>
                        {t('common.frequency')}*
                      </Label>
                      <Select
                        value={medication.frequency}
                        onValueChange={(value) =>
                          handleMedicationChange(index, 'frequency', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t('common.Select.frequency')}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Once daily">
                            {t('common.Frequency.daily')}
                          </SelectItem>
                          <SelectItem value="Twice daily">
                            {t('common.Frequency.twice')}
                          </SelectItem>
                          <SelectItem value="3 times daily">
                            {t('common.Frequency.3times')}
                          </SelectItem>
                          <SelectItem value="4 times daily">
                            {t('common.Frequency.4times')}
                          </SelectItem>
                          <SelectItem value="Every 4 hours">
                            {t('common.Frequency.4hours')}
                          </SelectItem>
                          <SelectItem value="Every 6 hours">
                            {t('common.Frequency.6hours')}
                          </SelectItem>
                          <SelectItem value="Every 8 hours">
                            {t('common.Frequency.8hours')}
                          </SelectItem>
                          <SelectItem value="As needed">
                            {t('common.Frequency.asNeeded')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`duration-${index}`}>
                        {t('common.duration')}*
                      </Label>
                      <Input
                        id={`duration-${index}`}
                        placeholder="e.g., 7 days, 30 days"
                        value={medication.duration}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            'duration',
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`instructions-${index}`}>
                      {t('prescription.specificInstructions')}
                    </Label>
                    <Textarea
                      id={`instructions-${index}`}
                      placeholder={`${t('prescription.specificInstructions')}...`}
                      value={medication.instructions}
                      onChange={(e) =>
                        handleMedicationChange(
                          index,
                          'instructions',
                          e.target.value
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
              <CardTitle className="text-lg">
                {t('prescription.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('prescription.prescriptionDate')}*</Label>
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
                <Label htmlFor="notes">{t('prescription.generalNotes')}</Label>
                <Textarea
                  id="notes"
                  placeholder={t('prescription.generalNotes')}
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
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {mode === 'edit'
                ? t('prescription.updatePrescription')
                : t('prescription.createPrescription')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
