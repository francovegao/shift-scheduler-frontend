"use client";

import { Dispatch, SetStateAction } from "react";
import { formatPayRate, getFullAddress } from "@/app/lib/utils";
import Status from "./status";
import { formatInTimeZone } from "date-fns-tz";
import { CalendarIcon } from "@heroicons/react/24/outline";
import SendEmailModal from "./email-modal";
import { useAuth } from "../context/auth-context";

export default function ShiftInfoModal({
  data,
  setOpen,
  token,
}: {
  data?: any;
  setOpen: () => void;
  token?: string;
}) {
  const { appUser, loading } = useAuth();

  if (!appUser) {
    return <p>Please login...</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  function generateGCalLink(event: any): string | undefined {
    const baseUrl =
      "https://calendar.google.com/calendar/render?action=TEMPLATE";

    const start = formatInTimeZone(
      event.startTime,
      event.company?.timezone,
      "yyyyMMdd'T'HHmmssXXX",
    );
    const end = formatInTimeZone(
      event.endTime,
      event.company?.timezone,
      "yyyyMMdd'T'HHmmssXXX",
    );
    const appLink = `https://shifthappens.vercel.app/`;
    const eventDetails = `Details: ${event.title || ""}: ${event.description || ""} \n\n<a href="${appLink}">Click here to view all details</a>`;

    const params = new URLSearchParams({
      text: `Shift at ${event.company?.name}`,
      dates: `${start}/${end}`,
      details: eventDetails,
      location:
        getFullAddress(
          event.company?.address,
          event.company?.city,
          event.company?.province,
          null,
        ) || "",
    });

    return `${baseUrl}&${params.toString()}`;
  }

  const role = appUser.role;
  const pharmacistId = appUser.pharmacistProfile?.id;

  return (
    <div className="p-4 flex flex-col gap-4 text-primary">
      <h1 className="text-xl font-semibold">Shift Info</h1>

      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-4 shadow-sm">
        {/* HEADER: Status & Pay */}
        <div className="flex justify-between items-start mb-3">
          <Status status={data.status} />
          <span className="font-medium text-lg">
            {formatPayRate(data.payRate)}
            {formatPayRate(data.payRate) !== "No Data" ? " per hr" : ""}
          </span>
        </div>

        {/* BODY: Date & Time */}
        <div className="mb-4">
          <h3 className="font-bold text-slate-800">
            {formatInTimeZone(
              data.startTime,
              data.company?.timezone,
              "EEEE, MMM dd, yyyy",
            )}
          </h3>
          <p className="text-slate-600">
            {formatInTimeZone(data.startTime, data.company?.timezone, "HH:mm")}{" "}
            - {formatInTimeZone(data.endTime, data.company?.timezone, "HH:mm")}
          </p>
          <p className="font-semibold">{data?.title}</p>
          <p className="text-xs text-gray-500 break-words">
            {data?.description}
          </p>
        </div>

        {/* LOCATION */}
        <div className="bg-slate-50 p-3 rounded-lg mb-4">
          <p className="font-medium">
            {data.location?.name || data.company?.name}
          </p>
          <p className="text-sm text-slate-500 leading-tight">
            {data.location?.email || data.company?.email}
          </p>
          <p className="text-sm text-slate-500 leading-tight">
            {data.location?.phone || data.company?.phone}
          </p>
          <p className="text-sm text-slate-500 leading-tight">
            {getFullAddress(
              data.location?.address || data.company?.address,
              data.location?.city || data.company?.city,
              data.location?.province || data.company?.province,
              null,
            )}
          </p>
        </div>

        {/* PHARMACIST */}
        <div className="bg-slate-50 p-3 rounded-lg mb-4">
          {data.published === true ? (
            <>
              {data.status !== "open" && (
                <div className="flex flex-col">
                  <h3 className="font-medium">
                    {data.pharmacist?.user.firstName}{" "}
                    {data.pharmacist?.user.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {data.pharmacist?.user.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {data.pharmacist?.user.phone}
                  </p>
                  {data.pharmacist?.licenseNumber && (
                    <p className="text-sm text-gray-500">
                      License: {data.pharmacist?.licenseNumber}
                    </p>
                  )}
                  {data.pharmacist?.email && (
                    <p className="text-sm text-gray-500">
                      E-transfer: {data.pharmacist?.email}
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col">
              <span className="flex items-center justify-center rounded-full max-w-[130px] px-2 py-1 text-xs bg-orange-500 text-white">
                <h3 className="font-semibold">Draft Shift</h3>
              </span>
            </div>
          )}
        </div>

        {/* CANCELLATION */}
        <div className="bg-slate-50 p-3 rounded-lg mb-4">
          {data.status === "taken" && (
            <div className="font-medium">
              <p className="text-sm text-complementary-one">
                To cancel this shift please contact:
              </p>
              <p className="text-sm text-gray-500">
                {data.company?.contactName}
              </p>
              <p className="text-sm text-gray-500">
                {data.company?.contactPhone}
              </p>
              <p className="text-sm text-gray-500">
                {data.company?.contactEmail}
              </p>
              {!!(
                token &&
                role === "relief_pharmacist" &&
                pharmacistId &&
                data.company?.contactEmail
              ) && (
                <div className="mt-1">
                  <SendEmailModal
                    type="request_cancellation"
                    token={token}
                    id={data.id}
                    pharmacistId={pharmacistId}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center gap-4 w-full">
        {data.status === "taken" && (
          <a
            href={generateGCalLink(data)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-white rounded-md"
            style={{ backgroundColor: "rgb(0, 135, 68)" }}
          >
            <CalendarIcon className="ml-1 w-4 text-white" />
            Google Calendar
          </a>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen();
          }}
          className="bg-gray-500 text-white py-2 px-4 rounded-md border-none w-max self-center hover:bg-gray-600 cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}
