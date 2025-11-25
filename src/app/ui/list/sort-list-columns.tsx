'use client';

import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SetStateAction} from "react";

 
 export default function SortListColumns({ 
  options 
}: {
   options: { value: string; label: string; }[]; }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

  const handleFilterChange = (status: { target: { value: SetStateAction<string>; }; }) => {
    console.log(`Sorting... ${status.target.value}`);
    const sortingValues = status.target.value.toString()
    
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (sortingValues!=='') {
      params.set('sortBy', sortingValues.split(":")[0]);
      params.set("sortOrder", sortingValues.split(":")[1]);
    } else {
      params.delete('sortBy');
      params.delete('sortOrder');
    }
    replace(`${pathname}?${params.toString()}`);
  };
 
 return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Sort List
      </label>
      <select
      onChange={handleFilterChange}
      defaultValue={(searchParams.get('sortBy')?.toString()||'')+':'+
                    (searchParams.get('sortOrder')?.toString()||'')}
      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-8 text-sm outline-1 text-gray-500"
        >
          <option value="" selected>Sort</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}