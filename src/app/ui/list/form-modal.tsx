'use client';

import { PencilIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Dispatch, JSX, SetStateAction, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { deleteUser } from "@/app/lib/actions";
import { FormContainerProps } from './form-container';

const deleteActionMap = {
  user: deleteUser,
  //TODO: update delete actions
  pharmacist: deleteUser,
  company: deleteUser,
  location: deleteUser,
  shift: deleteUser,
}

const UserForm = dynamic(() => import("../forms/users/user-form"), {
  loading: () => <h1>Loading...</h1>,
});
const PharmacistForm = dynamic(() => import("../forms/pharmacists/pharmacist-form"), {
  loading: () => <h1>Loading...</h1>,
});
const CompanyForm = dynamic(() => import("../forms/pharmacies/company-form"), {
  loading: () => <h1>Loading...</h1>,
});
const LocationForm = dynamic(() => import("../forms/pharmacies/location-form"), {
  loading: () => <h1>Loading...</h1>,
});
const ShiftForm = dynamic(() => import("../forms/shifts/shift-form"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>, 
    type: "create" | "update", 
    token: string,
    data?: any,
    relatedData?: any,
  ) => JSX.Element;
} = {
  user: (setOpen, type, token, data, relatedData) => <UserForm type={type} data={data} setOpen={setOpen} token={token} relatedData={relatedData} />,
  pharmacist: (setOpen, type, token, data, relatedData) => <PharmacistForm type={type} data={data} setOpen={setOpen} token={token} relatedData={relatedData}/>,
  company: (setOpen, type, token, data, relatedData) => <CompanyForm type={type} data={data} setOpen={setOpen} token={token} relatedData={relatedData}/>,
  location: (setOpen, type, token, data, relatedData) => <LocationForm type={type} data={data} setOpen={setOpen} token={token} relatedData={relatedData}/>,
  shift: (setOpen, type, token, data, relatedData) => <ShiftForm type={type} data={data}setOpen={setOpen} token={token} relatedData={relatedData}/>,
}

export default function FormModal({ 
  table, type, token, data, id, relatedData, }: 
  FormContainerProps & { relatedData?: any } ) 
{
  const [open, setOpen] = useState(false);

  const Form = () => {
    const [state, formAction] = useFormState(
      deleteActionMap[table].bind(null, token),
      {
        success: false,
        error: false,
      });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`${table} has been deleted!`, {toastId: 'unique-toast'});
        setOpen(false);
        router.refresh();
      }
    }, [state, router])

    return type === "delete" && id ? (
      <form className='p-4 flex flex-col gap-4' action={formAction} >
        <input type="text" name="id" value={id}  hidden />
        <span className="text-center font-medium">Are you sure you want to delete this {table}?</span>
        <span className="text-center font-medium">This action cannot be undone!</span>
        <button type="submit" className="bg-red-500 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Delete
        </button>
        {state.error && <span className="text-red-500 text-center">Something went wrong!</span>}
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](setOpen, type, token, data, relatedData)
    ) : (
      "Form not found!"
    );
  };

  return (
     <>
        <button onClick={()=>setOpen(true)}
          className={clsx(
          'rounded-md cursor-pointer',
          {
            'flex h-10 items-center bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
            : type === 'create',
            'border p-2 hover:bg-gray-200': type === 'update',
            'p-2 border hover:bg-gray-200': type === 'delete',
          },
        )}
        >
          {type === 'create' ? (
          <>
            <span className="hidden md:block">Add {table}</span>{' '}
            <PlusIcon className="h-5 md:ml-4" />
          </>
          ) : null}
          {type === 'update' ? (
          <>
            <PencilIcon className="w-5" />
          </>
          ) : null}
          {type === 'delete' ? (
            <>
              <TrashIcon className="w-5" />
            </>
          ) : null}
        </button>
        
        {open && (
          <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
            <div className='bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]'>
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