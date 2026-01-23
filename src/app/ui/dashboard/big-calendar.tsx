'use client';

import { Calendar, momentLocalizer, SlotInfo, View, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useEffect, useState } from 'react';
import Status from '../list/status';
import TakeShiftForm from '../forms/shifts/take-shift-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ShiftInfoModal from '../list/shift-info-modal';
import { toZonedTime  } from 'date-fns-tz';
import { Event } from 'react-big-calendar';

const localizer = momentLocalizer(moment)

interface CalendarEvent extends Event {
  title: string;
  allDay: boolean;
  start: Date;
  end: Date;
  shift: any;
}

export default function BigCalendar({
  data,
  action,
  token,
  pharmacistId,
}: {
  data: { title: string; allDay: boolean; start: Date; end: Date; shift: any;}[];
  action?: "takeShift";
  token: string;
  pharmacistId?: string;
}){
    const [view, setView] = useState<View>(Views.WEEK);
    const [date, setDate] = useState(new Date());

    const [open, setOpen] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    
    //Change events UTC time to desired Timezone (to avoid displaying events in user's local timezone)
    useEffect(() => {
      if(data){
        const reformatted = data.map((event) => {
          const startUtcDate = new Date(event.start);
          const endUtcDate = new Date(event.end);
          return {
            ...event,
            start: toZonedTime(startUtcDate, event.shift.company.timezone),
            end: toZonedTime(endUtcDate, event.shift.company.timezone)
          };
        });
        setEvents(reformatted);
      }
      }, [data]);



    const eventStyleGetter = (event: any) => {
        let className = "";

        switch(event.shift.status){
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
      console.log("here: "+action)
      if(action==='takeShift'){
        setSelectedShift(event?.shift);
        setOpen(true);
      }else{
        setSelectedShift(event?.shift);
        setOpen(true);
      }
    };

  function handleSelectSlot(slotInfo: SlotInfo): void {
     console.log('Selected slot:', slotInfo);
  }

    return(
        <div className="h-full bg-white p-4 rounded-md">
          <span className='mx-1'><Status status="open"/></span>
          <span className='mx-1'><Status status="taken"/></span>
          <span className='mx-1'><Status status="completed"/></span>
          <span className='mx-1'><Status status="cancelled"/></span>

          <div className='mt-4'>

            <Calendar
              localizer={localizer}
              events={events}
              components={{
                month: {},
                week: {event: CustomWeekEventComponent},
                day: {event: CustomDayEventComponent},
              }}
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
              popup
            />

            { (open && selectedShift && action==='takeShift') && (
              <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                <div className='bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]'>
                  <TakeShiftForm pharmacistId={pharmacistId} token={token} data={selectedShift} setOpen={setOpen}/>
                  <div className='absolute top-4 right-4 cursor-pointer' onClick={()=>setOpen(false)}>
                    <XMarkIcon className='w-6' />
                  </div>
    
                </div>
              </div>
            )}

            { (open && selectedShift && action!=="takeShift") && (
              <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                <div className='bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]'>
                  <ShiftInfoModal data={selectedShift} setOpen={setOpen}/>
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

const CustomDayEventComponent = ({ event }: any | undefined) => {
  // Access custom data from the 'event' object
  const { title, shift} = event;

  return (
    <div>
      <p className='mb-2 font-semibold'>{title}</p>
      <p className='mb-2'>${parseFloat(shift?.payRate).toFixed(2)} /hr</p>
      {shift.status === 'open' && (
        <>
         <p>Info:</p>
         <p>{shift.title}</p>
         <p>{shift.description}</p>
        </>
         )}
      {shift.status !== 'open' && (
        <>
         <p>Pharmacy:</p>
         <p>{shift.location?.name}</p>
         <p>{shift.company.name}</p>
        </>
         )}
    </div>
  );
};

const CustomWeekEventComponent = ({ event }: any | undefined) => {
  // Access custom data from the 'event' object
  const { title, shift} = event;

  return (
    <div>
      <p className='mb-2 font-semibold'>{title}</p>
      {shift.status !== 'open' && (
        <div className='mb-2 font-medium'>
         <p>{shift.location?.name}</p>
         <p>{shift.company.name}</p>
        </div>
         )}
      <p className='mb-2'>${parseFloat(shift?.payRate).toFixed(2)} /hr</p>
    </div>
  );
};
