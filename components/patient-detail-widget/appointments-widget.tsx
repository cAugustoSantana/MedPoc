'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { AppointmentWithDetails } from '@/types/appointment';
import type { Patient } from '@/types/patient';
import { toast } from 'sonner';
import { AddAppointmentDialog } from '@/components/add-appointment-dialog';

interface AppointmentWidgetProps {
  patientId: string;
  patient?: Patient;
}

export default function AppointmentWidget({
  patientId,
  patient,
}: AppointmentWidgetProps) {
  const [appointmentsOpen, setAppointmentsOpen] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const handleAppointmentAdded = () => {
    // Refresh the appointments list
    loadAppointments();
    toast.success('Appointment added successfully!', {
      description: 'The appointment has been scheduled.',
      duration: 3000,
    });
  };

  const loadAppointments = useCallback(async () => {
    if (!patientId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/patient/${patientId}/appointments`);
      const result = await response.json();

      if (result.success) {
        setAppointments(result.data);
      } else {
        toast.error('Failed to load appointments', {
          description: result.error || 'Please try again.',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Failed to load appointments', {
        description: 'Please check your connection and try again.',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // Load appointments count immediately when component mounts
  useEffect(() => {
    if (patientId) {
      loadAppointments();
    }
  }, [patientId, loadAppointments]);

  // Also load when section is opened (in case of refresh)
  useEffect(() => {
    if (appointmentsOpen && patientId && appointments.length === 0) {
      loadAppointments();
    }
  }, [appointmentsOpen, patientId, appointments.length, loadAppointments]);

  // Separate upcoming and recent appointments
  const now = new Date();
  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.scheduledAt && new Date(appointment.scheduledAt) > now
  );
  const recentAppointments = appointments.filter(
    (appointment) =>
      appointment.scheduledAt && new Date(appointment.scheduledAt) <= now
  );

  const getStatusBadge = (appointment: AppointmentWithDetails) => {
    const status = appointment.status?.toLowerCase();
    const confirmed = appointment.confirmed;

    if (status === 'completed') {
      return (
        <Badge variant="secondary">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    }

    if (confirmed) {
      return (
        <Badge variant="outline">
          <CheckCircle className="h-3 w-3 mr-1" />
          Confirmed
        </Badge>
      );
    }

    return (
      <Badge variant="outline">
        <AlertCircle className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) {
      return {
        date: 'N/A',
        time: 'N/A',
        full: 'N/A',
      };
    }
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      full: date.toLocaleString(),
    };
  };

  return (
    <Collapsible open={appointmentsOpen} onOpenChange={setAppointmentsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <CardTitle>Appointments</CardTitle>
                <Badge variant="secondary">
                  {loading && appointments.length === 0
                    ? 'Loading...'
                    : `${upcomingAppointments.length} upcoming`}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                {patient && (
                  <AddAppointmentDialog
                    selectedPatient={patient}
                    onAppointmentAdded={handleAppointmentAdded}
                  />
                )}
                {appointmentsOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">
                  Loading appointments...
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Upcoming Appointments */}
                {upcomingAppointments.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-green-700">
                      Upcoming Appointments
                    </h4>
                    <div className="space-y-3">
                      {upcomingAppointments.map((appointment) => {
                        const { date, time } = formatDateTime(
                          appointment.scheduledAt
                        );
                        return (
                          <div
                            key={appointment.appointmentId}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">
                                  {appointment.reason || 'Appointment'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {date} at {time}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.doctorName || 'Dr. Unknown'}
                                </p>
                                {appointment.location && (
                                  <p className="text-sm text-muted-foreground">
                                    {appointment.location}
                                  </p>
                                )}
                              </div>
                            </div>
                            {getStatusBadge(appointment)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {upcomingAppointments.length > 0 &&
                  recentAppointments.length > 0 && <Separator />}

                {/* Recent Appointments */}
                {recentAppointments.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-muted-foreground">
                      Recent Appointments
                    </h4>
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
                        {recentAppointments.map((appointment) => {
                          const { date } = formatDateTime(
                            appointment.scheduledAt
                          );
                          return (
                            <TableRow key={appointment.appointmentId}>
                              <TableCell>{date}</TableCell>
                              <TableCell>
                                {appointment.reason || 'Appointment'}
                              </TableCell>
                              <TableCell>
                                {appointment.doctorName || 'Dr. Unknown'}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(appointment)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* No appointments message */}
                {appointments.length === 0 && !loading && (
                  <div className="text-center py-8 text-muted-foreground">
                    No appointments found for this patient.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
