'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../input-field";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { pharmacistSchema } from "@/app/lib/formValidationSchemas";
import z from "zod";
import { useFormState } from "react-dom";
import { createPharmacist, updatePharmacist } from "@/app/lib/actions";
import { toast } from "react-toastify";
import SelectAllowedCompaniesForm from "../pharmacies/select-allowed-companies-form";

// Infer the input and output types from the schema
type FormInput = z.input<typeof pharmacistSchema>;
type FormOutput = z.output<typeof pharmacistSchema>;

export default function PharmacistForm({ 
    type,
    data, 
    setOpen,
    token,
    relatedData,
    userId,
    }:{
    type: "create" | "update";
    data?: any; 
    setOpen: Dispatch<SetStateAction<boolean>>;
    token: string;
    relatedData?: any;
    userId?: string;
    }){

      const [canViewAllPharmacies, setCanViewAllPharmacies] = useState(false);
      const [showSelectCompaniesForm, setShowSelectCompaniesForm] = useState(false);

      const [createdPharmacistId, setCreatedPharmacistId] = useState('');

      const {
        register,
        watch,
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
          responseData: null
        }
      );

      const onSubmit = handleSubmit((data) => {
        setCanViewAllPharmacies(data.canViewAllCompanies)
        formAction(data)
      });

      useEffect(() => {
        if (state.success) {
          if(!canViewAllPharmacies && type==="create"){
            toast(`Pharmacist Profile has been ${type === "create" ? "created" : "updated"}!`, {toastId: 'unique-toast'});
             setCreatedPharmacistId(state.responseData?.id);
             setShowSelectCompaniesForm(true);
          }else{
            toast(`Pharmacist Profile has been ${type === "create" ? "created" : "updated"}!`, {toastId: 'unique-toast'});
            setOpen(false);
            window.location.reload();
          }
        }
      }, [state, type, setOpen])

      //const {pharmacists} = relatedData;

    return(
      <div>
      {showSelectCompaniesForm ? (
        <div className="flex flex-col items-center">
          <SelectAllowedCompaniesForm setOpen={setOpen} token={token} pharmacistId={createdPharmacistId} data={data}/>
          <p className="font-semibold">Or add them later in the pharmacist profile page</p>
        </div>
      ) : (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
          <h1 className="text-xl font-semibold">{type === "create" ? "Create a New Pharmacist Profile" : "Update Pharmacist Profile"}</h1>
            {data && (
            <InputField
              label="Pharmacist Profile Id"
              name="id"
              defaultValue={data?.id}
              register={register}
              error={errors?.id}
              hidden
            />
            )}
            {userId && (
            <InputField
              label="User Id"
              name="userId"
              defaultValue={userId}
              register={register}
              error={errors?.userId}
              hidden
            />
            )}
            {data && (
            <InputField
              label="User Id from Data"
              name="userId"
              defaultValue={data?.userId}
              register={register}
              error={errors?.userId}
              hidden
            />
            )}
          
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
              error={errors?.experienceYears}
            />
            <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs text-gray-500">Approved</label>
                <select
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                  {...register("approved", {
                    setValueAs: value => value === 'true'
                  })}
                  defaultValue={data?.approved ? 'true' : 'false'}
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
              <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs text-gray-500">Can View All Pharmacies?</label>
                <select
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                  {...register("canViewAllCompanies", {
                    setValueAs: value => value === 'true'
                  })}
                  defaultValue={data?.canViewAllCompanies ? 'true' : 'false'}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {errors.canViewAllCompanies?.message && ( 
                  <p className="text-xs text-red-400">
                    {errors.canViewAllCompanies?.message.toString()}
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
        )}
    </div>
    );
}