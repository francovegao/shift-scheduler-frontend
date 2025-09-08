"use client";

import { fetchPharmacists } from "@/app/lib/data";
import { AuthWrapper } from "@/app/ui/authentication/auth-wrapper";
import { useAuth } from "@/app/ui/context/auth-context";
import { lusitana } from "@/app/ui/fonts";
import FormModal from "@/app/ui/list/form-modal";
import Pagination from "@/app/ui/list/pagination";
import ApprovedStatus from "@/app/ui/list/status";
import Table from "@/app/ui/list/table";
import TableSearch from "@/app/ui/table-search";
import { EyeIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useEffect, useState } from "react";

type PharmacistList = User & { roles: Roles[] } & {pharmacistProfile?: PharmacistProfile} ;

type User = {
    id: number,
    email: string,
    firstName?: string,
    lastName?: string,
    phone?: string,
} 

type Roles = {
  id: string,
  userId: string,
  role: string,
  companyId: string,
}

type PharmacistProfile = {
    id: string,
    userId: string,
    licenseNumber: string,
    address?: string,
    city?: string,
    province?: string,
    postalCode?: string,
    email?: string,
    bio?: string,
    experienceYears?: number,
    approved: boolean,
}

const columns = [
  {
    header: "Info",
    accessor: "info",
    className: "px-4 py-5 font-medium sm:pl-6",
  },
  {
    header: "Email",
    accessor: "email",
    className: "hidden md:table-cell px-3 py-5 font-medium",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell px-3 py-5 font-medium",
  },
  {
    header: "License Number",
    accessor: "licenseNumber",
    className: "hidden md:table-cell px-3 py-5 font-medium",
  },
  {
    header: "Status",
    accessor: "status",
    className: "hidden sm:table-cell px-3 py-5 font-medium",
  },
  {
    header: "Etransfer Email",
    accessor: "etransferemail",
    className: "hidden lg:table-cell px-3 py-5 font-medium",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell px-3 py-5 font-medium",
  },
  {
    header: "",
    accessor: "edit",
    className:"relative py-3 pl-6 pr-3"
  },
];

export default function PharmacistsList({
  searchParams,
  }:{
    searchParams: { [key: string]: string | undefined} ;
  }){
    const { firebaseUser, appUser, loading } = useAuth();

    const [pharmacists, setPharmacists] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isFetching, setIsFetching] = useState(true);

    const { page, query, ...queryParams } = searchParams;
    const currentPage = page ? parseInt(page) : 1;
    const search = query ? query : ''; 

    // Fetch pharmacists client-side
    useEffect(() => {
    const getPharmacists = async () => {
      setIsFetching(true);
      try {
        const pharmacistsResponse = await fetchPharmacists(search, currentPage);
        setPharmacists(pharmacistsResponse?.data ?? []);
        setTotalPages(pharmacistsResponse?.meta?.totalPages ?? 1);
      } catch (err) {
        console.error("Failed to fetch pharmacists", err);
      } finally {
        setIsFetching(false);
      }
    };
    
    getPharmacists();
   }, [search, currentPage, JSON.stringify(queryParams)]);
    
    if (loading || isFetching) return <div>Loading...</div>;
        
    if (!firebaseUser || !appUser) {
        return null;  
    }
    
    const role = appUser.role;

 const renderRow = (item: PharmacistList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-50"
    >
      <td className="flex items-center gap-4 whitespace-nowrap py-3 pl-6 pr-3">
        {/*<Image
          src={item.photo}
          alt=""
          width={40}
          height={40}
          className="md:hidden lg:block w-10 h-10 rounded-full object-cover"
        />*/}
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.firstName}</h3>
          <p className="text-xs text-gray-500">{item?.lastName}</p>
        </div>
      </td>
      <td className="hidden md:table-cell whitespace-nowrap px-3 py-3">{item.email}</td>
      <td className="hidden lg:table-cell whitespace-nowrap px-3 py-3">{item.phone}</td>
      <td className="hidden md:table-cell whitespace-nowrap px-3 py-3">{item.pharmacistProfile?.licenseNumber}</td>
      <td className="hidden sm:table-cell whitespace-nowrap px-3 py-3">
        <ApprovedStatus status={item.pharmacistProfile?.approved ? "approved":"pending"} />
      </td>
      <td className="hidden lg:table-cell whitespace-nowrap px-3 py-3">{item.pharmacistProfile?.email}</td>
      <td className="hidden lg:table-cell whitespace-nowrap px-3 py-3">
        {[
          item.pharmacistProfile?.address,
          item.pharmacistProfile?.city,
          item.pharmacistProfile?.province,
          item.pharmacistProfile?.postalCode,
          ].filter(Boolean).map((val, i) => (
            <div key={i}>{val}</div>
            ))
          }
        </td>
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <Link 
            href={`pharmacists/${item.id}`}
            className="rounded-md border p-2 hover:bg-gray-100"
          >
            <EyeIcon className="w-5"  />
          </Link>
          {role === "admin" && (
            <>
              <FormModal table="pharmacist" type="update" id={item.id} />
              <FormModal table="pharmacist" type="delete" id={item.id} />
             </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <AuthWrapper allowedRoles={["admin"]}>
      <div className="p-4 lg:p-8">
          <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
              Pharmacists List
          </h1>
          <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
              {/* TOP */}
              <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                  <TableSearch placeholder="Search pharmacists..." />
                  {role === "admin" && (
                  <FormModal table="pharmacist" type="create" />
                  )}
              </div>
              {/* LIST */}
              <div style={{overflowX: 'scroll'}}>
                  <Table columns={columns} renderRow={renderRow} data={pharmacists}/>
              </div>
              {/* PAGINATION */}
              <div className="mt-5 flex w-full justify-center">
                  <Pagination totalPages={totalPages} />
              </div>
          </div>
      </div>
    </AuthWrapper>
  );
}