"use client";

import { fetchLocations } from "@/app/lib/data";
import { lusitana } from "@/app/ui/fonts";
import FormModal from "@/app/ui/list/form-modal";
import Pagination from "@/app/ui/list/pagination";
import Table from "@/app/ui/list/table";
import TableSearch from "@/app/ui/table-search";
import Link from "next/link";
import { EyeIcon } from "@heroicons/react/24/outline";
import { AuthWrapper } from "@/app/ui/authentication/auth-wrapper";
import { useAuth } from "@/app/ui/context/auth-context";
import { useEffect, useState } from "react";

type LocationsList = Location & { company: Company };

type Location = {
    id: number,
    name: string,
    email?: string,
    phone?: string,
    address?: string,
    city?: string,
    province?: string,
    postalCode?: string,
    companyId: string,
}

type Company = {
    id: number,
    approved: boolean,
    name: string,
    email?: string,
    phone?: string,
    address?: string,
    city?: string,
    province?: string,
    postalCode?: string,
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
    className: "hidden lg:table-cell px-3 py-5 font-medium",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell px-3 py-5 font-medium",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell px-3 py-5 font-medium",
  },
  {
    header: "City",
    accessor: "city",
    className: "hidden lg:table-cell px-3 py-5 font-medium",
  },
    {
    header: "Province",
    accessor: "province",
    className: "hidden lg:table-cell px-3 py-5 font-medium",
  },
    {
    header: "Postal Code",
    accessor: "postalCode",
    className: "hidden lg:table-cell px-3 py-5 font-medium",
  },
  {
    header: "",
    accessor: "edit",
    className:"relative py-3 pl-6 pr-3"
  },
];

export default function LocationsList({
  searchParams,
  }:{
    searchParams: { [key: string]: string | undefined} ;
  }){
    const { firebaseUser, appUser, loading } = useAuth();

    const [locations, setLocations] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isFetching, setIsFetching] = useState(true);

    const { page, query, ...queryParams } = searchParams;
    const currentPage = page ? parseInt(page) : 1;
    const search = query ? query : '';

    // Fetch locations client-side
    useEffect(() => {
    const getLocations = async () => {
      setIsFetching(true);
      try {
        const locationsResponse = await fetchLocations(search, currentPage, queryParams);
        setLocations(locationsResponse?.data ?? []);
        setTotalPages(locationsResponse?.meta?.totalPages ?? 1);
      } catch (err) {
        console.error("Failed to fetch locations", err);
      } finally {
        setIsFetching(false);
      }
    };

    getLocations();
  }, [search, currentPage, JSON.stringify(queryParams)]);

    if (loading || isFetching) return <div>Loading...</div>;
    
    if (!firebaseUser || !appUser) {
        return null;  
    }

    const role = appUser.role;

    const renderRow = (item: LocationsList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-50"
    >
      <td className="flex items-center gap-4 whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.company.name}</p>
        </div>
      </td>
      <td className="hidden lg:table-cell whitespace-nowrap px-3 py-3">{item.email}</td>
      <td className="hidden lg:table-cell whitespace-nowrap px-3 py-3">{item.phone}</td>
      <td className="hidden lg:table-cell whitespace-nowrap px-3 py-3">{item.address}</td>
      <td className="hidden lg:table-cell whitespace-nowrap px-3 py-3">{item.city}</td>
      <td className="hidden lg:table-cell whitespace-nowrap px-3 py-3">{item.province}</td>
      <td className="hidden lg:table-cell whitespace-nowrap px-3 py-3">{item.postalCode}</td>
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <Link 
            href={`locations/${item.id}`}
            className="rounded-md border p-2 hover:bg-gray-100"
          >
            <EyeIcon className="w-5"  />
          </Link>
          { role === "pharmacy_manager" && (
            <> 
              <FormModal table="location" type="update" id={item.id}/>
            </>
          )}
          {role === "admin" && (
            <> 
              <FormModal table="location" type="update" id={item.id}/>
              <FormModal table="location" type="delete" id={item.id}/>
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <AuthWrapper allowedRoles={["admin", "pharmacy_manager"]}>
      <div className="p-4 lg:p-8">
          <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
              Locations List
          </h1>
          <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
              {/* TOP */}
              <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                  <TableSearch placeholder="Search locations..." />
                { (role === "admin" || role === "pharmacy_manager") && (
                  <FormModal table="location" type="create" />
                  )}
              </div>

              {locations.length === 0 ? (
                <div className="mt-5 flex w-full justify-center text-sm">
                  No locations found
                </div>
              ) : (   
                <>   
                  {/* LIST */}
                  <div style={{overflowX: 'scroll'}}>
                      <Table columns={columns} renderRow={renderRow} data={locations}/>
                  </div>
                  {/* PAGINATION */}
                  <div className="mt-5 flex w-full justify-center">
                      <Pagination totalPages={totalPages} />
                  </div>
                </>
              )}
          </div>
      </div>
    </AuthWrapper>
  );
}