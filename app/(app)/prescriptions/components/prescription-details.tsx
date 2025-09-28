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
import { Button } from '@/components/ui/button';
import {
  Calendar,
  User,
  FileText,
  Stethoscope,
  Pill,
  Download,
} from 'lucide-react';
import { Patient } from '@/types/patient';
import { Prescription } from '@/types/prescription';
import { PrescriptionItem } from '@/types/prescription-item';
import { useTranslations } from '@/hooks/use-translations';

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
  const { t } = useTranslations();
  const [prescriptionItems, setPrescriptionItems] = useState<
    PrescriptionItem[]
  >([]);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  // Fetch prescription items when prescription changes
  useEffect(() => {
    if (prescription?.prescriptionId) {
      fetchPrescriptionItems(prescription.prescriptionId);
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
      console.error(t('Error.fetchingPatients'), error);
      setPatients([]);
    }
  };

  const fetchPrescriptionItems = async (prescriptionId: number) => {
    try {
      const response = await fetch(
        `/api/prescriptions/${prescriptionId}/items`
      );
      const result = await response.json();

      if (result.success) {
        setPrescriptionItems(result.data);
      } else {
        setPrescriptionItems([]);
      }
    } catch (error) {
      console.error(t('Error.fetchingPatients'), error);
      setPrescriptionItems([]);
    }
  };

  const handleDownloadPDF = async () => {
    if (!prescription?.prescriptionId) return;

    try {
      setIsDownloadingPDF(true);
      const response = await fetch(
        `/api/prescriptions/${prescription.prescriptionId}/pdf`
      );

      if (!response.ok) {
        throw new Error(t('Error.fetchingPatients'));
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prescription-${prescription.prescriptionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(t('Error.downloadPDF'), error);
      // You might want to show a toast notification here
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  // Helper function to get patient name by ID
  const getPatientName = (patientId: number | null) => {
    if (!patientId) return t('Patient.Unknown');
    const patient = patients.find((p) => p.patientId === patientId);
    return patient?.name || t('Patient.Unknown');
  };

  if (!prescription) return null;

  const getStatusBadge = () => {
    // For now, we'll show a default status since the schema doesn't have a status field
    return (
      <Badge className="bg-green-100 text-green-800">
        {t('Common.active')}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('PrescriptionsDetail.title')}
              </DialogTitle>
              <DialogDescription>
                {t('completePrescription.active')}{' '}
                {getPatientName(prescription.patientId)}
              </DialogDescription>
            </div>
            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloadingPDF}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isDownloadingPDF
                ? t('Common.generating')
                : t('Common.downloadPDF')}
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">
                {t('Common.Prescription')} #{prescription.prescriptionId}
              </h3>
              {getStatusBadge()}
            </div>
          </div>

          <Separator />

          {/* Patient Information */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('Common.patientInformation')}
            </h4>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">
                  {t('Common.patientName')}:
                </span>
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
              {t('Common.medications')} ({prescriptionItems.length})
            </h4>
            <div className="space-y-4">
              {prescriptionItems.length > 0 ? (
                prescriptionItems.map((item, index) => (
                  <div
                    key={item.itemId}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-base">
                        {item.drugName || 'Unknown Medication'}
                      </h5>
                      <Badge variant="outline">
                        {t('Common.medication')} {index + 1}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          {t('Common.dosage')}:
                        </span>
                        <div className="font-medium">
                          {item.dosage || 'Not specified'}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          {t('Common.dosage')}
                        </span>
                        <div className="font-medium">
                          {item.frequency || 'Not specified'}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          {t('Common.duration')}:
                        </span>
                        <div className="font-medium">
                          {item.duration || 'Not specified'}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          {t('Common.instructions')}:
                        </span>
                        <div className="font-medium">
                          {item.instructions || 'No specific instructions'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {t('PrescriptionsDetail.notFound')}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Prescription Information */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              {t('PrescriptionsDetail.prescriptionInfo')}
            </h4>
            <div className="grid grid-cols-1 gap-4 text-sm">
              {prescription.notes && (
                <div>
                  <span className="text-muted-foreground">
                    {' '}
                    {t('PrescriptionsDetail.generalNotes')}
                  </span>
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
              {t('PrescriptionsDetail.title')}
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">
                  {t('PrescriptionsDetail.prescriptionDate')}:
                </span>
                <div className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {prescription.prescribedAt
                    ? new Date(prescription.prescribedAt).toLocaleDateString()
                    : 'Not specified'}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {t('Common.createdDate')}:
                </span>
                <div className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {prescription.createdAt
                    ? new Date(prescription.createdAt).toLocaleDateString()
                    : 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {t('Common.status')}:
                </span>
                <div className="font-medium">{getStatusBadge()}</div>
              </div>
              {prescription.updatedAt && (
                <div>
                  <span className="text-muted-foreground">
                    {t('Common.lastUpdate')}:
                  </span>
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
