import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card";

import {Calendar} from '@/components/ui/calendar-rac'
import Image from "next/image";
import { getAllPatients } from '@/db/queries/patients';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { patient } from "@/db/migrations/schema";



const patientsData = await getAllPatients();

export default function Home() {
  return ( 
    <div>
        <div>
          <Card>
            <CardContent>
            <Calendar></Calendar>
            </CardContent>
          </Card>
        </div>
    <div>
      <Card>
        <Table> 
          <TableHeader> 
            <TableRow>
              <TableHead>  Name </TableHead>
              <TableHead>  Gender </TableHead>
              <TableHead >  Email </TableHead>
              <TableHead>  Date of birth </TableHead>
      </TableRow>
      </TableHeader>
      <TableBody>
        {patientsData.map((patient) => (
          <TableRow key = {patient.name}>
            <TableCell>{patient.name}</TableCell>
            <TableCell>{patient.flag}</TableCell>
            <TableCell>{patient.email}</TableCell>
            <TableCell>{patient.location}</TableCell>
          </TableRow>

        ))}   
      </TableBody>
      </Table>
    </Card>
    </div>
    </div>
   

  );
}
