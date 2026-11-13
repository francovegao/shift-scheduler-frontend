"use client";

import MyShiftsRoute from "@/app/ui/dashboard/my-shifts-route";

export default function UpcomingMyShiftsPage() {
  return (
    <MyShiftsRoute
      title="Upcoming - My Shifts"
      timeFilter="upcoming"
      bigCalendarType="upcoming_shifts_pharmacist"
    />
  );
}
