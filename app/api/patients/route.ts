import { NextRequest, NextResponse } from "next/server";
import { getAllPatients } from "@/db/queries/patients";

export async function GET(request: NextRequest) {
  try {
    const patients = await getAllPatients();
    return NextResponse.json({ success: true, data: patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}