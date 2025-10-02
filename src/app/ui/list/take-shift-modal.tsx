'use client';

import { BookOpenIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { takeShift} from "@/app/lib/actions";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {  takeShiftSchema } from '@/app/lib/formValidationSchemas';
import z from 'zod';
import { getFullAddress } from '@/app/lib/utils';

// Infer the input and output types from the schema
type FormInput = z.input<typeof takeShiftSchema>;
type FormOutput = z.output<typeof takeShiftSchema>;

const DateFormat = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  weekday: 'short',
 } as const;

 const TimeFormat = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,  
 } as const;

export default function TakeShiftModal({ 
  token,
  data, 
  pharmacistId, 
}: {
  pharmacistId?: string;
  data?: any;
  token: string;
  }) 
{
  const [open, setOpen] = useState(false);

  const Form = () => {

     const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<FormInput, any, FormOutput>({
        resolver: zodResolver(takeShiftSchema),
      });

    const [state, formAction] = useFormState(
         takeShift.bind(null, token),
      {
        success: false,
        error: false,
      }
    );

    const onSubmit = handleSubmit((data) => {
        console.log(data)
        formAction(data)
      });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`Shift taken!`, {toastId: 'unique-toast'});
        setOpen(false);
        router.refresh();
      }
    }, [state, router, setOpen])

      if (!data) {
        return <p>Loading...</p>;
      }

    return (
      <form className='p-4 flex flex-col gap-4' onSubmit={onSubmit} >
        <input  
          value={data?.id} 
          defaultValue={data?.id} 
          {...register("id")}
          hidden />
                {errors.id?.message && ( 
                  <p className="text-xs text-red-400">
                    {errors.id?.message.toString()}
                  </p>
                )}
        <input  
        value={pharmacistId} 
        defaultValue={pharmacistId} 
        {...register("pharmacistId")} 
        hidden />
                {errors.pharmacistId?.message && ( 
                  <p className="text-xs text-red-400">
                    {errors.pharmacistId?.message.toString()}
                  </p>
                )}
        <input 
        value="taken" 
        defaultValue="taken" 
        {...register("status")}
        hidden/>
                {errors.status?.message && ( 
                  <p className="text-xs text-red-400">
                    {errors.status?.message.toString()}
                  </p>
                )}
        <h1 className="text-xl font-semibold">Take Shift</h1>
        <div className="flex justify-around flex-wrap gap-4 mb-4">
          <div>
            <h2 className="text-gray-400 font-medium mb-2">Location Information</h2>
            {data.location ? (
              <div className="">
                <h3 className="font-semibold">{data.location?.name}</h3>
                <p className="text-sm text-gray-500">{data.company?.name}</p>
                <p className="text-sm text-gray-500">{data.location?.email}</p>
                <p className="text-sm text-gray-500">{data.location?.phone}</p>
                <p className="text-sm text-gray-500">{getFullAddress(data.location?.address, data.location?.city, data.location?.province, null)}</p>
              </div>
              ):(
              <div className="">
                <h3 className="font-semibold">{data.company?.name}</h3>
                <p className="text-sm text-gray-500">{data.company?.email}</p>
                <p className="text-sm text-gray-500">{data.company?.phone}</p>
                <p className="text-sm text-gray-500">{getFullAddress(data.company?.address, data.company?.city, data.company?.province, null)}</p>
              </div>
              )}
          </div>
          <div>
            <h2 className="text-gray-400 font-medium mb-2">Shift Information</h2>
              <div className="">
                <h3 className="font-semibold">{new Intl.DateTimeFormat("en-CA", DateFormat).format(new Date(data.startTime))}</h3>
                <p className="text-sm text-gray-500">{new Date(data.startTime).toLocaleTimeString("en-US", TimeFormat)}-{new Date(data.endTime).toLocaleTimeString("en-US", TimeFormat)} </p>
                <p className="text-sm text-gray-500">${parseFloat(data.payRate).toFixed(2)} per hr</p>
              </div>
          </div>
        </div>
        <span className="text-center font-medium">Are you sure you want to take this shift?</span>
        <span className="text-center font-medium">Please verify all the information before taking this shift</span>
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Take Shift
        </button>
        {state.error && <span className="text-red-500 text-center">Something went wrong!</span>}
      </form>
    );
  };

  return (
     <>
        <button onClick={()=>setOpen(true)}
          className='rounded-md cursor-pointer border p-2 hover:bg-gray-200'
        >
          <>
            <BookOpenIcon className="w-5" />
          </>
        </button>
        
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
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