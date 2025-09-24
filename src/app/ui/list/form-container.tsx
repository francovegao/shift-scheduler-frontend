import { useEffect, useState } from "react";
import FormModal from "./form-modal";
import { fetchCompanies, fetchLocations, fetchPharmacists } from "@/app/lib/data";

export type FormContainerProps = {
  table: "shift" | "user" | "pharmacist" | "company" | "location";
  type: "create" | "update" | "delete";
  token: string,
  data?: any;
  id?: string;
};


export default function FormContainer({ 
    table, 
    type, 
    token, 
    data, 
    id, 
}: FormContainerProps) {
    const [isFetching, setIsFetching] = useState(false);
    const [relatedData, setRelatedData] = useState<any>({});

    useEffect(() => {
        if (type === "delete") return;

        const fetchData = async () => {
        setIsFetching(true);
        try {
            switch (table) {
            case "location": {
                //Fetch users that have role = location_manager and locationId is empty
                //Fetch companies to link the location to the company
                const companiesResponse = await fetchCompanies("", 1, token);  //TODO: Update this fetch to get all the companies, not just the limited by page
                setRelatedData({ companies: companiesResponse?.data ?? [] });
                break;
            }
            case "shift":
                //Fetch the companies?, Locations? and pharmacists? to create a new shift
                const companiesRes = await fetchCompanies("", 1, token);  //TODO: Update this fetch to get all the companies, not just the limited by page
                const locationsRes = await fetchLocations("", 1,{}, token);  //TODO: Update this fetch to get only the locations linked to that company
                const pharmacistsRes = await fetchPharmacists("", 1, token);  //TODO: Update this fetch to get all the pharmacists without a pharmacist profile and not just the limited by page
                setRelatedData({ pharmacists: pharmacistsRes?.data ?? [], companies: companiesRes?.data ?? [], locations: locationsRes?.data ?? [] });
                break;
            case "pharmacist":
                //Fetch users that have role = relief_pharmacist and pharmacistProfile is empty
                const pharmacistsResponse = await fetchPharmacists("", 1, token);  //TODO: Update this fetch to get all the pharmacists without a pharmacist profile and not just the limited by page
                setRelatedData({ pharmacists: pharmacistsResponse?.data ?? [] });
                break;
            case "company":
                //Fetch the users that have role = pharmacy_manager and companyId is empty
                break;
            case "user":
                //Do not fetch companies or locations because we dont know the user type to be created
                break;
            }
        } catch (err) {
            console.error("Failed to fetch related data", err);
        } finally {
            setIsFetching(false);
        }
    };

    if (token) fetchData();
  }, [table, type, token]);

    return(
        <div >
            <FormModal 
                table={table} 
                type={type} 
                token={token} 
                data={data} 
                id={id} 
                relatedData={relatedData} 
            />
        </div>
    )
}
