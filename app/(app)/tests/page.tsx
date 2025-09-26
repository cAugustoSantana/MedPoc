'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
} from 'lucide-react';

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

const initialMockTestResults: TestResult[] = [
  {
    id: 'LAB-2024-001',
    patientName: 'Sarah Johnson',
    patientId: 'PT-12345',
    testType: 'Complete Blood Count (CBC)',
    testDate: '2024-01-15',
    status: 'abnormal',
    orderingPhysician: 'Dr. Michael Chen',
    labName: 'Central Medical Lab',
    results: [
      {
        parameter: 'White Blood Cells',
        value: '12.5',
        unit: 'K/μL',
        referenceRange: '4.0-11.0',
        status: 'high',
      },
      {
        parameter: 'Red Blood Cells',
        value: '4.2',
        unit: 'M/μL',
        referenceRange: '4.2-5.4',
        status: 'normal',
      },
      {
        parameter: 'Hemoglobin',
        value: '13.8',
        unit: 'g/dL',
        referenceRange: '12.0-15.5',
        status: 'normal',
      },
      {
        parameter: 'Platelets',
        value: '180',
        unit: 'K/μL',
        referenceRange: '150-450',
        status: 'normal',
      },
    ],
  },
  {
    id: 'LAB-2024-002',
    patientName: 'Robert Martinez',
    patientId: 'PT-67890',
    testType: 'Lipid Panel',
    testDate: '2024-01-14',
    status: 'critical',
    orderingPhysician: 'Dr. Emily Rodriguez',
    labName: 'Quest Diagnostics',
    results: [
      {
        parameter: 'Total Cholesterol',
        value: '280',
        unit: 'mg/dL',
        referenceRange: '<200',
        status: 'critical',
      },
      {
        parameter: 'LDL Cholesterol',
        value: '190',
        unit: 'mg/dL',
        referenceRange: '<100',
        status: 'critical',
      },
      {
        parameter: 'HDL Cholesterol',
        value: '35',
        unit: 'mg/dL',
        referenceRange: '>40',
        status: 'low',
      },
      {
        parameter: 'Triglycerides',
        value: '275',
        unit: 'mg/dL',
        referenceRange: '<150',
        status: 'high',
      },
    ],
  },
  {
    id: 'LAB-2024-003',
    patientName: 'Lisa Thompson',
    patientId: 'PT-11111',
    testType: 'Thyroid Function Panel',
    testDate: '2024-01-13',
    status: 'normal',
    orderingPhysician: 'Dr. Michael Chen',
    labName: 'LabCorp',
    results: [
      {
        parameter: 'TSH',
        value: '2.1',
        unit: 'mIU/L',
        referenceRange: '0.4-4.0',
        status: 'normal',
      },
      {
        parameter: 'Free T4',
        value: '1.3',
        unit: 'ng/dL',
        referenceRange: '0.8-1.8',
        status: 'normal',
      },
      {
        parameter: 'Free T3',
        value: '3.2',
        unit: 'pg/mL',
        referenceRange: '2.3-4.2',
        status: 'normal',
      },
    ],
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case 'normal':
      return 'text-[color:var(--medical-normal)]';
    case 'high':
    case 'low':
      return 'text-[color:var(--medical-warning)]';
    case 'critical':
      return 'text-[color:var(--medical-critical)]';
    case 'abnormal':
      return 'text-[color:var(--medical-warning)]';
    case 'pending':
      return 'text-muted-foreground';
    default:
      return 'text-foreground';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'normal':
      return (
        <CheckCircle className="h-4 w-4 text-[color:var(--medical-normal)]" />
      );
    case 'abnormal':
    case 'high':
    case 'low':
      return (
        <AlertTriangle className="h-4 w-4 text-[color:var(--medical-warning)]" />
      );
    case 'critical':
      return (
        <AlertTriangle className="h-4 w-4 text-[color:var(--medical-critical)]" />
      );
    case 'pending':
      return <Clock className="h-4 w-4 text-muted-foreground" />;
    default:
      return null;
  }
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'normal':
      return 'default';
    case 'abnormal':
    case 'high':
    case 'low':
      return 'secondary';
    case 'critical':
      return 'destructive';
    case 'pending':
      return 'outline';
    default:
      return 'default';
  }
}

export default function TestResultsPage() {
  const [testResults, setTestResults] = useState<TestResult[]>(
    initialMockTestResults
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [testTypeFilter, setTestTypeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [expandedResults, setExpandedResults] = useState<Set<string>>(
    new Set()
  );
  const resultsPerPage = 5;

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

  const filteredAndSortedResults = useMemo(() => {
    const filtered = testResults.filter((result) => {
      const matchesSearch =
        result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.testType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || result.status === statusFilter;

      const matchesTestType =
        testTypeFilter === 'all' ||
        (testTypeFilter === 'blood' &&
          result.testType.toLowerCase().includes('blood')) ||
        (testTypeFilter === 'imaging' &&
          result.testType.toLowerCase().includes('imaging')) ||
        (testTypeFilter === 'urine' &&
          result.testType.toLowerCase().includes('urine')) ||
        (testTypeFilter === 'cardiac' &&
          result.testType.toLowerCase().includes('cardiac'));

      return matchesSearch && matchesStatus && matchesTestType;
    });

    filtered.sort((a, b) => {
      const dateA = new Date(a.testDate).getTime();
      const dateB = new Date(b.testDate).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [testResults, searchTerm, statusFilter, testTypeFilter, sortOrder]);

  const totalPages = Math.ceil(
    filteredAndSortedResults.length / resultsPerPage
  );
  const startIndex = (currentPage - 1) * resultsPerPage;
  const paginatedResults = filteredAndSortedResults.slice(
    startIndex,
    startIndex + resultsPerPage
  );

  const toggleResultExpansion = (resultId: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(resultId)) {
      newExpanded.delete(resultId);
    } else {
      newExpanded.add(resultId);
    }
    setExpandedResults(newExpanded);
  };

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
    const newId = `LAB-2024-${String(testResults.length + 1).padStart(3, '0')}`;

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

    setTestResults((prev) => [newTestResult, ...prev]);

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

    setIsAddDialogOpen(false);
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Test & Lab Results
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and review patient laboratory results
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-[color:var(--medical-primary)] hover:bg-[color:var(--medical-primary)]/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Result
                  </Button>
                </DialogTrigger>
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
                        <Label htmlFor="orderingPhysician">
                          Ordering Physician
                        </Label>
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
                        <Label className="text-base font-medium">
                          Test Parameters
                        </Label>
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
                              <Label htmlFor={`parameter-${index}`}>
                                Parameter
                              </Label>
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
                                  updateResultParameter(
                                    index,
                                    'value',
                                    e.target.value
                                  )
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
                                  updateResultParameter(
                                    index,
                                    'unit',
                                    e.target.value
                                  )
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
                                    updateResultParameter(
                                      index,
                                      'status',
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="normal">
                                      Normal
                                    </SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="critical">
                                      Critical
                                    </SelectItem>
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
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitNewTest}
                      disabled={!isFormValid()}
                    >
                      Add Test Result
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name, ID, or test type..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Results</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="abnormal">Abnormal</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={testTypeFilter} onValueChange={setTestTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Test type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tests</SelectItem>
              <SelectItem value="blood">Blood Work</SelectItem>
              <SelectItem value="imaging">Imaging</SelectItem>
              <SelectItem value="urine">Urine Tests</SelectItem>
              <SelectItem value="cardiac">Cardiac</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sortOrder}
            onValueChange={(value: 'newest' | 'oldest') => setSortOrder(value)}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Results count and pagination info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-
            {Math.min(
              startIndex + resultsPerPage,
              filteredAndSortedResults.length
            )}{' '}
            of {filteredAndSortedResults.length} results
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid gap-4 mb-6">
          {paginatedResults.map((result) => (
            <Card key={result.id} className="bg-card border-border">
              <Collapsible
                open={expandedResults.has(result.id)}
                onOpenChange={() => toggleResultExpansion(result.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-4 cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg font-medium text-foreground">
                            {result.patientName}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {result.patientId}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {result.testType} • {result.labName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ordered by {result.orderingPhysician} •{' '}
                          {result.testDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <Badge
                          variant={getStatusBadgeVariant(result.status)}
                          className="capitalize"
                        >
                          {result.status}
                        </Badge>
                        {expandedResults.has(result.id) ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-3">
                      {result.results.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm text-foreground">
                              {item.parameter}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Reference: {item.referenceRange} {item.unit}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-mono font-medium ${getStatusColor(item.status)}`}
                            >
                              {item.value} {item.unit}
                            </p>
                            <Badge
                              variant={getStatusBadgeVariant(item.status)}
                              className="text-xs capitalize mt-1"
                            >
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      ))}

                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Test ID</p>
                            <p className="font-mono text-foreground">
                              {result.id}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Collection Date
                            </p>
                            <p className="text-foreground">{result.testDate}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Laboratory</p>
                            <p className="text-foreground">{result.labName}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Ordering Physician
                            </p>
                            <p className="text-foreground">
                              {result.orderingPhysician}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {/* Pagination component */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={
                      currentPage === 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
