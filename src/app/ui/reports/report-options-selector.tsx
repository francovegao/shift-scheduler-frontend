import { format } from "date-fns";
import GenerateReportModal from "./generate-report-modal";
import { useState } from "react";

export default function ReportOptionSelector({ token }: { token: string }) {
  const [reportType, setReportType] = useState<
    "shifts" | "companies" | "pharmacists"
  >("shifts");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="p-2">
      <div className="flex flex-col gap-2 text-black">
        {/*Title */}
        <div className="flex items-center justify-start gap-4">
          <h1 className="text-xl font-semibold">Generate Reports</h1>
        </div>

        {/*Options Selectors */}
        <div className="flex justify-between flex-wrap p-4 gap-4 bg-white rounded-md shadow-sm">
          <p className="text-gray-700 font-medium">Define Report Parameters</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div className="flex flex-col">
              <label className="text-gray-500">Type:</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              >
                <option value="shifts">Shifts</option>
                <option value="pharmacists">Pharmacists</option>
                <option value="companies">Companies</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-500">From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-500">To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              />
            </div>
          </div>
          <GenerateReportModal
            reportType={reportType}
            token={token}
            filters={{
              startDate,
              endDate,
              type: reportType,
            }}
          />
        </div>
      </div>
    </div>
  );
}
