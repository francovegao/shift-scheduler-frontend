'use client';

import ShiftsGraph from "@/app/ui/list/shifts-graph";
import { 
    UserCircleIcon, PhoneIcon, EnvelopeIcon, 
    IdentificationIcon, MapPinIcon, CheckCircleIcon,
    ClockIcon, BuildingStorefrontIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { SetStateAction, useEffect, useState, use } from "react";
import { useAuth } from "@/app/ui/context/auth-context";
import { fetchOnePharmacist } from "@/app/lib/data";
import FormContainer from "@/app/ui/list/form-container";
import BigCalendarContainer from "@/app/ui/dashboard/big-calendar-container";
import { getFullAddress } from "@/app/lib/utils";
import { notFound } from "next/navigation";

export default function SinglePharmacistPage({
    params,
}:{
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    const { firebaseUser, appUser, loading } = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [token, setToken] = useState("");
    const [pharmacist, setPharmacist] = useState<any | null>(null);
    const [counts, setCounts] = useState<any | null>(null);

    // Get token
    useEffect(() => {
        if (firebaseUser) {
        firebaseUser.getIdToken().then((idToken: SetStateAction<string>) => {
            setToken(idToken);
        });
        }
    }, [firebaseUser]);

    // Fetch pharmacist when token is ready
    useEffect(() => {
    const getPharmacist = async () => {
        setIsFetching(true);
        try {
        const pharmacistResponse = await fetchOnePharmacist(id, token);
        setPharmacist(pharmacistResponse.data ?? null);
        setCounts(pharmacistResponse.meta ?? null);
        } catch (err) {
        console.error("Failed to fetch pharmacist", err);
        } finally {
        setIsFetching(false);
        }
    };
    if (token){ getPharmacist() };
    }, [token, id]);

    if (loading || isFetching) return <div>Loading...</div>;
    if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;
    if(!pharmacist) { notFound(); }

    const role = appUser.role;

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
        {/* LEFT */}
        <div className="w-full xl:w-2/3">
            {/* TOP */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* USER INFO CARD */}
                <div className="bg-primary py-6 px-4 rounded-md flex-1 flex gap-4 text-white">
                    <div className="w-1/3">
                        <UserCircleIcon className="w-36 h-36" />
                        {role === "admin" && (
                            <div className="grid grid-cols-2 gap-2">
                                <div className="">
                                    <FormContainer
                                        table="user"
                                        type="update"
                                        token={token}
                                        data={pharmacist}
                                    />
                                    <p className="text-xs mt-2">Edit User</p>
                                </div>
                                <div className="">
                                    <FormContainer
                                        table="pharmacist"
                                        type="update"
                                        token={token}
                                        data={pharmacist.pharmacistProfile}
                                    />
                                    <p className="text-xs mt-2">Edit Pharmacist Profile</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-2/3 flex flex-col justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-semibold">{pharmacist?.firstName+ " " + pharmacist?.lastName}</h2>

                        </div>
                        <p className="text-sm">
                            {pharmacist.pharmacistProfile.bio || "Add a bio to show it here"}
                        </p>
                        <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <IdentificationIcon className="w-5"/>
                                <span>{pharmacist.pharmacistProfile.licenseNumber || "Add a license number"}</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <MapPinIcon className="w-5"/>
                                <span>{getFullAddress(pharmacist.pharmacistProfile.address, pharmacist.pharmacistProfile.city, pharmacist.pharmacistProfile.province, pharmacist.pharmacistProfile.postalCode)}</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <EnvelopeIcon className="w-5"/>
                                <span>{pharmacist.email || "Add an email"}</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <PhoneIcon className="w-5"/>
                                <span>{pharmacist.phone || "Add a phone number"}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* SMALL CARDS */}
                <div className="flex-1 flex gap-4 justify-between flex-wrap text-white">
                    {/* CARD */}
                    <div className="bg-complementary-two p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <BuildingStorefrontIcon className="w-6 h-6" />
                        <div className="">
                            <h2 className="text-xl font-semibold">{counts?.totalPharmacies || "No data"}</h2>
                            <span className="text-sm">Locations Worked</span>
                        </div>
                    </div>
                    {/* CARD */}
                    <div className="bg-primary p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <ClockIcon className="w-6 h-6" />
                        <div className="">
                            <h2 className="text-xl font-semibold">{counts?.totalTaken || "No data"}</h2>
                            <span className="text-sm">Scheduled Shifts</span>
                        </div>
                    </div>
                    {/* CARD */}
                    <div className="bg-secondary p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <CheckCircleIcon className="w-6 h-6" />
                        <div className="">
                            <h2 className="text-xl font-semibold">{counts?.totalCompleted || "No data"}</h2>
                            <span className="text-sm">Completed Shifts</span>
                        </div>
                    </div>
                    {/* CARD */}
                    <div className="bg-complementary-one p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <XCircleIcon className="w-6 h-6" />
                        <div className="">
                            <h2 className="text-xl font-semibold">{counts?.totalCancelled || "No data"}</h2>
                            <span className="text-sm">Cancelled Shifts</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* BOTTOM */}
            <div className="mt-4 rounded-md p-4 h-[800px] mb-4">
               <h1 className="text-xl font-semibold">Pharmacist&apos;s Schedule</h1>
               <BigCalendarContainer type="single_pharmacist" id={id} />
            </div>
        </div>
        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-md">
                <h1 className="text-xl font-semibold">Shortcuts</h1>
                <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500 text-white font-medium">
                    <Link className="p-3 rounded-md bg-secondary" href={`/dashboard/shifts?pharmacistId=${pharmacist.pharmacistProfile.id}`}>Pharmacist&apos;s Shifts</Link>
                    <Link className="p-3 rounded-md bg-complementary-one" href="/">Pharmacist&apos;s Reports</Link>
                    <Link className="p-3 rounded-md bg-complementary-two" href="/">Pharmacist&apos;s Files</Link>
                    <Link className="p-3 rounded-md bg-secondary" href="/">Pharmacist&apos;s Notifications</Link>
                    <Link className="p-3 rounded-md bg-complementary-one" href="/">Pharmacist&apos;s Contact</Link>
                </div>
            </div>
            <ShiftsGraph data={counts?.monthlyCounts} />
        </div>
    </div>
    
  );
}