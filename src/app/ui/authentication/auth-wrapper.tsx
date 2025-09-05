"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import SignOutButton from "../dashboard/sign-out-button";
import { useAuth } from "../context/auth-context";

type Props = {
  children: ReactNode;
  allowedRoles?: string[]; // e.g. ["admin", "pharmacy_manager"]
};

//Wrapper to protect routes according to user roles
export function AuthWrapper({ children , allowedRoles }: Props) {
  const { appUser, loading } = useAuth();
  const [baseURL, setBaseURL] = useState<string | URL | undefined>();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseURL(window.location.origin);
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!appUser) {
    return null; // Prevent flicker before redirect
  }

  if (allowedRoles && !allowedRoles.includes(appUser.role ?? "")) {

    router.push(`${baseURL}/${appUser.role}`); 

    return (
      <div>
        Unauthorized - you do not have permission to view this page.
        <SignOutButton />
      </div>
    );
  }

  return <>{children}</>;
}
