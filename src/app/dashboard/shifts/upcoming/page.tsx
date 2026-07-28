import ShiftsListContainer from "@/app/ui/dashboard/shifts-list-container";

export default function PastShiftsPage() {
  return (
    <ShiftsListContainer timeFilter="upcoming" title="Upcoming Shifts List" />
  );
}
