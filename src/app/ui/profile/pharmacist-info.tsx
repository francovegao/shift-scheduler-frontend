import { getFullAddress } from "@/app/lib/utils";
import FormContainer from "../list/form-container";

export default function ReliefPharmacistProfileInfo({ pharmacistProfile, token }:{pharmacistProfile:any, token: string}) {
  return (
      <div className="p-2">
        <div className="flex flex-col gap-2 text-black">
          {/*Title and Edit Button */}
          <div className="flex items-center justify-start gap-4">    
            <h1 className="text-xl font-semibold">Pharmacist Profile</h1>
            <FormContainer table="pharmacist" type="update" token={token} data={pharmacistProfile} />
          </div>
          
          {/*Information */}
          <div className="flex justify-between flex-wrap p-4 gap-4 bg-white rounded-md shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <div className="flex flex-col">
                <label className="text-gray-500">License Number:</label>
                <p>{pharmacistProfile?.licenseNumber}</p>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-500">E-transfer Email:</label>
                <p>{pharmacistProfile?.email}</p>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-500">Bio:</label>
                <p>{pharmacistProfile?.bio}</p>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-500">Experience Years:</label>
                <p>{pharmacistProfile?.experienceYears}</p>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-500">Status:</label>
                <p>{pharmacistProfile?.approved ? "Approved" : "Pending Approval"}</p>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-500">Address:</label>
                <p>{getFullAddress(pharmacistProfile?.address, pharmacistProfile?.city, pharmacistProfile?.province, pharmacistProfile?.postalCode)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
