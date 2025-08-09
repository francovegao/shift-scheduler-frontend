import { companiesData, role, shiftsData } from "@/app/lib/data";
import BigCalendar from "@/app/ui/dashboard/big-calendar";
import { lusitana } from "@/app/ui/fonts";
import { AddPharmacist, DeletePharmacist, UpdatePharmacist } from "@/app/ui/list/buttons";
import Pagination from "@/app/ui/list/pagination";
import ApprovedStatus from "@/app/ui/list/status";
import Table from "@/app/ui/list/table";
import TableSearch from "@/app/ui/table-search";

type Shift = {
    id: number,
    locationName?: string,
    companyName: string,
    title: string,
    description?: string,
    startTime: string,
    endTime: string,
    payRate: string,
    status: string,
    pharmacist?: string,
}

const columns = [
  {
    header: "Info",
    accessor: "info",
    className: "px-4 py-5 font-medium sm:pl-6",
  },
  {
    header: "Date",
    accessor: "date",
    className: "hidden table-cell px-3 py-5 font-medium",
  },
  {
    header: "Start - End time",
    accessor: "startEndTime",
    className: "hidden table-cell px-3 py-5 font-medium",
  },
  {
    header: "Rate",
    accessor: "payRate",
    className: "hidden sm:table-cell px-3 py-5 font-medium",
  },
  {
    header: "Status",
    accessor: "status",
    className: "hidden sm:table-cell px-3 py-5 font-medium",
  },
  {
    header: "Pharmacist",
    accessor: "pharmacist",
    className: "hidden lg:table-cell px-3 py-5 font-medium",
  },
  {
    header: "",
    accessor: "edit",
    className:"relative py-3 pl-6 pr-3"
  },
];

export default async function ShiftsList() {
    const totalPages=4  ///Modify for use with pagination

    const renderRow = (item: Shift) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-50"
    >
      <td className="flex items-center gap-4 whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.companyName}</h3>
          <p className="text-xs text-gray-500">{item?.locationName}</p>
        </div>
      </td>
      <td className="hidden table-cell whitespace-nowrap px-3 py-3">{item.startTime.slice(0,10)}</td>
      <td className="hidden table-cell whitespace-nowrap px-3 py-3">{item.startTime.slice(11,16)}-{item.endTime.slice(11,16)}</td>
      <td className="hidden sm:table-cell whitespace-nowrap px-3 py-3">{item.payRate}</td>
      <td className="hidden sm:table-cell whitespace-nowrap px-3 py-3">
        <ApprovedStatus status={item.status} />
      </td>
      <td className="hidden lg:table-cell whitespace-nowrap px-3 py-3">{item.pharmacist}</td>
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
            {/*//TODO UPDATE BUTTONS */}
          <UpdatePharmacist id={item.id} /> 
          {role === "admin" && (
             <DeletePharmacist id={item.id} /> //TODO UPDATE BUTTONS
            //<FormModal table="teacher" type="delete" id={item.id}/>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 lg:p-8">
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
            Shifts List
        </h1>
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <TableSearch placeholder="Search shifts..." />
                {role === "admin" && (
                <AddPharmacist /> //TODO UPDATE BUTTONS
                )}
            </div>
            {/* LIST */}
            <div style={{overflowX: 'scroll'}}>
                <Table columns={columns} renderRow={renderRow} data={shiftsData}/>
            </div>
            {/* PAGINATION */}
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
                      <div className="w-full xl:w-2/3">
                          <BigCalendar/>
                      </div>
    </div>
  );
}