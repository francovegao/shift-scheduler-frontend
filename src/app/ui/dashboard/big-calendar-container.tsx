'use client';

import { fetchAllMyShifts, fetchCompanyShifts, fetchLocationShifts, fetchPharmacistShifts } from "@/app/lib/data";
import BigCalendar from "./big-calendar";
import { useAuth } from "../context/auth-context";
import { SetStateAction, useEffect, useState } from "react";
import { useSelectedCompany } from "@/app/lib/useSelectedCompany";


export default function BigCalendarContainer({  
  type, 
  id,
}: {
  type: "dashboard_manager" | "dashboard_pharmacist" | "single_pharmacist" | "single_company" | "single_location" ;
  id?: string;
}) {
    const { firebaseUser, appUser, loading } = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [token, setToken] = useState("");
    const [shifts, setShifts] = useState<any[]>([]);
    const currentCompanyId = useSelectedCompany((state) => state.currentCompanyId);

    // Get token
    useEffect(() => {
      if (firebaseUser) {
        firebaseUser.getIdToken().then((idToken: SetStateAction<string>) => {
          setToken(idToken);
        });
      }
    }, [firebaseUser]);

    useEffect(() => {
      const fetchData = async () => {
      setIsFetching(true);
      try {
          switch (type) {
            case "dashboard_pharmacist":
            case "dashboard_manager":
              const queryParams: Record<string, string> = {};

              //Set current selected companyId
              if(appUser?.role ==="pharmacy_manager"){
                if(currentCompanyId !== appUser?.companyId ){
                  queryParams["companyId"] = currentCompanyId || "";
                }
              }

              if (queryParams["companyId"] === "") {
                  delete queryParams["companyId"];
              }

              const shiftsResponse = await fetchAllMyShifts(token, queryParams);
              setShifts(shiftsResponse?.data ?? []);
              break;
            case "single_pharmacist":
              if(id) {
                const shiftsResponse = await fetchPharmacistShifts(id, token);
                setShifts(shiftsResponse?.data ?? []);
              }
              break;
            case "single_company":
              if(id) {
                const shiftsResponse = await fetchCompanyShifts(id, token);
                const allShifts = shiftsResponse?.data ?? [];
                const filteredShifts = allShifts.filter(
                  (shift: any) => shift.location === null 
                );
                setShifts(filteredShifts);
              }
              break;
            case "single_location":
              if(id) {
                const shiftsResponse = await fetchLocationShifts(id, token);
                setShifts(shiftsResponse?.data ?? []);
              }
              break;
            default:
              break;
          }
      } catch (err) {
          console.error("Failed to fetch big calendar shifts", err);
      } finally {
          setIsFetching(false);
      }
  };

  if (token) fetchData();
  }, [type, token, currentCompanyId]);

    if (loading || isFetching) return <div>Loading...</div>;
    if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;

    const data = shifts.map((shift) => {
      let title: string= "";

      if(shift.pharmacistId &&
         (type === 'dashboard_manager' || type === "single_company" || type === "single_location") ){
        title = `${shift.pharmacist?.user?.firstName} ${shift.pharmacist?.user?.lastName}`;
      }else{
        title =
            shift.location?.name
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

    return(
        <div >
            <BigCalendar data={data} token={token} />
        </div>
    )
}