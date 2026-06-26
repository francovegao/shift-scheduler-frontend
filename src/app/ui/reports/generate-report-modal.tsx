import { useState } from "react";
import { useAuth } from "../context/auth-context";
import { DocumentPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import ReportForm from "../forms/reports/report-form";

export default function GenerateReportModal({
  reportType,
  token,
  filters,
}: {
  reportType: "shifts" | "companies" | "pharmacists";
  token: string;
  filters: {
    startDate?: string;
    endDate?: string;
    type: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const { appUser, loading } = useAuth();

  const Form = () => {
    return reportType === "shifts" ? (
      <>
        {filters.startDate && filters.endDate ? (
          <ReportForm
            reportType={reportType}
            token={token}
            setOpen={setOpen}
            filters={filters}
          />
        ) : (
          <div className="text-sm text-gray-700 font-semibold p-10">
            Please select "From" and "To" dates.
          </div>
        )}
      </>
    ) : (
      <div className="text-sm text-gray-700 font-semibold p-10">
        Only shifts reports enabled for the moment. Please change report type to
        shifts.
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (!appUser) return <div>Please sign in to continue</div>;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={clsx(
          "rounded-md cursor-pointer p-2 flex bg-primary text-white py-2 px-4 border-none w-max self-center hover:bg-primary-100 text-sm font-normal",
        )}
      >
        <>
          <DocumentPlusIcon className="h-5 md:mr-4" />{" "}
          <span className="hidden md:block">Generate {reportType} report</span>
        </>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white text-black p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <XMarkIcon className="w-6" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
