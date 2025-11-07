import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import ShiftsCalendar from "./shifts-calendar";
import ShiftsCalendarList from "./shifts-calendar-list";
import Link from "next/link";

export default async function ShiftsCalendarContainer({
  searchParams,
}:{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const {date} = await searchParams;

  return (
    <div className="w-full md:col-span-4 bg-white pb-4 px-4 rounded-md shadow-sm">
      <h1 className="text-xl font-semibold my-4">View Open Shifts</h1>
      <p>Select a date to view the corresponding open shifts</p>
        <ShiftsCalendar />
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold my-4">Shifts</h1>
            <Link href='/dashboard/openShifts' className="text-gray-500 text-xs hover:bg-gray-100 hover:text-blue-600" >View All</Link>
        </div>
        <div className="flex flex-col gap-4">
            <ShiftsCalendarList dateParam={date as string} />
        </div>
        <Link href='/dashboard/openShifts' className="text-gray-500 text-xs hover:bg-gray-100 hover:text-blue-600" >Click Here to view the complete list of open shifts</Link>
    </div>
  
  );
}