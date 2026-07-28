import ShiftsListContainer from "@/app/ui/dashboard/shifts-list-container";

export default function UpcomingShiftsPage() {
  return (
    <ShiftsListContainer
      timeFilter="upcoming"
      bigCalendarType="upcoming_shifts_manager"
      title="Upcoming Shifts List"
    />
  );
}
