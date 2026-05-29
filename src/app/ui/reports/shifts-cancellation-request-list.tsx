import { useEffect, useState } from "react";
import Pagination from "../list/pagination";
import Table from "../list/table";
import Status from "../list/status";
import { formatInTimeZone } from "date-fns-tz";
import { useSearchParams } from "next/navigation";
import { fetchShiftCancellationRequests } from "@/app/lib/data";
import ProcessCancelRequestModal from "./process-cancel-request-modal";

type ShiftCancellationRequestList = ShiftCancellationRequest & {
  shift: Shift & { company: Company } & { location: Location };
} & { pharmacist: Pharmacist & { user: User } };

type ShiftCancellationRequest = {
  id: string;
  shiftId: string;
  pharmacistId: string;
  reason: string;
  status: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
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

const columns = [
  {
    header: "Pharmacist",
    accessor: "pharmacist",
    className: "table-cell px-3 py-5 font-medium",
  },
  {
    header: "Shift Info",
    accessor: "date",
    className: "table-cell px-3 py-5 font-medium",
  },
  {
    header: "Cancellation Reason",
    accessor: "reason",
    className: "table-cell px-3 py-5 font-medium",
  },
  {
    header: "Status",
    accessor: "status",
    className: "table-cell px-3 py-5 font-medium",
  },
  {
    header: "",
    accessor: "edit",
    className: "px-4 py-5 font-medium sm:pl-6",
  },
];

export default function ShiftCancellationRequestsList({
  token,
  appUser,
}: {
  token: string;
  appUser: any;
}) {
  const [isFetching, setIsFetching] = useState(true);
  const [shiftCancellationRequests, setShiftCancellationRequests] = useState<
    any[]
  >([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  const searchParams = useSearchParams();

  // Fetch shifts when token is ready
  useEffect(() => {
    const getShiftCancellationRequests = async () => {
      setIsFetching(true);
      try {
        const page = searchParams.get("page");

        const currentPage = page ? parseInt(page) : 1;

        const shiftCancellationRequestsResponse =
          await fetchShiftCancellationRequests(currentPage, token);
        setShiftCancellationRequests(
          shiftCancellationRequestsResponse?.data ?? [],
        );
        setTotalPages(shiftCancellationRequestsResponse?.meta?.totalPages ?? 1);
      } catch (err) {
        console.error("Failed to fetch shifts", err);
      } finally {
        setIsFetching(false);
      }
    };
    if (token) {
      getShiftCancellationRequests();
    }
  }, [token]);

  if (isFetching) return <div>Loading...</div>;

  const renderRow = (item: ShiftCancellationRequestList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-50"
    >
      <td className="table-cell flex items-center gap-4 py-3 pl-6 pr-3 max-w-[180px] overflow-hidden">
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.pharmacist?.user.firstName} {item.pharmacist?.user.lastName}
          </h3>
          <p className="text-xs text-gray-500 truncate w-full">
            {item.pharmacist?.user.email}
          </p>
          <p className="text-xs text-gray-500">{item.pharmacist?.user.phone}</p>
        </div>
      </td>
      <td className="table-cell flex items-center justify-center gap-4 py-3 pl-6 pr-3">
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.shift?.location?.name || item.shift?.company?.name}
          </h3>
          {item.shift?.location && (
            <p className="text-xs text-gray-500">{item.shift?.company?.name}</p>
          )}
          <span className="font-medium">
            {formatInTimeZone(
              item.shift.startTime,
              item.shift.company?.timezone,
              "MMM dd, yyyy",
            )}
          </span>
          <span className="text-sm text-gray-500">
            {formatInTimeZone(
              item.shift.startTime,
              item.shift.company?.timezone,
              "HH:mm",
            )}
            -
            {formatInTimeZone(
              item.shift.endTime,
              item.shift.company?.timezone,
              "HH:mm",
            )}
          </span>
          <span className="text-sm text-gray-500">
            ${parseFloat(item.shift.payRate).toFixed(2)} /hr
          </span>
        </div>
      </td>
      <td className="table-cell flex items-center gap-4 py-3 pl-6 pr-3 w-48">
        <div className="flex flex-col">
          <p className="text-sm break-words">{item?.reason}</p>
        </div>
      </td>
      <td className=" px-3 py-3">
        <Status status={item.status} />
      </td>
      <td className="table-cell flex items-center gap-4 py-3 pl-6 pr-3 w-48">
        {appUser.role === "admin" && item.status === "pending" && (
          <ProcessCancelRequestModal
            token={token}
            data={item}
            adminName={`${appUser.firstName} ${appUser.lastName}`}
          />
        )}
        {item.status === "rejected" && (
          <div className="flex flex-col">
            <p className="text-xs text-gray-500 break-words">
              No changes made to shift
            </p>
          </div>
        )}
        {item.status === "approved" && (
          <div className="flex flex-col">
            <p className="text-xs text-gray-500 break-words">
              {item.pharmacist?.user.firstName} {item.pharmacist?.user.lastName}{" "}
              is no longer assigned to this shift
            </p>
          </div>
        )}
      </td>
    </tr>
  );

  const ShiftCancellationRequestCard = ({
    item,
  }: {
    item: ShiftCancellationRequestList;
  }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 mb-4 shadow-sm">
      {/* HEADER: Status & Pay */}
      <div className="flex justify-between items-start mb-3">
        <Status status={item.status} />
      </div>

      {/* BODY: Pharmacist */}
      <div className="mb-4">
        <h3 className="font-semibold">
          {item.pharmacist?.user.firstName} {item.pharmacist?.user.lastName}
        </h3>
        <p className="text-xs text-gray-500 truncate w-full">
          {item.pharmacist?.user.email}
        </p>
        <p className="text-xs text-gray-500">{item.pharmacist?.user.phone}</p>
      </div>

      {/* SHIFT INFO */}
      <div className="bg-slate-50 p-3 rounded-lg mb-4">
        <h3 className="font-semibold">
          {item.shift?.location?.name || item.shift?.company?.name}
        </h3>
        {item.shift?.location && (
          <p className="text-xs text-gray-500">{item.shift?.company?.name}</p>
        )}
        <p className="font-medium">
          {formatInTimeZone(
            item.shift.startTime,
            item.shift.company?.timezone,
            "MMM dd, yyyy",
          )}
        </p>
        <p className="text-sm text-gray-500">
          {formatInTimeZone(
            item.shift.startTime,
            item.shift.company?.timezone,
            "HH:mm",
          )}
          -
          {formatInTimeZone(
            item.shift.endTime,
            item.shift.company?.timezone,
            "HH:mm",
          )}
        </p>
        <p className="text-sm text-gray-500">
          ${parseFloat(item.shift.payRate).toFixed(2)} /hr
        </p>
      </div>

      {/* Reason */}
      <div className="bg-slate-50 p-3 rounded-lg mb-4">
        <p className="text-sm break-words">{item?.reason}</p>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
        <div className="flex gap-2">
          {appUser.role === "admin" && item.status === "pending" && (
            <ProcessCancelRequestModal
              token={token}
              data={item}
              adminName={`${appUser.firstName} ${appUser.lastName}`}
            />
          )}
          {item.status === "rejected" && (
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 break-words">
                No changes made to shift
              </p>
            </div>
          )}
          {item.status === "approved" && (
            <div className="flex flex-col">
              <p className="text-sm text-gray-500 break-words">
                {item.pharmacist?.user.firstName}{" "}
                {item.pharmacist?.user.lastName} is no longer assigned to this
                shift
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-8">
      <h1 className={`font-bold mb-4 text-xl md:text-2xl`}>
        Shift Cancellation Requests
      </h1>
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        {/* LIST */}
        <div className="block lg:hidden mt-6">
          {shiftCancellationRequests.map((item) => (
            <ShiftCancellationRequestCard key={item.id} item={item} />
          ))}
        </div>

        <div className="hidden lg:block">
          <div style={{ overflowX: "scroll" }}>
            <Table
              columns={columns}
              renderRow={renderRow}
              data={shiftCancellationRequests}
            />
          </div>
        </div>
        {/* PAGINATION */}
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
