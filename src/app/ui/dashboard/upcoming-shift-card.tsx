import { clockInShift, clockOutShift } from "@/app/lib/actions";
import { getFullAddress } from "@/app/lib/utils";
import { formatInTimeZone } from "date-fns-tz";
import { useState } from "react";
import Status from "../list/status";
import { toast } from "react-toastify";

export default function UpcomingShiftCard({ shift, token }: any) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const workLog = shift.workLogs?.[0];

  const isClockedIn = workLog && !workLog.clockOut;
  const isWorkLogCompleted = workLog && workLog.clockOut;

  const handleClockIn = async () => {
    setLoading(true);
    try {
      await clockInShift(token, shift.id);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast(`Failed to clock in. Please try again.`, {
        toastId: "unique-toast",
      });
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      await clockOutShift(token, shift.id);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast(`Failed to clock out. Please try again.`, {
        toastId: "unique-toast",
      });
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  const companyTodayStr = formatInTimeZone(
    new Date(),
    shift.company?.timezone,
    "yyyy-MM-dd",
  );

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const companyTomorrowStr = formatInTimeZone(
    tomorrowDate,
    shift.company?.timezone,
    "yyyy-MM-dd",
  );

  const shiftDateStr = formatInTimeZone(
    shift.startTime,
    shift.company?.timezone,
    "yyyy-MM-dd",
  );

  const isToday = shiftDateStr === companyTodayStr;
  const isTomorrow = shiftDateStr === companyTomorrowStr;

  let dateBadge = "Upcoming";
  if (isToday) dateBadge = "Today";
  if (isTomorrow) dateBadge = "Tomorrow";

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row md:flex-col justify-between h-full gap-4">
        <div>
          {shift.location ? (
            <div className="flex flex-col mb-3">
              <p className="font-semibold">{shift.location?.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {getFullAddress(
                  shift.location?.address,
                  shift.location?.city,
                  shift.location?.province,
                  null,
                )}
              </p>
            </div>
          ) : (
            <div className="flex flex-col mb-2">
              <p className="font-semibold">{shift.company?.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {getFullAddress(
                  shift.company?.address,
                  shift.company?.city,
                  shift.company?.province,
                  null,
                )}
              </p>
            </div>
          )}
          <div className="mb-3 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] uppercase tracking-wider  font-bold px-2 py-0.5 rounded-full ${
                  isToday
                    ? "bg-primary text-white"
                    : isTomorrow
                      ? "bg-complementary-two text-white"
                      : "bg-secondary text-white"
                }`}
              >
                {dateBadge}
              </span>
              <p className="text-sm font-medium text-gray-700">
                {formatInTimeZone(
                  shift.startTime,
                  shift.company?.timezone,
                  "EEE MMM dd, yyyy",
                )}
              </p>
            </div>

            <p className="text-sm text-gray-500">
              {formatInTimeZone(
                shift.startTime,
                shift.company?.timezone,
                "HH:mm",
              )}{" "}
              -{" "}
              {formatInTimeZone(
                shift.endTime,
                shift.company?.timezone,
                "HH:mm",
              )}
            </p>
          </div>
          <div className="flex flex-col border-t border-gray-50 pt-2">
            <h3 className="text-sm font-semibold text-gray-800">
              {shift?.title}
            </h3>
            <p className="text-xs text-gray-400 break-words mt-0.5 line-clamp-3">
              {shift?.description}
            </p>
          </div>
        </div>

        {/* ACTION */}
        <div className="flex items-center justify-end sm:justify-start md:justify-end mt-auto pt-2 border-t sm:border-none md:border-t border-gray-100">
          {!isClockedIn && !isWorkLogCompleted && isToday && (
            <>
              {!confirming ? (
                <button
                  onClick={() => setConfirming(true)}
                  className="bg-primary text-white py-2 px-4 rounded-md border-none w-max self-center hover:bg-primary-100 cursor-pointer"
                >
                  Clock In
                </button>
              ) : (
                <div className="flex flex-col gap-2 items-center w-full">
                  <p className="text-sm text-gray-600 text-center">
                    Clock in at{" "}
                    <span className="font-semibold">
                      {formatInTimeZone(
                        new Date(),
                        shift.company?.timezone,
                        "HH:mm",
                      )}
                    </span>
                    ?
                  </p>
                  <div className="flex gap-2 w-full justify-center">
                    <button
                      onClick={handleClockIn}
                      disabled={loading}
                      className="bg-green-500 text-white px-3 py-1 text-sm rounded hover:bg-green-700 font-medium transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirming(false)}
                      className="px-3 py-1 border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {isClockedIn && (
            <div className="w-full">
              <div className="mb-2 text-right sm:text-left md:text-right">
                <p className="text-sm text-gray-500 font-semibold">
                  Clocked In:{" "}
                  <span className="text-gray-800">
                    {formatInTimeZone(
                      workLog?.clockIn,
                      shift.company?.timezone,
                      "HH:mm",
                    )}
                  </span>
                </p>
              </div>
              {!confirming ? (
                <button
                  onClick={() => setConfirming(true)}
                  className="bg-complementary-one text-white py-2 px-4 rounded-md border-none w-max self-center hover:bg-pink-400 cursor-pointer"
                >
                  Clock Out
                </button>
              ) : (
                <div className="flex flex-col gap-2 items-center w-full">
                  <p className="text-sm text-gray-600 text-center">
                    Clock out at{" "}
                    <span className="font-semibold">
                      {formatInTimeZone(
                        new Date(),
                        shift.company?.timezone,
                        "HH:mm",
                      )}
                    </span>
                    ?
                  </p>
                  <div className="flex gap-2 w-full justify-center">
                    <button
                      onClick={handleClockOut}
                      disabled={loading}
                      className="bg-red-700 text-white px-3 py-1 text-sm rounded hover:bg-red-800 font-medium transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirming(false)}
                      className="px-3 py-1 border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {isWorkLogCompleted && (
            <div className="text-right sm:text-left md:text-right space-y-0.5 w-full">
              <p className="text-sm text-gray-500 font-semibold">
                In:{" "}
                <span className="text-gray-800">
                  {formatInTimeZone(
                    workLog?.clockIn,
                    shift.company?.timezone,
                    "HH:mm",
                  )}
                </span>
              </p>
              <p className="text-sm text-gray-500 font-semibold">
                Out:{" "}
                <span className="text-gray-800">
                  {formatInTimeZone(
                    workLog?.clockOut,
                    shift.company?.timezone,
                    "HH:mm",
                  )}
                </span>
              </p>
              <div className="mt-1 flex justify-end sm:justify-start md:justify-end">
                <Status status={shift.status} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
