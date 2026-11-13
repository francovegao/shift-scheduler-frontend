"use client";

import MyShiftsRoute from "@/app/ui/dashboard/my-shifts-route";

export default function PastMyShiftsPage() {
  return (
    <MyShiftsRoute
      title="Past - My Shifts"
      timeFilter="past"
      bigCalendarType="past_shifts_pharmacist"
    />
  );
}
