import { AuthWrapper } from "@/app/ui/authentication/auth-wrapper";
import Announcements from "@/app/ui/dashboard/notifications";
import BigCalendar from "@/app/ui/dashboard/big-calendar";
import CardWrapper from "@/app/ui/dashboard/cards-admin";
import LatestShifts from "@/app/ui/dashboard/latest-shifts";
import { lusitana } from "@/app/ui/fonts";

export default async function CompanyManagerPage() {

  return (
    <AuthWrapper allowedRoles={["admin", "pharmacy_manager"]}>
      <main className="p-4 md:p-8">
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
              Company Page Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CardWrapper />
            </div>

            <div className="p-4 flex gap-4 flex-col xl:flex-row">
              {/* LEFT */}
              <div className="w-full xl:w-2/3">
                <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                  Company's Shifts
                </h2>
                <div className="h-full bg-white p-4 rounded-md">
                    <BigCalendar/>
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