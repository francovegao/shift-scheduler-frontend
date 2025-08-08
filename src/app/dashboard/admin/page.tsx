import { lusitana } from '@/app/ui/fonts';
import CardWrapper from '@/app/ui/dashboard/cards';
import LatestShifts from '@/app/ui/dashboard/latest-shifts';
import ShiftsCalendar from '@/app/ui/dashboard/shifts-calendar';
import Announcements from '@/app/ui/dashboard/announcements';

export default async function AdminPage() {

  return (
    <main className="p-6 md:p-12">
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Admin Page Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <CardWrapper />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
          <ShiftsCalendar />
          <LatestShifts />
          <Announcements />
      </div>
    </main>
  );
}