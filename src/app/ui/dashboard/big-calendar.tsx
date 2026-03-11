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
import ColorCodes from './color-codes';
import StatusIcon from './status-icon';
import FormContainer from '../list/form-container';
import { format } from 'date-fns';
import { useAuth } from '../context/auth-context';
import { ShiftSchema } from '@/app/lib/formValidationSchemas';
import SendEmailModal from '../list/email-modal';
import { formatPayRate } from '@/app/lib/utils';

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
  action?: "takeShift" | "createShift";
  token: string;
  pharmacistId?: string;
}){
  const { firebaseUser, appUser, loading } = useAuth();
    const [view, setView] = useState<View>(Views.WEEK);
    const [date, setDate] = useState(new Date());

    const [open, setOpen] = useState(false);
    const [selectedShift, setSelectedShift] = useState<ShiftSchema | null>(null);
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    const [selectedSlotStart, setSelecteSlotStart] = useState<Date | null>(null);


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

        if(event.shift.status === 'completed' || event.shift.status === 'cancelled'){
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
        }

        switch(event.shift.company.name){
          case 'Create Compounding':
            className = "create-green";
            break;
          case 'Curis Seton':
            className = "seton-yellow";
            break;
          case 'Curis Mahogany':
            className = "mahogany-blue";
            break;
          case 'Curis Kingsland':
            className = "kingsland-pink";
            break;
          case 'Curis Harmony':
            className = "harmony-lightblue";
            break;
          case 'Curis Trinity Hills':
            className = "trinityhills-purple";
            break;
          case 'Pharm Drugstore':
            className = "pharm-gold";
            break;
          default:
            if (/Grassroots/.test(event.shift.company.name)) {
              className = "grassroots-olivegreen";
            } else if (event.shift.status === 'taken') {
              className = "taken-shift";
            } else {
              className = "open-shift";
            }
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
        setSelecteSlotStart(null)
      }else{
        setSelectedShift(event?.shift);
        setOpen(true);
        setSelecteSlotStart(null)
      }
    };

  function handleSelectSlot(slotInfo: SlotInfo): void {
    if(action==="createShift"){
      setOpen(true)
      setSelectedShift(null)
      setSelecteSlotStart(slotInfo.start)
    }
  }

  if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;

  const role = appUser.role;

    return(
        <div className="h-full bg-white p-4 rounded-md">
          <div className="h-full bg-white p-4 rounded-md grid grid-cols-4 gap-y-4 gap-x-2 items-center md:w-[80%] lg:w-[60%] 2xl:w-[50%]">
            <ColorCodes label="Create" color="green"/>
            <ColorCodes label="Seton" color="yellow"/>
            <ColorCodes label="Mahogany" color="blue"/>
            {/* <ColorCodes label="Grassroots" color="olivegreen"/> */}

            <ColorCodes label="Kingsland" color="pink"/>
            <ColorCodes label="Harmony" color="lightblue"/>
            <ColorCodes label="Trinity Hills" color="purple"/>
            <ColorCodes label="Pharm" color="gold"/>
          </div>
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
              selectable
              onSelectSlot={handleSelectSlot}
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
                  <ShiftInfoModal data={selectedShift} setOpen={()=>setOpen(false)} token={token} />

                  <div className='absolute top-4 right-4 cursor-pointer' onClick={()=>setOpen(false)}>
                    <XMarkIcon className='w-6' />
                  </div>
                  <div className='absolute top-7 left-34 cursor-pointer flex items-center gap-2'>
                    { (role === "admin") && ( selectedShift.status === 'open') && (
                      <SendEmailModal type="open_shift" token={token} data={selectedShift} />
                    )}
                    { (role === "admin" ||
                        role === "pharmacy_manager" ||
                        role === "location_manager") &&
                        (selectedShift.status === "open" ||
                          selectedShift.status === "taken") && (
                            <>
                              <FormContainer table="shift" type="update" token={token} data={selectedShift} />
                              <FormContainer table="shift" type="delete" token={token} id={selectedShift.id} data={selectedShift}/>
                            </>
                    )}
                  </div>
                </div>
              </div>
            )}

            { (open  && selectedSlotStart && action==="createShift") && (
               <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                <div className='bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]'>
                  <div className='p-4 flex flex-col gap-4' >
                    <h1 className="text-xl font-semibold">Calendar slot selected</h1>
                    <div className='p-4 flex flex-col gap-4 items-center text-center'>
                      <p className="font-medium"><span className='font-semibold'>Date:</span> {format(selectedSlotStart, "EEEE, MMMM do")}</p>
                      <p className="font-medium"><span className='font-semibold'>Time:</span> {format(selectedSlotStart, "h:mmaaa").toLowerCase()}</p>
                      <p className="text-sm text-gray-500">Click the button below to add a shift in this slot</p>
                    </div>
                    <div className="mx-auto">
                      <FormContainer table="shift" type="create" token={token} initialDate={selectedSlotStart} />
                    </div>
                  </div>
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
      <div className='mb-2'><Status status={shift.status} /></div>
      <p className='mb-2'>{formatPayRate(shift.payRate)}{formatPayRate(shift.payRate) !== "No Data" ? " /hr" : "" }</p>
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
      <p className='mb-2'>{formatPayRate(shift.payRate)}{formatPayRate(shift.payRate) !== "No Data" ? " /hr" : "" }</p>
      <div className='mb-2 ml-1'><StatusIcon status={shift.status} /></div>
    </div>
  );
};
