import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
//import { LatestInvoice } from '@/app/lib/definitions';
//import { fetchLatestInvoices } from '@/app/lib/data';

//TEMPORARY
const latestInvoices = [
  {
    id: 'Page A',
    image_url: "https://picsum.photos/200/300",
    name: 2400,
    email: 2400,
    amount: 2400,
  },
  {
    id: 'Page B',
    image_url: "https://picsum.photos/200/300",
    name: 1398,
    email: 1398,
    amount: 2210,
  },
  {
    id: 'Page C',
    image_url: "https://picsum.photos/200/300",
    name: 9800,
    email: 9800,
    amount: 2290,
  },
  {
    id: 'Page D',
    image_url: "https://picsum.photos/200/300",
    name: 3908,
    email: 3908,
    amount: 2000,
  },
  {
    id: 'Page E',
    image_url: "https://picsum.photos/200/300",
    name: 4800,
    email: 3,
    amount: 2181,
  },
  {
    id: 'Page F',
    image_url: "https://picsum.photos/200/300",
    name: 3800,
    email: 3800,
    amount: 2500,
  },
  {
    id: 'Page G',
    image_url: "https://picsum.photos/200/300",
    name: 4300,
    email: 4300,
    amount: 2100,
  },
];

/*export default async function LatestInvoices({
  latestInvoices,
}: {
  latestInvoices: LatestInvoice[];
}) {*/
  export default async function LatestShifts(){ //Remove props
  //const latestInvoices = await fetchLatestInvoices();
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Latest Shifts
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">

        <div className="bg-white px-6">
          {latestInvoices.map((invoice, i) => {
            return (
              <div
                key={invoice.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                    Image
                  {/*<Image
                    src={invoice.image_url}
                    alt={`${invoice.name}'s profile picture`}
                    className="mr-4 rounded-full"
                    width={32}
                    height={32}
                  />*/}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {invoice.name}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {invoice.email}
                    </p>
                  </div>
                </div>
                <p
                  className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                >
                  {invoice.amount}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
