import { companiesData, fetchCompanies, fetchLocations, role } from "@/app/lib/data";
import { lusitana } from "@/app/ui/fonts";
import { AddPharmacist, DeletePharmacist, UpdatePharmacist } from "@/app/ui/list/buttons";
import FormModal from "@/app/ui/list/form-modal";
import Pagination from "@/app/ui/list/pagination";
import ApprovedStatus from "@/app/ui/list/status";
import Table from "@/app/ui/list/table";
import TableSearch from "@/app/ui/table-search";
import Link from "next/link";
import { EyeIcon } from "@heroicons/react/24/outline";

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

const renderRow = (item: Company) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-50"
    >
      <td className="flex items-center gap-4 whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
        </div>
      </td>
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
              {/* <UpdatePharmacist id={item.id} /> */}
              <FormModal table="company" type="update" id={item.id}/>
              {/* <DeletePharmacist id={item.id} /> */}
              <FormModal table="company" type="delete" id={item.id}/>
            </>
          )}
        </div>
      </td>
    </tr>
  );

export default async function CompaniesList({
  searchParams,
  }:{
    searchParams: Promise< { [key: string]: string | undefined} >;
  }){

    const searchParameters = await searchParams;
    const query = searchParameters?.query || '';
    const currentPage = Number(searchParameters?.page) || 1;

    const companiesResponse = await fetchCompanies(query, currentPage);
    const companies = companiesResponse?.data;
    const totalPages=companiesResponse.meta?.totalPages;

  return (
    <div className="p-4 lg:p-8">
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
            Companies List
        </h1>
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <TableSearch placeholder="Search companies..." />
                {role === "admin" && (
                //<AddPharmacist />
                <FormModal table="company" type="create" />
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
  );
}