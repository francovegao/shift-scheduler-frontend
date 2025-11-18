"use client";

import {  fetchCompanies, } from "@/app/lib/data";
import Pagination from "@/app/ui/list/pagination";
import ApprovedStatus from "@/app/ui/list/status";
import Table from "@/app/ui/list/table";
import TableSearch from "@/app/ui/list/table-search";
import Link from "next/link";
import { EyeIcon } from "@heroicons/react/24/outline";
import { AuthWrapper } from "@/app/ui/authentication/auth-wrapper";
import { useAuth } from "@/app/ui/context/auth-context";
import { SetStateAction, useEffect, useState, use } from "react";
import FormContainer from "@/app/ui/list/form-container";
import { useSearchParams } from "next/navigation";

type Company = {
    id: string,
    approved: boolean,
    name: string,
    legalName?: string,
    GSTNumber?: string,
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
    header: "GST Number",
    accessor: "GSTNumber",
    className: "hidden sm:table-cell px-3 py-5 font-medium",
  },
  {
    header: "Status",
    accessor: "status",
    className: "hidden sm:table-cell px-3 py-5 font-medium",
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



export default function CompaniesList(){

    const { firebaseUser, appUser, loading } = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [token, setToken] = useState("");
    const [companies, setCompanies] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);

    const searchParams = useSearchParams(); 

    // Get token
    useEffect(() => {
      if (firebaseUser) {
        firebaseUser.getIdToken().then((idToken: SetStateAction<string>) => {
          setToken(idToken);
        });
      }
    }, [firebaseUser]);

    // Fetch companies client-side
    useEffect(() => {
    const getCompanies = async () => {
      setIsFetching(true);
      try {
        const page = searchParams.get('page');
        const query = searchParams.get('query');
        const queryParams: Record<string, string> = {};

        const currentPage = page ? parseInt(page) : 1;
        const search = query ?? '';

        const companiesResponse = await fetchCompanies(search, currentPage, token);
        setCompanies(companiesResponse?.data ?? []);
        setTotalPages(companiesResponse?.meta?.totalPages ?? 1);
      } catch (err) {
        console.error("Failed to fetch companies", err);
      } finally {
        setIsFetching(false);
      }
    };
    if (token){ getCompanies() };
   }, [token, searchParams]);
    
    if (loading || isFetching) return <div>Loading...</div>;
    if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;
    
    const role = appUser.role;

const renderRow = (item: Company) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-50"
    >
      <td className="flex items-center gap-4 whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.legalName}</p>
        </div>
      </td>
      <td className="hidden sm:table-cell whitespace-nowrap px-3 py-3">{item?.GSTNumber}</td>
      <td className="hidden sm:table-cell whitespace-nowrap px-3 py-3">
        <ApprovedStatus status={item.approved ? "approved":"pending"} />
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
            href={`companies/${item.id}`}
            className="rounded-md border p-2 hover:bg-gray-100"
          >
            <EyeIcon className="w-5"  />
          </Link>
          {role === "admin" && (
            <>
              <FormContainer table="company" type="update" token={token} data={item}/>
              <FormContainer table="company" type="delete" token={token} id={item.id}/>
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <AuthWrapper allowedRoles={["admin"]}>
      <div className="p-4 lg:p-8">
          <h1 className={`font-bold mb-4 text-xl md:text-2xl`}>
              Companies List
          </h1>
          <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
              {/* TOP */}
              <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                  <TableSearch placeholder="Search companies..." />
                  {role === "admin" && (
                  //<AddPharmacist />
                  <FormContainer table="company" type="create"  token={token}/>
                  )}
              </div>
              {/* LIST */}
              <div style={{overflowX: 'scroll'}}>
                  <Table columns={columns} renderRow={renderRow} data={companies}/>
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