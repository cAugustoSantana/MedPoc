"use client"
import { AgeDisplay } from '@/components/age-display'
import { useState, useEffect } from "react"
import {
  ChevronDown,
  ChevronRight,
  Calendar,
  FileText,
  TestTube,
  Phone,
  Mail,
  MapPin,
  User,
  Heart,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Patient } from "../types/patient"

interface PatientDetailProps {
  patientId: string
}

export default function PatientDetail({ patientId }: PatientDetailProps) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [medicalRecordsOpen, setMedicalRecordsOpen] = useState(false)
  const [appointmentsOpen, setAppointmentsOpen] = useState(false)
  const [testsOpen, setTestsOpen] = useState(false)

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/patients/${patientId}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Patient not found")
          }
          throw new Error("Failed to fetch patient data")
        }

        const patientData = await response.json()
        setPatient(patientData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (patientId) {
      fetchPatient()
    }
  }, [patientId])

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading patient data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No patient data available.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Patient Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Patient Details</CardTitle>
            <Button variant="outline">Edit Patient</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="text-xl font-semibold">{patient.name}</h3>
                  <p className="text-muted-foreground">Patient ID: {patient.patientId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Age</p>
                  <AgeDisplay className="text-lg" dob={patient.dob} />
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Gender</p>
                  <p className="text-lg">{patient.gender}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Blood Type</p>
                  <p className="text-lg">{patient.bloodType}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Date of Birth</p>
                  <p className="text-lg">{patient.dateOfBirth}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{patient.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{patient.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{patient.address}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="font-medium text-sm text-muted-foreground">Insurance</p>
                <p className="text-sm">{patient.insurance.provider}</p>
                <p className="text-xs text-muted-foreground">Policy: {patient.insurance.policy}</p>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-sm text-muted-foreground">Emergency Contact</p>
                <p className="text-sm">{patient.emergencyContact.name}</p>
                <p className="text-xs text-muted-foreground">{patient.emergencyContact.phone}</p>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex flex-wrap gap-2">
            {patient.conditions.map((condition, index) => (
              <Badge key={index} variant="secondary">
                <Heart className="h-3 w-3 mr-1" />
                {condition}
              </Badge>
            ))}
            {patient.allergies.map((allergy, index) => (
              <Badge key={index} variant="outline">
                Allergic to {allergy}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medical Records Section */}
      <Collapsible open={medicalRecordsOpen} onOpenChange={setMedicalRecordsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <CardTitle>Medical Records</CardTitle>
                  <Badge variant="secondary">{patient.medicalRecords.length} records</Badge>
                </div>
                {medicalRecordsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Visit Type</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Treatment</TableHead>
                    <TableHead>Doctor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patient.medicalRecords.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.visitType}</TableCell>
                      <TableCell>{record.diagnosis}</TableCell>
                      <TableCell>{record.treatment}</TableCell>
                      <TableCell>{record.doctor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Appointments Section */}
      <Collapsible open={appointmentsOpen} onOpenChange={setAppointmentsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <CardTitle>Appointments</CardTitle>
                  <Badge variant="secondary">{patient.upcomingAppointments.length} upcoming</Badge>
                </div>
                {appointmentsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3 text-green-700">Upcoming Appointments</h4>
                  <div className="space-y-3">
                    {patient.upcomingAppointments.map((appointment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{appointment.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.date} at {appointment.time}
                            </p>
                            <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {appointment.status === "Confirmed" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {appointment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3 text-muted-foreground">Recent Appointments</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patient.recentAppointments.map((appointment, index) => (
                        <TableRow key={index}>
                          <TableCell>{appointment.date}</TableCell>
                          <TableCell>{appointment.type}</TableCell>
                          <TableCell>{appointment.doctor}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{appointment.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Tests Section */}
      <Collapsible open={testsOpen} onOpenChange={setTestsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TestTube className="h-5 w-5" />
                  <CardTitle>Tests & Lab Results</CardTitle>
                  <Badge variant="secondary">{patient.labResults.length} results</Badge>
                </div>
                {testsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3 text-blue-700">Recent Lab Results</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Reference Range</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patient.labResults.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell>{result.test}</TableCell>
                          <TableCell className="font-medium">{result.result}</TableCell>
                          <TableCell className="text-muted-foreground">{result.referenceRange}</TableCell>
                          <TableCell>{result.date}</TableCell>
                          <TableCell>
                            <Badge variant={result.status === "Normal" ? "secondary" : "destructive"}>
                              {result.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {patient.imagingTests.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-3 text-purple-700">Imaging & Other Tests</h4>
                      <div className="space-y-3">
                        {patient.imagingTests.map((test, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{test.type}</p>
                              <p className="text-sm text-muted-foreground">{test.date}</p>
                              <p className="text-sm">{test.result}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              View Report
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  )
}
