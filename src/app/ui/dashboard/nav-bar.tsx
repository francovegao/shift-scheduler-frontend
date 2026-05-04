"use client";

import {
  BellIcon,
  BuildingOfficeIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useEffect, SetStateAction } from "react";
import { useAuth } from "../context/auth-context";
import { displayRole } from "@/app/lib/utils";
import { fetchUserInfo } from "@/app/lib/data";
import { useSelectedCompany } from "@/app/lib/useSelectedCompany";
import Notifications from "./notifications";
import Menu from "./menu";
import Image from "next/image";

type User = {
  id: string;
  firebaseUid: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  createdAt: string;
  role:
    | "admin"
    | "pharmacy_manager"
    | "location_manager"
    | "relief_pharmacist"
    | null;
  companyId: string | null;
  locationId: string | null;
  pharmacistProfile: any | null;
  files?: File[];
  company: any;
  location: any;
  allowedCompanies?: AllowedCompanies[];
};

type AllowedCompanies = {
  id: string;
  name: string;
  files?: File[];
};

type File = {
  userId?: string;
  companyId?: string;
  fileName: string;
  fileUrl: string;
  type: "resume" | "logo" | "profilePicture";
};

export default function NavBar() {
  const { firebaseUser, appUser, loading } = useAuth();
  const [isFetching, setIsFetching] = useState(true);
  const [token, setToken] = useState("");

  const [user, setUser] = useState<User | null>(null);

  const currentCompanyId = useSelectedCompany(
    (state) => state.currentCompanyId,
  );
  const setCompany = useSelectedCompany((state) => state.setCompany);

  // Get token
  useEffect(() => {
    if (firebaseUser) {
      firebaseUser.getIdToken().then((idToken: SetStateAction<string>) => {
        setToken(idToken);
      });
    }
  }, [firebaseUser]);

  useEffect(() => {
    const getUser = async () => {
      setIsFetching(true);
      try {
        if (appUser?.id) {
          const userResponse = await fetchUserInfo(appUser.id, token);
          setUser(userResponse?.data ?? null);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setIsFetching(false);
      }
    };
    if (token) {
      getUser();
    }
  }, [token, appUser]);

  useEffect(() => {
    if (user && !currentCompanyId) {
      setCompany(user.companyId ?? null);
    }
  }, [user]);

  const saveSelectedCompany = (id: string) => {
    setCompany(id);
  };

  if (loading || isFetching) return <div>Loading...</div>;
  if (!firebaseUser || !appUser || !user)
    return <div>Please sign in to continue</div>;

  const profilePicture = user?.files?.find(
    (file: { type: string }) => file.type === "profilePicture",
  );

  const hasResume = user?.files?.find(
    (file: { type: string }) => file.type === "resume",
  );

  const getMissingInfoMessage = () => {
    if (appUser?.role !== "relief_pharmacist") return null;
    if (profilePicture && hasResume) return null;

    if (!profilePicture && !hasResume)
      return "Please complete your profile. Missing profile picture and resume.";
    if (!profilePicture)
      return "Please complete your profile. Missing profile picture.";
    if (!hasResume) return "Please complete your profile. Missing resume.";
    return null;
  };

  const missingInfoMessage = getMissingInfoMessage();

  const companyLogo =
    currentCompanyId !== user.companyId
      ? (
          (user?.allowedCompanies ?? [])?.find((c) => c.id === currentCompanyId)
            ?.files ?? []
        ).find((file: { type: string }) => file.type === "logo")
      : user?.company?.files.find(
          (file: { type: string }) => file.type === "logo",
        );

  return (
    <div className="flex items-center justify-between p-4">
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        {appUser?.role === "pharmacy_manager" && (
          <Menu
            button={
              <div className="flex items-center gap-1 cursor-pointer hover:bg-sky-100 hover:text-primary rounded-md p-1">
                {companyLogo ? (
                  <div className="relative w-7 h-7 overflow-hidden border border-gray-200 shadow-sm">
                    <Image
                      src={companyLogo.fileUrl}
                      alt="Company logo"
                      fill
                      sizes="64px"
                      objectFit="contain"
                    />
                  </div>
                ) : (
                  <BuildingOfficeIcon className="w-7 h-7" />
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-medium">
                    {user?.allowedCompanies?.find(
                      (c) => c.id === currentCompanyId,
                    )?.name || user?.company?.name}
                  </span>
                  <span className="text-[10px] text-complementary-one text-right">
                    Current Pharmacy
                  </span>
                </div>
                <ChevronDownIcon className="w-4 h-4" />
              </div>
            }
          >
            <p
              key={user.companyId}
              onClick={() => {
                saveSelectedCompany(user.companyId!);
                close();
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {user.company?.name}
            </p>

            {user?.allowedCompanies?.map((c) => (
              <p
                key={c.id}
                onClick={() => {
                  saveSelectedCompany(c.id);
                  close();
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {c.name}
              </p>
            ))}
          </Menu>
        )}

        <Menu
          button={
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-sky-100 hover:text-primary rounded-md p-1">
              <div className="flex items-center gap-2">
                {profilePicture ? (
                  <div className="relative w-7 h-7 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                    <Image
                      src={profilePicture.fileUrl}
                      alt="Profile picture"
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <UserCircleIcon className="w-7 h-7" />
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-medium">
                    {appUser.firstName} {appUser.lastName}
                  </span>
                  <span className="text-[10px] text-gray-500 text-right">
                    {displayRole(appUser.role)}
                  </span>
                </div>
              </div>
              {missingInfoMessage && (
                <p className="text-[10px] text-red-500 text-center leading-tight mt-1 max-w-[150px]">
                  {missingInfoMessage}
                </p>
              )}
            </div>
          }
        >
          <Link
            href="/"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <span>Home</span>
          </Link>

          <Link
            href="/dashboard/profile"
            className="flex items-center justify-between w-full gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <span>Profile</span>
            {missingInfoMessage && (
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
            )}
          </Link>
        </Menu>

        <Menu
          width="w-80"
          button={
            <div className="rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-sky-100 hover:text-primary">
              <BellIcon className="w-5 h-5" />
            </div>
          }
        >
          <div className="py-2 px-4">
            <Notifications />
          </div>
        </Menu>
      </div>
    </div>
  );
}
