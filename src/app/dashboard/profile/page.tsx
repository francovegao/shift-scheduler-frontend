"use client";

import { fetchUserInfo } from "@/app/lib/data";
import { AuthWrapper } from "@/app/ui/authentication/auth-wrapper";
import { useAuth } from "@/app/ui/context/auth-context";
import RelatedDataModal from "@/app/ui/list/related-data-modal";
import BasicProfileInfo from "@/app/ui/profile/base-info";
import CompanyManagerProfileInfo from "@/app/ui/profile/company-manager-info";
import LocationManagerProfileInfo from "@/app/ui/profile/location-manager-info";
import ReliefPharmacistProfileInfo from "@/app/ui/profile/pharmacist-info";
import { SetStateAction, useEffect, useState } from "react";

type User = {
  id: string;
  firebaseUid: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  createdAt: string;
  role: "admin" | "pharmacy_manager" | "location_manager" | "relief_pharmacist" | null;
  companyId: string | null;
  locationId: string | null;
  pharmacistProfile: any | null;
  files: any | null;
  company: any;
  location: any;
};


export default function ProfilePage() {

    const { firebaseUser, appUser, loading } = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [token, setToken] = useState("");

    const [user, setUser] = useState<User | null>(null);

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
        if (token){ getUser() };
    }, [token, appUser]);

    if (loading || isFetching) return <div>Loading...</div>;
    if (!firebaseUser || !appUser || !user) return <div>Please sign in to continue</div>;

    const role = appUser.role;

  return (
    <AuthWrapper allowedRoles={["admin", "pharmacy_manager", "location_manager", "relief_pharmacist"]}>
        <div className="p-4 lg:p-8">
            <BasicProfileInfo user={user} token={token} />

            {role === "pharmacy_manager" && <CompanyManagerProfileInfo company={user?.company} token={token}/>}
            {role === "relief_pharmacist" && <ReliefPharmacistProfileInfo pharmacistProfile={user?.pharmacistProfile} token={token}/>} 
            {role === "location_manager" && <LocationManagerProfileInfo location={user?.location} companyName={user?.company?.name} token={token} />}   

            <div className="p-2">
                <div className="flex flex-col gap-2 text-black">
                    {/*Title and Edit Button */}
                    <div className="flex items-center justify-start gap-4">    
                        <h1 className="text-xl font-semibold">User Files</h1>
                    </div>
                    
                    {/*Information */}
                    <div className="flex justify-between flex-wrap p-4 gap-4 bg-white rounded-md shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                            <div className="flex flex-col">
                                <label className="text-gray-500">Files:</label>
                                <p>{user.files?.fileName?.map((f: { name: any; }) => f.name).join(", ")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-2">
                <div className="flex flex-col gap-2 text-black">
                    {/*Title and Edit Button */}
                    <div className="flex items-center justify-start gap-4">    
                        <h1 className="text-xl font-semibold">Security</h1>
                        <RelatedDataModal type="update_password" token={token} />
                    </div>
                    
                    {/*Information */}
                    <div className="flex justify-between flex-wrap p-4 gap-4 bg-white rounded-md shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                            <div className="flex flex-col">
                                <label className="text-gray-500">Password:</label>
                                <p>********</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create a modal like addRelatedDataModal to add buttons here to change password, edit files, edit basic info, etc. */}
        </div>
    </AuthWrapper>
  );
}
