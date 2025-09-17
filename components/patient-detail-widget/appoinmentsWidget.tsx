'use client';

import { useState } from 'react';
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

export default function AppointmentWidget() {
  const [appointmentsOpen, setAppointmentsOpen] = useState(false);

  return (
    <Collapsible open={appointmentsOpen} onOpenChange={setAppointmentsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <CardTitle>Appointments</CardTitle>
                <Badge variant="secondary">3 upcoming</Badge>
              </div>
              {appointmentsOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-4">
              {/* Upcoming */}
              <div>
                <h4 className="font-semibold mb-3 text-green-700">
                  Upcoming Appointments
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Annual Physical</p>
                        <p className="text-sm text-muted-foreground">
                          Jan 15, 2025 at 10:00 AM
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Dr. Smith
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Confirmed
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Diabetes Follow-up</p>
                        <p className="text-sm text-muted-foreground">
                          Feb 20, 2025 at 2:30 PM
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Dr. Johnson
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Recent */}
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
                    <TableRow>
                      <TableCell>Dec 15, 2024</TableCell>
                      <TableCell>Follow-up</TableCell>
                      <TableCell>Dr. Smith</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Completed</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Nov 20, 2024</TableCell>
                      <TableCell>Check-up</TableCell>
                      <TableCell>Dr. Johnson</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Completed</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
