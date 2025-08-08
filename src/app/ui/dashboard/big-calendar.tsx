'use client';

import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment'
import { scheduledShifts } from '@/app/lib/data'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { lusitana } from '../fonts';
import { useState } from 'react';

const localizer = momentLocalizer(moment)

export default function BigCalendar() {
    const [view, setView] = useState<View>(Views.WEEK);
    const [date, setDate] = useState(new Date());

    const handleOnChangeView = (selectedView: View) => {
        setView(selectedView)
    };

    return(
        <div className="h-full bg-white p-4 rounded-md">
            <Calendar
            localizer={localizer}
            events={scheduledShifts}
            startAccessor="start"
            endAccessor="end"
            views={["month", "week", "day"]}
            view={view}
            style={{ height: 700 }}
            onView={handleOnChangeView}
            onNavigate={(date) => {
                setDate(new Date(date));
             }}
            />
        </div>
    )
}
