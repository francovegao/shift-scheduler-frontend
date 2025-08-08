import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";

export default function SchedulerLogo() {
  return (
    <div
      className={` flex flex-row items-center leading-none text-white`}
    >
      <BuildingStorefrontIcon className="h-12 w-12" />
      <p className="text-[16px]">Relief Scheduler</p>
    </div>
  );
}