import { AuthWrapper } from "@/app/ui/authentication/auth-wrapper";
import Announcements from "@/app/ui/dashboard/notifications";
import CardWrapperPharmacist from "@/app/ui/dashboard/cards-pharmacist";
import ShiftsCalendarContainer from '@/app/ui/dashboard/shifts-calendar-container';
import { lusitana } from "@/app/ui/fonts";
import BigCalendarContainer from "@/app/ui/dashboard/big-calendar-container";

export default async function PharmacistPage({
  searchParams,
}:{
  searchParams: { [keys: string]: string | undefined};
}) {

  return (
    <AuthWrapper allowedRoles={["admin", "relief_pharmacist"]}>
      <main className="p-4 md:p-8">
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
              Pharmacist Page Dashboard
            </h1>
            {/* USER CARDS */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CardWrapperPharmacist />
            </div>
            <div className="p-4 flex gap-4 flex-col xl:flex-row">
              {/* LEFT */}
              <div className="w-full xl:w-2/3">
                <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                  My Shifts
                </h2>
                <div className="h-full bg-white p-4 rounded-md">
                    <BigCalendarContainer type="dashboard" />
                </div>
              </div>
              {/* RIGHT */}
              <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <ShiftsCalendarContainer searchParams={searchParams} />
                <Announcements />
              </div>
            </div>
      </main>
    </AuthWrapper>
  );
}