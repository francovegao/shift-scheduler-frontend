import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import ShiftsCalendar from "./shifts-calendar";
import ShiftsCalendarList from "./shifts-calendar-list";

export default async function ShiftsCalendarContainer({
  searchParams,
}:{
  searchParams: { [keys: string]: string | undefined};
}) {
  const {date} = await searchParams;

  return (
    <div className="w-full md:col-span-4 bg-white p-4 rounded-md shadow-sm">
        <ShiftsCalendar />
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold my-4">Shifts</h1>
            <EllipsisHorizontalIcon className="w-8"/>
        </div>
        <div className="flex flex-col gap-4">
            <ShiftsCalendarList dateParam={date} />
        </div>
    </div>
  
  );
}