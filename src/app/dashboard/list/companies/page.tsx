"use client";

import { fetchCompanies } from "@/app/lib/data";
import Pagination from "@/app/ui/list/pagination";
import ApprovedStatus from "@/app/ui/list/status";
import Table from "@/app/ui/list/table";
import TableSearch from "@/app/ui/list/table-search";
import Link from "next/link";
import { BuildingStorefrontIcon, EyeIcon } from "@heroicons/react/24/outline";
import { AuthWrapper } from "@/app/ui/authentication/auth-wrapper";
import { useAuth } from "@/app/ui/context/auth-context";
import { SetStateAction, useEffect, useState, use } from "react";
import FormContainer from "@/app/ui/list/form-container";
import { useSearchParams } from "next/navigation";
import SortListColumns from "@/app/ui/list/sort-list-columns";
import Image from "next/image";
import { getFullAddress } from "@/app/lib/utils";

type Company = {
  id: string;
  approved: boolean;
  name: string;
  legalName?: string;
  GSTNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  files?: File[];
};

type File = {
  userId?: string;
  fileName: string;
  fileUrl: string;
  type: "resume" | "logo" | "profilePicture";
};

const columns = [
  {
    header: "Info",
    accessor: "info",
    className: "px-4 py-5 font-medium sm:pl-6",
  },
  {
    header: "GST & Contact",
    accessor: "GSTNumber",
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
    className: "relative py-3 pl-6 pr-3",
  },
];

export default function CompaniesList() {
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
        const page = searchParams.get("page");
        const query = searchParams.get("query");
        const queryParams: Record<string, string> = {};

        searchParams.forEach((value, key) => {
          if (key !== "page" && key !== "query") {
            queryParams[key] = value;
          }
        });

        const currentPage = page ? parseInt(page) : 1;
        const search = query ?? "";

        const companiesResponse = await fetchCompanies(
          search,
          currentPage,
          queryParams,
          token,
        );
        setCompanies(companiesResponse?.data ?? []);
        setTotalPages(companiesResponse?.meta?.totalPages ?? 1);
      } catch (err) {
        console.error("Failed to fetch companies", err);
      } finally {
        setIsFetching(false);
      }
    };
    if (token) {
      getCompanies();
    }
  }, [token, searchParams]);

  if (loading || isFetching) return <div>Loading...</div>;
  if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;

  const role = appUser.role;

  const renderRow = (item: Company) => {
    const companyLogo = item.files?.find((file) => file.type === "logo");

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-50"
      >
        <td className="whitespace-nowrap py-3 pl-6 pr-3 max-w-xs">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-8 relative">
              {companyLogo?.fileUrl ? (
                <Image
                  src={companyLogo.fileUrl}
                  alt={`${item.name}'s logo`}
                  fill
                  sizes="48px"
                  style={{ objectFit: "contain" }}
                />
              ) : (
                <BuildingStorefrontIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <h3 className="font-semibold leading-none whitespace-normal">
                {item.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 whitespace-normal break-words">
                {item.legalName}
              </p>
              <h3 className="text-xs font-medium mt-1">{item.email}</h3>
              <p className="text-xs text-gray-700">{item.phone}</p>
              <p
                className="text-xs text-gray-500 mt-1 whitespace-normal break-words"
                title={getFullAddress(
                  item?.address,
                  item?.city,
                  item?.province,
                  item?.postalCode,
                )}
              >
                {getFullAddress(
                  item?.address,
                  item?.city,
                  item?.province,
                  item?.postalCode,
                )}
              </p>
            </div>
          </div>
        </td>
        <td className="table-cell whitespace-nowrap px-3 py-3">
          <div className="flex flex-col">
            <p className="text-xs">
              {item?.GSTNumber ? `GST: ${item?.GSTNumber}` : ""}
            </p>
            <h3 className="text-xs font-semibold mt-2">{item?.contactName}</h3>
            <h3 className="text-xs text-gray-700">{item?.contactPhone}</h3>
            <p className="text-xs text-gray-700">{item?.contactEmail}</p>
          </div>
        </td>
        <td className="table-cell whitespace-nowrap px-3 py-3">
          <ApprovedStatus status={item.approved ? "approved" : "pending"} />
        </td>
        <td className="whitespace-nowrap py-3 pl-6 pr-3">
          <div className="flex justify-end gap-2">
            <Link
              href={`companies/${item.id}`}
              className="rounded-md border p-2 hover:bg-gray-100"
            >
              <EyeIcon className="w-5" />
            </Link>
            {role === "admin" && (
              <>
                <FormContainer
                  table="company"
                  type="update"
                  token={token}
                  data={item}
                />
                <FormContainer
                  table="company"
                  type="delete"
                  token={token}
                  id={item.id}
                />
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const CompanyCard = ({ item }: { item: Company }) => {
    const companyLogo = item.files?.find((file) => file.type === "logo");

    return (
      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-4 shadow-sm">
        {/* BODY: User Info*/}
        <div className="mb-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-8 relative">
              {companyLogo?.fileUrl ? (
                <Image
                  src={companyLogo.fileUrl}
                  alt={`${item.name}'s logo`}
                  fill
                  sizes="48px"
                  style={{ objectFit: "contain" }}
                />
              ) : (
                <BuildingStorefrontIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-semibold leading-none">{item.name}</h3>
              <p className="text-xs text-gray-500 mt-1 break-words">
                {item.legalName}
              </p>
              <h3 className="text-xs font-medium mt-1 break-all">
                {item.email}
              </h3>
              <p className="text-xs text-gray-700">{item.phone}</p>
              <p
                className="text-xs text-gray-500 mt-1"
                title={getFullAddress(
                  item?.address,
                  item?.city,
                  item?.province,
                  item?.postalCode,
                )}
              >
                {getFullAddress(
                  item?.address,
                  item?.city,
                  item?.province,
                  item?.postalCode,
                )}
              </p>
            </div>
          </div>
        </div>

        {/* EXTRA INFO */}
        <div className="bg-slate-50 p-3 rounded-lg mb-4">
          <div className="flex flex-col">
            <p className="text-xs">
              {item?.GSTNumber ? `GST: ${item?.GSTNumber}` : ""}
            </p>
            <h3 className="text-xs font-semibold mt-2">{item?.contactName}</h3>
            <h3 className="text-xs text-gray-700">{item?.contactPhone}</h3>
            <p className="text-xs text-gray-700">{item?.contactEmail}</p>
          </div>
        </div>

        {/* STATUS */}
        <div className="bg-slate-50 p-3 rounded-lg mb-4">
          <ApprovedStatus status={item.approved ? "approved" : "pending"} />
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-3 border-t border-slate-100">
          <div className="flex gap-3">
            <Link
              href={`companies/${item.id}`}
              className="rounded-md border p-2 hover:bg-gray-100"
            >
              <EyeIcon className="w-5" />
            </Link>
            {role === "admin" && (
              <>
                <FormContainer
                  table="company"
                  type="update"
                  token={token}
                  data={item}
                />
                <FormContainer
                  table="company"
                  type="delete"
                  token={token}
                  id={item.id}
                />
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AuthWrapper allowedRoles={["admin"]}>
      <div className="p-4 lg:p-8">
        <h1 className={`font-bold mb-4 text-xl md:text-2xl`}>Companies List</h1>
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
          {/* TOP */}
          <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
            <TableSearch placeholder="Search companies..." />
            <SortListColumns
              options={[
                { value: "name:asc", label: "Company Name ↑" },
                { value: "name:desc", label: "Company Name ↓" },
                { value: "legalName:asc", label: "Legal Name ↑" },
                { value: "legalName:desc", label: "Legal Name ↓" },
              ]}
            />
            {role === "admin" && (
              //<AddPharmacist />
              <FormContainer table="company" type="create" token={token} />
            )}
          </div>
          {/* LIST */}
          <div className="block lg:hidden mt-6">
            {companies.map((item) => (
              <CompanyCard key={item.id} item={item} />
            ))}
          </div>
          <div className="hidden lg:block">
            <div style={{ overflowX: "scroll" }}>
              <Table columns={columns} renderRow={renderRow} data={companies} />
            </div>
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
