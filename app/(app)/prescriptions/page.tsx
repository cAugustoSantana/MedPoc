'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';
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
import { PrescriptionForm } from './components/prescription-form';
import { PrescriptionDetails } from './components/prescription-details';
import { DeleteConfirmDialog } from './components/delete-confirm-dialog';
import { Patient } from '@/types/patient';
import { Prescription } from '@/types/prescription';
import { PrescriptionItem } from '@/types/prescription-item';
import { toast } from 'sonner';

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

export default function PrescriptionsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prescriptionItems, setPrescriptionItems] = useState<{
    [key: number]: PrescriptionItem[];
  }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [editingPrescription, setEditingPrescription] =
    useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  const fetchPrescriptions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prescriptions');
      const result = await response.json();

      if (result.success) {
        setPrescriptions(result.data);
        // Fetch prescription items for each prescription
        await fetchPrescriptionItems(result.data);
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

  const fetchPrescriptionItems = async (prescriptions: Prescription[]) => {
    try {
      const itemsMap: { [key: number]: PrescriptionItem[] } = {};

      for (const prescription of prescriptions) {
        if (prescription.prescriptionId) {
          const response = await fetch(
            `/api/prescriptions/${prescription.prescriptionId}/items`,
          );
          const result = await response.json();

          if (result.success) {
            itemsMap[prescription.prescriptionId] = result.data;
          } else {
            itemsMap[prescription.prescriptionId] = [];
          }
        }
      }

      setPrescriptionItems(itemsMap);
    } catch (error) {
      console.error('Error fetching prescription items:', error);
    }
  };

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
    if (isSignedIn) {
      fetchPrescriptions();
      fetchPatients();
    }
  }, [fetchPrescriptions, isSignedIn]);

  // Don't render anything while checking authentication
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
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
    prescription: Prescription,
  ): PrescriptionItem[] => {
    if (!prescription.prescriptionId) return [];
    return prescriptionItems[prescription.prescriptionId] || [];
  };

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const patientName = getPatientName(prescription.patientId);
    const items = getPrescriptionItems(prescription);
    const medicationNames = items
      .map(
        (item) =>
          (item as PrescriptionItem & { drugName?: string }).drugName ||
          'Unknown Medication',
      )
      .join(' ');

    const matchesSearch =
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicationNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prescription.notes?.toLowerCase() || '').includes(
        searchTerm.toLowerCase(),
      );
    const matchesStatus = statusFilter === 'all';
    return matchesSearch && matchesStatus;
  });

  const handleAddPrescription = async (
    prescriptionData: PrescriptionFormData,
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
        // Refresh prescription items
        await fetchPrescriptionItems([result.data, ...prescriptions]);
      } else {
        toast.error(result.error || 'Failed to create prescription');
      }
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast.error('Failed to create prescription');
    }
  };

  const handleEditPrescription = async (
    prescriptionData: PrescriptionFormData,
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
        },
      );

      const result = await response.json();

      if (result.success) {
        const updatedPrescriptions = prescriptions.map((p) =>
          p.prescriptionId === editingPrescription.prescriptionId
            ? result.data
            : p,
        );
        setPrescriptions(updatedPrescriptions);
        setEditingPrescription(null);
        setIsFormOpen(false);
        toast.success('Prescription updated successfully');
        // Refresh prescription items
        await fetchPrescriptionItems(updatedPrescriptions);
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
      const response = await fetch(
        `/api/prescriptions/${selectedPrescription.prescriptionId}`,
        {
          method: 'DELETE',
        },
      );

      const result = await response.json();

      if (result.success) {
        const updatedPrescriptions = prescriptions.filter(
          (p) => p.prescriptionId !== selectedPrescription.prescriptionId,
        );
        setPrescriptions(updatedPrescriptions);
        setSelectedPrescription(null);
        setIsDeleteDialogOpen(false);
        toast.success('Prescription deleted successfully');
        // Remove prescription items from state
        const updatedItems = { ...prescriptionItems };
        delete updatedItems[selectedPrescription.prescriptionId];
        setPrescriptionItems(updatedItems);
      } else {
        toast.error(result.error || 'Failed to delete prescription');
      }
    } catch (error) {
      console.error('Error deleting prescription:', error);
      toast.error('Failed to delete prescription');
    }
  };

  const getStatusBadge = () => {
    // For now, we'll show a default status since the schema doesn't have a status field
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">
              Loading prescriptions...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Prescriptions</h1>
          <p className="text-muted-foreground">
            Manage patient prescriptions and medications
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Prescription
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prescription Management</CardTitle>
          <CardDescription>
            View and manage all patient prescriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, medication, or notes..."
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prescribed Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.map((prescription) => {
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
                                  {(
                                    item as PrescriptionItem & {
                                      drugName?: string;
                                    }
                                  ).drugName || 'Unknown Medication'}
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
                                {(
                                  item as PrescriptionItem & {
                                    drugStrength?: string;
                                  }
                                ).drugStrength || 'N/A'}
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
                                {(
                                  item as PrescriptionItem & {
                                    frequencyDescription?: string;
                                  }
                                ).frequencyDescription || 'N/A'}
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
                              prescription.prescribedAt,
                            ).toLocaleDateString()
                          : 'Not specified'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPrescription(prescription);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingPrescription(prescription);
                              setIsFormOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPrescription(prescription);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
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
        </CardContent>
      </Card>

      <PrescriptionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={
          editingPrescription ? handleEditPrescription : handleAddPrescription
        }
        initialData={editingPrescription}
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
        prescriptionName={selectedPrescription?.notes || 'this prescription'}
      />
    </div>
  );
}
