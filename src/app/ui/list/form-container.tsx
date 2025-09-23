import FormModal from "./form-modal";

export type FormContainerProps = {
  table: "shift" | "user" | "pharmacist" | "company" | "location";
  type: "create" | "update" | "delete";
  token: string,
  data?: any;
  id?: string;
};


export default function FormContainer({ table, type, token, data, id }: FormContainerProps) {

    let relatedData = {};

    if( type !== "delete"){
        switch(table){
            case "shift":
                //Fetch the companies?, Locations? and pharmacists? to create a new shift
                break;
            case "user":
                //Do not fetch companies or locations because we dont know the user type to be created
                break;
            case "pharmacist":
                //Fetch users that have role = relief_pharmacist and pharmacistProfile is empty
                break;
            case "company":
                //Fetch the users that have role = pharmacy_manager and companyId is empty
                break;
            case "location":
                //Fetch users that have role = location_manager and locationId is empty
                break;
            default:
                break;
        }
    }

    return(
        <div >
            <FormModal table={table} type={type} token={token} data={data} id={id} relatedData={relatedData} />
        </div>
    )
}