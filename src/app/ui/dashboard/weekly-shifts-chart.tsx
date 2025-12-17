"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Status from '../list/status';
import { useAuth } from '../context/auth-context';
import { SetStateAction, useEffect, useState } from 'react';
import { fetchWeekCounts } from '@/app/lib/data';

type WeekType = "current" | "last" | "beforeLast" | "next" | "afterNext";

const WEEK_OPTIONS: { label: string; value: WeekType }[] = [
  { label: "Before", value: "beforeLast" },
  { label: "Last", value: "last" },
  { label: "Current", value: "current" },
  { label: "Next", value: "next" },
  { label: "After", value: "afterNext" },
];

export const WeeklyShiftsChart = () => {
  const { firebaseUser, appUser, loading } = useAuth();
  const [isFetching, setIsFetching] = useState(true);
  const [token, setToken] = useState("");
  const [weekData, setWeekData] = useState<any[]>([]);

  const [selectedWeek, setSelectedWeek] = useState<WeekType>("current");


  // Get token
    useEffect(() => {
        if (firebaseUser) {
        firebaseUser.getIdToken().then((idToken: SetStateAction<string>) => {
            setToken(idToken);
        });
        }
    }, [firebaseUser]);
  
    // Fetch counts when token is ready
    useEffect(() => {
    const getCounts = async () => {
        setIsFetching(true);
        try {
          const countsResponse = await fetchWeekCounts(selectedWeek, token);
          setWeekData(countsResponse.data ?? null);
        } catch (err) {
          console.error("Failed to fetch counts", err);
        } finally {
          setIsFetching(false);
        }
    };
    if (token){ getCounts() };
    }, [token, selectedWeek ]);
  
    if (loading || isFetching) return <div>Loading...</div>;
    if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;

    const formatDay = (dateStr: string) => {
      const [year, month, day] = dateStr.split("-").map(Number);

      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
      });
    };

    const data: any[] | undefined = []
    weekData.forEach((dayCount)=>{
      data.push({
        date: dayCount.date,
        open: dayCount.open,
        taken: dayCount.taken,
        cancelled: dayCount.cancelled,
        completed: dayCount.completed,
      })
    })



  return (
    <div className="bg-white p-4 rounded-md min-h-[320px] @container flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold">Weekly Breakdown</h1>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {WEEK_OPTIONS.map((week) => (
          <button
            key={week.value}
            onClick={() => setSelectedWeek(week.value)}
            className={`
              px-3 py-1 rounded-full text-sm font-medium transition
              ${
                selectedWeek === week.value
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }
            `}
          >
            {week.label}
          </button>
        ))}
      </div>
      {/* CHART */}
      <div className='w-full h-[250px]'>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"   
              tickFormatter={formatDay}
              tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="open" stackId="a" fill="#64748B"  />
            <Bar dataKey="taken" stackId="a" fill="#3b82f6"  />
            <Bar dataKey="completed" stackId="a" fill="#48BB78"  />
            <Bar dataKey="cancelled" stackId="a" fill="#ef4444"  />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* BOTTOM */}
        <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-2 w-full mx-auto">
            <Status status="open" />
            <Status status="taken" />
            <Status status="cancelled" />
            <Status status="completed" />
        </div>
    </div>
  );
};