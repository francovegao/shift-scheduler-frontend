"use client";

import { fetchUsers } from "@/app/lib/data";
import { displayRole } from "@/app/lib/utils";
import { AuthWrapper } from "@/app/ui/authentication/auth-wrapper";
import { useAuth } from "@/app/ui/context/auth-context";
import FormContainer from "@/app/ui/list/form-container";
import Pagination from "@/app/ui/list/pagination";
import RelatedDataModal from "@/app/ui/list/related-data-modal";
import ApprovedStatus from "@/app/ui/list/status";
import Table from "@/app/ui/list/table";
import TableSearch from "@/app/ui/list/table-search";
import { EyeIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SetStateAction, useEffect, useState, use } from "react";

type UserList = User & { company: Company } & { location: Location } & { pharmacistProfile: PharmacistProfile };

type User = {
    id: string,
    email: string,
    firstName?: string,
    lastName?: string,
    phone?: string,
    role: string,
    companyId?: string,
    locationId?: String
} 

type Company = {
    id: string,
    approved: boolean,
    name: string,
    email?: string,
    phone?: string,
    address?: string,
    city?: string,
    province?: string,
    postalCode?: string,
}

type Location = {
    id: string,
    name: string,
    email?: string,
    phone?: string,
    address?: string,
    city?: string,
    province?: string,
    postalCode?: string,
    companyId: string,
}

type PharmacistProfile = {
    id: string,
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
    header: "Role",
    accessor: "role",
    className: "hidden sm:table-cell px-3 py-5 font-medium",
  },
      {
    header: "Related",
    accessor: "related",
    className: "px-3 py-5 font-medium",
  },
  {
    header: "",
    accessor: "edit",
    className:"relative py-3 pl-6 pr-3"
  },
];



export default function UsersList(){
  
    const { firebaseUser, appUser, loading } = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [token, setToken] = useState("");
    const [users, setUsers] = useState<any[]>([]);
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

    // Fetch users when token is ready
    useEffect(() => {
    const getUsers = async () => {
      setIsFetching(true);
      try {
        const page = searchParams.get('page');
        const query = searchParams.get('query');
        const queryParams: Record<string, string> = {};

        const currentPage = page ? parseInt(page) : 1;
        const search = query ?? '';

        const usersResponse = await fetchUsers(search, currentPage, queryParams, token);
        setUsers(usersResponse?.data ?? []);
        setTotalPages(usersResponse?.meta?.totalPages ?? 1);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setIsFetching(false);
      }
    };
    if (token){ getUsers() };
   }, [token, searchParams]);
    
    if (loading || isFetching) return <div>Loading...</div>;
    if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;
    
    const role = appUser.role;

const renderRow = (item: UserList) => (
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
      <td className="hidden sm:table-cell whitespace-nowrap px-3 py-3">
        {displayRole(item.role)}
      </td>
      <td className="flex items-center gap-4 whitespace-nowrap py-3 pl-6 pr-3">
        {(item.role === "pharmacy_manager") && (
          <div className="flex flex-col">
            {item?.company ? (
              <>
            <h3 className="font-semibold">{item?.company?.name}</h3>
            <p className="text-xs text-gray-500">{item?.location?.name}</p>
            </>
            ) : (
             <RelatedDataModal type="link_company" token={token} id={item.id}/> 
            )}
          </div>
        )}
        {( item.role === "location_manager") && (
          <div className="flex flex-col">
            {item?.company ? (
              <>
            <h3 className="font-semibold">{item?.location?.name}</h3>
            <p className="text-xs text-gray-500">{item?.company?.name}</p>
            </>
            ) : (
             <RelatedDataModal type="link_location" token={token} id={item.id}/> 
            )}
          </div>
        )}
        {item.role === "relief_pharmacist" && (
          <div className="flex flex-col">
            {item.pharmacistProfile ? ( 
              <ApprovedStatus status={item.pharmacistProfile?.approved ? "approved":"pending"} />
            ):(
            <RelatedDataModal type="link_pharmacist_profile" token={token} id={item.id}/> 
            )}
          </div>
        )}
      </td>
      
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          {(item.role === "relief_pharmacist" && item.pharmacistProfile) && (
          <Link 
            href={`pharmacists/${item.id}`}
            className="rounded-md border p-2 hover:bg-gray-100"
          >
              <EyeIcon className="w-5"  />
          </Link>
          )}
          {role === "admin" && (
            <>
              <FormContainer table="user" type="update" token={token} data={item} />
              <FormContainer table="user" type="delete" token={token} id={item.id} />
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
              Users List
          </h1>
          <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
              {/* TOP */}
              <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                  <TableSearch placeholder="Search users..." />
                  {role === "admin" && (
                  <FormContainer table="user" type="create" token={token} />
                  )}
              </div>
              {/* LIST */}
              <div style={{overflowX: 'scroll'}}>
                  <Table columns={columns} renderRow={renderRow} data={users}/>
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