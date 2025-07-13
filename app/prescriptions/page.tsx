'use client';

import { useState, useEffect } from 'react';
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

// Mock data
const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientId: '1',
    medications: [
      {
        id: 'm1',
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: '3 times daily',
        duration: '7 days',
        instructions: 'Take with food',
      },
    ],
    prescribedDate: '2024-01-15',
    status: 'active',
    doctorName: 'Dr. Sarah Johnson',
    refills: 0,
    diagnosis: 'Bacterial infection',
    generalInstructions: 'Complete the full course even if feeling better',
  },
  {
    id: '2',
    patientId: '2',
    medications: [
      {
        id: 'm2',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take in the morning',
      },
      {
        id: 'm3',
        name: 'Hydrochlorothiazide',
        dosage: '25mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take with Lisinopril',
      },
    ],
    prescribedDate: '2024-01-14',
    status: 'active',
    doctorName: 'Dr. Michael Chen',
    refills: 2,
    diagnosis: 'Hypertension',
    generalInstructions: 'Monitor blood pressure daily',
  },
  {
    id: '3',
    patientId: '3',
    medications: [
      {
        id: 'm4',
        name: 'Metformin',
        dosage: '850mg',
        frequency: 'Twice daily',
        duration: '90 days',
        instructions: 'Take with meals',
      },
      {
        id: 'm5',
        name: 'Glipizide',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: '90 days',
        instructions: 'Take 30 minutes before breakfast',
      },
    ],
    prescribedDate: '2024-01-10',
    status: 'completed',
    doctorName: 'Dr. Sarah Johnson',
    refills: 1,
    diagnosis: 'Type 2 Diabetes',
    generalInstructions: 'Monitor blood glucose levels regularly',
  },
];

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] =
    useState<Prescription[]>(mockPrescriptions);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [editingPrescription, setEditingPrescription] =
    useState<Prescription | null>(null);

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

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const patientName = getPatientName(prescription.patientId);
    const matchesSearch =
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medications.some((med) =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesStatus =
      statusFilter === 'all' || prescription.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddPrescription = (newPrescription: Omit<Prescription, 'id'>) => {
    const prescription: Prescription = {
      ...newPrescription,
      id: Date.now().toString(),
    };
    setPrescriptions([prescription, ...prescriptions]);
    setIsFormOpen(false);
  };

  const handleEditPrescription = (
    updatedPrescription: Omit<Prescription, 'id'>,
  ) => {
    if (editingPrescription) {
      setPrescriptions(
        prescriptions.map((p) =>
          p.id === editingPrescription.id
            ? { ...updatedPrescription, id: editingPrescription.id }
            : p,
        ),
      );
      setEditingPrescription(null);
      setIsFormOpen(false);
    }
  };

  const handleDeletePrescription = () => {
    if (selectedPrescription) {
      setPrescriptions(
        prescriptions.filter((p) => p.id !== selectedPrescription.id),
      );
      setSelectedPrescription(null);
      setIsDeleteDialogOpen(false);
    }
  };

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
                placeholder="Search by patient name, medication, or patient ID..."
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
                  <TableHead>Doctor</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {getPatientName(prescription.patientId)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {prescription.patientId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {prescription.medications.map((med, index) => (
                          <div key={med.id} className="text-sm">
                            <span className="font-medium">{med.name}</span>
                            {index < prescription.medications.length - 1 && (
                              <span className="text-muted-foreground">, </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {prescription.medications.map((med) => (
                          <div key={med.id} className="text-sm">
                            {med.dosage}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {prescription.medications.map((med) => (
                          <div key={med.id} className="text-sm">
                            {med.frequency}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(prescription.status)}</TableCell>
                    <TableCell>
                      {new Date(
                        prescription.prescribedDate,
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{prescription.doctorName}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPrescriptions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No prescriptions found matching your criteria.
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
        prescriptionName={selectedPrescription?.medications[0]?.name || ''}
      />
    </div>
  );
}
