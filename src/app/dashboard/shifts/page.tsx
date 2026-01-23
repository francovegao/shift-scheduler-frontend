"use client";

import { fetchShifts } from "@/app/lib/data";
import { useSelectedCompany } from "@/app/lib/useSelectedCompany";
import { getFullAddress } from "@/app/lib/utils";
import { AuthWrapper } from "@/app/ui/authentication/auth-wrapper";
import { useAuth } from "@/app/ui/context/auth-context";
import BigCalendar from "@/app/ui/dashboard/big-calendar";
import BigCalendarContainer from "@/app/ui/dashboard/big-calendar-container";
import FilterDate from "@/app/ui/list/filter-date";
import FilterPayRate from "@/app/ui/list/filter-pay-rate";
import FilterShiftStatus from "@/app/ui/list/filter-shift-status";
import FormContainer from "@/app/ui/list/form-container";
import Pagination from "@/app/ui/list/pagination";
import SortListColumns from "@/app/ui/list/sort-list-columns";
import ApprovedStatus from "@/app/ui/list/status";
import Table from "@/app/ui/list/table";
import TableSearch from "@/app/ui/list/table-search";
import { useRouter, useSearchParams } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";

type ShiftList = Shift & { company: Company }
                 & { location: Location } 
                 & { pharmacist: Pharmacist & { user: User } };

type Shift = {
    id: string,
    companyId: string,
    locationId?: string,
    title: string,
    description?: string,
    startTime: string,
    endTime: string,
    payRate: string,
    status: string,
    published: boolean,
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
  timezone: string;
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
    className: "table-cell px-3 py-5 font-medium",
  },
  {
    header: "Notes",
    accessor: "notes",
    className: "table-cell px-3 py-5 font-medium",
  },
  {
    header: "Pharmacist",
    accessor: "pharmacist",
    className: "table-cell px-3 py-5 font-medium",
  },
  {
    header: "",
    accessor: "edit",
    className:"px-4 py-5 font-medium sm:pl-6"
  },
];



export default function ShiftsList(){

    const router = useRouter();
    const searchParams = useSearchParams();
    const { firebaseUser, appUser, loading } = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [token, setToken] = useState("");
    const [shifts, setShifts] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const currentCompanyId = useSelectedCompany((state) => state.currentCompanyId);

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

                if(key === "from" || key === "to" ){
                   //Detect if the value is a valid date
                  const parsedDate = new Date(value);
                  const isValidDate = !isNaN(parsedDate.getTime());

                  if(isValidDate){
                    queryParams[key] = parsedDate.toISOString();
                  }

                }else{
                  queryParams[key] = value;
                }
            }});
        
            const currentPage = page ? parseInt(page) : 1;
            const search = query ?? '';

            //Set current selected companyId
            if(appUser?.role ==="pharmacy_manager"){
              if(currentCompanyId !== appUser?.companyId ){
                queryParams["companyId"] = currentCompanyId || "";
              }
            }

            const shiftsResponse = await fetchShifts(search, currentPage, queryParams, token);
            setShifts(shiftsResponse?.data ?? []);
            setTotalPages(shiftsResponse?.meta?.totalPages ?? 1);
          } catch (err) {
            console.error("Failed to fetch shifts", err);
          } finally {
            setIsFetching(false);
          }
        };
        if (token){ getShifts() };
  }, [token, searchParams, currentCompanyId]);

    if (loading || isFetching) return <div>Loading...</div>;
    if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;

    const role = appUser.role;

    //Prepare data to send to BigCalendar component
    const data = shifts.map((shift) => {
        const title =
            shift.location?.name
            ? `${shift.location.name} - ${shift.company.name}`
            : shift.company.name;

        return {
            title,
            allDay: false,
            start: new Date(shift.startTime),
            end: new Date(shift.endTime),
            shift: shift,
        };
    });

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
      <td className="table-cell whitespace-nowrap px-3 py-3">{formatInTimeZone(item.startTime, item.company?.timezone , 'MMM dd, yyyy')}</td>
      <td className="table-cell whitespace-nowrap px-3 py-3">
        {formatInTimeZone(item.startTime, item.company?.timezone, "HH:mm")}-{formatInTimeZone(item.endTime, item.company?.timezone, "HH:mm")}
      </td>
      <td className="table-cell whitespace-nowrap px-3 py-3">${parseFloat(item.payRate).toFixed(2)}</td>
      <td className="table-cell whitespace-nowrap px-3 py-3">
        <ApprovedStatus status={item.status} />
      </td>
      <td className="table-cell flex items-center gap-4 py-3 pl-6 pr-3 w-48">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item?.title}</h3>
          <p className="text-xs text-gray-500 break-words">{item?.description}</p>
        </div>
      </td>
      <td className="table-cell flex items-center gap-4 whitespace-nowrap py-3 pl-6 pr-3 w-48">
        {item.published === true ? (
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.pharmacist?.user.firstName} {item.pharmacist?.user.lastName}</h3>
            <p className="text-xs text-gray-500">{item.pharmacist?.user.email}</p>
            <p className="text-xs text-gray-500">{item.pharmacist?.user.phone}</p>
          </div>
        ) : (
          <div className="flex flex-col">
            <span className="flex items-center justify-center rounded-full px-2 py-1 text-xs bg-orange-500 text-white">
              <h3 className="font-semibold">Draft Shift</h3>
            </span>
            <p className="text-xs text-gray-500">Not visible to Pharmacists</p>
            <p className="text-xs text-gray-500">Publish Shift to make it visible</p>
          </div>
        )}
      </td>     
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          {(role === "admin" ||
            role === "pharmacy_manager" ||
            role === "location_manager" ) &&
            ( item.status === 'open' ) &&  (
            <>
              <FormContainer table="shift" type="update" token={token} data={item} />
              <FormContainer table="shift" type="delete" token={token} id={item.id}/>
            </>
          )
          }
        </div>
      </td>
    </tr>
  );

  return (
    <AuthWrapper allowedRoles={["admin", "pharmacy_manager", "location_manager", "relief_pharmacist"]}>
      <div className="p-4 lg:p-8">
        <h1 className={`font-bold mb-4 text-xl md:text-2xl`}>
          Shifts List
        </h1>
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
          {/* TOP */}
          <div className="mt-2 flex items-center justify-between gap-4 md:mt-2">
            <TableSearch placeholder="Search shifts..." />
            <SortListColumns options={[
                { value: 'name:asc', label: 'Pharmacy Name ↑' },
                { value: 'name:desc', label: 'Pharmacy Name ↓' },
                { value: 'payRate:asc', label: 'Pay Rate ↑' },
                { value: 'payRate:desc', label: 'Pay Rate ↓' },
                { value: 'startTime:asc', label: 'Shift Date ↑' },
                { value: 'startTime:desc', label: 'Shift Date ↓' },
              ]} />
             { (role === "admin" ||
                role === "pharmacy_manager" ||
                role === "location_manager") && (
              <FormContainer table="shift" type="create" token={token}/>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 md:justify-between md:mt-4">
            <div className="w-full lg:w-auto">
              <FilterDate />
            </div>
            <FilterShiftStatus options={[
                { value: 'open', label: 'Open' },
                { value: 'taken', label: 'Scheduled' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]} />
              <FilterPayRate />
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
        <div className="h-screen bg-white p-1 rounded-md mb-4">
          { (role === "admin" ||
                role === "pharmacy_manager" ||
                role === "location_manager") && (
              <BigCalendarContainer type="dashboard_manager" />
            )}
            { (role === "relief_pharmacist") && (
              <BigCalendar token={token} data={data}/>
            )}
            
        </div>
      </div>
    </AuthWrapper>
  );   
}