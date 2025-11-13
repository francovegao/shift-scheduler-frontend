import { AuthWrapper } from "@/app/ui/authentication/auth-wrapper";
import Announcements from "@/app/ui/dashboard/notifications";
import LatestShifts from "@/app/ui/dashboard/latest-shifts";
import CardWrapperManager from "@/app/ui/dashboard/cards-manager";
import BigCalendarContainer from "@/app/ui/dashboard/big-calendar-container";

export default async function LocationManagerPage() {

  return (
    <AuthWrapper allowedRoles={["admin", "location_manager"]}>
      <main className="p-4 md:p-8">
            <h1 className={`font-bold mb-4 text-xl md:text-2xl`}>
              Location Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CardWrapperManager />
            </div>

            <div className="p-4 flex gap-4 flex-col xl:flex-row">
              {/* LEFT */}
              <div className="w-full xl:w-2/3">
                <h1 className={`font-semibold mb-4 text-xl md:text-2xl`}>
                  Pharmacy's Shifts
                </h1>
                <div className="h-full bg-white p-4 rounded-md">
                    <BigCalendarContainer type="dashboard_manager" />
                </div>
              </div>
              {/* RIGHT */}
              <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <LatestShifts />
                <Announcements />
              </div>
            </div>
      </main>
    </AuthWrapper>
  );
}