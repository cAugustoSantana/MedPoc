'use client';
import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
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
import { useTranslations } from '@/hooks/use-translations';
import { Badge } from '@/components/ui/badge';
export default function MedicalRecordsWidget() {
  const [medicalRecordsOpen, setMedicalRecordsOpen] = useState(false);
  const { t } = useTranslations();

  return (
    <Collapsible open={medicalRecordsOpen} onOpenChange={setMedicalRecordsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <CardTitle>{t('MedicalRecords.title')}</CardTitle>
                <Badge variant="secondary">12 records</Badge>
              </div>{' '}
              {medicalRecordsOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}{' '}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('MedicalRecords.date')}</TableHead>
                  <TableHead>{t('MedicalRecords.visitType')}</TableHead>
                  <TableHead>{t('Common.Diagnosis')}</TableHead>
                  <TableHead>{t('MedicalRecords.treatment')}</TableHead>
                  <TableHead>{t('MedicalRecords.doctor')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Dec 15, 2024</TableCell>
                  <TableCell>Follow-up</TableCell>
                  <TableCell>Hypertension monitoring</TableCell>
                  <TableCell>Medication adjustment</TableCell>
                  <TableCell>Dr. Smith</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Nov 20, 2024</TableCell>
                  <TableCell>Routine Check-up</TableCell>
                  <TableCell>Diabetes management</TableCell>
                  <TableCell>Diet counseling</TableCell>
                  <TableCell>Dr. Johnson</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Oct 10, 2024</TableCell>
                  <TableCell>Emergency</TableCell>
                  <TableCell>Chest pain</TableCell>
                  <TableCell>EKG, observation</TableCell>
                  <TableCell>Dr. Williams</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
