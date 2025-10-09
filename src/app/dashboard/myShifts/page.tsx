"use client";

import { fetchMyShifts } from "@/app/lib/data";
import { getFullAddress } from "@/app/lib/utils";
import { AuthWrapper } from "@/app/ui/authentication/auth-wrapper";
import { useAuth } from "@/app/ui/context/auth-context";
import BigCalendarContainer from "@/app/ui/dashboard/big-calendar-container";
import { lusitana } from "@/app/ui/fonts";
import FilterDate from "@/app/ui/list/filter-date";
import FilterShiftStatus from "@/app/ui/list/filter-shift-status";
import FormModal from "@/app/ui/list/form-modal";
import Pagination from "@/app/ui/list/pagination";
import ApprovedStatus from "@/app/ui/list/status";
import Table from "@/app/ui/list/table";
import TableSearch from "@/app/ui/list/table-search";
import { useRouter, useSearchParams } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";

type ShiftList = Shift & { company: Company }
                 & { location: Location } 
                 & { pharmacist: Pharmacist & { user: User } };

type Shift = {
    id: number,
    companyId: string,
    locationId?: string,
    title: string,
    description?: string,
    startTime: string,
    endTime: string,
    payRate: string,
    status: string,
    createdAt : string,
    pharmacistId: string,
}

type Company = {
  id: string,
  name: string,
  email: string,
  phone: string,
  address: string,
  city: string,
  province: string,
}

type Location = {
  id: string,
  name: string,
  email: string,
  phone: string,
  address: string,
  city: string,
  province: string,
}

type Pharmacist = {
  id: string,
  userId: string,
}

type User = {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
}

const DateFormat = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
 } as const;

 const TimeFormat = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,  
 } as const;

const columns = [
  {
    header: "Info",
    accessor: "info",
    className: "px-4 py-5 font-medium sm:pl-6",
  },
  {
    header: "Date",
    accessor: "date",
    className: "table-cell px-3 py-5 font-medium",
  },
  {
    header: "Start - End time",
    accessor: "startEndTime",
    className: "table-cell px-3 py-5 font-medium",
  },
  {
    header: "Rate",
    accessor: "payRate",
    className: "table-cell px-3 py-5 font-medium",
  },
  {
    header: "Status",
    accessor: "status",
    className: "hidden sm:table-cell px-3 py-5 font-medium",
  },
  {
    header: "Notes",
    accessor: "notes",
    className: "hidden md:table-cell px-3 py-5 font-medium",
  },
  {
    header: "Pharmacist",
    accessor: "pharmacist",
    className: "hidden lg:table-cell px-3 py-5 font-medium",
  },
];



export default function PharmacistShiftsList(){

    const router = useRouter();
    const searchParams = useSearchParams();
    const { firebaseUser, appUser, loading } = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [token, setToken] = useState("");
    const [shifts, setShifts] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);

    // Redirect if not logged in
    useEffect(() => {
      if (!loading && !firebaseUser) {
        router.push("/");
      }
    }, [loading, firebaseUser, router]);

    // Get token
    useEffect(() => {
      if (firebaseUser) {
        firebaseUser.getIdToken().then((idToken: SetStateAction<string>) => {
          setToken(idToken);
        });
      }
    }, [firebaseUser]);

        // Fetch shifts when token is ready
      useEffect(() => {
        const getShifts = async () => {
          setIsFetching(true);
          try {
            const page = searchParams.get('page');
            const query = searchParams.get('query');
            const queryParams: Record<string, string> = {};

            searchParams.forEach((value, key) => {
              if (key !== 'page' && key !== 'query') {
                //Detect if the value is a valid date
                const parsedDate = new Date(value);
                const isValidDate = !isNaN(parsedDate.getTime());

                if (isValidDate) {
                  queryParams[key] = parsedDate.toISOString();
                } else {
                  queryParams[key] = value;
                }
              }
            });
        
            const currentPage = page ? parseInt(page) : 1;
            const search = query ?? '';

            const shiftsResponse = await fetchMyShifts(search, currentPage, queryParams, token);
            setShifts(shiftsResponse?.data ?? []);
            setTotalPages(shiftsResponse?.meta?.totalPages ?? 1);
          } catch (err) {
            console.error("Failed to fetch shifts", err);
          } finally {
            setIsFetching(false);
          }
        };
        if (token){ getShifts() };
  }, [token, searchParams]);

    if (loading || isFetching) return <div>Loading...</div>;
    if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;

    const role = appUser.role;

    const renderRow = (item: ShiftList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-50"
    >
      <td className="flex items-center gap-4 whitespace-nowrap py-3 pl-6 pr-3">
        {item.location ? (
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.location?.name}</h3>
          <p className="text-xs text-gray-500">{item.company?.name}</p>
                    <p className="text-xs text-gray-500">{item.location?.email}</p>
          <p className="text-xs text-gray-500">{item.location?.phone}</p>
          <p className="text-xs text-gray-500">{getFullAddress(item.location?.address, item.location?.city, item.location?.province, null)}</p>
        </div>
        ):(
          <div className="flex flex-col">
          <h3 className="font-semibold">{item.company?.name}</h3>
          <p className="text-xs text-gray-500">{item.company?.email}</p>
          <p className="text-xs text-gray-500">{item.company?.phone}</p>
          <p className="text-xs text-gray-500">{getFullAddress(item.company?.address, item.company?.city, item.company?.province, null)}</p>
        </div>
        )}
      </td>
      <td className="table-cell whitespace-nowrap px-3 py-3">{new Intl.DateTimeFormat("en-CA", DateFormat).format(new Date(item.startTime))}</td>
      <td className="table-cell whitespace-nowrap px-3 py-3">
        {new Date(item.startTime).toLocaleTimeString("en-US", TimeFormat)}-{new Date(item.endTime).toLocaleTimeString("en-US", TimeFormat)} 
      </td>
      <td className="table-cell whitespace-nowrap px-3 py-3">${parseFloat(item.payRate).toFixed(2)}</td>
      <td className="hidden sm:table-cell whitespace-nowrap px-3 py-3">
        <ApprovedStatus status={item.status} />
      </td>
      <td className="hidden md:table-cell flex items-center gap-4 py-3 pl-3 pr-3 w-48">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item?.title}</h3>
          <p className="text-xs text-gray-500 break-words">{item?.description}</p>
        </div>
      </td>
      <td className="hidden lg:table-cell flex items-center gap-4 whitespace-nowrap py-3 pl-3 pr-3">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.pharmacist?.user.firstName} {item.pharmacist?.user.lastName}</h3>
          <p className="text-xs text-gray-500">{item.pharmacist?.user.email}</p>
          <p className="text-xs text-gray-500">{item.pharmacist?.user.phone}</p>
        </div>
      </td>
    </tr>
  );

  return (
    <AuthWrapper allowedRoles={["admin", "pharmacy_manager", "location_manager", "relief_pharmacist"]}>
      <div className="p-4 lg:p-8">
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          My Shifts
        </h1>
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
          {/* TOP */}
          <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
            <TableSearch placeholder="Search shifts..." />
            <FilterDate />
            <FilterShiftStatus />
          </div>
          {/* LIST */}
          <div style={{ overflowX: 'scroll' }}>
            <Table columns={columns} renderRow={renderRow} data={shifts} />
          </div>
          {/* PAGINATION */}
          <div className="mt-5 flex w-full justify-center">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-md">
          <BigCalendarContainer type="dashboard" />
        </div>
      </div>
    </AuthWrapper>
  );
    
}