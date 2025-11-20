import Link from "next/link";
import FormContainer from "../list/form-container";

export default function LocationManagerProfileInfo({ location, companyName, token }:{location:any, companyName:string, token: string}) {
  return (
    // <div className="w-full">
    //   <h1 className="text-xl font-semibold">Manager Information</h1>
    //     <div className="gap-4 mt-2 bg-white p-4 rounded-md shadow-sm">
    //     <p><strong>Location:</strong> {location?.name}</p>
    //     <p><strong>Company:</strong> {location?.company?.name}</p>
    //     {/* Add button to see location single page to view complete location info including location files*/}
    //     </div>
    //     <FormContainer table="location" type="update" token={token} data={location} />
    // </div>
       <div className="p-2">
        <div className="flex flex-col gap-2 text-black">
          {/*Title and Edit Button */}
          <div className="flex items-center justify-start gap-4">    
            <h1 className="text-xl font-semibold">Manager Information</h1>
            <FormContainer table="location" type="update" token={token} data={location} />
          </div>
          
          {/*Information */}
          <div className="flex justify-between flex-wrap p-4 gap-4 bg-white rounded-md shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <div className="flex flex-col">
                <label className="text-gray-500">Location:</label>
                <Link href={`list/locations/${location?.id}`}
                className="hover:bg-gray-100 hover:text-blue-600">
                  {location?.name}</Link>
              </div>

              <div className="flex flex-col">
              <label className="text-gray-500">Company:</label>
              <p>{companyName}</p>
            </div>
  

            </div>
          </div>
        </div>
      </div>
  );
}