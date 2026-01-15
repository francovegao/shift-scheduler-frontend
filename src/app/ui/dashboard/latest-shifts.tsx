"use client";

import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/auth-context';
import { SetStateAction, useEffect, useState } from 'react';
import { fetchLatestShifts } from '@/app/lib/data';
import ApprovedStatus from '../list/status';
import ShiftInfoModal from '../list/shift-info-modal';
import Link from 'next/link';
import { useSelectedCompany } from '@/app/lib/useSelectedCompany';

const DateFormat = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
 } as const;

const TimeFormat = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,  
 } as const;

  export default function LatestShifts(){ 
    const { firebaseUser, appUser, loading } = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [token, setToken] = useState("");
    const [latestShifts, setLatestShifts] = useState<any[]>([]);

    const [openEventId, setOpenEventId] = useState(null);
    const currentCompanyId = useSelectedCompany((state) => state.currentCompanyId);

    // Get token
      useEffect(() => {
        if (firebaseUser) {
          firebaseUser.getIdToken().then((idToken: SetStateAction<string>) => {
            setToken(idToken);
          });
        }
      }, [firebaseUser]);
    
      // Fetch latest shifts when token is ready
      useEffect(() => {
        const getLatestShifts = async () => {
          setIsFetching(true);
          try {
              const queryParams: Record<string, string> = {};

              //Set current selected companyId
              if(appUser?.role ==="pharmacy_manager"){
                if(currentCompanyId !== appUser?.companyId ){
                  queryParams["companyId"] = currentCompanyId || "";
                }
              }

              if (queryParams["companyId"] === "") {
                  delete queryParams["companyId"];
              }

            const latestShiftsResponse = await fetchLatestShifts(token, queryParams);
            setLatestShifts(latestShiftsResponse?.data ?? []);
          } catch (err) {
            console.error("Failed to fetch latest shifts", err);
          } finally {
            setIsFetching(false);
          }
        };
        if (token){ getLatestShifts() };
    }, [token, currentCompanyId]);

    if (loading || isFetching) return <div>Loading...</div>;
    if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;

    const role = appUser.role;

    const handleSelectEvent = (eventId: SetStateAction<null>) => {
      setOpenEventId(eventId);
    };

  return (
    <div className="flex w-full flex-col md:col-span-4 rounded-md">
        <div className="flex items-center justify-between mt-2 mb-4">
          <h1 className="text-xl font-semibold">Latest Posted Shifts</h1>
          <Link href='/dashboard/shifts' className="text-gray-500 text-xs hover:bg-gray-100 hover:text-blue-600" >View All</Link>
        </div>
      <div className="flex grow flex-col justify-between rounded-md shadow-sm bg-white">
        <div className="bg-white divide-y-4 rounded-md p-4">
          {latestShifts.length === 0 && (
            <p className="text-gray-500 text-center py-6">
              No recent shifts available.
            </p>
          )}

          {latestShifts.slice(0, 5).map((item) => (
            <div
              onClick={() => handleSelectEvent(item.id)}
              key={item.id}
              className="flex flex-row items-center rounded-md justify-between p-4  transition text-white odd:bg-primary even:bg-secondary odd:hover:bg-primary-100 even:hover:bg-secondary-100"
            >
              <div className="flex flex-col">
                {item.location ? (
                  <span>
                    <p className="truncate text-sm font-semibold">
                      {item?.location?.name}
                    </p>
                    <p className="text-sm">{item?.company?.name}</p>
                  </span>
                ) : (
                  <span>
                    <p className="truncate text-sm font-semibold">
                      {item.company.name}
                    </p>
                    <p className="text-sm">{item?.location?.name}</p>
                  </span>
                )}
                <div className="mt-1">
                  <ApprovedStatus status={item.status} />
                  {item.published === false && (
                    <span className="flex items-center justify-center rounded-2xl mt-1 py-1 px-3 text-xs bg-orange-500 text-white text-center text-wrap">
                      <h3 className="font-semibold">Draft Shift</h3>
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p
                  className={` text-sm font-medium`}
                >
                  {new Date(item.startTime).toLocaleDateString(
                    "en-US", 
                    DateFormat
                  )}
                </p>
                <p className="text-sm">
                  {new Date(item.startTime).toLocaleTimeString(
                    "en-US",
                    TimeFormat
                  )}
                  –
                  {new Date(item.endTime).toLocaleTimeString("en-US", TimeFormat)}
                </p>
              </div>
              { (openEventId === item.id && role !== 'relief_pharmacist') && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                  <div className='bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]'>
                    <ShiftInfoModal data={item} setOpen={() => setOpenEventId(null)}/>
                    <div className='absolute top-4 right-4 cursor-pointer' 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents the click from bubbling up
                          setOpenEventId(null);
                        }}>
                      <XMarkIcon className='w-6 text-black' />
                    </div>

                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

        <div className="flex items-center pb-3 pt-2 px-4 text-gray-500">
          <ArrowPathIcon className="h-5 w-5" />
          <h3 className="ml-2 text-sm">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
