import { AuthWrapper } from "@/app/ui/authentication/auth-wrapper";
import Announcements from "@/app/ui/dashboard/notifications";
import CardWrapperPharmacist from "@/app/ui/dashboard/cards-pharmacist";
import ShiftsCalendarContainer from '@/app/ui/dashboard/shifts-calendar-container';
import BigCalendarContainer from "@/app/ui/dashboard/big-calendar-container";
import PharmacistAccessGuard from "@/app/ui/authorization/pharmacists-access-guard";

export default async function PharmacistPage({
  searchParams,
}:{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {

  return (
    <AuthWrapper allowedRoles={["admin", "relief_pharmacist"]}>
      <PharmacistAccessGuard>
        <main className="p-4 md:p-8">
              <h1 className={`font-bold mb-4 text-xl md:text-2xl`}>
                Pharmacist Dashboard
              </h1>
              {/* USER CARDS */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <CardWrapperPharmacist />
              </div>
              <div className="p-4 flex gap-4 flex-col xl:flex-row">
                {/* LEFT */}
                <div className="w-full xl:w-2/3">
                  <h1 className={`font-semibold mb-4 text-xl md:text-2xl`}>
                    My Shifts
                  </h1>
                  <div className="h-full bg-white p-4 rounded-md">
                      <BigCalendarContainer type="dashboard_pharmacist" />
                  </div>
                </div>
                {/* RIGHT */}
                <div className="w-full xl:w-1/3 flex flex-col gap-8">
                  <ShiftsCalendarContainer searchParams={searchParams} />
                  <Announcements />
                </div>
              </div>
        </main>
      </PharmacistAccessGuard>
    </AuthWrapper>
  );
}