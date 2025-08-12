"use client";

import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: "Jan", shifts: 1, fill: "#C3EBFA" },
  { month: "Feb", shifts: 3, fill: "#FAE27C" },
  { month: "Mar", shifts: 2, fill: "#C3EBFA" },
  { month: "Apr", shifts: 4, fill: "#FAE27C" },
  { month: "May", shifts: 7, fill: "#C3EBFA" },
  { month: "Jun", shifts: 5, fill: "#FAE27C" },
  { month: "Jul", shifts: 15, fill: "#C3EBFA" },
  { month: "Aug", shifts: 12, fill: "#FAE27C" },
  { month: "Sep", shifts: 0, fill: "#C3EBFA" },
  { month: "Oct", shifts: 0, fill: "#FAE27C" },
  { month: "Nov", shifts: 0, fill: "#C3EBFA" },
  { month: "Dec", shifts: 0, fill: "#FAE27C" },
];

export default function ShiftsGraph() {
    return(
    <div className="bg-white p-4 rounded-md h-80">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Monthly Shifts</h1>
      </div>
      <ResponsiveContainer className="pb-4 pt-4" width="100%" height="100%">
        <BarChart
            width={500}
            height={300}
            data={data}
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