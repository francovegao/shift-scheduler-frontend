"use client";

import { fetchUsers } from "@/app/lib/data";
import { AuthWrapper } from "@/app/ui/authentication/auth-wrapper";
import { useAuth } from "@/app/ui/context/auth-context";
import { lusitana } from "@/app/ui/fonts";
import FormContainer from "@/app/ui/list/form-container";
import FormModal from "@/app/ui/list/form-modal";
import Pagination from "@/app/ui/list/pagination";
import Table from "@/app/ui/list/table";
import TableSearch from "@/app/ui/list/table-search";
import { EyeIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { SetStateAction, useEffect, useState } from "react";

type UserList = User & { company: Company } & { location: Location };

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
    header: "Company",
    accessor: "company",
    className: "hidden md:table-cell px-3 py-5 font-medium",
  },
  {
    header: "",
    accessor: "edit",
    className:"relative py-3 pl-6 pr-3"
  },
];



export default function UsersList({
  searchParams,
  }:{
    searchParams: { [key: string]: string | undefined} ;
  }){
    const { firebaseUser, appUser, loading } = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [token, setToken] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    

    const { page, query, ...queryParams } =  searchParams;
    const currentPage = page ? parseInt(page) : 1;
    const search = query ? query : ''; 

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
   }, [token, search, currentPage, JSON.stringify(queryParams)]);
    
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
        {item.role}
      </td>
      <td className="hidden md:table-cell flex items-center gap-4 whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item?.company?.name}</h3>
          <p className="text-xs text-gray-500">{item?.location?.name}</p>
        </div>
      </td>
      
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <Link 
            href={`users/${item.id}`}
            className="rounded-md border p-2 hover:bg-gray-100"
          >
            <EyeIcon className="w-5"  />
          </Link>
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
          <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
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