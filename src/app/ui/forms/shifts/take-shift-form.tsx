'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {  takeShiftSchema } from "@/app/lib/formValidationSchemas";
import z from "zod";
import { useFormState } from "react-dom";
import { takeShift } from "@/app/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getFullAddress } from "@/app/lib/utils";

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

export default function TakeShiftForm({ 
  token,
  data, 
  setOpen,
  pharmacistId, 
}: {
  pharmacistId?: string;
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  token: string;
  }){

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
              formAction(data)
            });
      
          useEffect(() => {
            if (state.success) {
              toast(`Shift taken!`, {toastId: 'unique-toast'});
              setOpen(false);
              window.location.reload();
            }
          }, [state, setOpen])
      
            if (!data) {
              return <p>Loading...</p>;
            }
        
    return(
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
}