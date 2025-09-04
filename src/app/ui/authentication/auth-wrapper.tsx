"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { auth } from "@/app/lib/firebaseConfig";
import SignOutButton from "../dashboard/sign-out-button";
import { fetchUserRole } from "@/app/lib/data";

type Props = {
  children: ReactNode;
  allowedRoles?: string[]; // e.g. ["admin", "company_manager"]
};

export function AuthWrapper({ children , allowedRoles }: Props) {
  const [user, loading] = useAuthState(auth);
  const [role, setRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const [baseURL, setBaseURL] = useState<string | URL | undefined>();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");         // redirect to login
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseURL(window.location.origin);
    }
  }, []);

  // Fetch role from backend once we have a user
  useEffect(() => {
      const fetchRole = async () => {
        if (user) {
          try {
            const token = await user.getIdToken();
            const res = await fetchUserRole(user.uid, token);
            setRole(res.role); 
          } catch (err) {
            console.error("Error fetching role:", err);
          } finally {
            setCheckingRole(false);
          }
        }
      };

    fetchRole();
  }, [user]);

  if (loading || checkingRole) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Prevent flicker before redirect
  }

  if (allowedRoles && !allowedRoles.includes(role ?? "")) {

    router.push(`${baseURL}/${role}`); 

    return (
      <div>
        Unauthorized - you do not have permission to view this page.
        <SignOutButton />
      </div>
    );
  }

  return <>{children}</>;
}
