'use client';

import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useState } from 'react';
import Status from '../list/status';
import TakeShiftModal from '../list/take-shift-modal';

const localizer = momentLocalizer(moment)

export default function BigCalendar({
  data,
  action,
}: {
  data: { title: string; start: Date; end: Date }[];
  action?: "take";
}){
    const [view, setView] = useState<View>(Views.WEEK);
    const [date, setDate] = useState(new Date());

    const eventStyleGetter = (event: any) => {
        let className = "";

        switch(event.status){
          case 'open':
            className = "open-shift";
            break;
          case 'taken':
            className = "taken-shift";
            break;
          case 'completed':
            className = "completed-shift";
            break;
          case 'cancelled':
            className = "cancelled-shift";
            break;
          default:
            className = "open-shift";
            break;
        }

         return {
          className: className,
        };
      };

    return(
        <div className="h-full bg-white p-4 rounded-md">
          <span className='mx-1'><Status status="open"/></span>
          <span className='mx-1'><Status status="taken"/></span>
          <span className='mx-1'><Status status="completed"/></span>
          <span className='mx-1'><Status status="cancelled"/></span>

          <div className='mt-4'>

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
              eventPropGetter={eventStyleGetter}
              //onSelectEvent={handleSelectEvent}
            />
          </div>
        </div>
    )
}
