"use client";

import { FunnelIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SetStateAction } from "react";

export default function FilterUserRole({
  options,
}: {
  options: { value: string; label: string }[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilterChange = (userRole: {
    target: { value: SetStateAction<string> };
  }) => {
    console.log(`Filtering... ${userRole.target.value}`);
    const filteredUserRole = userRole.target.value.toString();

    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (filteredUserRole !== "") {
      params.set("userRole", filteredUserRole);
    } else {
      params.delete("userRole");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        User Role
      </label>
      <select
        onChange={handleFilterChange}
        defaultValue={searchParams.get("userRole")?.toString()}
        className="peer block w-full rounded-md border border-surface-muted py-[9px] pl-8 text-sm outline-1 text-tx-body-muted"
      >
        <option value="" selected>
          User Role
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FunnelIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-tx-body-muted peer-focus:text-tx-primary" />
    </div>
  );
}
