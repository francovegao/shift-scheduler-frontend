'use client';

import { BuildingOffice2Icon, BuildingOfficeIcon, PencilIcon, PlusIcon, ShieldExclamationIcon, TrashIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import {useState } from 'react';
import LinkManagerToCompanyForm from '../forms/pharmacies/link-manager-to-company-form';
import SelectAllowedCompaniesForm from '../forms/pharmacies/select-allowed-companies-form';
import PharmacistForm from '../forms/pharmacists/pharmacist-form';
import LinkManagerToLocationForm from '../forms/pharmacies/link-manager-to-location-form';
import ChangePasswordForm from '../forms/security/change-password-form';
import SelectManagedCompaniesForm from '../forms/pharmacies/select-managed-companies-form';

export default function RelatedDataModal({ 
  type, token, data, id 
}:{ 
  type: "link_company" | "link_location" | "link_pharmacist_profile" | "set_allowed_companies" | "set_managed_companies" | "update_password", 
  token: string,
  data?: any;
  id?: string; 
}) 
{
  const [open, setOpen] = useState(false);

  const Form = () => {

    return type === "link_company" && id ? (
      <div>
        <LinkManagerToCompanyForm token={token} setOpen={setOpen} userId={id}/>
      </div>
    ) : type === "link_location" && id ? (
      <div>
        <LinkManagerToLocationForm token={token} setOpen={setOpen} userId={id}/>
      </div>
    ) : type === "link_pharmacist_profile" && id ? (  
        <div>
        <PharmacistForm type="create" setOpen={setOpen} token={token} userId={id}/>
      </div>
    ) : type === "set_allowed_companies" && id ? (
        <div>
        <SelectAllowedCompaniesForm setOpen={setOpen} token={token} pharmacistId={id} data={data}/>
      </div>
    ) : type === "set_managed_companies" && id ? (
        <div>
        <SelectManagedCompaniesForm setOpen={setOpen} token={token} userId={id} data={data}/>
      </div>
    ) : type === "update_password" ? (
        <div>
        <ChangePasswordForm setOpen={setOpen} />
      </div>
    ) :(
      "Form not found!"
    );
  };

  return (
     <>
      <button
        onClick={() => setOpen(true)}
        className={clsx(
          'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
          'border border-red-400 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-500',
        )}
      >
        {type === 'link_company' && (
          <>
            <BuildingOfficeIcon className="w-4 h-4" />
            <span>Select Manager’s Company</span>
          </>
        )}

        {type === 'link_location' && (
          <>
            <BuildingOfficeIcon className="w-4 h-4" />
            <span>Select Manager’s Location</span>
          </>
        )}

        {type === 'link_pharmacist_profile' && (
          <>
            <UserIcon className="w-4 h-4" />
            <span>Add Pharmacist Profile</span>
          </>
        )}

        {type === 'set_allowed_companies' && (
          <>
            <BuildingOffice2Icon className="w-4 h-4" />
            <span>Set Allowed Pharmacies</span>
          </>
        )}
        {type === 'set_managed_companies' && (
          <>
            <BuildingOffice2Icon className="w-4 h-4" />
            <span>Set Managed Pharmacies</span>
          </>
        )}
        {type === 'update_password' && (
          <>
            <ShieldExclamationIcon className="w-4 h-4" />
            <span>Change Password</span>
          </>
        )}
      </button>
        
        {open && (
          <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
            <div className='bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-9/10 overflow-y-scroll'>
              <Form />
              <div className='absolute top-4 right-4 cursor-pointer' onClick={()=>setOpen(false)}>
                <XMarkIcon className='w-6' />
              </div>

            </div>
          </div>
        )}
     </>
  );
}