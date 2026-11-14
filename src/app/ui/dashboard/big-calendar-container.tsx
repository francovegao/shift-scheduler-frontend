"use client";

import { acceptRefresh } from "@/app/lib/refresh-response";

import { useDataRevision } from "@/app/lib/data-revisions";

import {
  fetchAllMyShifts,
  fetchCompanyShifts,
  fetchLocationShifts,
  fetchPharmacistShifts,
} from "@/app/lib/data";
import BigCalendar from "./big-calendar";
import { useAuth } from "../context/auth-context";
import { SetStateAction, useEffect, useState } from "react";
import { useSelectedCompany } from "@/app/lib/useSelectedCompany";

export default function BigCalendarContainer({
  type,
  id,
}: {
  type:
    | "dashboard_manager"
    | "dashboard_pharmacist"
    | "single_pharmacist"
    | "single_company"
    | "single_location"
    | "past_shifts_manager"
    | "upcoming_shifts_manager"
    | "upcoming_shifts_pharmacist"
    | "past_shifts_pharmacist";
  id?: string;
}) {
  const shiftsRevision = useDataRevision("shifts");
  const { firebaseUser, appUser, loading } = useAuth();
  const [isFetching, setIsFetching] = useState(true);
  const [token, setToken] = useState("");
  const [shifts, setShifts] = useState<any[]>([]);
  const currentCompanyId = useSelectedCompany(
    (state) => state.currentCompanyId,
  );

  // Get token
  useEffect(() => {
    if (firebaseUser) {
      firebaseUser.getIdToken().then((idToken: SetStateAction<string>) => {
        setToken(idToken);
      });
    }
  }, [firebaseUser]);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const queryParams: Record<string, string> = {};
        switch (type) {
          case "upcoming_shifts_pharmacist":
          case "past_shifts_pharmacist": {
            queryParams.timeFilter =
              type === "upcoming_shifts_pharmacist" ? "upcoming" : "past";
            const shiftsResponse = await fetchAllMyShifts(token, queryParams);
            setShifts(shiftsResponse?.data ?? []);
            break;
          }
          case "dashboard_pharmacist":
          case "dashboard_manager":
            //Set current selected companyId
            if (appUser?.role === "pharmacy_manager") {
              if (currentCompanyId !== appUser?.companyId) {
                queryParams["companyId"] = currentCompanyId || "";
              }
            }

            if (queryParams["companyId"] === "") {
              delete queryParams["companyId"];
            }

            const shiftsResponse = await fetchAllMyShifts(token, queryParams);
            if (!active || !acceptRefresh(shiftsResponse, "shifts", "data", "ui-dashboard-big-calendar-container")) return;
            if (active) setShifts(shiftsResponse?.data ?? []);
            break;
          case "single_pharmacist":
            if (id) {
              const shiftsResponse = await fetchPharmacistShifts(id, token);
              if (!active || !acceptRefresh(shiftsResponse, "shifts", "data", "ui-dashboard-big-calendar-container")) return;
              if (active) setShifts(shiftsResponse?.data ?? []);
            }
            break;
          case "single_company":
            if (id) {
              const shiftsResponse = await fetchCompanyShifts(id, token);
              if (!active || !acceptRefresh(shiftsResponse, "shifts", "data", "ui-dashboard-big-calendar-container")) return;
              const allShifts = shiftsResponse?.data ?? [];
              const filteredShifts = allShifts.filter(
                (shift: any) => shift.location === null,
              );
              if (active) setShifts(filteredShifts);
            }
            break;
          case "single_location":
            if (id) {
              const shiftsResponse = await fetchLocationShifts(id, token);
              if (!active || !acceptRefresh(shiftsResponse, "shifts", "data", "ui-dashboard-big-calendar-container")) return;
              if (active) setShifts(shiftsResponse?.data ?? []);
            }
            break;
          case "past_shifts_manager":
            queryParams["timeFilter"] = "past";

            //Set current selected companyId
            if (appUser?.role === "pharmacy_manager") {
              if (currentCompanyId !== appUser?.companyId) {
                queryParams["companyId"] = currentCompanyId || "";
              }
            }

            if (queryParams["companyId"] === "") {
              delete queryParams["companyId"];
            }

            const pastShiftsResponse = await fetchAllMyShifts(
              token,
              queryParams,
            );
            if (!active || !acceptRefresh(pastShiftsResponse, "shifts", "data", "ui-dashboard-big-calendar-container")) return;
            if (active) setShifts(pastShiftsResponse?.data ?? []);
            break;
          case "upcoming_shifts_manager":
            queryParams["timeFilter"] = "upcoming";

            //Set current selected companyId
            if (appUser?.role === "pharmacy_manager") {
              if (currentCompanyId !== appUser?.companyId) {
                queryParams["companyId"] = currentCompanyId || "";
              }
            }

            if (queryParams["companyId"] === "") {
              delete queryParams["companyId"];
            }

            const upcomingShiftsResponse = await fetchAllMyShifts(
              token,
              queryParams,
            );
            if (!active || !acceptRefresh(upcomingShiftsResponse, "shifts", "data", "ui-dashboard-big-calendar-container")) return;
            if (active) setShifts(upcomingShiftsResponse?.data ?? []);
            break;
          default:
            break;
        }
      } catch (err) {
        console.error("Failed to fetch big calendar shifts", err);
      } finally {
        if (active) setIsFetching(false);
      }
    };

    if (token) fetchData();
    return () => {
      active = false;
    };
  }, [type, token, currentCompanyId, shiftsRevision]);

  if (loading || isFetching) return <div>Loading...</div>;
  if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;

  const role = appUser.role;

  const data = shifts.map((shift) => {
    let title: string = "";

    if (
      shift.pharmacistId &&
      (type === "dashboard_manager" ||
        type === "single_company" ||
        type === "single_location")
    ) {
      title = `${shift.pharmacist?.user?.firstName} ${shift.pharmacist?.user?.lastName}`;
    } else {
      title = shift.location?.name
        ? `${shift.location.name} - ${shift.company.name}`
        : shift.company.name;
    }

    return {
      title,
      allDay: false,
      start: new Date(shift.startTime),
      end: new Date(shift.endTime),
      shift: shift,
    };
  });

  return (
    <div>
      {(role === "admin" ||
        role === "pharmacy_manager" ||
        role === "location_manager") && (
        <BigCalendar data={data} token={token} action="createShift" />
      )}
      {role === "relief_pharmacist" && (
        <BigCalendar token={token} data={data} />
      )}
    </div>
  );
}
