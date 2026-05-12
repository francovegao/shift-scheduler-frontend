"use client";

import ShiftsGraph from "@/app/ui/list/shifts-graph";
import {
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  IdentificationIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { SetStateAction, useEffect, useState, use } from "react";
import { useAuth } from "@/app/ui/context/auth-context";
import { fetchOnePharmacist } from "@/app/lib/data";
import FormContainer from "@/app/ui/list/form-container";
import BigCalendarContainer from "@/app/ui/dashboard/big-calendar-container";
import { getDisplayFileName, getFullAddress } from "@/app/lib/utils";
import { notFound } from "next/navigation";
import RelatedDataModal from "@/app/ui/list/related-data-modal";
import ApprovedStatus from "@/app/ui/list/status";
import { getDownloadUrl } from "@/app/lib/actions";
import Image from "next/image";

export default function SinglePharmacistPage({
  params,
}: {
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
    if (token) {
      getPharmacist();
    }
  }, [token, id]);

  if (loading || isFetching) return <div>Loading...</div>;
  if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;
  if (!pharmacist) {
    notFound();
  }

  async function openFile(fileId: string) {
    try {
      const signedUrl = await getDownloadUrl(token, fileId);

      window.open(signedUrl, "_blank", "noreferrer");
    } catch (err) {
      console.error("Failed to open file", err);
    }
  }

  const role = appUser.role;
  const resume = pharmacist?.files.find(
    (file: { type: string }) => file.type === "resume",
  );
  const profilePicture = pharmacist?.files.find(
    (file: { type: string }) => file.type === "profilePicture",
  );

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-primary py-6 px-4 rounded-md flex-1 flex gap-4 text-white">
            <div className="w-2/5 md:w-1/3 flex flex-col justify-start items-center">
              {profilePicture ? (
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border border-black-100 flex-shrink-0">
                  <Image
                    src={profilePicture.fileUrl}
                    alt="Profile picture"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <UserCircleIcon className="w-24 h-24 md:w-36 md:h-36" />
              )}

              <div className="py-1 mb-2 text-gray-800">
                {pharmacist.pharmacistProfile?.canViewAllCompanies === false &&
                pharmacist.pharmacistProfile?.canViewPayRates === false ? (
                  <RelatedDataModal
                    type="set_pharmacist_permissions"
                    token={token}
                    id={pharmacist?.pharmacistProfile?.id}
                    data={pharmacist?.pharmacistProfile}
                  />
                ) : pharmacist.pharmacistProfile?.canViewAllCompanies ===
                    false &&
                  pharmacist.pharmacistProfile?.canViewPayRates === true ? (
                  <RelatedDataModal
                    type="set_allowed_companies"
                    token={token}
                    id={pharmacist?.pharmacistProfile?.id}
                    data={pharmacist?.pharmacistProfile}
                  />
                ) : pharmacist.pharmacistProfile?.canViewAllCompanies ===
                    true &&
                  pharmacist.pharmacistProfile?.canViewPayRates === false ? (
                  <RelatedDataModal
                    type="set_allowed_pay_rates"
                    token={token}
                    id={pharmacist?.pharmacistProfile?.id}
                    data={pharmacist?.pharmacistProfile}
                  />
                ) : (
                  <></>
                )}
              </div>
              {role === "admin" && (
                <div className="flex flex-col md:grid md:grid-cols-2 gap-2 w-full mt-4">
                  <div className="flex flex-col items-center text-center">
                    <FormContainer
                      table="user"
                      type="update"
                      token={token}
                      data={pharmacist}
                    />
                    <p className="text-[10px] md:text-xs mt-1">Edit User</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <FormContainer
                      table="pharmacist"
                      type="update"
                      token={token}
                      data={pharmacist.pharmacistProfile}
                    />
                    <p className="text-[10px] md:text-xs mt-1">
                      Edit Pharmacist Profile
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4 p-2">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">
                  {pharmacist?.firstName + " " + pharmacist?.lastName}
                </h2>
              </div>
              <p className="text-sm">
                {pharmacist.pharmacistProfile.bio ||
                  "Add a bio to show it here"}
              </p>
              <div className="flex flex-col gap-3 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <IdentificationIcon className="w-5" />
                  <span>
                    {pharmacist.pharmacistProfile.licenseNumber ||
                      "Add a license number"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5" />
                  <span>
                    {getFullAddress(
                      pharmacist.pharmacistProfile.address,
                      pharmacist.pharmacistProfile.city,
                      pharmacist.pharmacistProfile.province,
                      pharmacist.pharmacistProfile.postalCode,
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="w-5" />
                  <span className="break-all">
                    {pharmacist.email || "Add an email"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-5" />
                  <span>{pharmacist.phone || "Add a phone number"}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-2 space-around flex-wrap text-white">
            {/* CARD */}
            <div className="bg-complementary-two p-4 rounded-md flex gap-2 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <BuildingStorefrontIcon className="w-6 h-6" />
              <div className="">
                <h2 className="text-xl font-semibold">
                  {counts?.totalPharmacies || "No data"}
                </h2>
                <span className="text-sm">Locations Worked</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-primary p-4 rounded-md flex gap-2 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <ClockIcon className="w-6 h-6" />
              <div className="">
                <h2 className="text-xl font-semibold">
                  {counts?.totalTaken || "No data"}
                </h2>
                <span className="text-sm">Scheduled Shifts</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-secondary p-4 rounded-md flex gap-2 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <CheckCircleIcon className="w-6 h-6" />
              <div className="">
                <h2 className="text-xl font-semibold">
                  {counts?.totalCompleted || "No data"}
                </h2>
                <span className="text-sm">Completed Shifts</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-complementary-one p-4 rounded-md flex gap-2 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <XCircleIcon className="w-6 h-6" />
              <div className="">
                <h2 className="text-xl font-semibold">
                  {counts?.totalCancelled || "No data"}
                </h2>
                <span className="text-sm">Cancelled Shifts</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 rounded-md p-4 h-[800px] mb-24">
          <h1 className="text-xl font-semibold">Pharmacist&apos;s Schedule</h1>
          <BigCalendarContainer type="single_pharmacist" id={id} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">
            Pharmacist&apos;s Extra Info
          </h1>
          <div className="mt-4 grid grid-cols-[minmax(0,max-content)_minmax(0,1fr)] gap-x-4 gap-y-4 items-center">
            <p className="font-bold">Status: </p>
            <div>
              <ApprovedStatus
                status={
                  pharmacist.pharmacistProfile?.approved === true
                    ? "approved"
                    : pharmacist.pharmacistProfile?.approved === false
                      ? "pending"
                      : "no-profile"
                }
              />
            </div>

            <p className="font-bold">Permissions: </p>
            <div>
              {pharmacist.pharmacistProfile && (
                <>
                  <p>
                    <span className="font-medium">All Pharmacies?</span>{" "}
                    {pharmacist.pharmacistProfile?.canViewAllCompanies
                      ? "Yes"
                      : "No"}
                  </p>
                  {!pharmacist.pharmacistProfile?.canViewAllCompanies && (
                    <p className="text-xs">
                      Can see{" "}
                      {pharmacist.pharmacistProfile?.companyPermissions.length}{" "}
                      pharmacies
                    </p>
                  )}
                  <p className="mt-2">
                    <span className="font-medium">All Pay Rates?</span>{" "}
                    {pharmacist.pharmacistProfile?.canViewPayRates
                      ? "Yes"
                      : "No"}
                  </p>
                  {!pharmacist.pharmacistProfile?.canViewPayRates && (
                    <p className="text-xs">
                      Can see{" "}
                      {
                        pharmacist.pharmacistProfile?.companyPermissions.filter(
                          (p: { canViewPayRate: any }) => p.canViewPayRate,
                        ).length
                      }{" "}
                      pharmacies' pay rates
                    </p>
                  )}
                </>
              )}
            </div>

            <p className="font-bold">Resume: </p>
            <div>
              {resume ? (
                <div className="flex items-center gap-2">
                  <span className="font-medium italic break-all">
                    {getDisplayFileName(resume.fileName)}
                  </span>
                  <button
                    onClick={() => openFile(resume.id)}
                    className="text-blue-500 hover:underline cursor-pointer"
                  >
                    View
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">Not uploaded yet</div>
              )}
            </div>

            <p className="font-bold">Shifts: </p>
            <Link
              className="text-blue-500 hover:underline cursor-pointer"
              href={`/dashboard/shifts?pharmacistId=${pharmacist.pharmacistProfile.id}`}
            >
              View All Shifts
            </Link>
          </div>
        </div>
        <ShiftsGraph data={counts?.monthlyCounts} />
      </div>
    </div>
  );
}
