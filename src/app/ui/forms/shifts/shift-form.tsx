'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../input-field";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ShiftSchema, shiftSchema } from "@/app/lib/formValidationSchemas";
import z from "zod";
import { useFormState } from "react-dom";
import { createShift, updateShift } from "@/app/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Infer the input and output types from the schema
type FormInput = z.input<typeof shiftSchema>;
type FormOutput = z.output<typeof shiftSchema>;

export default function ShiftForm({ 
    type,
    data, 
    setOpen,
    token,
    relatedData,
    }:{
    type: "create" | "update";
    data?: any; 
    setOpen: Dispatch<SetStateAction<boolean>>;
    token: string;
    relatedData?: any;
    }){

      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<FormInput, any, FormOutput>({
        resolver: zodResolver(shiftSchema),
      });

      const [state, formAction] = useFormState(
          type === "create" ? createShift.bind(null, token) : updateShift.bind(null, token),
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
          toast(`Shift has been ${type === "create" ? "created" : "updated"}!`, {toastId: 'unique-toast'});
          setOpen(false);
          router.refresh();
        }
      }, [state, router, type, setOpen])

      const {pharmacists, companies, locations } = relatedData;
      
    return(
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
          <h1 className="text-xl font-semibold">{type === "create" ? "Create a new shift" : "Update shift"}</h1>
          <span className="text-xs text-gray-400 font-medium">
            Shift Information
          </span>
          <div className="flex justify-between flex-wrap gap-4">
            {data && (
              <InputField
                  label="Id"
                  name="id"
                  defaultValue={data?.id}
                  register={register}
                  error={errors?.id}
                  hidden
                />
              )}
            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500">Pharmacy</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("companyId")}
                defaultValue={data?.companies}
              >
                {companies.map(
                  (company: { id: string; name: string}) => (
                    <option
                      value={company.id}
                      key={company.id}
                      selected={data && company.id === data.companyId}
                    >
                      {company.name}
                    </option>
                  )
                )}
              </select>
              {errors.companyId?.message && (
                <p className="text-xs text-red-400">
                  {errors.companyId.message.toString()}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500">Location</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("locationId")}
                defaultValue={data?.locations}
              >
                <option value=""></option>
                {locations.map(
                  (location: { id: string; name: string}) => (
                    <option
                      value={location.id}
                      key={location.id}
                      selected={data && location.id === data.locationId}
                    >
                      {location.name}
                    </option>
                  )
                )}
              </select>
              {errors.locationId?.message && (
                <p className="text-xs text-red-400">
                  {errors.locationId.message.toString()}
                </p>
              )}
            </div>
            <InputField
              label="Title"
              name="title"
              defaultValue={data?.title}
              register={register}
              error={errors?.title}
            />
              <InputField
              label="Description"
              name="description"
              defaultValue={data?.description}
              register={register}
              error={errors?.description}
            />
              <InputField
              label="Start Time"
              name="startTime"
              defaultValue={data?.startTime}
              register={register}
              error={errors?.endTime}
            />
              <InputField
              label="End Time"
              name="endTime"
              defaultValue={data?.endTime}
              register={register}
              error={errors?.endTime}
            />
            <InputField
              label="Pay Rate"
              name="payRate"
              defaultValue={data?.payRate}
              register={register}
              error={errors?.payRate}
            />
            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500">Relief Pharmacist</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("pharmacistId")}
                defaultValue={data?.pharmacists}
              >
                <option value=""></option>
                {pharmacists.map(
                  (pharmacist: { id: string; firstName: string; lastName: string; pharmacistProfile:{id:string} }) => (
                    <option
                      value={pharmacist.pharmacistProfile.id}
                      key={pharmacist.pharmacistProfile.id}
                      selected={data && pharmacist.pharmacistProfile.id === data.pharmacistId}
                    >
                      {pharmacist.firstName + " " + pharmacist.lastName}
                    </option>
                  )
                )}
              </select>
              {errors.pharmacistId?.message && (
                <p className="text-xs text-red-400">
                  {errors.pharmacistId.message.toString()}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs text-gray-500">Status</label>
                <select
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                  {...register("status")}
                  defaultValue={data?.status}
                >
                  <option value="open">open</option>
                  <option value="taken">taken</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
                {errors.status?.message && ( 
                  <p className="text-xs text-red-400">
                    {errors.status?.message.toString()}
                  </p>
                )}
            </div>
           </div> 
           {state.error && <span className="text-red-500">Something went wrong!</span>}     
          <button className="bg-blue-400 text-white p-2 rounded-md">
            {type === "create" ? "Create" : "Update"}
          </button>
        </form>
    );
}