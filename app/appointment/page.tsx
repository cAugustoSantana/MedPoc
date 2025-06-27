import React from "react";

import Calendar from "@/components/comp-488";
// import PatientTable from "@/components/patient-table";
// import { getAllPatients } from "@/db/queries/patients";
import { Patient } from "@/types/patient";

export default async function HomePage() {
  //let patientsData: Patient[] = [];

 /* try {
    patientsData = await getAllPatients();
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    // Continue with empty data instead of crashing
  }*/

  return (
    <main className="bg-white p-6 min-h-screen">
      {/* Row container with full screen height */}
      <div className="flex flex-row gap-6 items-start min-h-screen">
        {/* Calendar Section: Full height + gray background */}
        <div className="w-fit bg-gray-100 p-6 rounded-xl shadow-sm h-full min-h-screen">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Appointments
            </h1>
            <Calendar />
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-1">

        </div>
      </div>
    </main>
  );
}
