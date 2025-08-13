import Announcements from "@/app/ui/dashboard/announcements";
import BigCalendar from "@/app/ui/dashboard/big-calendar";
import FormModal from "@/app/ui/list/form-modal";
import ShiftsGraph from "@/app/ui/list/shifts-graph";
import { 
    UserCircleIcon, PhoneIcon, EnvelopeIcon, 
    IdentificationIcon, MapPinIcon, CheckCircleIcon,
    ClockIcon, BuildingStorefrontIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function SinglePharmacistPage() {

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
        {/* LEFT */}
        <div className="w-full xl:w-2/3">
            {/* TOP */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* USER INFO CARD */}
                <div className="bg-blue-200 py-6 px-4 rounded-md flex-1 flex gap-4">
                    <div className="w-1/3">
                        <UserCircleIcon className="w-36 h-36 text-gray-600" />
                    </div>
                    <div className="w-2/3 flex flex-col justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-semibold">Leonard Snyder</h1>
                            <FormModal
                                table="pharmacist"
                                type="update"
                                data={{
                                    firstName: "Leonard",
                                    lastName: "Snyder",
                                    email: "example@gmail.com",
                                    phone: "+1 236 833 5241",
                                    resume: "",
                                    licenseNumber: "234789",
                                    address: "123 Fake Street",
                                    city: "Calgary",
                                    province: "AB",
                                    postalCode: "V3K0J2",
                                    etransferEmail: "",
                                    bio: "Lorem ipsum, dolor sit amet consectetyr adipisicing elit",
                                    experienceYears: 9,
                                    approved: true,
                                }}
                            />
                        </div>
                        <p className="text-sm text-gray-500">
                            Lorem ipsum, dolor sit amet consectetyr adipisicing elit.
                        </p>
                        <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <IdentificationIcon className="w-5"/>
                                <span>234789</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <MapPinIcon className="w-5"/>
                                <span>Calgary</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <EnvelopeIcon className="w-5"/>
                                <span>example@gmail.com</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <PhoneIcon className="w-5"/>
                                <span>+1 236 833 5241</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* SMALL CARDS */}
                <div className="flex-1 flex gap-4 justify-between flex-wrap">
                    {/* CARD */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <CheckCircleIcon className="w-6 h-6" />
                        <div className="">
                            <h1 className="text-xl font-semibold">10</h1>
                            <span className="text-sm text-gray-400">Completed Shifts</span>
                        </div>
                    </div>
                    {/* CARD */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <XCircleIcon className="w-6 h-6" />
                        <div className="">
                            <h1 className="text-xl font-semibold">2</h1>
                            <span className="text-sm text-gray-400">Cancelled Shifts</span>
                        </div>
                    </div>
                    {/* CARD */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <ClockIcon className="w-6 h-6" />
                        <div className="">
                            <h1 className="text-xl font-semibold">3</h1>
                            <span className="text-sm text-gray-400">Scheduled Shifts</span>
                        </div>
                    </div>
                    {/* CARD */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <BuildingStorefrontIcon className="w-6 h-6" />
                        <div className="">
                            <h1 className="text-xl font-semibold">3</h1>
                            <span className="text-sm text-gray-400">Locations Worked</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* BOTTOM */}
            <div className="mt-4 rounded-md p-4 h-[800px]">
               <h1 className="text-xl font-semibold">Pharmacist&apos;s Schedule</h1>
               <BigCalendar />
            </div>
        </div>
        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-md">
                <h1 className="text-xl font-semibold">Shortcuts</h1>
                <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
                    <Link className="p-3 rounded-md bg-blue-50" href="/">Pharmacist&apos;s Shifts</Link>
                    <Link className="p-3 rounded-md bg-purple-50" href="/">Pharmacist&apos;s Files</Link>
                    <Link className="p-3 rounded-md bg-yellow-50" href="/">Pharmacist&apos;s Information</Link>
                    <Link className="p-3 rounded-md bg-pink-50" href="/">Pharmacist&apos;s Contact</Link>
                    <Link className="p-3 rounded-md bg-blue-50" href="/">Pharmacist&apos;s Reports</Link>
                </div>
            </div>
            <ShiftsGraph />
            <Announcements />
        </div>
    </div>
    
  );
}