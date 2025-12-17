"use client";

import { formatShiftsData } from '@/app/lib/utils';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ShiftsGraph({
  data,
}:{
  data?: { month: string; count: number }[];
}) {
    const chartData = data ? formatShiftsData(data) : [];

    return(
    <div className="bg-white p-4 rounded-md h-80">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Monthly Shifts</h1>
      </div>
      <ResponsiveContainer className="pb-4 pt-4" width="100%" height="100%">
        <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="1 1" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="shifts" fill="black" activeBar={<Rectangle fill="pink" stroke="pink" />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
    );

}