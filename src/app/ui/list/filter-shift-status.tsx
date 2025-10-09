'use client';

import { FunnelIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SetStateAction} from "react";

 
 export default function FilterShiftStatus() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

  const handleFilterChange = (status: { target: { value: SetStateAction<string>; }; }) => {
    console.log(`Filtering... ${status.target.value}`);
    const filteredStatus = status.target.value.toString()
    
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (filteredStatus!=='') {
      params.set('status', filteredStatus);
    } else {
      params.delete('status');
    }
    replace(`${pathname}?${params.toString()}`);
  };
 
 return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Shift Status
      </label>
      <select
      onChange={handleFilterChange}
      defaultValue={searchParams.get('status')?.toString()}
      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-8 text-sm outline-1 text-gray-500"
        >
          <option value="" selected>Status</option>
          <option value="taken">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="open">Open</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <FunnelIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}