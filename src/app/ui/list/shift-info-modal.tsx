'use client';

import { Dispatch, SetStateAction} from "react";
import { getFullAddress } from "@/app/lib/utils";
import Status from "./status";
import { formatInTimeZone } from "date-fns-tz";
import { CalendarIcon } from "@heroicons/react/24/outline";


export default function ShiftInfoModal({
  data, 
  setOpen,
}: {
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  }){

    const onSubmit = () => {
        setOpen(false);
    };

    if (!data) {
        return <p>Loading...</p>;
    }
        
  function generateGCalLink(event: any): string | undefined {
    const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";

    const start =  formatInTimeZone(event.startTime, event.company?.timezone, "yyyyMMdd'T'HHmmssXXX");
    const end = formatInTimeZone(event.endTime, event.company?.timezone, "yyyyMMdd'T'HHmmssXXX");
    const appLink = `https://shifthappens.vercel.app/`;
    const eventDetails = `Details: ${event.title || ""}: ${event.description || ""} \n\n<a href="${appLink}">Click here to view all details</a>`;
    
    const params = new URLSearchParams({
      text: `Shift at ${event.company?.name}`,
      dates: `${start}/${end}`,
      details: eventDetails,
      location: getFullAddress(event.company?.address, event.company?.city, event.company?.province, null) || "",
    });

    return `${baseUrl}&${params.toString()}`;
  }
  
  
    return(
      <form className='p-4 flex flex-col gap-4 text-primary' onSubmit={onSubmit} >   
        <h1 className="text-xl font-semibold">Shift Info</h1>
        <div className="flex justify-around flex-wrap gap-4 mb-4">
          <div>
            <h2 className="text-gray-400 font-medium mb-2">Pharmacy Information</h2>
            {data.location ? (
              <div className="">
                <h3 className="font-semibold">{data.location?.name}</h3>
                <p className="text-sm text-gray-500">{data.company?.name}</p>
                <p className="text-sm text-gray-500">{data.location?.email}</p>
                <p className="text-sm text-gray-500">{data.location?.phone}</p>
                <p className="text-sm text-gray-500">{getFullAddress(data.location?.address, data.location?.city, data.location?.province, null)}</p>
              </div>
              ):(
              <div className="">
                <h3 className="font-semibold">{data.company?.name}</h3>
                <p className="text-sm text-gray-500">{data.company?.email}</p>
                <p className="text-sm text-gray-500">{data.company?.phone}</p>
                <p className="text-sm text-gray-500">{getFullAddress(data.company?.address, data.company?.city, data.company?.province, null)}</p>
              </div>
              )}
          </div>
          <div>
            <h2 className="text-gray-400 font-medium mb-2">Shift Information</h2>
              <div className="">
                <h3 className="font-semibold">{formatInTimeZone(data.startTime, data.company?.timezone, 'EEE MMM dd, yyyy')}</h3>
                <p className="text-sm text-gray-500">{formatInTimeZone(data.startTime, data.company?.timezone, "HH:mm")}-{formatInTimeZone(data.endTime, data.company?.timezone, "HH:mm")} </p>
                <p className="text-sm text-gray-500">${parseFloat(data.payRate).toFixed(2)} per hr</p>
                <p className="text-sm text-gray-500">Status: <Status status={data.status} /></p>
                 {data.published === false && (
                    <span className="flex items-center justify-center rounded-2xl mt-1 py-1 px-3 text-xs bg-orange-500 text-white text-center text-wrap">
                      <h3 className="font-semibold">Draft Shift</h3>
                    </span>
                  )}
              </div>
          </div>
          <div>
            <h2 className="text-gray-400 font-medium mb-2">Shift Description</h2>
              <div className="">
                <h3 className="font-semibold">{data.title}</h3>
                <p className="text-sm text-gray-500">{data.description} </p>
              </div>
          </div>
          {data.status !== 'open' && (
            <div>
            <h2 className="text-gray-400 font-medium mb-2">Pharmacist Information</h2>
              <div className="">
                <h3 className="font-semibold">{data.pharmacist?.user?.firstName} {data.pharmacist?.user?.lastName}</h3>
                <p className="text-sm text-gray-500">{data.pharmacist?.user?.email}</p>
                <p className="text-sm text-gray-500">{data.pharmacist?.user?.phone}</p>
                <p className="text-sm text-gray-500">License: {data.pharmacist?.licenseNumber}</p>
                {data.pharmacist?.email && (<p className="text-sm text-gray-500">E-transfer: {data.pharmacist?.email}</p> )}
              </div>
          </div>
          )}
        </div>
          {data.status === 'taken' && (
            <div className="font-semibold text-complementary-one">To cancel this shift please contact:
              <p className="text-sm text-gray-500">{data.company?.contactName}</p>
              <p className="text-sm text-gray-500">{data.company?.contactPhone}</p>
              <p className="text-sm text-gray-500">{data.company?.contactEmail}</p>
            </div>
          )}
        <div className="flex justify-center items-center gap-4 w-full">
          {data.status === 'taken' && (
            <a 
              href={generateGCalLink(data)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-white rounded-md" style={{ backgroundColor: 'rgb(0, 135, 68)' }}
            >
              <CalendarIcon className="ml-1 w-4 text-white" />
              Google Calendar
            </a> 
          )}
          <button type="submit" className="bg-gray-500 text-white py-2 px-4 rounded-md border-none w-max self-center hover:bg-gray-600 cursor-pointer">
            Close
          </button>
        </div>
      </form>
    );
}