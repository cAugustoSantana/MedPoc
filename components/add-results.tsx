'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Stepper } from '@/components/ui/stepper';
import { Combobox } from '@/components/ui/combobox';
import {
  Dropzone,
  DropzoneEmptyState,
  DropzoneContent,
} from '@/components/ui/kibo-ui/dropzone';
import { ArrowLeft, ArrowRight, User } from 'lucide-react';
import { Patient } from '@/types/patient';

interface TestResult {
  id: string;
  patientName: string;
  patientId: string;
  testType: string;
  testDate: string;
  status: 'normal' | 'abnormal' | 'critical' | 'pending';
  results: {
    parameter: string;
    value: string;
    unit: string;
    referenceRange: string;
    status: 'normal' | 'high' | 'low' | 'critical';
  }[];
  orderingPhysician: string;
  labName: string;
}

interface AddResultsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddResult: (result: TestResult) => void;
}

export default function AddResultsDialog({
  isOpen,
  onOpenChange,
  onAddResult,
}: AddResultsDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [newTestForm, setNewTestForm] = useState<{
    patientName: string;
    patientId: string;
    testType: string;
    testDate: string;
    orderingPhysician: string;
    labName: string;
    results: {
      parameter: string;
      value: string;
      unit: string;
      referenceRange: string;
      status: 'normal' | 'high' | 'low' | 'critical';
    }[];
  }>({
    patientName: '',
    patientId: '',
    testType: '',
    testDate: '',
    orderingPhysician: '',
    labName: '',
    results: [
      {
        parameter: '',
        value: '',
        unit: '',
        referenceRange: '',
        status: 'normal',
      },
    ],
  });

  const determineOverallStatus = (
    results: typeof newTestForm.results
  ): TestResult['status'] => {
    if (results.some((r) => r.status === 'critical')) return 'critical';
    if (results.some((r) => r.status === 'high' || r.status === 'low'))
      return 'abnormal';
    return 'normal';
  };

  const handleSubmitNewTest = () => {
    // Generate new ID
    const newId = `LAB-2024-${String(Date.now()).slice(-6)}`;

    const newTestResult: TestResult = {
      id: newId,
      patientName: newTestForm.patientName,
      patientId: newTestForm.patientId,
      testType: newTestForm.testType,
      testDate: newTestForm.testDate,
      orderingPhysician: newTestForm.orderingPhysician,
      labName: newTestForm.labName,
      status: determineOverallStatus(newTestForm.results),
      results: newTestForm.results.filter((r) => r.parameter && r.value), // Only include completed parameters
    };

    onAddResult(newTestResult);

    // Reset form
    setNewTestForm({
      patientName: '',
      patientId: '',
      testType: '',
      testDate: '',
      orderingPhysician: '',
      labName: '',
      results: [
        {
          parameter: '',
          value: '',
          unit: '',
          referenceRange: '',
          status: 'normal',
        },
      ],
    });

    onOpenChange(false);
  };

  const isFormValid = () => {
    return (
      newTestForm.patientName &&
      newTestForm.patientId &&
      newTestForm.testType &&
      newTestForm.testDate &&
      newTestForm.orderingPhysician &&
      newTestForm.labName &&
      newTestForm.results.some((r) => r.parameter && r.value)
    );
  };

  const handleFileUpload = (acceptedFiles: File[]) => {
    setUploadedFiles(acceptedFiles);
  };

  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Fetch patients when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchPatients();
    }
  }, [isOpen]);

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

  const handlePatientChange = (patientId: string) => {
    const patient = patients.find((p) => p.patientId.toString() === patientId);
    setSelectedPatient(patient || null);
    if (patient) {
      setNewTestForm((prev) => ({
        ...prev,
        patientId: patient.patientId.toString(),
        patientName: patient.name,
      }));
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setUploadedFiles([]);
    setSelectedPatient(null);
    setNewTestForm({
      patientName: '',
      patientId: '',
      testType: '',
      testDate: '',
      orderingPhysician: '',
      labName: '',
      results: [
        {
          parameter: '',
          value: '',
          unit: '',
          referenceRange: '',
          status: 'normal',
        },
      ],
    });
    onOpenChange(false);
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold">
              Select Patient & Upload Test Results
            </h3>
            <p className="text-muted-foreground">
              First select a patient, then upload your test result files
            </p>
          </div>

          {/* Patient Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient *</Label>
              <Combobox
                options={patientOptions}
                value={selectedPatient?.patientId.toString() || ''}
                onValueChange={handlePatientChange}
                placeholder="Select patient..."
                searchPlaceholder="Search patients..."
                emptyText="No patients found."
                disabled={patientsLoading}
              />
            </div>

            {selectedPatient && (
              <div className="p-3 bg-muted/50 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">
                      {selectedPatient.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Patient ID: {selectedPatient.patientId}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* File Upload Section */}
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-medium">Upload Test Result Files</h4>
              <p className="text-sm text-muted-foreground">
                {selectedPatient
                  ? 'Upload your test result files for this patient'
                  : 'Please select a patient first to upload files'}
              </p>
            </div>

            <Dropzone
              onDrop={handleFileUpload}
              accept={{
                'application/pdf': ['.pdf'],
                'image/*': ['.png', '.jpg', '.jpeg'],
              }}
              maxFiles={5}
              maxSize={10 * 1024 * 1024} // 10MB
              src={uploadedFiles}
              disabled={!selectedPatient}
            >
              <DropzoneEmptyState />
              <DropzoneContent />
            </Dropzone>

            {!selectedPatient && (
              <div className="text-center p-4 bg-muted/30 rounded-lg border-2 border-dashed border-muted">
                <User className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Please select a patient to enable file upload
                </p>
              </div>
            )}

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Files:</Label>
                <div className="space-y-1">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded"
                    >
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Review and Save</h3>
            <p className="text-muted-foreground">
              Review your uploaded files and save the test results
            </p>
          </div>

          <div className="space-y-4">
            {/* Selected Patient Info */}
            {selectedPatient && (
              <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Selected Patient
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <span className="ml-2 font-medium">
                      {selectedPatient.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Patient ID:</span>
                    <span className="ml-2">{selectedPatient.patientId}</span>
                  </div>
                  {selectedPatient.email && (
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <span className="ml-2">{selectedPatient.email}</span>
                    </div>
                  )}
                  {selectedPatient.phone && (
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="ml-2">{selectedPatient.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Uploaded Files */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Uploaded Files:</h4>
              {uploadedFiles.length > 0 ? (
                <ul className="space-y-1">
                  {uploadedFiles.map((file, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No files uploaded
                </p>
              )}
            </div>

            {/* Test Information */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Test Information:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Test Type:</span>
                  <span className="ml-2">
                    {newTestForm.testType || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <span className="ml-2">
                    {newTestForm.testDate || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Physician:</span>
                  <span className="ml-2">
                    {newTestForm.orderingPhysician || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Laboratory:</span>
                  <span className="ml-2">
                    {newTestForm.labName || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Test Result</DialogTitle>
          <DialogDescription>
            {currentStep === 1
              ? 'Upload your test result files to get started'
              : 'Review and save your test results'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-center mb-6">
            <Stepper currentStep={currentStep} totalSteps={2} />
          </div>

          {renderStepContent()}
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePreviousStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {currentStep < 2 ? (
                <Button
                  onClick={handleNextStep}
                  disabled={!selectedPatient || uploadedFiles.length === 0}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmitNewTest} disabled={!isFormValid()}>
                  Save Test Result
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
