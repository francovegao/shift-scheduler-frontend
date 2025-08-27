import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";

export default function SchedulerLogo() {
  return (
    <div
      className={` flex flex-row items-center leading-none text-white`}
    >
      <BuildingStorefrontIcon className="h-12 md:h-24" />
      <p className="text-[16px] md:text-[20px]">Pharmacist Scheduler</p>
    </div>
  );
}