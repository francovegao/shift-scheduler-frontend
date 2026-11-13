"use client";

import { useDataRevision } from "@/app/lib/data-revisions";
import { acceptRefresh } from "@/app/lib/refresh-response";

import { fetchUserFb } from "@/app/lib/data";
import { auth } from "@/app/lib/firebaseConfig";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";


type AppUser = {
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
  pharmacistProfile: {id: string; approved: boolean; } | null;
};

type AuthContextType = {
  firebaseUser: any;  
  appUser: AppUser | null; 
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  appUser: null,
  loading: true,
});

//Context provider to save the user data in context making it available to components
export function ContextProvider({ children }: { children: React.ReactNode }) {
  const usersRevision = useDataRevision("users");
  const companiesRevision = useDataRevision("companies");
  const locationsRevision = useDataRevision("locations");
  const pharmacistsRevision = useDataRevision("pharmacists");
  const filesRevision = useDataRevision("files");
  const [firebaseUser, firebaseLoading] = useAuthState(auth);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchRole = async () => {
      if (!firebaseUser) {
        if (active) {
          setAppUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        // get Firebase JWT token
        const token = await firebaseUser.getIdToken();

        // call your backend with Authorization header
        const data = await fetchUserFb(firebaseUser.uid, token);
        if (active && acceptRefresh(data, "users", null)) setAppUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        if (active && usersRevision === 0) setAppUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    if (!firebaseLoading) {
      fetchRole();
    }
    return () => {
      active = false;
    };
  }, [firebaseUser, firebaseLoading, usersRevision, companiesRevision, locationsRevision, pharmacistsRevision, filesRevision]);

  return (
    <AuthContext.Provider value={{ firebaseUser, appUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
