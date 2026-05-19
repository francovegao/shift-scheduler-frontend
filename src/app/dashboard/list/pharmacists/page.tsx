"use client";

import { fetchPharmacists } from "@/app/lib/data";
import { getFullAddress } from "@/app/lib/utils";
import { AuthWrapper } from "@/app/ui/authentication/auth-wrapper";
import { useAuth } from "@/app/ui/context/auth-context";
import FormContainer from "@/app/ui/list/form-container";
import Pagination from "@/app/ui/list/pagination";
import RelatedDataModal from "@/app/ui/list/related-data-modal";
import SortListColumns from "@/app/ui/list/sort-list-columns";
import Table from "@/app/ui/list/table";
import TableSearch from "@/app/ui/list/table-search";
import { EyeIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SetStateAction, useEffect, useState, use } from "react";
import Image from "next/image";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Status from "@/app/ui/list/status";

//type PharmacistList = User & { roles: Roles[] } & {pharmacistProfile?: PharmacistProfile} ;
type PharmacistList = User & { pharmacistProfile?: PharmacistProfile };

type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  files?: File[];
};

type File = {
  userId?: string;
  fileName: string;
  fileUrl: string;
  type: "resume" | "logo" | "profilePicture";
};

type CompanyPermissions = {
  companyId: string;
  pharmacistId: string;
  canViewPayRate: boolean;
};

type PharmacistProfile = {
  id: string;
  userId: string;
  licenseNumber: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  email?: string;
  bio?: string;
  experienceYears?: number;
  approved: boolean;
  canViewAllCompanies: boolean;
  canViewPayRates: boolean;
  companyPermissions: CompanyPermissions[];
};

const columns = [
  {
    header: "Info",
    accessor: "info",
    className: "px-4 py-5 font-medium sm:pl-6",
  },
  {
    header: "Status",
    accessor: "status",
    className: "table-cell px-3 py-5 font-medium",
  },
  {
    header: "Permissions",
    accessor: "canViewAllCompanies",
    className: "table-cell px-3 py-5 font-medium",
  },
  {
    header: "",
    accessor: "edit",
    className: "relative py-3 pl-6 pr-3",
  },
];

export default function PharmacistsList() {
  const { firebaseUser, appUser, loading } = useAuth();
  const [isFetching, setIsFetching] = useState(true);
  const [token, setToken] = useState("");
  const [pharmacists, setPharmacists] = useState<any[]>([]);
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

  // Fetch pharmacists when token is ready
  useEffect(() => {
    const getPharmacists = async () => {
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

        const pharmacistsResponse = await fetchPharmacists(
          search,
          currentPage,
          queryParams,
          token,
        );
        setPharmacists(pharmacistsResponse?.data ?? []);
        setTotalPages(pharmacistsResponse?.meta?.totalPages ?? 1);
      } catch (err) {
        console.error("Failed to fetch pharmacists", err);
      } finally {
        setIsFetching(false);
      }
    };
    if (token) {
      getPharmacists();
    }
  }, [token, searchParams]);

  if (loading || isFetching) return <div>Loading...</div>;
  if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;

  const role = appUser.role;

  const renderRow = (item: PharmacistList) => {
    const profilePicture = item.files?.find(
      (file) => file.type === "profilePicture",
    );

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-50"
      >
        <td className="w-full py-3 pl-6 pr-3 overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-8 h-8 relative">
              {profilePicture?.fileUrl ? (
                <Image
                  src={profilePicture.fileUrl}
                  alt={`${item.firstName}'s profile`}
                  fill
                  sizes="48px"
                  className="rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <h3 className="font-semibold leading-none">
                {item.firstName} {item?.lastName}
              </h3>
              <p
                className="text-xs text-gray-500 mt-1 break-all"
                title={item.email}
              >
                {item.email}
              </p>
              <p className="text-xs text-gray-500 mt-1">{item.phone}</p>
            </div>
          </div>
          <div className="mt-1">
            <p className="text-xs text-gray-500">
              License: {item.pharmacistProfile?.licenseNumber}
            </p>
            <p className="text-xs text-gray-500">
              E-transfer email: {item.pharmacistProfile?.email}
            </p>
            <p
              className="text-xs text-gray-500 mt-1"
              title={getFullAddress(
                item.pharmacistProfile?.address,
                item.pharmacistProfile?.city,
                item.pharmacistProfile?.province,
                item.pharmacistProfile?.postalCode,
              )}
            >
              Address:{" "}
              {getFullAddress(
                item.pharmacistProfile?.address,
                item.pharmacistProfile?.city,
                item.pharmacistProfile?.province,
                item.pharmacistProfile?.postalCode,
              )}
            </p>
          </div>
        </td>
        <td className="table-cell whitespace-nowrap px-3 py-3">
          <Status
            status={
              item.pharmacistProfile?.approved === true
                ? "approved"
                : item.pharmacistProfile?.approved === false
                  ? "pending"
                  : "no-profile"
            }
          />
        </td>
        <td className="table-cell whitespace-nowrap px-3 py-3">
          {item.pharmacistProfile && (
            <>
              <p>
                <span className="font-semibold">All Pharmacies?</span>{" "}
                {item.pharmacistProfile?.canViewAllCompanies ? "Yes" : "No"}
              </p>
              {!item.pharmacistProfile?.canViewAllCompanies && (
                <p className="text-xs">
                  Can see {item.pharmacistProfile?.companyPermissions.length}{" "}
                  pharmacies
                </p>
              )}
              <p className="mt-2">
                <span className="font-semibold">All Pay Rates?</span>{" "}
                {item.pharmacistProfile?.canViewPayRates ? "Yes" : "No"}
              </p>
              {!item.pharmacistProfile?.canViewPayRates && (
                <p className="text-xs">
                  Can see{" "}
                  {
                    item.pharmacistProfile?.companyPermissions.filter(
                      (p) => p.canViewPayRate,
                    ).length
                  }{" "}
                  pharmacies' pay rates
                </p>
              )}
            </>
          )}
        </td>
        <td className="whitespace-nowrap py-3 pl-6 pr-3">
          {item.pharmacistProfile ? (
            <div className="flex justify-end gap-2">
              {item.pharmacistProfile?.canViewAllCompanies === false &&
              item.pharmacistProfile?.canViewPayRates === false ? (
                <RelatedDataModal
                  type="set_pharmacist_permissions"
                  token={token}
                  id={item?.pharmacistProfile?.id}
                  data={item?.pharmacistProfile}
                />
              ) : item.pharmacistProfile?.canViewAllCompanies === false &&
                item.pharmacistProfile?.canViewPayRates === true ? (
                <RelatedDataModal
                  type="set_allowed_companies"
                  token={token}
                  id={item?.pharmacistProfile?.id}
                  data={item?.pharmacistProfile}
                />
              ) : item.pharmacistProfile?.canViewAllCompanies === true &&
                item.pharmacistProfile?.canViewPayRates === false ? (
                <RelatedDataModal
                  type="set_allowed_pay_rates"
                  token={token}
                  id={item?.pharmacistProfile?.id}
                  data={item?.pharmacistProfile}
                />
              ) : (
                <></>
              )}
              <Link
                href={`pharmacists/${item.id}`}
                className="rounded-md border p-2 hover:bg-gray-100"
              >
                <EyeIcon className="w-5" />
              </Link>
              {role === "admin" && (
                <>
                  <FormContainer
                    table="pharmacist"
                    type="update"
                    token={token}
                    data={item.pharmacistProfile}
                  />
                  <FormContainer
                    table="pharmacist"
                    type="delete"
                    token={token}
                    id={item.pharmacistProfile?.id}
                  />
                </>
              )}
            </div>
          ) : (
            <div className="flex justify-end gap-2 px-8 mr-28">
              <RelatedDataModal
                type="link_pharmacist_profile"
                token={token}
                id={item.id}
              />
            </div>
          )}
        </td>
      </tr>
    );
  };

  const PharmacistCard = ({ item }: { item: PharmacistList }) => {
    const profilePicture = item.files?.find(
      (file) => file.type === "profilePicture",
    );

    return (
      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-4 shadow-sm">
        {/* BODY: User Info*/}
        <div className="mb-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-8 h-8 relative">
              {profilePicture?.fileUrl ? (
                <Image
                  src={profilePicture.fileUrl}
                  alt={`${item.firstName}'s profile`}
                  fill
                  sizes="48px"
                  className="rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <h3 className="font-semibold">
                {item.firstName} {item?.lastName}
              </h3>
              <p className="text-xs text-gray-500 mt-1 break-all">
                {item.email}
              </p>
              <p className="text-xs text-gray-500 mt-1">{item.phone}</p>
            </div>
          </div>
          <div className="mt-1">
            <p className="text-xs text-gray-500">
              License: {item.pharmacistProfile?.licenseNumber}
            </p>
            <p className="text-xs text-gray-500">
              E-transfer email: {item.pharmacistProfile?.email}
            </p>
            <p
              className="text-xs text-gray-500"
              title={getFullAddress(
                item.pharmacistProfile?.address,
                item.pharmacistProfile?.city,
                item.pharmacistProfile?.province,
                item.pharmacistProfile?.postalCode,
              )}
            >
              Address:{" "}
              {getFullAddress(
                item.pharmacistProfile?.address,
                item.pharmacistProfile?.city,
                item.pharmacistProfile?.province,
                item.pharmacistProfile?.postalCode,
              )}
            </p>
          </div>
        </div>

        {/* STATUS & PERMISSIONS */}
        <div className="bg-slate-50 p-3 rounded-lg mb-4">
          <div className="flex flex-col mt-1">
            <div className="max-w-[170px]">
              <Status
                status={
                  item.pharmacistProfile?.approved === true
                    ? "approved"
                    : item.pharmacistProfile?.approved === false
                      ? "pending"
                      : "no-profile"
                }
              />
            </div>
            <div className="max-w-[200px] mt-1">
              {item.pharmacistProfile && (
                <>
                  <p>
                    <span className="font-semibold">All Pharmacies?</span>{" "}
                    {item.pharmacistProfile?.canViewAllCompanies ? "Yes" : "No"}
                  </p>
                  {!item.pharmacistProfile?.canViewAllCompanies && (
                    <p className="text-xs">
                      Can see{" "}
                      {item.pharmacistProfile?.companyPermissions.length}{" "}
                      pharmacies
                    </p>
                  )}
                  <p className="mt-2">
                    <span className="font-semibold">All Pay Rates?</span>{" "}
                    {item.pharmacistProfile?.canViewPayRates ? "Yes" : "No"}
                  </p>
                  {!item.pharmacistProfile?.canViewPayRates && (
                    <p className="text-xs">
                      Can see{" "}
                      {
                        item.pharmacistProfile?.companyPermissions.filter(
                          (p) => p.canViewPayRate,
                        ).length
                      }{" "}
                      pharmacies' pay rates
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            {item.pharmacistProfile ? (
              <div className="w-full sm:w-auto">
                {item.pharmacistProfile?.canViewAllCompanies === false &&
                item.pharmacistProfile?.canViewPayRates === false ? (
                  <RelatedDataModal
                    type="set_pharmacist_permissions"
                    token={token}
                    id={item?.pharmacistProfile?.id}
                    data={item?.pharmacistProfile}
                  />
                ) : item.pharmacistProfile?.canViewAllCompanies === false &&
                  item.pharmacistProfile?.canViewPayRates === true ? (
                  <RelatedDataModal
                    type="set_allowed_companies"
                    token={token}
                    id={item?.pharmacistProfile?.id}
                    data={item?.pharmacistProfile}
                  />
                ) : item.pharmacistProfile?.canViewAllCompanies === true &&
                  item.pharmacistProfile?.canViewPayRates === false ? (
                  <RelatedDataModal
                    type="set_allowed_pay_rates"
                    token={token}
                    id={item?.pharmacistProfile?.id}
                    data={item?.pharmacistProfile}
                  />
                ) : (
                  <></>
                )}
                <div className="flex gap-2 mt-2">
                  <Link
                    href={`pharmacists/${item.id}`}
                    className="rounded-md border p-2 hover:bg-gray-100"
                  >
                    <EyeIcon className="w-5" />
                  </Link>
                  {role === "admin" && (
                    <>
                      <FormContainer
                        table="pharmacist"
                        type="update"
                        token={token}
                        data={item.pharmacistProfile}
                      />
                      <FormContainer
                        table="pharmacist"
                        type="delete"
                        token={token}
                        id={item.pharmacistProfile?.id}
                      />
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-start gap-3 px-2">
                <RelatedDataModal
                  type="link_pharmacist_profile"
                  token={token}
                  id={item.id}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AuthWrapper allowedRoles={["admin"]}>
      <div className="p-4 lg:p-8">
        <h1 className={`font-bold mb-4 text-xl md:text-2xl`}>
          Pharmacists List
        </h1>
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
          {/* TOP */}
          <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
            <TableSearch placeholder="Search pharmacists..." />
            <SortListColumns
              options={[
                { value: "firstName:asc", label: "First Name ↑" },
                { value: "firstName:desc", label: "First Name ↓" },
                { value: "lastName:asc", label: "Last Name ↑" },
                { value: "lastName:desc", label: "Last Name ↓" },
              ]}
            />
          </div>
          {/* LIST */}
          <div className="block xl:hidden mt-6">
            {pharmacists.map((item) => (
              <PharmacistCard key={item.id} item={item} />
            ))}
          </div>
          <div className="hidden xl:block">
            <div style={{ overflowX: "scroll" }}>
              <Table
                columns={columns}
                renderRow={renderRow}
                data={pharmacists}
              />
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
