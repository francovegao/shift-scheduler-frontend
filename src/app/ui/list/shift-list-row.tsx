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

export default function ShiftListRow({
  item,
  token,
  role,
}: {
  item: ShiftList;
  token: string;
  role: string | null;
}) {
  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-50"
    >
      <td className="flex items-center gap-4 whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.location?.name || item.company?.name}
          </h3>
          {item.location && (
            <p className="text-xs text-gray-500">{item.company?.name}</p>
          )}
          <p className="text-xs text-gray-500">
            {item.location?.email || item.company?.email}
          </p>
          <p className="text-xs text-gray-500">
            {item.location?.phone || item.company?.phone}
          </p>
          <p className="text-xs text-gray-500">
            {getFullAddress(
              item.location?.address || item.company?.address,
              item.location?.city || item.company?.city,
              item.location?.province || item.company?.province,
              null,
            )}
          </p>
        </div>
      </td>
      <td className="table-cell whitespace-nowrap px-3 py-3">
        <div className="flex flex-col">
          <span className="font-medium">
            {formatInTimeZone(
              item.startTime,
              item.company?.timezone,
              "MMM dd, yyyy",
            )}
          </span>
          <span className="text-xs text-gray-500">
            {formatInTimeZone(item.startTime, item.company?.timezone, "HH:mm")}-
            {formatInTimeZone(item.endTime, item.company?.timezone, "HH:mm")}
          </span>
          <span className="font-medium text-sm">
            ${parseFloat(item.payRate).toFixed(2)} /hr
          </span>
        </div>
      </td>

      <td className=" px-3 py-3">
        <Status status={item.status} />
        {item.workLogs?.[0] && (
          <>
            {item.workLogs?.[0]?.clockIn && (
              <p className="text-sm text-gray-500 font-semibold">
                In:{" "}
                <span className="text-gray-800">
                  {formatInTimeZone(
                    item.workLogs?.[0]?.clockIn,
                    item.company?.timezone,
                    "HH:mm",
                  )}
                </span>
              </p>
            )}
            {item.workLogs?.[0]?.clockOut && (
              <p className="text-sm text-gray-500 font-semibold">
                Out:{" "}
                <span className="text-gray-800">
                  {formatInTimeZone(
                    item.workLogs?.[0]?.clockOut,
                    item.company?.timezone,
                    "HH:mm",
                  )}
                </span>
              </p>
            )}
          </>
        )}
      </td>

      <td className="table-cell flex items-center gap-4 py-3 pl-6 pr-3 w-48">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item?.title}</h3>
          <p className="text-xs text-gray-500 break-words">
            {item?.description}
          </p>
        </div>
      </td>

      <td className="table-cell flex items-center gap-4 py-3 pl-6 pr-3 max-w-[180px] overflow-hidden">
        {item.published === true ? (
          <div className="flex flex-col">
            <Link href={`list/pharmacists/${item.pharmacist?.userId}`}>
              <h3 className="font-semibold">
                {item.pharmacist?.user.firstName}{" "}
                {item.pharmacist?.user.lastName}
              </h3>
              <p className="text-xs text-gray-500 truncate w-full">
                {item.pharmacist?.user.email}
              </p>
              <p className="text-xs text-gray-500">
                {item.pharmacist?.user.phone}
              </p>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col">
            <span className="flex items-center justify-center rounded-full px-2 py-1 text-xs bg-orange-500 text-white">
              <h3 className="font-semibold">Draft Shift</h3>
            </span>
            <p className="text-xs text-gray-500">
              Publish Shift to make it visible to pharmacists
            </p>
          </div>
        )}
      </td>
      <td className="whitespace-nowrap py-3 pl-3 pr-4">
        <div className="flex justify-end gap-2">
          {role === "admin" && item.status === "open" && (
            <SendEmailModal type="open_shift" token={token} data={item} />
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
      </td>
    </tr>
  );
}
