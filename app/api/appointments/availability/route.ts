import { NextRequest, NextResponse } from "next/server";
import { getBookedTimesForDate } from "@/db/queries/appointments";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) {
    return NextResponse.json({ success: false, error: "Date is required" }, { status: 400 });
  }
  try {
    const times = await getBookedTimesForDate(date);
    console.log("Booked times for", date, ":", times);
    return NextResponse.json({ success: true, data: times });
  } catch (error) {
    console.error("Error in /api/appointments/availability:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch availability" }, { status: 500 });
  }
} 