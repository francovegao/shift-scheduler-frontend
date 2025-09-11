"use client";

import { fetchShiftsByDate } from "@/app/lib/data";
import { SetStateAction, useEffect, useState } from "react";
import { useAuth } from "../context/auth-context";

export default function ShiftsCalendarList({
    dateParam,
}:{
    dateParam: string | undefined,
}) {
    const { firebaseUser, appUser, loading } = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [token, setToken] = useState("");
    const [shifts, setShifts] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);

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

  return (
    shifts.map((event) => {
        const startTime = new Date(event.startTime);
        const endTime = new Date(event.endTime);

        return(
        <div className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-blue-200 even:border-t-purple-200"
            key={event.id}>
            <div className="flex items-center justify-between">
                <h1 className="font-semibold text-gray-600">{event.title}</h1>
                <span className="text-gray-300 text-xs">
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
            </div>
            <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
        </div>
        );
    })
  );
}