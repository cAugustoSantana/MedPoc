'use client';

import { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { Calendar, Clock, User, Phone, FileText } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { AddAppointmentDialog } from '@/components/add-appointment-dialog';
import { AppointmentWithDetails } from '@/types/appointment';
import { toast } from 'sonner';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>(
    [],
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(2024, 11, 15),
  ); // December 15, 2024
  const [loading, setLoading] = useState(false);

  // Load appointments for selected date
  const loadAppointmentsForDate = async (date: Date) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/appointments?date=${date.toISOString()}`,
      );
      const result = await response.json();

      if (result.success) {
        setAppointments(result.data);
      } else {
        toast.error('Failed to load appointments', {
          description: 'Please refresh the page and try again.',
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
  };

  // Load all appointments on component mount
  useEffect(() => {
    const loadAllAppointments = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/appointments');
        const result = await response.json();

        if (result.success) {
          setAppointments(result.data);
        } else {
          toast.error('Failed to load appointments', {
            description: 'Please refresh the page and try again.',
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
    };

    loadAllAppointments();
  }, []);

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      loadAppointmentsForDate(date);
    }
  };

  // Filter appointments for selected date
  const selectedDateAppointments = selectedDate
    ? appointments.filter(
        (appointment) =>
          appointment.scheduledAt &&
          isSameDay(new Date(appointment.scheduledAt), selectedDate),
      )
    : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const handleAppointmentAdded = async (newAppointment: any) => {
    // Refresh appointments for the selected date
    if (selectedDate) {
      await loadAppointmentsForDate(selectedDate);
    }

    // Also refresh all appointments
    try {
      const response = await fetch('/api/appointments');
      const result = await response.json();

      if (result.success) {
        setAppointments(result.data);
      }
    } catch (error) {
      console.error('Error refreshing appointments:', error);
    }
  };

  const formatAppointmentTime = (scheduledAt: string | null) => {
    if (!scheduledAt) return '';
    return format(new Date(scheduledAt), 'hh:mm a');
  };

  const formatAppointmentDuration = (duration: string) => {
    // Extract duration from the appointment type or use a default
    // This could be enhanced based on your business logic
    return '30 min'; // Default duration
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar with Date Picker */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Select Date
          </h2>
          <p className="text-sm text-gray-600">
            Choose a date to view appointments
          </p>
        </div>

        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="rounded-md border"
        />

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Quick Stats
          </h3>
          <div className="space-y-1 text-sm text-blue-700">
            <div>Total Appointments: {appointments.length}</div>
            <div>Today: {selectedDateAppointments.length}</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
              <p className="text-gray-600">
                {selectedDate
                  ? format(selectedDate, 'EEEE, MMMM d, yyyy')
                  : 'Select a date to view appointments'}
              </p>
            </div>
            <AddAppointmentDialog onAppointmentAdded={handleAppointmentAdded} />
          </div>
        </div>

        {/* Appointments List */}
        <div className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading appointments...</div>
            </div>
          ) : selectedDate ? (
            selectedDateAppointments.length > 0 ? (
              <div className="space-y-4">
                {selectedDateAppointments.map((appointment) => (
                  <Card
                    key={appointment.appointmentId}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {appointment.patientName || 'Unknown Patient'}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatAppointmentTime(
                                  appointment.scheduledAt,
                                )}{' '}
                                ({formatAppointmentDuration('30 min')})
                              </span>
                              {appointment.patientName && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-4 w-4" />
                                  {/* Phone would come from patient data */}
                                  (555) 123-4567
                                </span>
                              )}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="capitalize">
                            {appointment.reason || 'Consultation'}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={`capitalize ${getStatusColor(appointment.status || 'pending')}`}
                          >
                            {appointment.status || 'pending'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p>{appointment.reason || 'No notes available'}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Calendar className="h-12 w-12 mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">
                  No appointments scheduled
                </h3>
                <p className="text-center mb-4">
                  There are no appointments scheduled for{' '}
                  {format(selectedDate, 'MMMM d, yyyy')}.
                </p>
                <AddAppointmentDialog
                  onAppointmentAdded={handleAppointmentAdded}
                />
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Calendar className="h-12 w-12 mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Select a date</h3>
              <p className="text-center">
                Choose a date from the calendar to view appointments for that
                day.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
