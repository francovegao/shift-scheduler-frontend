"use client";

import { fetchShifts, role } from "@/app/lib/data";
import { auth } from "@/app/lib/firebaseConfig";
import { AuthWrapper } from "@/app/ui/authentication/auth-wrapper";
import BigCalendar from "@/app/ui/dashboard/big-calendar";
import { lusitana } from "@/app/ui/fonts";
import FormModal from "@/app/ui/list/form-modal";
import Pagination from "@/app/ui/list/pagination";
import ApprovedStatus from "@/app/ui/list/status";
import Table from "@/app/ui/list/table";
import TableSearch from "@/app/ui/table-search";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

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
}

type Location = {
  id: string,
  name: string,
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
    className: "hidden table-cell px-3 py-5 font-medium",
  },
  {
    header: "Start - End time",
    accessor: "startEndTime",
    className: "hidden table-cell px-3 py-5 font-medium",
  },
  {
    header: "Rate",
    accessor: "payRate",
    className: "hidden sm:table-cell px-3 py-5 font-medium",
  },
  {
    header: "Status",
    accessor: "status",
    className: "hidden sm:table-cell px-3 py-5 font-medium",
  },
  {
    header: "Pharmacist",
    accessor: "pharmacist",
    className: "hidden lg:table-cell px-3 py-5 font-medium",
  },
  {
    header: "",
    accessor: "edit",
    className:"relative py-3 pl-6 pr-3"
  },
];

const renderRow = (item: ShiftList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-50"
    >
      <td className="flex items-center gap-4 whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.company.name}</h3>
          <p className="text-xs text-gray-500">{item.location?.name}</p>
        </div>
      </td>
      <td className="hidden table-cell whitespace-nowrap px-3 py-3">{new Intl.DateTimeFormat("en-CA", DateFormat).format(new Date(item.startTime))}</td>
      <td className="hidden table-cell whitespace-nowrap px-3 py-3">
        {new Date(item.startTime).toLocaleTimeString("en-US", TimeFormat)}-{new Date(item.endTime).toLocaleTimeString("en-US", TimeFormat)} 
      </td>
      <td className="hidden sm:table-cell whitespace-nowrap px-3 py-3">${parseFloat(item.payRate).toFixed(2)}</td>
      <td className="hidden sm:table-cell whitespace-nowrap px-3 py-3">
        <ApprovedStatus status={item.status} />
      </td>
      <td className="hidden lg:table-cell flex items-center gap-4 whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.pharmacist?.user.firstName} {item.pharmacist?.user.lastName}</h3>
          <p className="text-xs text-gray-500">{item.pharmacist?.user.email}</p>
          <p className="text-xs text-gray-500">{item.pharmacist?.user.phone}</p>
        </div>
      </td>
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          {role === "admin" && (
            <>
              {/*<UpdatePharmacist id={item.id} /> */}
              <FormModal table="shift" type="update" id={item.id}/>
              {/*<DeletePharmacist id={item.id} /> */}
              <FormModal table="shift" type="delete" id={item.id}/>
            </>
          )}
        </div>
      </td>
    </tr>
  );

export default function ShiftsList({
  searchParams,
  }:{
    searchParams: { [key: string]: string | undefined};
  }){

    const router = useRouter();
    const [user, loading] = useAuthState(auth);
    const [token, setToken] = useState("");
    const [shifts, setShifts] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const { page, query, ...queryParams } = searchParams;
    const currentPage = page ? parseInt(page) : 1;
    const search = query ?? '';  //query?query:"";

    // Redirect if not logged in
    useEffect(() => {
      if (!loading && !user) {
        router.push("/");
      }
    }, [loading, user, router]);

    // Get token when user logs in
    useEffect(() => {
      if (user) {
        user.getIdToken().then((idToken) => {
          setToken(idToken);
        });
      }
    }, [user]);

    // Fetch shifts when token is ready
    useEffect(() => {
      if (token) {
        fetchShifts(search, currentPage, queryParams, token).then((res) => {
          setShifts(res?.data || []);
          setTotalPages(res?.meta?.totalPages || 1);
        });
      }
    }, [token, search, currentPage, queryParams]);

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Please sign in to continue</div>;

  return (
    <AuthWrapper allowedRoles={["admin", "pharmacy_manager", "location_manager", "relief_pharmacist"]}>
      <div className="p-4 lg:p-8">
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Shifts List
        </h1>
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
          {/* TOP */}
          <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
            <TableSearch placeholder="Search shifts..." />
            {role === "admin" && (
              //<AddPharmacist />
              <FormModal table="shift" type="create" />
            )}
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
        <div className="h-full bg-white p-4 rounded-md">
          <BigCalendar />
        </div>
      </div>
    </AuthWrapper>
  );
    
}