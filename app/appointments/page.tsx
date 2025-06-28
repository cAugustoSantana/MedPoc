'use client';

import { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { Calendar, Clock, Plus, User, Phone, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';

// Mock appointment data
const mockAppointments = [
  {
    id: 1,
    patientName: 'Sarah Johnson',
    time: '09:00 AM',
    duration: '30 min',
    type: 'Consultation',
    phone: '(555) 123-4567',
    notes: 'Follow-up for blood pressure medication',
    status: 'confirmed',
    date: new Date(2024, 11, 15), // December 15, 2024
  },
  {
    id: 2,
    patientName: 'Michael Chen',
    time: '10:30 AM',
    duration: '45 min',
    type: 'Physical Exam',
    phone: '(555) 987-6543',
    notes: 'Annual physical examination',
    status: 'confirmed',
    date: new Date(2024, 11, 15),
  },
  {
    id: 3,
    patientName: 'Emily Rodriguez',
    time: '02:00 PM',
    duration: '30 min',
    type: 'Consultation',
    phone: '(555) 456-7890',
    notes: 'Diabetes management consultation',
    status: 'pending',
    date: new Date(2024, 11, 15),
  },
  {
    id: 4,
    patientName: 'David Wilson',
    time: '11:00 AM',
    duration: '30 min',
    type: 'Follow-up',
    phone: '(555) 234-5678',
    notes: 'Post-surgery follow-up',
    status: 'confirmed',
    date: new Date(2024, 11, 16),
  },
  {
    id: 5,
    patientName: 'Lisa Thompson',
    time: '03:30 PM',
    duration: '60 min',
    type: 'Consultation',
    phone: '(555) 345-6789',
    notes: 'Initial consultation for chronic pain',
    status: 'confirmed',
    date: new Date(2024, 11, 16),
  },
];

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  // Filter appointments for selected date
  const selectedDateAppointments = selectedDate
    ? mockAppointments.filter((appointment) =>
        isSameDay(appointment.date, selectedDate),
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
          onSelect={setSelectedDate}
          className="rounded-md border"
          classNames={{
            months: 'flex flex-col',
            month: '',
            nav: 'flex items-center justify-between mb-2',
            button_previous: 'h-8 w-8 p-0 opacity-50 hover:opacity-100',
            button_next: 'h-8 w-8 p-0 opacity-50 hover:opacity-100',
            month_caption: 'flex-1 text-center text-base font-semibold',
            caption_label: 'text-base font-semibold',
            weekdays: 'flex',
            weekday: 'text-muted-foreground flex-1 text-center text-[0.8rem]',
            week: 'flex w-full',
            day: 'h-8 w-8 p-0 font-normal aria-selected:opacity-100 rounded-full',
            day_selected: 'bg-primary text-primary-foreground',
            day_today: 'bg-accent text-accent-foreground',
            day_outside: 'text-muted-foreground opacity-50',
            day_disabled: 'text-muted-foreground opacity-50',
            day_range_middle:
              'aria-selected:bg-accent aria-selected:text-accent-foreground',
            day_hidden: 'invisible',
          }}
        />

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Quick Stats
          </h3>
          <div className="space-y-1 text-sm text-blue-700">
            <div>Total Appointments: {mockAppointments.length}</div>
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
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Appointment
            </Button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="flex-1 p-6 overflow-auto">
          {selectedDate ? (
            selectedDateAppointments.length > 0 ? (
              <div className="space-y-4">
                {selectedDateAppointments.map((appointment) => (
                  <Card
                    key={appointment.id}
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
                              {appointment.patientName}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {appointment.time} ({appointment.duration})
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {appointment.phone}
                              </span>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="capitalize">
                            {appointment.type}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={`capitalize ${getStatusColor(appointment.status)}`}
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p>{appointment.notes}</p>
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
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                  Schedule New Appointment
                </Button>
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
