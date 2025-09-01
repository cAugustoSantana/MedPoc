import { Phone, Mail, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Patient } from '@/types/patient';

interface PatientDetailProps {
  patient: Patient;
}

export default function PatientDetail({ patient }: PatientDetailProps) {
  // Calculate age from date of birth
  const calculateAge = (dob: string | null) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Patient Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Patient Details
            </CardTitle>
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
                  <p className="text-muted-foreground">
                    Patient ID:{' '}
                    {patient.uuid?.slice(0, 8).toUpperCase() || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Age</p>
                  <p className="text-lg">{calculateAge(patient.dob)} years</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Gender</p>
                  <p className="text-lg">{patient.gender || 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">
                    Date of Birth
                  </p>
                  <p className="text-lg">
                    {patient.dob
                      ? new Date(patient.dob).toLocaleDateString()
                      : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {patient.phone || 'Not provided'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {patient.email || 'Not provided'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {patient.address || 'Not provided'}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="font-medium text-sm text-muted-foreground">
                  Record Info
                </p>
                <p className="text-xs text-muted-foreground">
                  Created:{' '}
                  {patient.createdAt
                    ? new Date(patient.createdAt).toLocaleDateString()
                    : 'Unknown'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Updated:{' '}
                  {patient.updatedAt
                    ? new Date(patient.updatedAt).toLocaleDateString()
                    : 'Never'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
