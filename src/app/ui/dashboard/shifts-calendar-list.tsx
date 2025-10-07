"use client";

import { fetchShiftsByDate } from "@/app/lib/data";
import { SetStateAction, useEffect, useState } from "react";
import { useAuth } from "../context/auth-context";
import { XMarkIcon } from "@heroicons/react/24/outline";
import TakeShiftForm from "../forms/shifts/take-shift-form";

export default function ShiftsCalendarList({
    dateParam,
}:{
    dateParam: string | undefined,
}) {
    const { firebaseUser, appUser, loading } = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [token, setToken] = useState("");
    const [shifts, setShifts] = useState<any[]>([]);

    const [openEventId, setOpenEventId] = useState(null);


    //const date = dateParam ? new Date(dateParam) : new Date();
    const date = dateParam ? dateParam : "";

    // Get token
    useEffect(() => {
      if (firebaseUser) {
        firebaseUser.getIdToken().then((idToken: SetStateAction<string>) => {
          setToken(idToken);
        });
      }
    }, [firebaseUser]);

    // Fetch shifts when token is ready
      useEffect(() => {
        const getShifts = async () => {
          setIsFetching(true);
          try {
            const shiftsResponse = await fetchShiftsByDate(date, token);
            setShifts(shiftsResponse?.data ?? []);
            //setTotalPages(shiftsResponse?.meta?.totalPages ?? 1);
          } catch (err) {
            console.error("Failed to fetch shifts by date", err);
          } finally {
            setIsFetching(false);
          }
        };
        if (token){ getShifts() };
  }, [token, date ]);

    if (loading || isFetching) return <div>Loading...</div>;
    if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;

    const role = appUser.role;
    const pharmacistId = appUser.pharmacistProfile?.id;

    const handleSelectEvent = (eventId: SetStateAction<null>) => {
      setOpenEventId(eventId);
    };

  return (
    shifts.map((event) => {
        const startTime = new Date(event.startTime);
        const endTime = new Date(event.endTime);

        return(
        <div onClick={() => handleSelectEvent(event.id)} className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-blue-200 even:border-t-purple-200 hover:bg-gray-100"
            key={event.id}>
            <div className="flex items-center items-start">
              <div className="flex flex-col w-2/3">
                <h1 className="font-semibold text-gray-600 text-sm">{event?.location?.name}</h1>
                <h2 className="font-semibold text-gray-600 text-sm">{event.company.name}</h2>
                <p className="mt-2 text-gray-400 text-xs">{event.title}</p>
                <p className="mt-2 text-gray-400 text-xs">{event.description}</p>
              </div>
              <div className="flex flex-col w-1/3">
                <span className="text-gray-500 text-xs">
                    {startTime.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    })}
                    -
                    {endTime.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    })}
                </span>
                <span className="text-gray-500 text-xs">
                    ${event.payRate} /hr
                </span>
              </div> 
            </div>

            { (openEventId === event.id && role === 'relief_pharmacist') && (
              <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                <div className='bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]'>
                  <TakeShiftForm pharmacistId={pharmacistId} token={token} data={event} setOpen={() => setOpenEventId(null)}/>
                  <div className='absolute top-4 right-4 cursor-pointer' 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents the click from bubbling up
                        setOpenEventId(null);
                      }}>
                    <XMarkIcon className='w-6' />
                  </div>
    
                </div>
              </div>
            )}
        </div>
        );
    })
  );
}