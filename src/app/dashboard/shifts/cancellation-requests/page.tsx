"use client";

import { AuthWrapper } from "@/app/ui/authentication/auth-wrapper";
import { SetStateAction, useEffect, useState } from "react";
import ShiftCancellationRequestsList from "@/app/ui/cancel-requests/shifts-cancellation-request-list";
import { useAuth } from "@/app/ui/context/auth-context";

export default function CancelRequestsPage() {
  const { firebaseUser, appUser, loading } = useAuth();
  const [token, setToken] = useState("");

  // Get token
  useEffect(() => {
    if (firebaseUser) {
      firebaseUser.getIdToken().then((idToken: SetStateAction<string>) => {
        setToken(idToken);
      });
    }
  }, [firebaseUser]);

  if (loading) return <div>Loading...</div>;
  if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;

  const role = appUser.role;

  return (
    <AuthWrapper allowedRoles={["admin"]}>
      <div className="p-4 lg:p-8">
        {role === "admin" && (
          <ShiftCancellationRequestsList token={token} appUser={appUser} />
        )}
      </div>
    </AuthWrapper>
  );
}
