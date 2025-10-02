"use client";

import { fetchUser } from "@/app/lib/data";
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
  pharmacistProfile: {id: string; } | null;
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
  const [firebaseUser, firebaseLoading] = useAuthState(auth);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!firebaseUser) {
        setAppUser(null);
        setLoading(false);
        return;
      }

      try {
        // get Firebase JWT token
        const token = await firebaseUser.getIdToken();

        // call your backend with Authorization header
        const data = await fetchUser(firebaseUser.uid, token);
        setAppUser(data); // assuming backend returns {id, email, role}
      } catch (error) {
        console.error("Error fetching user:", error);
        setAppUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (!firebaseLoading) {
      fetchRole();
    }
  }, [firebaseUser, firebaseLoading]);

  return (
    <AuthContext.Provider value={{ firebaseUser, appUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
