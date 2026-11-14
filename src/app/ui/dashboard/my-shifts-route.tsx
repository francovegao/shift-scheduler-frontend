"use client";

import { AuthWrapper } from "@/app/ui/authentication/auth-wrapper";
import { useAuth } from "@/app/ui/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MyShiftsListContainer from "./my-shifts-list-container";

type Props = {
  title: string;
  timeFilter?: "upcoming" | "past";
  bigCalendarType:
    | "dashboard_pharmacist"
    | "upcoming_shifts_pharmacist"
    | "past_shifts_pharmacist";
};

export default function MyShiftsRoute({
  title,
  timeFilter,
  bigCalendarType,
}: Props) {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !firebaseUser) router.push("/");
  }, [firebaseUser, loading, router]);

  return (
    <AuthWrapper allowedRoles={["relief_pharmacist"]}>
      <MyShiftsListContainer
        title={title}
        timeFilter={timeFilter}
        bigCalendarType={bigCalendarType}
      />
    </AuthWrapper>
  );
}
