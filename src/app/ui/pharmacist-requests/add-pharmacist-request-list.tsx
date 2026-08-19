import { useSearchParams } from "next/navigation";
import Pagination from "../list/pagination";
import { useEffect, useState } from "react";
import { fetchAddPharmacistRequests } from "@/app/lib/data";
import Table from "../list/table";
import { getFullAddress } from "@/app/lib/utils";
import Status from "../list/status";
import AdminProcessRequestModal from "../admin-requests/admin-process-request-modal";
import DateInUserTimezone from "../common/date-in-user-timezone";

type PharmacistRequestList = PharmacistRequest & {
  submittedBy: SubmittedBy;
} & { reviewedBy: ReviewedBy };

type PharmacistRequest = {
  id: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  licenseNumber: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  bio?: string;
  experienceYears?: Number;
  eTransferEmail?: string;

  status: string;
  reviewedAt?: string;
  rejectionReason?: string;

  createdAt: string;
  updatedAt?: string;
};

type SubmittedBy = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type ReviewedBy = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

const columns = [
  {
    header: "User Info",
    accessor: "user",
    className: "table-cell px-3 py-5 font-medium",
  },
  {
    header: "Pharmacist Info",
    accessor: "pharmacist",
    className: "table-cell px-3 py-5 font-medium",
  },
  {
    header: "Submitted By",
    accessor: "submittedBy",
    className: "table-cell px-3 py-5 font-medium",
  },
  {
    header: "Request Status",
    accessor: "status",
    className: "table-cell px-3 py-5 font-medium",
  },
  {
    header: "",
    accessor: "edit",
    className: "px-4 py-5 font-medium sm:pl-6",
  },
];

export default function AddPharmacistRequestsList({
  token,
  appUser,
}: {
  token: string;
  appUser: any;
}) {
  const [isFetching, setIsFetching] = useState(true);
  const [pharmacistRequests, setPharmacistRequests] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  const searchParams = useSearchParams();

  // Fetch requests when token is ready
  useEffect(() => {
    const getShiftCancellationRequests = async () => {
      setIsFetching(true);
      try {
        const page = searchParams.get("page");

        const currentPage = page ? parseInt(page) : 1;

        const pharmacistRequestsResponse = await fetchAddPharmacistRequests(
          currentPage,
          token,
        );
        setPharmacistRequests(pharmacistRequestsResponse?.data ?? []);
        setTotalPages(pharmacistRequestsResponse?.meta?.totalPages ?? 1);
      } catch (err) {
        console.error("Failed to fetch add pharmacist requests", err);
      } finally {
        setIsFetching(false);
      }
    };
    if (token) {
      getShiftCancellationRequests();
    }
  }, [token, searchParams]);

  if (isFetching) return <div>Loading...</div>;

  const renderRow = (item: PharmacistRequestList) => (
    <tr
      key={item.id}
      className="border-b border-surface-muted even:bg-surface-muted/30 text-sm hover:bg-surface-muted"
    >
      <td className="table-cell flex items-center gap-4 py-3 pl-6 pr-3 max-w-[180px] overflow-hidden">
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.firstName} {item.lastName}
          </h3>
          <p className="text-xs  truncate w-full">{item.email}</p>
          <p className="text-xs">{item.phone}</p>
        </div>
      </td>
      <td className="table-cell flex items-center gap-4 py-3 pl-6 pr-3 max-w-[180px] overflow-hidden">
        <div className="flex flex-col gap-y-1">
          <p className="text-xs">License: {item.licenseNumber}</p>
          <p className="text-xs ">Bio: {item.bio}</p>
          <p className="text-xs ">
            Experience Years: {item.experienceYears?.toString()}
          </p>
          <p className="text-xs ">E-transfer: {item.eTransferEmail}</p>
          <p
            className="text-xs "
            title={getFullAddress(
              item?.address,
              item?.city,
              item?.province,
              item?.postalCode,
            )}
          >
            Address:{" "}
            {getFullAddress(
              item?.address,
              item?.city,
              item?.province,
              item?.postalCode,
            )}
          </p>
        </div>
      </td>
      <td className="table-cell flex items-center gap-4 py-3 pl-6 pr-3 max-w-[180px] overflow-hidden">
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.submittedBy.firstName} {item.submittedBy.lastName}
          </h3>
          <p className="text-xs text-tx-body-muted truncate w-full">
            {item.submittedBy.email}
          </p>
          <p className="text-xs mt-2">
            Date: <DateInUserTimezone isoString={item.createdAt} />
          </p>
        </div>
      </td>

      <td className=" px-3 py-3">
        <Status status={item.status} />
        {item.status !== "pending" && (
          <div className="mt-1">
            <div className="text-xs text-tx-body-muted">
              By: {item.reviewedBy.firstName} {item.reviewedBy.lastName}
            </div>
            <p className="text-xs text-tx-body-muted truncate w-full">
              {item.reviewedBy.email}
            </p>
          </div>
        )}
      </td>
      <td className="table-cell flex items-center gap-4 py-3 pl-6 pr-3 w-48">
        {appUser.role === "admin" && item.status === "pending" && (
          <AdminProcessRequestModal
            type={"add_pharmacist"}
            token={token}
            data={item}
          />
        )}
        {item.status === "rejected" && (
          <div className="flex flex-col gap-y-1">
            <p className="text-xs text-tx-body-muted break-words">
              Pharmacist was not added to the system
            </p>
            <p className="text-xs  break-words">
              Reject Reason: {item?.rejectionReason}
            </p>
          </div>
        )}
        {item.status === "approved" && (
          <div className="flex flex-col gap-y-1">
            <p className="text-xs text-tx-body-muted break-words">
              Pharmacist added to the system
            </p>
            <p className="text-xs  break-words">
              Manage permissions in the pharmacists list page
            </p>
          </div>
        )}
      </td>
    </tr>
  );

  const PharmacistRequestCard = ({ item }: { item: PharmacistRequestList }) => (
    <div className="bg-surface p-4 rounded-xl border border-surface-muted mb-4 shadow-sm">
      {/* HEADER: Status & Pay */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col">
          <Status status={item.status} />
          {item.status !== "pending" && (
            <div className="mt-1">
              <div className="text-xs text-tx-body-muted">
                By: {item.reviewedBy.firstName} {item.reviewedBy.lastName}
              </div>
              <p className="text-xs text-tx-body-muted truncate w-full">
                {item.reviewedBy.email}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* BODY: User Info */}
      <div className="mb-4  flex flex-col gap-1.5">
        <h3 className="font-semibold">
          {item.firstName} {item.lastName}
        </h3>
        <p className="text-sm  truncate w-full">{item.email}</p>
        <p className="text-sm">{item.phone}</p>

        <p className="text-xs">License: {item.licenseNumber}</p>
        <p className="text-xs ">Bio: {item.bio}</p>
        <p className="text-xs ">
          Experience Years: {item.experienceYears?.toString()}
        </p>
        <p className="text-xs ">E-transfer: {item.eTransferEmail}</p>
        <p
          className="text-xs "
          title={getFullAddress(
            item?.address,
            item?.city,
            item?.province,
            item?.postalCode,
          )}
        >
          Address:{" "}
          {getFullAddress(
            item?.address,
            item?.city,
            item?.province,
            item?.postalCode,
          )}
        </p>
      </div>

      {/* Submitted by */}
      <div className="bg-surface-muted/50 p-3 rounded-lg mb-4">
        <h3 className="font-semibold">
          {item.submittedBy.firstName} {item.submittedBy.lastName}
        </h3>
        <p className="text-xs text-tx-body-muted truncate w-full">
          {item.submittedBy.email}
        </p>
        <p className="text-xs mt-2">
          Date: <DateInUserTimezone isoString={item.createdAt} />
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center pt-3 border-t border-surface-muted">
        <div className="flex gap-2">
          {appUser.role === "admin" && item.status === "pending" && (
            <AdminProcessRequestModal
              type={"add_pharmacist"}
              token={token}
              data={item}
            />
          )}
          {item.status === "rejected" && (
            <div className="flex flex-col gap-y-1">
              <p className="text-xs text-tx-body-muted break-words">
                Pharmacist was not added to the system
              </p>
              <p className="text-xs  break-words">
                Reject Reason: {item?.rejectionReason}
              </p>
            </div>
          )}
          {item.status === "approved" && (
            <div className="flex flex-col gap-y-1">
              <p className="text-sm text-tx-body-muted break-words">
                Pharmacist added to the system
              </p>
              <p className="text-sm  break-words">
                Manage permissions in the pharmacists list page
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
        Add Pharmacist Requests
      </h1>
      <div className="bg-surface p-4 rounded-md flex-1 m-4 mt-0">
        {/* LIST */}
        <div className="block lg:hidden mt-6">
          {pharmacistRequests.map((item) => (
            <PharmacistRequestCard key={item.id} item={item} />
          ))}
        </div>

        <div className="hidden lg:block">
          <div style={{ overflowX: "scroll" }}>
            <Table
              columns={columns}
              renderRow={renderRow}
              data={pharmacistRequests}
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
