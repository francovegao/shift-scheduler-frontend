'use client';

import ShiftsGraph from "@/app/ui/list/shifts-graph";
import { 
    UserCircleIcon, PhoneIcon, EnvelopeIcon, 
    CalendarIcon, MapPinIcon, CheckCircleIcon,
    ClockIcon, BuildingStorefrontIcon, XCircleIcon,
    BuildingOfficeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useAuth } from "@/app/ui/context/auth-context";
import { SetStateAction, useEffect, useState, use } from "react";
import FormContainer from "@/app/ui/list/form-container";
import { fetchOneLocation } from "@/app/lib/data";
import { getFullAddress } from "@/app/lib/utils";
import BigCalendarContainer from "@/app/ui/dashboard/big-calendar-container";
import { notFound } from "next/navigation";

export default function SingleLocationPage({
    params,
}:{
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    const { firebaseUser, appUser, loading } = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [token, setToken] = useState("");
    const [location, setLocation] = useState<any | null>(null);
    const [counts, setCounts] = useState<any | null>(null);

    // Get token
    useEffect(() => {
        if (firebaseUser) {
        firebaseUser.getIdToken().then((idToken: SetStateAction<string>) => {
            setToken(idToken);
        });
        }
    }, [firebaseUser]);

    // Fetch location when token is ready
    useEffect(() => {
    const getLocation = async () => {
        setIsFetching(true);
        try {
        const locationResponse = await fetchOneLocation(id, token);
        setLocation(locationResponse.data ?? null);
        setCounts(locationResponse.meta ?? null);
        } catch (err) {
        console.error("Failed to fetch location", err);
        } finally {
        setIsFetching(false);
        }
    };
    if (token){ getLocation() };
    }, [token, id]);

    

    if (loading || isFetching) return <div>Loading...</div>;
    if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;
    if(!location) { notFound(); }

    const role = appUser.role;
    
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
        {/* LEFT */}
        <div className="w-full xl:w-2/3">
            {/* TOP */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* USER INFO CARD */}
                <div className="bg-blue-200 py-6 px-4 rounded-md flex-1 flex gap-4">
                    <div className="w-1/3">
                        <BuildingStorefrontIcon className="w-36 h-36 text-gray-600" />
                    </div>
                    <div className="w-2/3 flex flex-col justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-semibold">{location?.name }</h1>
                            {role === "admin" && (
                                <FormContainer
                                    table="location"
                                    type="update"
                                    token={token}
                                    data={location}
                                />
                            )}
                        </div>
                        <p className="text-sm text-gray-500">
                            {location.company.approved ? "Approved: This location can post shifts" : "Not Approved: This location can't post shifts"}
                        </p>
                        <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <BuildingOfficeIcon className="w-5"/>
                                <span>{location.company?.name || "No parent company"}</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <MapPinIcon className="w-5"/>
                                <span>{getFullAddress(location.address, location.city, location.province, location.postalCode)}</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <EnvelopeIcon className="w-5"/>
                                <span>{location?.email || "Add an email"}</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <PhoneIcon className="w-5"/>
                                <span>{location?.phone || "Add a phone number"}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* SMALL CARDS */}
                <div className="flex-1 flex gap-4 justify-between flex-wrap">
                    {/* CARD */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <CalendarIcon className="w-6 h-6" />
                        <div className="">
                            <h1 className="text-xl font-semibold">{counts?.totalOpen || "0"}</h1>
                            <span className="text-sm text-gray-400">Open Shifts</span>
                        </div>
                    </div>
                    {/* CARD */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <ClockIcon className="w-6 h-6" />
                        <div className="">
                            <h1 className="text-xl font-semibold">{counts?.totalTaken || "0"}</h1>
                            <span className="text-sm text-gray-400">Scheduled Shifts</span>
                        </div>
                    </div>
                    {/* CARD */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <XCircleIcon className="w-6 h-6" />
                        <div className="">
                            <h1 className="text-xl font-semibold">{counts?.totalCompleted || "0"}</h1>
                            <span className="text-sm text-gray-400">Completed Shifts</span>
                        </div>
                    </div>
                    {/* CARD */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <CheckCircleIcon className="w-6 h-6" />
                        <div className="">
                            <h1 className="text-xl font-semibold">{counts?.totalCancelled || "0"}</h1>
                            <span className="text-sm text-gray-400">Cancelled Shifts</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* BOTTOM */}
            <div className="mt-4 rounded-md p-4 h-[800px]  mb-4">
               <h1 className="text-xl font-semibold">Location&apos;s Calendar</h1>
               <BigCalendarContainer type="single_location" id={id} />
            </div>
        </div>
        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-md">
                <h1 className="text-xl font-semibold">Shortcuts</h1>
                <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
                    <Link className="p-3 rounded-md bg-blue-50" href={`/dashboard/shifts?locationId=${id}`}>Location&apos;s Shifts</Link>
                    <Link className="p-3 rounded-md bg-purple-50" href={`/dashboard/list/users?locationId=${id}`}>Location&apos;s Managers</Link>
                    <Link className="p-3 rounded-md bg-yellow-50" href="/">Location&apos;s Reports</Link>
                    <Link className="p-3 rounded-md bg-pink-50" href="/">Location&apos;s Files</Link>
                    <Link className="p-3 rounded-md bg-blue-50" href="/">Location&apos;s Notifications</Link>
                </div>
            </div>
            <ShiftsGraph data={counts?.monthlyCounts} />
        </div>
    </div>
    
  );
}