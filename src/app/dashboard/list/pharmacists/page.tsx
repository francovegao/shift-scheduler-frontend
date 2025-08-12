import { pharmacistsData, role } from "@/app/lib/data";
import { lusitana } from "@/app/ui/fonts";
import { AddPharmacist, DeletePharmacist, UpdatePharmacist } from "@/app/ui/list/buttons";
import FormModal from "@/app/ui/list/form-modal";
import Pagination from "@/app/ui/list/pagination";
import ApprovedStatus from "@/app/ui/list/status";
import Table from "@/app/ui/list/table";
import TableSearch from "@/app/ui/table-search";
import Image from "next/image";

type Pharmacist = {
    id: number,
    licenseNumber: string,
    name: string,
    email: string,
    photo: string,
    phone: string,
    address: string,
    approved: boolean,
}

const columns = [
  {
    header: "Info",
    accessor: "info",
    className: "px-4 py-5 font-medium sm:pl-6",
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
    header: "",
    accessor: "edit",
    className:"relative py-3 pl-6 pr-3"
  },
];

export default async function PharmacistsList() {
    const totalPages=4  ///Modify for use with pagination

    const renderRow = (item: Pharmacist) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-50"
    >
      <td className="flex items-center gap-4 whitespace-nowrap py-3 pl-6 pr-3">
        <Image
          src={item.photo}
          alt=""
          width={40}
          height={40}
          className="md:hidden lg:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell whitespace-nowrap px-3 py-3">{item.licenseNumber}</td>
      <td className="hidden sm:table-cell whitespace-nowrap px-3 py-3">
        <ApprovedStatus status={item.approved ? "approved":"pending"} />
      </td>
      <td className="hidden lg:table-cell whitespace-nowrap px-3 py-3">{item.email}</td>
      <td className="hidden lg:table-cell whitespace-nowrap px-3 py-3">{item.phone}</td>
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          {role === "admin" && (
            <>
              {/*<UpdatePharmacist id={item.id} />*/}
              <FormModal table="pharmacist" type="update" id={item.id} />
              {/*<DeletePharmacist id={item.id} />*/}
              <FormModal table="pharmacist" type="delete" id={item.id} />
             </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
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
                <Table columns={columns} renderRow={renderRow} data={pharmacistsData}/>
            </div>
            {/* PAGINATION */}
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    </div>
  );
}