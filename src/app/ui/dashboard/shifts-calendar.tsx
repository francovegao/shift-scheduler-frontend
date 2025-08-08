'use client';

import { useState } from "react"
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css';
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

//TEMPORARY
const events = [
  {
    id: 1,
    title: "Lorem upsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem imsum dolor sit amet, consectur adipsin elit.",
  },
  {
    id: 2,
    title: "Lorem upsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem imsum dolor sit amet, consectur adipsin elit.",
  },
  {
    id: 3,
    title: "Lorem upsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem imsum dolor sit amet, consectur adipsin elit.",
  },
];

export default function ShiftsCalendar() {
    const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="w-full md:col-span-4 ">
        <Calendar onChange={onChange} value={value} />
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold my-4">Events</h1>
            <EllipsisHorizontalIcon className="w-12"/>
        </div>
        <div className="flex flex-col gap-4 bg-white p-4 rounded-md">
            {events.map((event) => (
            <div className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-blue-200 even:border-t-purple-200"
             key={event.id}>
                <div className="flex items-center justify-between">
                    <h1 className="font-semibold text-gray-600">{event.title}</h1>
                    <span className="text-gray-300 text-xs">{event.time}</span>
                </div>
                <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
            </div>
            ))}
        </div>
    </div>
  
  );
}