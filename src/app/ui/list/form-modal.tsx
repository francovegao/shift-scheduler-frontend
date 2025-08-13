'use client';

import { PencilIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import PharmacistForm from '../pharmacists/pharmacist-form';

export default function FormModal({ table, type, data, id }:{ 
    table: "shift" | "pharmacist" | "location";
    type: "create" | "update" | "delete";
    data?: any;
    id?: number;
  }) 
{
  const [open, setOpen] = useState(false);

  const Form = () => {
    return type === "delete" && id ? (
      <form className='p-4 flex flex-col gap-4' > {/*action={deleteInvoiceWithId}>*/}
        <span className="text-center font-medium">Are you sure you want to delete this {table}?</span>
        <button type="submit" className="bg-red-500 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Delete
        </button>
      </form>
    ) : (
      <PharmacistForm type='update' data={data}/>
    )
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