'use client';

import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useState } from 'react';

const localizer = momentLocalizer(moment)

export default function BigCalendar({
  data,
}: {
  data: { title: string; start: Date; end: Date }[];
}){
    const [view, setView] = useState<View>(Views.WEEK);
    const [date, setDate] = useState(new Date());


    return(
        <div className="h-full bg-white p-4 rounded-md">
            <Calendar
            localizer={localizer}
            events={data}
            startAccessor="start"
            endAccessor="end"
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            view={view}
            date={date}
            style={{ height: 700 }}
            onView={(view) => setView(view)}
            onNavigate={(date) => {
                setDate(new Date(date));
             }}
            />
        </div>
    )
}
