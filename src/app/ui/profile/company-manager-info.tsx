import Link from "next/link";
import FormContainer from "../list/form-container";

export default function CompanyManagerProfileInfo({ company, token }:{company:any, token: string}) {
  return (
      <div className="p-2">
        <div className="flex flex-col gap-2 text-black">
          {/*Title and Edit Button */}
          <div className="flex items-center justify-start gap-4">    
            <h1 className="text-xl font-semibold">Manager Information</h1>
            <FormContainer table="company" type="update" token={token} data={company} />
          </div>
          
          {/*Information */}
          <div className="flex justify-between flex-wrap p-4 gap-4 bg-white rounded-md shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <div className="flex flex-col">
                <label className="text-gray-500">Company:</label>
                <Link href={`list/companies/${company?.id}`}
                className="hover:bg-gray-100 hover:text-blue-600">
                  {company?.name} - {company?.legalName}</Link>
              </div>
  
            <div className="flex flex-col">
              <label className="text-gray-500">Locations:</label>
              <div className=""> 
                {company?.locations?.map((l: { name: any; id: any}, index: number) => 
                  <Link 
                    key={l.id || index} 
                    href={`list/locations/${l.id}`}
                    className="block hover:bg-gray-100 hover:text-blue-600 whitespace-nowrap" 
                  >
                    {l.name}
                  </Link>
                )}
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
  );
}