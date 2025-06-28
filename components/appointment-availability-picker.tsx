"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function AppointmentAvailabilityPicker({
  value,
  onChange,
}: {
  value: { date?: Date; time?: string };
  onChange: (val: { date?: Date; time?: string }) => void;
}) {
  const [date, setDate] = React.useState<Date | undefined>(value?.date);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(
    value?.time || null,
  );
  const [bookedTimes, setBookedTimes] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Generate time slots (09:00 to 18:00, every 15 min)
  const timeSlots = Array.from({ length: 37 }, (_, i) => {
    const totalMinutes = i * 15;
    const hour = Math.floor(totalMinutes / 60) + 9;
    const minute = totalMinutes % 60;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  });

  // Fetch booked times when date changes
  React.useEffect(() => {
    if (!date) {
      setBookedTimes([]);
      return;
    }
    setLoading(true);
    fetch(
      `/api/appointments/availability?date=${date.toISOString().slice(0, 10)}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBookedTimes(data.data);
        else setBookedTimes([]);
      })
      .catch(() => setBookedTimes([]))
      .finally(() => setLoading(false));
  }, [date]);

  // Handle date selection
  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedTime(null); // Reset time when date changes
    onChange({ date: newDate, time: undefined });
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    onChange({ date, time });
  };

  return (
    <Card className="gap-0 p-0">
      <CardContent className="relative p-0 md:pr-48">
        <div className="p-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            showOutsideDays={false}
            className="bg-transparent p-0"
          />
        </div>
        <div className="inset-y-0 right-0 flex max-h-72 w-full flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
          <div className="grid gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => handleTimeSelect(time)}
                className="w-full shadow-none"
                disabled={bookedTimes.includes(time) || loading || !date}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
        <div className="text-sm">
          {date && selectedTime ? (
            <>
              Your meeting is booked for{" "}
              <span className="font-medium">
                {date?.toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
              {" at "}
              <span className="font-medium">{selectedTime}</span>.
            </>
          ) : (
            <>Select a date and time for your meeting.</>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
