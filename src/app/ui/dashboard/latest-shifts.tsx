"use client";

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { useAuth } from '../context/auth-context';
import { SetStateAction, useEffect, useState } from 'react';
import { fetchLatestShifts } from '@/app/lib/data';
import ApprovedStatus from '../list/status';

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
            const latestShiftsResponse = await fetchLatestShifts(token);
            setLatestShifts(latestShiftsResponse?.data ?? []);
          } catch (err) {
            console.error("Failed to fetch latest shifts", err);
          } finally {
            setIsFetching(false);
          }
        };
        if (token){ getLatestShifts() };
    }, [token]);

    if (loading || isFetching) return <div>Loading...</div>;
    if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Latest Shifts
      </h2>
      <div className="flex grow flex-col justify-between rounded-md bg-gray-50">
        <div className="bg-white divide-y rounded-md shadow-sm">
          {latestShifts.length === 0 && (
            <p className="text-gray-500 text-center py-6">
              No recent shifts available.
            </p>
          )}

          {latestShifts.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="flex flex-row items-center justify-between p-4 hover:bg-gray-50 transition"
            >
              <div className="flex flex-col">
                {item.location ? (
                  <span>
                    <p className="truncate text-sm font-semibold">
                      {item?.location?.name}
                    </p>
                    <p className="text-sm text-gray-500">{item?.company?.name}</p>
                  </span>
                ) : (
                  <span>
                    <p className="truncate text-sm font-semibold">
                      {item.company.name}
                    </p>
                    <p className="text-sm text-gray-500">{item?.location?.name}</p>
                  </span>
                )}
                <div className="mt-1">
                  <ApprovedStatus status={item.status} />
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`${lusitana.className} text-sm font-medium text-gray-700`}
                >
                  {new Date(item.startTime).toLocaleDateString(
                    "en-US", 
                    DateFormat
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(item.startTime).toLocaleTimeString(
                    "en-US",
                    TimeFormat
                  )}
                  –
                  {new Date(item.endTime).toLocaleTimeString("en-US", TimeFormat)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center pb-3 pt-6 px-4 text-gray-500">
          <ArrowPathIcon className="h-5 w-5" />
          <h3 className="ml-2 text-sm">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
