'use client';

import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {  SetStateAction, useEffect, useState} from "react";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const parseDateString = (dateString: string | number | Date | null) => {
  return dateString ? new Date(dateString) : null;
};

 
 export default function FilterDate() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [startDate, setStartDate] = useState(() =>
        parseDateString(searchParams.get('from'))
    );
    const [endDate, setEndDate] = useState(() =>
        parseDateString(searchParams.get('to'))
    );

    const handleDateChange = (date: SetStateAction<Date | null>, type: string) => {
        const params = new URLSearchParams(searchParams);

        if (type === 'start') {
        setStartDate(date);
        if (date) {
            params.set('from', date.toString());
        } else {
            params.delete('from');
        }
        } else if (type === 'end') {
        setEndDate(date);
        if (date) {
            params.set('to', date.toString());
        } else {
            params.delete('to');
        }
        }
        
        params.set('page', '1');

        // Replace URL without triggering a full page reload
        replace(`${pathname}?${params.toString()}`);
  };
 
 return (
    <div className="relative flex flex-1 flex-shrink-0 items-center gap-2">             
        <div className="relative">
            <DatePicker
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-8 text-sm outline-1 text-gray-500"
            selected={startDate}
            onChange={(date) => handleDateChange(date, 'start')}
            selectsStart
            startDate={startDate}
            placeholderText="From"
            />
            <CalendarDaysIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>

        <div className="relative">
            <DatePicker
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-8 text-sm outline-1 text-gray-500"
            selected={endDate}
            onChange={(date) => handleDateChange(date, 'end')}
            selectsStart
            endDate={endDate}
            minDate={startDate??undefined}
            placeholderText="To"
            />
            <CalendarDaysIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
    </div>
  );
}