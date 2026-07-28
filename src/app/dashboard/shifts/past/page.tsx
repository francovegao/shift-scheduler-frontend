import ShiftsListContainer from "@/app/ui/dashboard/shifts-list-container";

export default function PastShiftsPage() {
  return (
    <ShiftsListContainer
      timeFilter="past"
      bigCalendarType="past_shifts_manager"
      title="Past Shifts List"
    />
  );
}
