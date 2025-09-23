'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../input-field";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useEffect } from "react";
import { PharmacistSchema, pharmacistSchema } from "@/app/lib/formValidationSchemas";
import z from "zod";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { createPharmacist, updatePharmacist } from "@/app/lib/actions";
import { toast } from "react-toastify";

// Infer the input and output types from the schema
type FormInput = z.input<typeof pharmacistSchema>;
type FormOutput = z.output<typeof pharmacistSchema>;

export default function PharmacistForm({ 
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
        resolver: zodResolver(pharmacistSchema),
      });

      const [state, formAction] = useFormState(
          type === "create" ? createPharmacist.bind(null, token) : updatePharmacist.bind(null, token),
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
          toast(`Pharmacist has been ${type === "create" ? "created" : "updated"}!`, {toastId: 'unique-toast'});
          setOpen(false);
          router.refresh();
        }
      }, [state, router, type, setOpen])

      const {pharmacists} = relatedData;

    return(
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
          <h1 className="text-xl font-semibold">{type === "create" ? "Create a new pharmacist" : "Update pharmacist"}</h1>
          <span className="text-xs text-gray-400 font-medium">
            User Information
          </span>
          <div className="flex justify-between flex-wrap gap-4">
            {data && (
            <InputField
                label="Id"
                name="id"
                defaultValue={data?.id}
                register={register}
                error={errors?.id}
                
              />
            )}
            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500">Relief Pharmacist</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("userId")}
                defaultValue={data?.pharmacists}
              >
                {pharmacists.map(
                  (pharmacist: { id: string; firstName: string; lastName: string }) => (
                    <option
                      value={pharmacist.id}
                      key={pharmacist.id}
                      selected={data && pharmacist.id === data.userId}
                    >
                      {pharmacist.firstName + " " + pharmacist.lastName}
                    </option>
                  )
                )}
              </select>
              {errors.userId?.message && (
                <p className="text-xs text-red-400">
                  {errors.userId.message.toString()}
                </p>
              )}
            </div>
           </div>
          <span className="text-xs text-gray-400 font-medium">
            Pharmacist Information
          </span>
          <div className="flex justify-between flex-wrap gap-4">
            <InputField
              label="License Number"
              name="licenseNumber"
              defaultValue={data?.licenseNumber}
              register={register}
              error={errors?.licenseNumber}
            />
              <InputField
              label="E-Transer Email"
              name="email"
              type="email"
              defaultValue={data?.email}
              register={register}
              error={errors?.email}
            />
              <InputField
              label="Bio"
              name="bio"
              type="text"
              defaultValue={data?.bio}
              register={register}
              error={errors?.bio}
            />
            <InputField
              label="Experience Years"
              name="experienceYears"
              type="number"
              defaultValue={data?.experienceYears}
              register={register}
              //error={errors?.experienceYears}
            />
            <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs text-gray-500">Approved</label>
                <select
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                  {...register("approved")}
                  defaultValue={data?.approved}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {errors.approved?.message && ( 
                  <p className="text-xs text-red-400">
                    {errors.approved?.message.toString()}
                  </p>
                )}
            </div>
           </div>
           <span className="text-xs text-gray-400 font-medium">
            Personal Information
          </span>
          <div className="flex justify-between flex-wrap gap-4">
            <InputField
              label="Address"
              name="address"
              defaultValue={data?.address}
              register={register}
              error={errors?.address}
            />
              <InputField
              label="City"
              name="city"
              defaultValue={data?.city}
              register={register}
              error={errors?.city}
            />
            <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs text-gray-500">Province</label>
                <select
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                  {...register("province")}
                  defaultValue={data?.province}
                >
                  <option value="AB">AB</option>
                  <option value="BC">BC</option>
                  <option value="MB">MB</option>
                  <option value="NB">NB</option>
                  <option value="NL">NL</option>
                  <option value="NS">NS</option>
                  <option value="ON">ON</option>
                  <option value="PE">PE</option>
                  <option value="QC">QC</option>
                  <option value="SK">SK</option>
                </select>
                {errors.province?.message && ( 
                  <p className="text-xs text-red-400">
                    {errors.province?.message.toString()}
                  </p>
                )}
            </div>
            <InputField
              label="Postal Code"
              name="postalCode"
              defaultValue={data?.postalCode}
              register={register}
              error={errors?.postalCode}
            />
           </div>
           {state.error && <span className="text-red-500">Something went wrong!</span>}
          <button className="bg-blue-400 text-white p-2 rounded-md">
            {type === "create" ? "Create" : "Update"}
          </button>
        </form>
    );
}