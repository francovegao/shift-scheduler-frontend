"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/auth-context";
import UpcomingShiftCard from "./upcoming-shift-card";
import { fetchPharmacistShifts } from "@/app/lib/data";
import { addDays, format } from "date-fns";
import Link from "next/link";

export default function TodayShiftsContainer() {
  const { firebaseUser, appUser, loading } = useAuth();
  const [token, setToken] = useState("");
  const [shifts, setShifts] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (firebaseUser) {
      firebaseUser.getIdToken().then(setToken);
    }
  }, [firebaseUser]);

  useEffect(() => {
    const fetchShifts = async () => {
      if (!token) return;

      setIsFetching(true);

      try {
        if (appUser?.id) {
          const now = new Date();
          const nextWeek = addDays(now, 7);
          const shiftsResponse = await fetchPharmacistShifts(
            appUser.id,
            token,
            undefined,
            format(now, "yyyy-MM-dd"),
            format(nextWeek, "yyyy-MM-dd"),
            "3",
          );
          setShifts(shiftsResponse?.data ?? []);
        }
      } catch (err) {
        console.error("Failed to fetch today shifts", err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchShifts();
  }, [token, appUser]);

  if (loading || isFetching) return <div>Loading...</div>;
  if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;
  if (!shifts.length) return null;

  return (
    <div className="mb-6 bg-white pb-4 px-4 rounded-md shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 mb-4">
        <h1 className="text-xl font-semibold my-4">Clock In Dashboard</h1>
        <Link
          href="/dashboard/myShifts"
          className="text-gray-500 text-xs font-medium px-2.5 py-1.5 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors"
        >
          View All My Shifts
        </Link>
      </div>
      {shifts.length === 0 ? (
        <p className="text-gray-400 text-center py-6">
          No upcoming assigned shifts (Next 7 days)
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shifts.map((shift: any) => (
            <UpcomingShiftCard key={shift.id} shift={shift} token={token} />
          ))}
        </div>
      )}
    </div>
  );
}
