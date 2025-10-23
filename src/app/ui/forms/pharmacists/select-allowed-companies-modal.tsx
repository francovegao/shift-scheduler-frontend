import { BuildingOffice2Icon, XMarkIcon } from '@heroicons/react/24/outline';
import {  useState } from 'react';
import SelectAllowedCompaniesForm from '../pharmacies/select-allowed-companies-form';

export default function SelectAllowedCompaniesModal({ 
  token,
  //data, 
  //pharmacistId, 
}: {
  //pharmacistId?: string;
  //data?: any;
  token: string;
  }) 
{
  const [open, setOpen] = useState(false);

  return (
     <>
        <button onClick={()=>setOpen(true)}
          className='inline-flex items-center rounded-full px-2 py-1 text-xs rounded-md cursor-pointer border hover:bg-gray-200'
        >
          <>
            Select Pharmacies
            <BuildingOffice2Icon className="ml-1 w-4" /> 
          </>
        </button>
        
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
            <div className='bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] h-[90%] overflow-y-scroll'>
              <SelectAllowedCompaniesForm token={token} setOpen={setOpen}/>
              <div className='absolute top-4 right-4 cursor-pointer' onClick={()=>setOpen(false)}>
                <XMarkIcon className='w-6' />
              </div>

            </div>
          </div>
        )}
     </>
  );
}