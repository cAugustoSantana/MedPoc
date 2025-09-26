'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
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
import { Plus, X } from 'lucide-react';

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

  const addResultParameter = () => {
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
  };

  const removeResultParameter = (index: number) => {
    setNewTestForm((prev) => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== index),
    }));
  };

  const updateResultParameter = (
    index: number,
    field: string,
    value: string
  ) => {
    setNewTestForm((prev) => ({
      ...prev,
      results: prev.results.map((result, i) =>
        i === index ? { ...result, [field]: value } : result
      ),
    }));
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Test Result</DialogTitle>
          <DialogDescription>
            Enter the patient information and test results below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Patient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                value={newTestForm.patientName}
                onChange={(e) =>
                  setNewTestForm((prev) => ({
                    ...prev,
                    patientName: e.target.value,
                  }))
                }
                placeholder="Enter patient name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input
                id="patientId"
                value={newTestForm.patientId}
                onChange={(e) =>
                  setNewTestForm((prev) => ({
                    ...prev,
                    patientId: e.target.value,
                  }))
                }
                placeholder="PT-12345"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testType">Test Type</Label>
              <Input
                id="testType"
                value={newTestForm.testType}
                onChange={(e) =>
                  setNewTestForm((prev) => ({
                    ...prev,
                    testType: e.target.value,
                  }))
                }
                placeholder="Complete Blood Count (CBC)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testDate">Test Date</Label>
              <Input
                id="testDate"
                type="date"
                value={newTestForm.testDate}
                onChange={(e) =>
                  setNewTestForm((prev) => ({
                    ...prev,
                    testDate: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderingPhysician">Ordering Physician</Label>
              <Input
                id="orderingPhysician"
                value={newTestForm.orderingPhysician}
                onChange={(e) =>
                  setNewTestForm((prev) => ({
                    ...prev,
                    orderingPhysician: e.target.value,
                  }))
                }
                placeholder="Dr. John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="labName">Laboratory</Label>
              <Input
                id="labName"
                value={newTestForm.labName}
                onChange={(e) =>
                  setNewTestForm((prev) => ({
                    ...prev,
                    labName: e.target.value,
                  }))
                }
                placeholder="Central Medical Lab"
              />
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Test Parameters</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addResultParameter}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Parameter
              </Button>
            </div>

            {newTestForm.results.map((result, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`parameter-${index}`}>Parameter</Label>
                    <Input
                      id={`parameter-${index}`}
                      value={result.parameter}
                      onChange={(e) =>
                        updateResultParameter(
                          index,
                          'parameter',
                          e.target.value
                        )
                      }
                      placeholder="White Blood Cells"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`value-${index}`}>Value</Label>
                    <Input
                      id={`value-${index}`}
                      value={result.value}
                      onChange={(e) =>
                        updateResultParameter(index, 'value', e.target.value)
                      }
                      placeholder="12.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`unit-${index}`}>Unit</Label>
                    <Input
                      id={`unit-${index}`}
                      value={result.unit}
                      onChange={(e) =>
                        updateResultParameter(index, 'unit', e.target.value)
                      }
                      placeholder="K/μL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`referenceRange-${index}`}>
                      Reference Range
                    </Label>
                    <Input
                      id={`referenceRange-${index}`}
                      value={result.referenceRange}
                      onChange={(e) =>
                        updateResultParameter(
                          index,
                          'referenceRange',
                          e.target.value
                        )
                      }
                      placeholder="4.0-11.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`status-${index}`}>Status</Label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={result.status}
                        onValueChange={(value) =>
                          updateResultParameter(index, 'status', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      {newTestForm.results.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeResultParameter(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmitNewTest} disabled={!isFormValid()}>
            Add Test Result
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
