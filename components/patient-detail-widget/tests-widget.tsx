'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ChevronDown, ChevronRight, TestTube } from 'lucide-react';
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
import { useTranslations } from '@/hooks/use-translations';

export default function TestsWidget() {
  const [testsOpen, setTestsOpen] = useState(false);
  const { t } = useTranslations();

  return (
    <Collapsible open={testsOpen} onOpenChange={setTestsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TestTube className="h-5 w-5" />
                <CardTitle>{t('tests.widgetTitle')}</CardTitle>
                <Badge variant="secondary">8 results</Badge>
              </div>
              {testsOpen ? (
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
              <div>
                <h4 className="font-semibold mb-3 text-blue-700">
                  {t('tests.recentLabResults')}
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead> {t('common.test')}</TableHead>
                      <TableHead>{t('common.result')}</TableHead>
                      <TableHead>{t('tests.referenceRange')}</TableHead>
                      <TableHead>{t('common.date')}</TableHead>
                      <TableHead>{t('common.status')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>HbA1c</TableCell>
                      <TableCell className="font-medium">7.2%</TableCell>
                      <TableCell className="text-muted-foreground">
                        {'<7.0%'}
                      </TableCell>
                      <TableCell>Dec 15, 2024</TableCell>
                      <TableCell>
                        <Badge variant="destructive">High</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Blood Pressure</TableCell>
                      <TableCell className="font-medium">140/90 mmHg</TableCell>
                      <TableCell className="text-muted-foreground">
                        {'<120/80'}
                      </TableCell>
                      <TableCell>Dec 15, 2024</TableCell>
                      <TableCell>
                        <Badge variant="destructive">High</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Cholesterol</TableCell>
                      <TableCell className="font-medium">185 mg/dL</TableCell>
                      <TableCell className="text-muted-foreground">
                        {'<200 mg/dL'}
                      </TableCell>
                      <TableCell>Nov 20, 2024</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Normal</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fasting Glucose</TableCell>
                      <TableCell className="font-medium">145 mg/dL</TableCell>
                      <TableCell className="text-muted-foreground">
                        70-100 mg/dL
                      </TableCell>
                      <TableCell>Nov 20, 2024</TableCell>
                      <TableCell>
                        <Badge variant="destructive">High</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3 text-purple-700">
                  {t('tests.recentLabResults')}
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Chest X-Ray</p>
                      <p className="text-sm text-muted-foreground">
                        Oct 10, 2024
                      </p>
                      <p className="text-sm">
                        Normal cardiac silhouette, clear lung fields
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      {t('tests.report')}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">EKG</p>
                      <p className="text-sm text-muted-foreground">
                        Oct 10, 2024
                      </p>
                      <p className="text-sm">
                        Normal sinus rhythm, no acute changes
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      {t('tests.report')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
