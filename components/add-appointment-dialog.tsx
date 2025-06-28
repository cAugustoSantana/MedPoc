'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusIcon } from 'lucide-react';
import { format, parse } from 'date-fns';

import { Button } from '@/components/ui/button';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { formatPhoneNumber } from '@/lib/utils';
import { createAppointmentAction } from '@/app/appointments/actions';
import { toast } from 'sonner';
import { Patient } from '@/types/patient';
import { AppointmentFormData, Appointment } from '@/types/appointment';
import { AppointmentAvailabilityPicker } from './appointment-availability-picker';

// Appointment form schema
const appointmentFormSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  duration: z.string().min(1, 'Duration is required'),
  type: z.string().min(1, 'Appointment type is required'),
  phone: z.string(),
  notes: z.string(),
  status: z.string().min(1, 'Status is required'),
});

interface AddAppointmentDialogProps {
  onAppointmentAdded?: (appointment: Appointment) => void;
  defaultDate?: Date;
}

export function AddAppointmentDialog({
  onAppointmentAdded,
  defaultDate,
}: AddAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [phoneAutoFilled, setPhoneAutoFilled] = useState(false);
  const patientsLoadedRef = useRef(false);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: '',
      date: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : '',
      time: '',
      duration: '30 min',
      type: '',
      phone: '',
      notes: '',
      status: 'confirmed',
    },
  });

  // Fetch patients when dialog opens
  useEffect(() => {
    if (open && !patientsLoadedRef.current) {
      fetchPatients();
    }
  }, [open]);

  const fetchPatients = async () => {
    setPatientsLoading(true);
    try {
      const response = await fetch('/api/patients');
      const result = await response.json();

      if (result.success) {
        setPatients(result.data);
        patientsLoadedRef.current = true;
      } else {
        setPatients([]);
        toast.error('Failed to load patients', {
          description: 'Please refresh and try again.',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
      toast.error('Failed to load patients', {
        description: 'Please check your connection and try again.',
        duration: 5000,
      });
    } finally {
      setPatientsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form with default date when closing
      form.reset({
        patientId: '',
        date: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : '',
        time: '',
        duration: '30 min',
        type: '',
        phone: '',
        notes: '',
        status: 'confirmed',
      });
      setPhoneAutoFilled(false);
    } else {
      // Reset form with current default date when opening
      form.reset({
        patientId: '',
        date: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : '',
        time: '',
        duration: '30 min',
        type: '',
        phone: '',
        notes: '',
        status: 'confirmed',
      });
    }
  };

  const onSubmit = async (data: AppointmentFormData) => {
    setLoading(true);
    try {
      // Call the server action to create the appointment
      const result = await createAppointmentAction(data);

      if (result.success) {
        console.log('Created appointment:', result.data);

        // Get the selected patient name for the notification
        const selectedPatient = patients.find(
          (p) => p.patientId.toString() === data.patientId,
        );
        const patientName = selectedPatient?.name || 'Unknown Patient';

        // Show success message with patient name
        toast.success(`Appointment created successfully for ${patientName}!`, {
          description: `Scheduled for ${data.date} at ${data.time}`,
          duration: 5000,
        });

        // Call the callback if provided
        if (onAppointmentAdded && result.data) {
          onAppointmentAdded(result.data);
        }

        // Reset form and close dialog
        form.reset();
        setOpen(false);
      } else {
        toast.error('Failed to create appointment', {
          description: result.error || 'Please check your input and try again.',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error adding appointment:', error);
      toast.error('Failed to create appointment', {
        description: 'An unexpected error occurred. Please try again.',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Convert patients to combobox options
  const patientOptions = patients.map((patient) => ({
    value: patient.patientId.toString(),
    label: patient.name,
  }));

  // Handle patient selection to auto-populate phone
  const handlePatientChange = (patientId: string) => {
    const selectedPatient = patients.find(
      (p) => p.patientId.toString() === patientId,
    );
    if (selectedPatient && selectedPatient.phone) {
      const formattedPhone = formatPhoneNumber(selectedPatient.phone);
      form.setValue('phone', formattedPhone);
      setPhoneAutoFilled(true);
    } else {
      // Clear phone if patient doesn't have one or if no patient selected
      form.setValue('phone', '');
      setPhoneAutoFilled(false);
    }
    form.setValue('patientId', patientId);
  };

  // Memoize the onChange function to prevent infinite loops
  const handleAvailabilityChange = useCallback(
    ({ date, time }: { date?: Date; time?: string }) => {
      form.setValue('date', date ? format(date, 'yyyy-MM-dd') : '');
      form.setValue('time', time || '');
    },
    [form],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Add Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Appointment</DialogTitle>
          <DialogDescription>
            Fill in the appointment details below. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient *</FormLabel>
                    <FormControl>
                      <Combobox
                        options={patientOptions}
                        value={field.value}
                        onValueChange={handlePatientChange}
                        placeholder="Select patient..."
                        searchPlaceholder="Search patients..."
                        emptyText="No patients found."
                        disabled={patientsLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="tel"
                          placeholder="(555) 123-4567"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            if (phoneAutoFilled) {
                              setPhoneAutoFilled(false);
                            }
                          }}
                          onBlur={(e) => {
                            // Format phone number when user finishes typing
                            const formatted = formatPhoneNumber(e.target.value);
                            if (formatted !== e.target.value) {
                              field.onChange(formatted);
                            }
                          }}
                        />
                        {phoneAutoFilled && field.value && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-muted px-1 py-0.5 rounded">
                            Auto-filled
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <AppointmentAvailabilityPicker
                  key={defaultDate?.toISOString()} // Force re-render when defaultDate changes
                  value={{
                    date: form.watch('date')
                      ? parse(form.watch('date'), 'yyyy-MM-dd', new Date())
                      : defaultDate,
                    time: form.watch('time'),
                  }}
                  onChange={handleAvailabilityChange}
                />
              </div>
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="15 min">15 min</SelectItem>
                        <SelectItem value="30 min">30 min</SelectItem>
                        <SelectItem value="45 min">45 min</SelectItem>
                        <SelectItem value="60 min">60 min</SelectItem>
                        <SelectItem value="90 min">90 min</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Type *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Consultation">
                          Consultation
                        </SelectItem>
                        <SelectItem value="Physical Exam">
                          Physical Exam
                        </SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Check-up">Check-up</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter appointment notes..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Appointment'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
