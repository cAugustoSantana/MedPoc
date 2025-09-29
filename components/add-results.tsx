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
import {
  ArrowLeft,
  ArrowRight,
  User,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Patient } from '@/types/patient';
import { ExtractedTestData } from '@/lib/ocr-server-service';

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
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<ExtractedTestData | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
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

  const handleFileUpload = async (acceptedFiles: File[]) => {
    setUploadedFiles(acceptedFiles);
    setOcrError(null);

    if (acceptedFiles.length > 0) {
      await processFilesWithOCR(acceptedFiles);
    }
  };

  const processFilesWithOCR = async (files: File[]) => {
    setOcrProcessing(true);
    setOcrError(null);

    try {
      // Process the first file (you could extend this to process multiple files)
      const file = files[0];

      console.log('🚀 Starting server-side OCR processing...');
      console.log(
        '📁 File:',
        file.name,
        file.type,
        `${(file.size / 1024 / 1024).toFixed(2)} MB`
      );

      // Use server-side OCR via API route
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('🔍 Server-side OCR result:', result);

      if (result.success) {
        console.log('🎉 OCR processing completed successfully!');
        console.log('📊 Confidence:', result.confidence);

        if (result.rawText) {
          console.log('📝 Raw text from OCR:');
          console.log(result.rawText);
        }

        if (result.data) {
          console.log('📋 Extracted Data Summary:');
          console.log('='.repeat(40));
          console.log('Test Type:', result.data.testType || 'Not found');
          console.log('Test Date:', result.data.testDate || 'Not found');
          console.log(
            'Physician:',
            result.data.orderingPhysician || 'Not found'
          );
          console.log('Lab Name:', result.data.labName || 'Not found');
          console.log('Number of Results:', result.data.results?.length || 0);

          if (result.data.results && result.data.results.length > 0) {
            console.log('📊 Test Results:');
            result.data.results.forEach(
              (
                testResult: {
                  parameter: string;
                  value: string;
                  unit: string;
                  referenceRange: string;
                  status: 'normal' | 'high' | 'low' | 'critical';
                },
                index: number
              ) => {
                console.log(
                  `  ${index + 1}. ${testResult.parameter}: ${testResult.value} ${testResult.unit} (${testResult.referenceRange}) - ${testResult.status}`
                );
              }
            );
          }
          console.log('='.repeat(40));

          setOcrResult(result.data);

          // Auto-populate the form with extracted data
          setNewTestForm((prev) => ({
            ...prev,
            testType: result.data?.testType || prev.testType,
            testDate: result.data?.testDate || prev.testDate,
            orderingPhysician:
              result.data?.orderingPhysician || prev.orderingPhysician,
            labName: result.data?.labName || prev.labName,
            results:
              result.data?.results && result.data.results.length > 0
                ? result.data.results
                : prev.results,
          }));
        }
      } else {
        console.error('❌ OCR failed:', result.error);
        setOcrError(result.error || 'Failed to process file');
      }
    } catch (error) {
      console.error('OCR processing error:', error);
      setOcrError('Failed to process file. Please try again.');
    } finally {
      setOcrProcessing(false);
    }
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
    setOcrProcessing(false);
    setOcrResult(null);
    setOcrError(null);
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

                {/* OCR Processing Status */}
                {ocrProcessing && (
                  <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm text-blue-700">
                      Scanning test results... This may take a few moments.
                    </span>
                  </div>
                )}

                {ocrResult && !ocrProcessing && (
                  <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      Successfully extracted test data! Proceed to step 2 to
                      review.
                    </span>
                  </div>
                )}

                {ocrError && !ocrProcessing && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-700">{ocrError}</span>
                  </div>
                )}
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
            <h3 className="text-lg font-semibold">
              Review and Confirm Test Results
            </h3>
            <p className="text-muted-foreground">
              {ocrResult
                ? 'Review the extracted test data and make any necessary corrections'
                : 'Review your uploaded files and save the test results'}
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

            {/* Test Information Form */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-4">Test Information:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="testType">Test Type *</Label>
                  <input
                    id="testType"
                    type="text"
                    value={newTestForm.testType}
                    onChange={(e) =>
                      setNewTestForm((prev) => ({
                        ...prev,
                        testType: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Complete Blood Count"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testDate">Test Date *</Label>
                  <input
                    id="testDate"
                    type="date"
                    value={newTestForm.testDate}
                    onChange={(e) =>
                      setNewTestForm((prev) => ({
                        ...prev,
                        testDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderingPhysician">
                    Ordering Physician *
                  </Label>
                  <input
                    id="orderingPhysician"
                    type="text"
                    value={newTestForm.orderingPhysician}
                    onChange={(e) =>
                      setNewTestForm((prev) => ({
                        ...prev,
                        orderingPhysician: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Dr. Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="labName">Laboratory *</Label>
                  <input
                    id="labName"
                    type="text"
                    value={newTestForm.labName}
                    onChange={(e) =>
                      setNewTestForm((prev) => ({
                        ...prev,
                        labName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., City Medical Lab"
                  />
                </div>
              </div>
            </div>

            {/* Test Results */}
            {newTestForm.results.length > 0 && (
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-4">Test Results:</h4>
                <div className="space-y-3">
                  {newTestForm.results.map((result, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 gap-2 items-center"
                    >
                      <input
                        type="text"
                        value={result.parameter}
                        onChange={(e) => {
                          const newResults = [...newTestForm.results];
                          newResults[index].parameter = e.target.value;
                          setNewTestForm((prev) => ({
                            ...prev,
                            results: newResults,
                          }));
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Parameter"
                      />
                      <input
                        type="text"
                        value={result.value}
                        onChange={(e) => {
                          const newResults = [...newTestForm.results];
                          newResults[index].value = e.target.value;
                          setNewTestForm((prev) => ({
                            ...prev,
                            results: newResults,
                          }));
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Value"
                      />
                      <input
                        type="text"
                        value={result.unit}
                        onChange={(e) => {
                          const newResults = [...newTestForm.results];
                          newResults[index].unit = e.target.value;
                          setNewTestForm((prev) => ({
                            ...prev,
                            results: newResults,
                          }));
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Unit"
                      />
                      <input
                        type="text"
                        value={result.referenceRange}
                        onChange={(e) => {
                          const newResults = [...newTestForm.results];
                          newResults[index].referenceRange = e.target.value;
                          setNewTestForm((prev) => ({
                            ...prev,
                            results: newResults,
                          }));
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Reference Range"
                      />
                      <select
                        value={result.status}
                        onChange={(e) => {
                          const newResults = [...newTestForm.results];
                          newResults[index].status = e.target.value as
                            | 'normal'
                            | 'high'
                            | 'low'
                            | 'critical';
                          setNewTestForm((prev) => ({
                            ...prev,
                            results: newResults,
                          }));
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="low">Low</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setNewTestForm((prev) => ({
                      ...prev,
                      results: [
                        ...prev.results,
                        {
                          parameter: '',
                          value: '',
                          unit: '',
                          referenceRange: '',
                          status: 'normal',
                        },
                      ],
                    }));
                  }}
                >
                  Add Result
                </Button>
              </div>
            )}
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
                  disabled={
                    !selectedPatient ||
                    uploadedFiles.length === 0 ||
                    ocrProcessing
                  }
                >
                  {ocrProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
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
