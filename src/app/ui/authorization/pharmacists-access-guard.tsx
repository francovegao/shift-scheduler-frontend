"use client";

import { useAuth } from "../context/auth-context";

export default function PharmacistAccessGuard({ children }: { children: React.ReactNode }) {
  const { appUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Only block relief pharmacists who are NOT approved
  if (
    appUser?.role === "relief_pharmacist" &&
    !appUser?.pharmacistProfile?.approved
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10">
        <h1 className="text-2xl font-semibold text-red-600">Access Restricted</h1>
        <p className="mt-4 text-gray-700 text-center max-w-lg">
          You are currently not approved to take shifts.
          <br />
          Please contact the administrator to obtain approval.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
