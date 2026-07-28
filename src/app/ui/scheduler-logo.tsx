import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";

export default function SchedulerLogo() {
  return (
    <div className="flex flex-row md:flex-col items-center md:justify-center leading-none text-white gap-3 md:gap-2">
      <BuildingStorefrontIcon className="h-10 md:h-20 flex-shrink-0" />
      <div className="space-y-1 whitespace-nowrap flex-shrink-0 md:text-center">
        <p className="text-[16px] md:text-[20px]">Shift Happens</p>
        <p className="text-[9px] md:text-[11px]">
          by CurisRx & Pharm Drugstore
        </p>
      </div>
    </div>
  );
}
