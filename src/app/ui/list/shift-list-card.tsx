import { getFullAddress } from "@/app/lib/utils";
import { formatInTimeZone } from "date-fns-tz";
import Status from "./status";
import Link from "next/link";
import SendEmailModal from "./email-modal";
import FormContainer from "./form-container";
import RelatedDataModal from "./related-data-modal";

type ShiftList = Shift & {
  company: Company;
  location: Location;
  pharmacist: Pharmacist & { user: User };
  workLogs: WorkLogs[];
};

type Shift = {
  id: string;
  companyId: string;
  locationId?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  payRate: string;
  status: string;
  published: boolean;
  createdAt: string;
  pharmacistId: string;
};

type Company = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  timezone: string;
};

type Location = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
};

type Pharmacist = {
  id: string;
  userId: string;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type WorkLogs = {
  id: string;
  clockIn: string;
  clockOut: string;
};

export default function ShiftListCard({
  item,
  token,
  role,
}: {
  item: ShiftList;
  token: string;
  role: string | null;
}) {
  return (
    <div className="bg-surface p-4 rounded-xl border border-surface-muted dark:border-zinc-800 mb-4 shadow-sm">
      {/* HEADER: Status & Pay */}
      <div className="flex justify-between items-start mb-3">
        <div className="text-left space-y-2 w-full">
          <Status status={item.status} />{" "}
          {item.workLogs?.[0] && (
            <div className="text-left space-y-0.2 w-full">
              {item.workLogs?.[0]?.clockIn && (
                <p className="text-sm text-tx-body-muted font-semibold">
                  In:{" "}
                  <span className="text-tx-secondary">
                    {formatInTimeZone(
                      item.workLogs?.[0]?.clockIn,
                      item.company?.timezone,
                      "HH:mm",
                    )}
                  </span>
                </p>
              )}
              {item.workLogs?.[0]?.clockOut && (
                <p className="text-sm text-tx-body-muted font-semibold">
                  Out:{" "}
                  <span className="text-tx-secondary">
                    {formatInTimeZone(
                      item.workLogs?.[0]?.clockOut,
                      item.company?.timezone,
                      "HH:mm",
                    )}
                  </span>
                </p>
              )}
            </div>
          )}
          {role === "admin" && item.status === "completed" && (
            <>
              <RelatedDataModal
                type="upsert_work_log"
                token={token}
                data={item}
                id={item.workLogs?.[0]?.id}
              />
            </>
          )}
        </div>
        <span className="font-medium text-lg text-tx-primary">
          ${parseFloat(item.payRate).toFixed(2)}/hr
        </span>
      </div>

      {/* BODY: Date & Time */}
      <div className="mb-4">
        <h3 className="font-bold text-tx-primary">
          {formatInTimeZone(
            item.startTime,
            item.company?.timezone,
            "EEEE, MMM dd, yyyy",
          )}
        </h3>
        <p className="text-tx-secondary">
          {formatInTimeZone(item.startTime, item.company?.timezone, "HH:mm")} -{" "}
          {formatInTimeZone(item.endTime, item.company?.timezone, "HH:mm")}
        </p>
        <p className="font-semibold">{item?.title}</p>
        <p className="text-xs text-tx-body-muted break-words">
          {item?.description}
        </p>
      </div>

      {/* LOCATION */}
      <div className="bg-surface-muted/50 p-3 rounded-lg mb-4">
        <p className="font-medium">
          {item.location?.name || item.company?.name}
        </p>
        <p className="text-sm text-tx-muted leading-tight">
          {item.company?.email}
        </p>
        <p className="text-sm text-tx-muted leading-tight">
          {item.company?.phone}
        </p>
        <p className="text-sm text-tx-muted leading-tight">
          {getFullAddress(
            item.location?.address || item.company?.address,
            item.location?.city || item.company?.city,
            item.location?.province || item.company?.province,
            null,
          )}
        </p>
      </div>

      {/* PHARMACIST */}
      <div className="bg-surface-muted/50 p-3 rounded-lg mb-4">
        {item.published === true ? (
          <div className="flex flex-col">
            <Link href={`list/pharmacists/${item.pharmacist?.userId}`}>
              <h3 className="font-semibold">
                {item.pharmacist?.user.firstName}{" "}
                {item.pharmacist?.user.lastName}
              </h3>
              <p className="text-xs text-tx-body-muted truncate">
                {item.pharmacist?.user.email}
              </p>
              <p className="text-xs text-tx-body-muted">
                {item.pharmacist?.user.phone}
              </p>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col">
            <span className="flex items-center justify-center rounded-full max-w-[130px] px-2 py-1 text-xs bg-orange-500 text-white">
              <h3 className="font-semibold">Draft Shift</h3>
            </span>
            <p className="text-xs text-tx-body-muted">
              Publish Shift to make it visible to pharmacists
            </p>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center pt-3 border-t border-surface-muted">
        <div className="flex gap-2">
          {role === "admin" &&
            item.status === "open" &&
            !item.workLogs?.[0] && (
              <SendEmailModal type="open_shift" token={token} data={item} />
            )}
          {(role === "admin" ||
            role === "pharmacy_manager" ||
            role === "location_manager") &&
            (item.status === "open" || item.status === "taken") && (
              <>
                <FormContainer
                  table="shift"
                  type="update"
                  token={token}
                  data={item}
                />
                <FormContainer
                  table="shift"
                  type="delete"
                  token={token}
                  id={item.id}
                  data={item}
                />
              </>
            )}
        </div>
      </div>
    </div>
  );
}
