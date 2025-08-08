import Announcements from "@/app/ui/dashboard/announcements";
import BigCalendar from "@/app/ui/dashboard/big-calendar";
import CardWrapper from "@/app/ui/dashboard/cards";
import ShiftsCalendar from "@/app/ui/dashboard/shifts-calendar";
import { lusitana } from "@/app/ui/fonts";

export default async function PharmacistPage() {

  return (
    <main className="p-4 md:p-8">
          <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
            Pharmacist Page Dashboard
          </h1>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <CardWrapper />
          </div>

          <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
            {/* LEFT */}
            <div className="w-full md:col-span-4">
              <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Scheduled Shifts
              </h2>
              <div className="w-full xl:w-2/3">
                  <BigCalendar/>
              </div>
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
              <ShiftsCalendar />
              <Announcements />
            </div>
          </div>
    </main>
  );
}