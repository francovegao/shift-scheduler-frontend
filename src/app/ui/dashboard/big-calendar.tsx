'use client';

import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useState } from 'react';
import Status from '../list/status';
import TakeShiftForm from '../forms/shifts/take-shift-form';
import { XMarkIcon } from '@heroicons/react/24/outline';

const localizer = momentLocalizer(moment)

export default function BigCalendar({
  data,
  action,
  token,
  pharmacistId,
}: {
  data: { title: string; allDay: boolean; start: Date; end: Date; shift: any}[];
  action?: "takeShift";
  token: string;
  pharmacistId?: string;
}){
    const [view, setView] = useState<View>(Views.WEEK);
    const [date, setDate] = useState(new Date());

    const [open, setOpen] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null);

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

    const handleSelectEvent = (event: {shift: any}) => {
      if(action==='takeShift'){
        setSelectedShift(event?.shift);
        setOpen(true);
      }
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
              onSelectEvent={handleSelectEvent}
            />

            {open && (
              <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                <div className='bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]'>
                  <TakeShiftForm pharmacistId={pharmacistId} token={token} data={selectedShift} setOpen={setOpen}/>
                  <div className='absolute top-4 right-4 cursor-pointer' onClick={()=>setOpen(false)}>
                    <XMarkIcon className='w-6' />
                  </div>
    
                </div>
              </div>
            )}

          </div>
        </div>
    )
}
