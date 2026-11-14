import { useDataRevision } from "@/app/lib/data-revisions";
import { acceptRefresh } from "@/app/lib/refresh-response";
import { useEffect, useState } from "react";
import FormModal from "./form-modal";
import {
  fetchCompanies,
  fetchLocations,
  fetchOneCompany,
  fetchPharmacists,
} from "@/app/lib/data";
import { useAuth } from "../context/auth-context";
import { useSelectedCompany } from "@/app/lib/useSelectedCompany";

export type FormContainerProps = {
  table:
    | "shift"
    | "user"
    | "pharmacist"
    | "company"
    | "location"
    | "shiftSeries"
    | "file"
    | "addPharmacistRequest";
  type: "create" | "update" | "delete";
  token: string;
  data?: any;
  id?: string;
  initialDate?: Date;
};

export default function FormContainer({
  table,
  type,
  token,
  data,
  id,
  initialDate,
}: FormContainerProps) {
  const companiesRevision = useDataRevision("companies");
  const locationsRevision = useDataRevision("locations");
  const pharmacistsRevision = useDataRevision("pharmacists");
  const { appUser, loading } = useAuth();
  const role = appUser?.role;
  const companyId = appUser?.companyId || undefined;

  const [isFetching, setIsFetching] = useState(
    type !== "delete" && (table === "shift" || table === "location"),
  );
  const [relatedData, setRelatedData] = useState<any>({});

  const currentCompanyId = useSelectedCompany(
    (state) => state.currentCompanyId,
  );

  useEffect(() => {
    if (type === "delete") return;
    let active = true;

    const fetchData = async () => {
      try {
        switch (table) {
          case "location": {
            //Fetch users that have role = location_manager and locationId is empty
            //Fetch companies to link the location to the company
            const companiesResponse = await fetchCompanies("", 1, {}, token); //TODO: Update this fetch to get all the companies, not just the limited by page
            if (!active || !acceptRefresh(companiesResponse, "companies")) return;
            if (active) setRelatedData({ companies: companiesResponse?.data ?? [] });
            break;
          }
          case "shift":
            if (role === "admin") {
              //Fetch the companies?, Locations? and pharmacists? to create a new shift
              const companiesRes = await fetchCompanies("", 1, {}, token); //TODO: Update this fetch to get all the companies, not just the limited by page
              const locationsRes = await fetchLocations("", 1, {}, token);
              const pharmacistsRes = await fetchPharmacists(
                "",
                1,
                {},
                token,
                50,
              ); //TODO: Update this fetch to get all the pharmacists without a pharmacist profile and not just the limited by page
              if (
                !active ||
                !acceptRefresh(companiesRes, "companies") ||
                !acceptRefresh(locationsRes, "locations") ||
                !acceptRefresh(pharmacistsRes, "pharmacists")
              ) return;
              if (active) setRelatedData({
                pharmacists: pharmacistsRes?.data ?? [],
                companies: companiesRes?.data ?? [],
                locations: locationsRes?.data ?? [],
              });
            }
            if (role === "pharmacy_manager") {
              //Don't fetch companies, only locations linked to the user companyId and pharmacists

              const companyRes = await fetchOneCompany(
                currentCompanyId ?? companyId ?? "",
                token,
              );
              const locationsRes = await fetchLocations(
                "",
                1,
                { companyId: companyId },
                token,
              );
              const pharmacistsRes = await fetchPharmacists(
                "",
                1,
                {},
                token,
                50,
              ); //TODO: Update this fetch to get all the pharmacists without a pharmacist profile and not just the limited by page
              if (
                !active ||
                !acceptRefresh(companyRes, "companies") ||
                !acceptRefresh(locationsRes, "locations") ||
                !acceptRefresh(pharmacistsRes, "pharmacists")
              ) return;
              if (active) setRelatedData({
                pharmacists: pharmacistsRes?.data ?? [],
                companies: [companyRes?.data],
                locations: locationsRes?.data ?? [],
              });
            }
            if (role === "location_manager") {
              //Don't fetch companies or locations, only fetch pharmacists
              const companyRes = await fetchOneCompany(companyId ?? "", token);
              const pharmacistsRes = await fetchPharmacists(
                "",
                1,
                {},
                token,
                50,
              ); //TODO: Update this fetch to get all the pharmacists without a pharmacist profile and not just the limited by page
              if (
                !active ||
                !acceptRefresh(companyRes, "companies") ||
                !acceptRefresh(pharmacistsRes, "pharmacists")
              ) return;
              if (active) setRelatedData({
                pharmacists: pharmacistsRes?.data ?? [],
                companies: [companyRes?.data],
              });
            }
            break;
          case "pharmacist":
            //Fetch users that have role = relief_pharmacist and pharmacistProfile is empty
            // const pharmacistsResponse = await fetchPharmacists("", 1, token);  //TODO: Update this fetch to get all the pharmacists without a pharmacist profile and not just the limited by page
            // setRelatedData({ pharmacists: pharmacistsResponse?.data ?? [] });
            break;
          case "company":
            //Fetch the users that have role = pharmacy_manager and companyId is empty
            break;
          case "user":
            //Do not fetch companies or locations because we dont know the user type to be created
            break;
          case "addPharmacistRequest":
            break;
        }
      } catch (err) {
        console.error("Failed to fetch related data", err);
      } finally {
        if (active) setIsFetching(false);
      }
    };

    if (token) fetchData();
    return () => {
      active = false;
    };
  }, [table, type, token, role, companyId, currentCompanyId, companiesRevision, locationsRevision, pharmacistsRevision]);

  if (loading || isFetching) return <div>Loading...</div>;
  if (!appUser) return <div>Please sign in to continue</div>;

  return (
    <div>
      <FormModal
        table={table}
        type={type}
        token={token}
        data={data}
        id={id}
        relatedData={relatedData}
        initialDate={initialDate}
      />
    </div>
  );
}
