"use client";

import { AuthWrapper } from "@/app/ui/authentication/auth-wrapper";
import { SetStateAction, useEffect, useState } from "react";
import { useAuth } from "@/app/ui/context/auth-context";
import ReportOptionSelector from "@/app/ui/reports/report-options-selector";
import TableSearch from "@/app/ui/list/table-search";
import Table from "@/app/ui/list/table";
import Pagination from "@/app/ui/list/pagination";
import { useSearchParams } from "next/navigation";
import { fetchEmailTemplates } from "@/app/lib/data";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type EmailTemplate = {
  id: string;
  key: string;
  name: string;
  description?: string;
  subjectTemplate: string;
  htmlTemplate: string;
  textTemplate?: string;
  variables?: any;

  isActive: boolean;
  allowManualSend: boolean;

  updatedBy?: any;
  versions?: any[];
};

const columns = [
  {
    header: "Name",
    accessor: "name",
    className: "px-4 py-5 font-medium sm:pl-6",
  },
  {
    header: "Description",
    accessor: "description",
    className: "table-cell px-3 py-5 font-medium",
  },
  {
    header: "Active",
    accessor: "isActive",
    className: "table-cell px-3 py-5 font-medium",
  },
  {
    header: "Updated By",
    accessor: "updatedBy",
    className: "table-cell px-3 py-5 font-medium",
  },
  {
    header: "",
    accessor: "edit",
    className: "relative py-3 pl-6 pr-3",
  },
];

export default function EmailTemplatesList() {
  const { firebaseUser, appUser, loading } = useAuth();
  const [isFetching, setIsFetching] = useState(true);
  const [token, setToken] = useState("");
  const [templates, setTemplates] = useState<any[]>([]);
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

  // Fetch templates client-side
  useEffect(() => {
    const getTemplates = async () => {
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

        const templatesResponse = await fetchEmailTemplates(
          search,
          currentPage,
          queryParams,
          token,
        );
        setTemplates(templatesResponse?.data ?? []);
        setTotalPages(templatesResponse?.meta?.totalPages ?? 1);
      } catch (err) {
        console.error("Failed to fetch templates", err);
      } finally {
        setIsFetching(false);
      }
    };
    if (token) {
      getTemplates();
    }
  }, [token, searchParams]);

  if (loading || isFetching) return <div>Loading...</div>;
  if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;

  const renderRow = (item: EmailTemplate) => {
    return (
      <tr
        key={item.id}
        className="border-b border-surface-muted even:bg-surface-muted/30 text-sm hover:bg-surface-muted"
      >
        <td className="min-w-0 py-3 pl-6 pr-3 overflow-hidden">
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-xs text-tx-body-muted">Key: {item.key}</p>
          </div>
        </td>
        <td className="table-cell flex items-center gap-4 py-2 pl-6 pr-2 w-64">
          <div className="flex flex-col">
            <p className="text-xs break-words">{item?.description}</p>
          </div>
        </td>
        <td className="table-cell whitespace-nowrap px-3 py-3">
          <div className="flex flex-col">
            <p className="text-xs">{item?.isActive ? "Yes" : "No"}</p>
          </div>
        </td>
        <td className="table-cell whitespace-nowrap px-3 py-3">
          <div className="flex flex-col">
            <p className="text-xs">{item?.updatedBy?.firstName}</p>
          </div>
        </td>
        <td className="whitespace-nowrap py-3 pl-6 pr-3">
          <div className="flex justify-end gap-2">
            <Link
              href={`email-templates/${item.key}`}
              className="rounded-md border p-2 hover:bg-gray-100 hover:text-primary"
            >
              <Cog6ToothIcon className="w-5" />
            </Link>
          </div>
        </td>
      </tr>
    );
  };

  const EmailTemplatesCard = ({ item }: { item: EmailTemplate }) => {
    return (
      <div className="bg-surface p-4 rounded-xl border border-surface-muted dark:border-zinc-800 mb-4 shadow-sm">
        {/* BODY: User Info*/}
        <div className="mb-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col justify-center gap-2">
              <h3 className="font-semibold leading-none">{item.name}</h3>
              <p className="text-xs text-tx-body-muted mt-1 break-all">
                Key: {item.key}
              </p>
              <h3 className="text-xs font-medium mt-1 break-words">
                {item.description}
              </h3>
            </div>
          </div>
        </div>

        {/* EXTRA INFO */}
        <div className="bg-surface-muted/50 p-3 rounded-lg mb-4">
          <div className="flex flex-col">
            <p className="text-xs break-words">
              Updated by: {item?.updatedBy?.firstName}
            </p>
          </div>
        </div>

        {/* STATUS */}
        <div className="bg-surface-muted/50 p-3 rounded-lg mb-4">
          <p className="text-xs">Active: {item?.isActive ? "Yes" : "No"}</p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-3 border-t border-surface-muted">
          <div className="flex gap-3">
            <Link
              href={`email-templates/${item.key}`}
              className="rounded-md border p-2 hover:bg-gray-100 hover:text-primary"
            >
              <Cog6ToothIcon className="w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AuthWrapper allowedRoles={["admin"]}>
      <div className="p-4 lg:p-8">
        <h1 className={`font-bold mb-4 text-xl md:text-2xl`}>
          Email Templates
        </h1>
        <div className="bg-surface p-4 rounded-md flex-1 m-4 mt-0">
          {/* TOP */}
          <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
            <TableSearch placeholder="Search email templates..." />
          </div>
          {/* LIST */}
          <div className="block lg:hidden mt-6">
            {templates.map((item) => (
              <EmailTemplatesCard key={item.id} item={item} />
            ))}
          </div>
          <div className="hidden lg:block">
            <div style={{ overflowX: "scroll" }}>
              <Table columns={columns} renderRow={renderRow} data={templates} />
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
