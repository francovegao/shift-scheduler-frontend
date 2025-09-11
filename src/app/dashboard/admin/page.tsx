import { lusitana } from '@/app/ui/fonts';
import CardWrapper from '@/app/ui/dashboard/cards';
import LatestShifts from '@/app/ui/dashboard/latest-shifts';
import { AuthWrapper } from '@/app/ui/authentication/auth-wrapper';
import ShiftsCalendarContainer from '@/app/ui/dashboard/shifts-calendar-container';
import Notifications from '@/app/ui/dashboard/notifications';

export default async function AdminPage({
  searchParams,
}:{
  searchParams: { [keys: string]: string | undefined};
}) {

  return (
    <AuthWrapper allowedRoles={["admin"]}>
      <main className="p-4 md:p-6">
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Admin Dashboard
        </h1>
        {/* USER CARDS */}
        <div className="p-8 grid gap-6 grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
          <CardWrapper />
        </div>
        <div className="flex gap-4 flex-col md:flex-row">
        {/* LEFT */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          {/* MIDDLE CHARTS */}
          <div className="flex gap-4 flex-col lg:flex-row">
            {/* COUNT CHART */}
            <div className="w-full lg:w-1/3 h-[450px]">
              Chart 1: Show graph of created shifts vs completed shifts every month of the year
              Option 2: Show open shifts vs taken shifts circle graph for the next month
            </div>
            {/* ATTENDANCE CHART */}
            <div className="w-full lg:w-2/3 h-[450px]">
              Chart 2: Show graph of next week with open shifts vs taken shifts
            </div>
          </div>
          {/* BOTTOM CHART */}
          <div className="w-full h-[500px]">
            Bottom: Maybe show graph of most active companies or most active relief pharmacist
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <ShiftsCalendarContainer searchParams={searchParams} />
          <LatestShifts />
          <Notifications />
        </div>
      </div>
      </main>
    </AuthWrapper>
  );
}