'use client';

import { Dispatch, SetStateAction} from "react";
import { getFullAddress } from "@/app/lib/utils";
import Status from "./status";
import { formatInTimeZone } from "date-fns-tz";


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
        <button type="submit" className="bg-gray-500 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Close
        </button>
      </form>
    );
}