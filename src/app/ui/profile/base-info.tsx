import { displayRole } from "@/app/lib/utils";
import FormContainer from "../list/form-container";

export default function BasicProfileInfo({ user, token }:{user:any, token:string}) {
  return (
    <div className="p-2">
      <div className="flex flex-col gap-2 text-black">
        {/*Title and Edit Button */}
        <div className="flex items-center justify-start gap-4">    
          <h1 className="text-xl font-semibold">User Information</h1>
          <FormContainer table="user" type="update" token={token} data={user} />
        </div>
        
        {/*Information */}
        <div className="flex justify-between flex-wrap p-4 gap-4 bg-white rounded-md shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div className="flex flex-col">
              <label className="text-gray-500">Role:</label>
              <p>{displayRole(user.role)}</p>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-500">First Name:</label>
              <p>{user.firstName}</p>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-500">Last Name:</label>
              <p>{user.lastName}</p>
            </div>
          
            <div className="flex flex-col">
              <label className="text-gray-500">Email:</label>
              <p>{user.email}</p>
            </div>
          
            <div className="flex flex-col">
              <label className="text-gray-500">Phone:</label>
              <p>{user.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
