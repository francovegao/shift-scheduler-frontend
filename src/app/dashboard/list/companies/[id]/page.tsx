'use client';

import Image from 'next/image';
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
import { fetchOneCompany } from "@/app/lib/data";
import BigCalendarContainer from "@/app/ui/dashboard/big-calendar-container";
import { getFullAddress } from "@/app/lib/utils";
import { notFound } from 'next/navigation';

export default function SingleLocationPage({
    params,
}:{
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    const { firebaseUser, appUser, loading } = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [token, setToken] = useState("");
    const [company, setCompany] = useState<any | null>(null);
    const [counts, setCounts] = useState<any | null>(null);

    // Get token
    useEffect(() => {
        if (firebaseUser) {
        firebaseUser.getIdToken().then((idToken: SetStateAction<string>) => {
            setToken(idToken);
        });
        }
    }, [firebaseUser]);

    // Fetch company when token is ready
    useEffect(() => {
    const getCompany = async () => {
        setIsFetching(true);
        try {
        const companyResponse = await fetchOneCompany(id, token);
        setCompany(companyResponse.data ?? null);
        setCounts(companyResponse.meta ?? null);
        } catch (err) {
        console.error("Failed to fetch company", err);
        } finally {
        setIsFetching(false);
        }
    };
    if (token){ getCompany() };
    }, [token, id]);

    if (loading || isFetching) return <div>Loading...</div>;
    if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;
    if(!company) { notFound(); }

    const role = appUser.role;

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
        {/* LEFT */}
        <div className="w-full xl:w-2/3">
            {/* TOP */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* USER INFO CARD */}
                <div className="bg-primary py-6 px-4 rounded-md flex-1 flex gap-4 text-white">
                    <div className="w-1/3 flex items-center">
                        {company.name==="Pharm Drugstore" ? (
                        <div className="relative w-full h-16">
                        <Image
                            src={`/${company?.name}-black.png`}
                            alt="Pharmacy Logo"
                            fill
                        />
                        </div>)
                        : company.name==="Grassroots Pharmacy"?(
                            <div className="relative w-full h-24">
                            <Image
                                src={`/${company?.name}-black.png`}
                                alt="Pharmacy Logo"
                                fill
                            />
                            </div>)
                        : company.name.includes("CurisRx") ? (
                             <div className="relative w-full h-12">
                            <Image
                                src={`/CurisRx-Black-2021.png`}
                                alt="Pharmacy Logo"
                                fill
                            />
                            </div>
                        ):(
                           <BuildingStorefrontIcon className="w-36 h-36" /> 
                        )}
                    </div>
                    <div className="w-2/3 flex flex-col justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-semibold">{company?.name }</h2>
                             {role === "admin" && (
                                <FormContainer
                                    table="company"
                                    type="update"
                                    token={token}
                                    data={company}
                                />
                                )}
                            {(role === "pharmacy_manager" &&
                            appUser?.companyId === company.id) && (
                                <FormContainer
                                    table="company"
                                    type="update"
                                    token={token}
                                    data={company}
                                />
                                )}
                        </div>
                        <p className="text-sm">{company.legalName}</p>
                        <p className="text-sm">
                            {company.approved ? "Approved: This pharmacy can post shifts" : "Not Approved: This pharmacy can't post shifts"}
                        </p>
                        <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <BuildingOfficeIcon className="w-5"/>
                                <span>GST: {company?.GSTNumber || "Add a GST Number"}</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <MapPinIcon className="w-5"/>
                                <span>{getFullAddress(company.address, company.city, company.province, company.postalCode)}</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <EnvelopeIcon className="w-5"/>
                                <span>{company?.email || "Add an email"}</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <PhoneIcon className="w-5"/>
                                <span>{company?.phone || "Add a phone number"}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* SMALL CARDS */}
                <div className="flex-1 flex gap-4 justify-between flex-wrap text-white">
                    {/* CARD */}
                    <div className="bg-complementary-two p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <CalendarIcon className="w-6 h-6" />
                        <div className="">
                            <h2 className="text-xl font-semibold">{counts?.totalOpen || "0"}</h2>
                            <span className="text-sm">Open Shifts</span>
                        </div>
                    </div>
                    {/* CARD */}
                    <div className="bg-primary p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <ClockIcon className="w-6 h-6" />
                        <div className="">
                            <h2 className="text-xl font-semibold">{counts?.totalTaken || "0"}</h2>
                            <span className="text-sm">Scheduled Shifts</span>
                        </div>
                    </div>
                    {/* CARD */}
                    <div className="bg-secondary p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <XCircleIcon className="w-6 h-6" />
                        <div className="">
                            <h2 className="text-xl font-semibold">{counts?.totalCompleted || "0"}</h2>
                            <span className="text-sm">Completed Shifts</span>
                        </div>
                    </div>
                    {/* CARD */}
                    <div className="bg-complementary-one p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <CheckCircleIcon className="w-6 h-6" />
                        <div className="">
                            <h2 className="text-xl font-semibold">{counts?.totalCancelled || "0"}</h2>
                            <span className="text-sm">Cancelled Shifts</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* BOTTOM */}
            <div className="mt-4 rounded-md p-4 h-[800px] mb-4">
               <h1 className="text-xl font-semibold">Company&apos;s Calendar</h1>
               <BigCalendarContainer type="single_company" id={id} />
            </div>
        </div>
        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-md">
                <h1 className="text-xl font-semibold">Shortcuts</h1>
                <div className="mt-4 flex gap-4 flex-wrap text-xs text-white font-medium">
                    <Link className="p-3 rounded-md bg-secondary" href={`/dashboard/shifts?companyId=${id}`}>Company&apos;s Shifts</Link>
                    <Link className="p-3 rounded-md bg-complementary-one" href={`/dashboard/list/users?companyId=${id}`}>Company&apos;s Managers</Link>
                    <Link className="p-3 rounded-md bg-complementary-two" href="/">Company&apos;s Reports</Link>
                    <Link className="p-3 rounded-md bg-secondary" href="/">Company&apos;s Files</Link>
                    <Link className="p-3 rounded-md bg-complementary-one" href="/">Company&apos;s Notifications</Link>
                </div>
            </div>
            <ShiftsGraph data={counts?.monthlyCounts} />
        </div>
    </div>
    
  );
}