'use client';

import { CurrencyDollarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

 
 export default function FilterPayRate() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleRateChange = useDebouncedCallback((rate, type: string) => {
        console.log(`Filtering pay rate... ${rate}`);
        const params = new URLSearchParams(searchParams);

            if (type === 'minRate') {
            if (rate) {
                params.set('minRate', rate);
            } else {
                params.delete('minRate');
            }
            } else if (type === 'maxRate') {
            if (rate) {
                params.set('maxRate', rate);
            } else {
                params.delete('maxRate');
            }
            }
            
            params.set('page', '1');

            // Replace URL without triggering a full page reload
            replace(`${pathname}?${params.toString()}`);
        }, 2000);
 
 return (
    <div className="relative flex flex-1 flex-shrink-0 items-center gap-2">             
        <div className="relative flex-1">
            <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-8 text-sm outline-1 placeholder:text-gray-500"
                placeholder="Min."
                type="number"
                min="0"
                max="150"
                onChange={(rate) => handleRateChange(rate.target.value, 'minRate')}
                defaultValue={searchParams.get('minRate')?.toString()}
            />
            <CurrencyDollarIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>

        <div className="relative flex-1">
            <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-8 text-sm outline-1 placeholder:text-gray-500"
                placeholder="Max."
                type="number"
                min="0"
                max="150"
                onChange={(rate) => handleRateChange(rate.target.value, 'maxRate')}
                defaultValue={searchParams.get('maxRate')?.toString()}
            />    
            <CurrencyDollarIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
    </div>
  );
}