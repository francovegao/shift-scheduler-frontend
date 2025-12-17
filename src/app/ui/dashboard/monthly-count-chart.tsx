"use client";

import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import Status from '../list/status';
import { useAuth } from '../context/auth-context';
import { SetStateAction, useEffect, useState } from 'react';
import { fetchMonthCounts } from '@/app/lib/data';

const style = {
  top: '50%',
  right: 0,
  transform: 'translate(0, -50%)',
  lineHeight: '24px',
};

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export const MonthShiftCounts = (
  { isAnimationActive = true }: { isAnimationActive?: boolean }
) => {
  const { firebaseUser, appUser, loading } = useAuth();
  const [isFetching, setIsFetching] = useState(true);
  const [token, setToken] = useState("");
  const [counts, setCounts] = useState<any | null>(null);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    String(now.getMonth() + 1).padStart(2, "0")
  );
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

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
        const month = `${selectedYear}-${selectedMonth}`;
        const countsResponse = await fetchMonthCounts(month, token);
        setCounts(countsResponse.meta.counts ?? null);
      } catch (err) {
        console.error("Failed to fetch counts", err);
      } finally {
        setIsFetching(false);
      }
  };
  if (token){ getCounts() };
  }, [token, selectedMonth, selectedYear]);

  if (loading || isFetching) return <div>Loading...</div>;
  if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;

const data = [
  { name: 'Open', value: counts.open, fill: '#64748B' },
  { name: 'Completed', value: counts.completed, fill: '#48BB78' },
  { name: 'Assigned', value: counts.taken, fill: '#3b82f6' },
  { name: 'Cancelled', value: counts.cancelled, fill: '#ef4444' },
];

const stats = [
  { label: "Open", value: counts.open, status: "open" },
  { label: "Assigned", value: counts.taken, status: "taken" },
  { label: "Completed", value: counts.completed, status: "completed" },
  { label: "Cancelled", value: counts.cancelled, status: "cancelled" },
];

  return (
    <div className="bg-white p-4 rounded-md min-h-[320px] @container flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Monthly Breakdown</h1>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border rounded-md px-2 py-1 text-sm"
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border rounded-md px-2 py-1 text-sm"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      {/* CHART */}
      <div className='w-full h-[250px]'>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius="80%"
              outerRadius="100%"
              cornerRadius="45%"
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              isAnimationActive={isAnimationActive}
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-800 text-xl font-semibold"
            >
              {counts.total}
            </text>
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              className="fill-gray-500 text-sm"
            >
              Total Shifts
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* BOTTOM */}
      <div className="grid grid-cols-1 gap-1">
          {stats.map((item) => (
            <div
              key={item.status}
              className="flex items-center justify-between rounded-md border p-1"
            >
              <div className="flex items-center gap-2 text-sm ">
                <Status status={item.status as any} />
              </div>
              <span className="text-lg font-medium">{item.value}</span>
            </div>
          ))}
        </div>
    </div>
  );
};