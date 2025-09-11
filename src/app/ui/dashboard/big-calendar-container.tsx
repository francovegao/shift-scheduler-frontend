'use client';

import { fetchAllMyShifts } from "@/app/lib/data";
import BigCalendar from "./big-calendar";
import { useAuth } from "../context/auth-context";
import { SetStateAction, useEffect, useState } from "react";


export default function BigCalendarContainer() {
    const { firebaseUser, appUser, loading } = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [token, setToken] = useState("");
    const [shifts, setShifts] = useState<any[]>([]);

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
        const getMyShifts = async () => {
          setIsFetching(true);
          try {
            const shiftsResponse = await fetchAllMyShifts(token);
            setShifts(shiftsResponse?.data ?? []);
          } catch (err) {
            console.error("Failed to fetch shifts", err);
          } finally {
            setIsFetching(false);
          }
        };
        if (token){ getMyShifts() };
    },  [token ]);

    if (loading || isFetching) return <div>Loading...</div>;
    if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;

    const data = shifts.map((shift) => {
        const title =
            shift.location?.name
            ? `${shift.company.name} - ${shift.location.name}`
            : shift.company.name;

        return {
            title,
            allDay: false,
            start: new Date(shift.startTime),
            end: new Date(shift.endTime),
        };
    });

    return(
        <div >
            <BigCalendar data={data}/>
        </div>
    )
}