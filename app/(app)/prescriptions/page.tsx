'use client';

import { useState, useEffect, useCallback } from 'react';
import { useOnboardingCheck } from '@/hooks/use-onboarding-check';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { PrescriptionForm } from './components/prescription-form';
import { PrescriptionDetails } from './components/prescription-details';
import { DeleteConfirmDialog } from './components/delete-confirm-dialog';
import { Patient } from '@/types/patient';
import { Prescription } from '@/types/prescription';
import { PrescriptionItem } from '@/types/prescription-item';
import { toast } from 'sonner';
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

// Type for prescription data that includes both original prescription and form data
type PrescriptionWithFormData = Omit<Prescription, 'patientId'> & {
  items: PrescriptionItem[];
  patientId: string;
  medications: Medication[];
};

export default function PrescriptionsPage() {
  const { isReady } = useOnboardingCheck();
  const [prescriptions, setPrescriptions] = useState<
    (Prescription & { items: PrescriptionItem[] })[]
  >([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<
    (Prescription & { items: PrescriptionItem[] }) | null
  >(null);
  const [editingPrescription, setEditingPrescription] =
    useState<PrescriptionWithFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPDF, setDownloadingPDF] = useState<number | null>(null);
  const [loadingViewDetails, setLoadingViewDetails] = useState<number | null>(
    null
  );
  const [loadingEditDetails, setLoadingEditDetails] = useState<number | null>(
    null
  );
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { t } = useTranslations();

  const fetchPrescriptions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prescriptions');
      const result = await response.json();

      if (result.success) {
        setPrescriptions(result.data);
      } else {
        toast.error(result.error || 'Failed to fetch prescriptions');
        setPrescriptions([]);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to fetch prescriptions');
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
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

  // Fetch prescriptions and patients on component mount
  useEffect(() => {
    if (isReady) {
      fetchPrescriptions();
      fetchPatients();
    }
  }, [fetchPrescriptions, isReady]);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Don't render anything while checking authentication or onboarding
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">{t('common.loading')}</div>
      </div>
    );
  }

  // Helper function to get patient name by ID
  const getPatientName = (patientId: number | null) => {
    if (!patientId) return 'Unknown Patient';
    const patient = patients.find((p) => p.patientId === patientId);
    return patient?.name || 'Unknown Patient';
  };

  // Get prescription items for a prescription
  const getPrescriptionItems = (
    prescription: Prescription & { items: PrescriptionItem[] }
  ): PrescriptionItem[] => {
    return prescription.items || [];
  };

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const patientName = getPatientName(prescription.patientId);
    const items = getPrescriptionItems(prescription);
    const medicationNames = items
      .map((item) => item.drugName || 'Unknown Medication')
      .join(' ');

    const matchesSearch =
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicationNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prescription.notes?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      );
    const matchesStatus = statusFilter === 'all';
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPrescriptions = filteredPrescriptions.slice(
    startIndex,
    endIndex
  );

  const handleAddPrescription = async (
    prescriptionData: PrescriptionFormData
  ) => {
    try {
      const prescriptionPayload = {
        ...prescriptionData,
        patientId: prescriptionData.patientId
          ? parseInt(prescriptionData.patientId, 10)
          : null,
      };

      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prescriptionPayload),
      });

      const result = await response.json();

      if (result.success) {
        setPrescriptions([result.data, ...prescriptions]);
        setIsFormOpen(false);
        toast.success('Prescription created successfully');
      } else {
        toast.error(result.error || 'Failed to create prescription');
      }
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast.error('Failed to create prescription');
    }
  };

  const handleEditPrescription = async (
    prescriptionData: PrescriptionFormData
  ) => {
    if (!editingPrescription) return;

    try {
      const prescriptionPayload = {
        ...prescriptionData,
        patientId: prescriptionData.patientId
          ? parseInt(prescriptionData.patientId, 10)
          : null,
      };

      const response = await fetch(
        `/api/prescriptions/${editingPrescription.prescriptionId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(prescriptionPayload),
        }
      );

      const result = await response.json();

      if (result.success) {
        const updatedPrescriptions = prescriptions.map((p) =>
          p.prescriptionId === editingPrescription.prescriptionId
            ? result.data
            : p
        );
        setPrescriptions(updatedPrescriptions);
        setEditingPrescription(null);
        setIsFormOpen(false);
        toast.success('Prescription updated successfully');
      } else {
        toast.error(result.error || 'Failed to update prescription');
      }
    } catch (error) {
      console.error('Error updating prescription:', error);
      toast.error('Failed to update prescription');
    }
  };

  const handleDeletePrescription = async () => {
    if (!selectedPrescription) return;

    try {
      setLoadingDelete(selectedPrescription.prescriptionId);
      const response = await fetch(
        `/api/prescriptions/${selectedPrescription.prescriptionId}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();

      if (result.success) {
        const updatedPrescriptions = prescriptions.filter(
          (p) => p.prescriptionId !== selectedPrescription.prescriptionId
        );
        setPrescriptions(updatedPrescriptions);
        setSelectedPrescription(null);
        setIsDeleteDialogOpen(false);
        toast.success('Prescription deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete prescription');
      }
    } catch (error) {
      console.error('Error deleting prescription:', error);
      toast.error('Failed to delete prescription');
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleViewDetails = async (
    prescription: Prescription & { items: PrescriptionItem[] }
  ) => {
    try {
      setLoadingViewDetails(prescription.prescriptionId);
      // Simulate a small delay to show loading state (in real app, this might fetch additional data)
      await new Promise((resolve) => setTimeout(resolve, 300));
      setSelectedPrescription(prescription);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error('Error loading prescription details:', error);
      toast.error('Failed to load prescription details');
    } finally {
      setLoadingViewDetails(null);
    }
  };

  const handleEditPrescriptionClick = async (
    prescription: Prescription & { items: PrescriptionItem[] }
  ) => {
    try {
      setLoadingEditDetails(prescription.prescriptionId);
      // Simulate a small delay to show loading state (in real app, this might fetch additional data)
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Transform prescription data to match the form format
      const transformedPrescription = {
        ...prescription,
        patientId: prescription.patientId?.toString() || '',
        medications: prescription.items.map((item) => ({
          id: item.itemId.toString(),
          name: item.drugName || '',
          dosage: item.dosage || '',
          frequency: item.frequency || '',
          duration: item.duration || '',
          instructions: item.instructions || '',
        })),
      } as PrescriptionWithFormData;

      setEditingPrescription(transformedPrescription);
      setIsFormOpen(true);
    } catch (error) {
      console.error('Error loading prescription for edit:', error);
      toast.error('Failed to load prescription for editing');
    } finally {
      setLoadingEditDetails(null);
    }
  };

  const getStatusBadge = () => {
    // For now, we'll show a default status since the schema doesn't have a status field
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
  };

  const handleDownloadPDF = async (prescriptionId: number) => {
    try {
      setDownloadingPDF(prescriptionId);
      const response = await fetch(`/api/prescriptions/${prescriptionId}/pdf`);

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prescription-${prescriptionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    } finally {
      setDownloadingPDF(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">
              {t('common.Loading.prescriptions')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('prescription.title')}</h1>
          <p className="text-muted-foreground">{t('prescription.subheader')}</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('prescription.newPrescription')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('prescription.cardTitle')}</CardTitle>
          <CardDescription>{t('prescription.cardDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('search.prescriptionTable')}
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allStatus')}</SelectItem>
                <SelectItem value="active">{t('common.active')}</SelectItem>
                <SelectItem value="completed">
                  {t('common.completed')}
                </SelectItem>
                <SelectItem value="cancelled">
                  {t('common.cancelled')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.patient')}</TableHead>
                  <TableHead>{t('common.medication')}</TableHead>
                  <TableHead>{t('common.dosage')}</TableHead>
                  <TableHead>{t('common.frequency')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead>{t('common.prescribedDate')}</TableHead>
                  <TableHead className="text-right">
                    {t('common.actions')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPrescriptions.map((prescription) => {
                  const items = getPrescriptionItems(prescription);
                  return (
                    <TableRow key={prescription.prescriptionId}>
                      <TableCell>
                        <div className="font-medium">
                          {getPatientName(prescription.patientId)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {items.length > 0 ? (
                            items.map((item, index) => (
                              <div key={item.itemId} className="text-sm">
                                <span className="font-medium">
                                  {item.drugName || t('common.prescribedDate')}
                                </span>
                                {index < items.length - 1 && (
                                  <span className="text-muted-foreground">
                                    ,{' '}
                                  </span>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              No medications
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {items.length > 0 ? (
                            items.map((item) => (
                              <div key={item.itemId} className="text-sm">
                                {item.dosage || 'N/A'}
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              -
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {items.length > 0 ? (
                            items.map((item) => (
                              <div key={item.itemId} className="text-sm">
                                {item.frequency || 'N/A'}
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              -
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge()}</TableCell>
                      <TableCell>
                        {prescription.prescribedAt
                          ? new Date(
                              prescription.prescribedAt
                            ).toLocaleDateString()
                          : 'Not specified'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(prescription)}
                            disabled={
                              loadingViewDetails === prescription.prescriptionId
                            }
                            title="View Details"
                          >
                            {loadingViewDetails ===
                            prescription.prescriptionId ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDownloadPDF(prescription.prescriptionId)
                            }
                            disabled={
                              downloadingPDF === prescription.prescriptionId
                            }
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleEditPrescriptionClick(prescription)
                            }
                            disabled={
                              loadingEditDetails === prescription.prescriptionId
                            }
                            title="Edit Prescription"
                          >
                            {loadingEditDetails ===
                            prescription.prescriptionId ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Edit className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPrescription(prescription);
                              setIsDeleteDialogOpen(true);
                            }}
                            disabled={
                              loadingDelete === prescription.prescriptionId
                            }
                            title="Delete Prescription"
                          >
                            {loadingDelete === prescription.prescriptionId ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredPrescriptions.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || statusFilter !== 'all'
                ? 'No prescriptions found matching your criteria.'
                : 'No prescriptions found. Create your first prescription to get started.'}
            </div>
          )}

          {filteredPrescriptions.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{' '}
                {Math.min(endIndex, filteredPrescriptions.length)} of{' '}
                {filteredPrescriptions.length} prescriptions
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                        }
                      }}
                      className={
                        currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Show first page, last page, current page, and pages around current page
                      const shouldShow =
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1);

                      if (!shouldShow) {
                        // Show ellipsis for gaps
                        if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      }

                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1);
                        }
                      }}
                      className={
                        currentPage >= totalPages
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <PrescriptionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={
          editingPrescription ? handleEditPrescription : handleAddPrescription
        }
        initialData={editingPrescription as Prescription | null}
        mode={editingPrescription ? 'edit' : 'create'}
      />

      <PrescriptionDetails
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        prescription={selectedPrescription}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeletePrescription}
        prescriptionName={
          selectedPrescription
            ? getPatientName(selectedPrescription.patientId)
            : 'this prescription'
        }
        loading={
          selectedPrescription
            ? loadingDelete === selectedPrescription.prescriptionId
            : false
        }
      />
    </div>
  );
}
