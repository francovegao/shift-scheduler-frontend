'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../input-field";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useEffect } from "react";
import { LocationSchema, locationSchema } from "@/app/lib/formValidationSchemas";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";
import { createLocation, updateLocation } from "@/app/lib/actions";

export default function LocationForm({ 
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
      } = useForm<LocationSchema>({
        resolver: zodResolver(locationSchema),
      });

      const [state, formAction] = useFormState(
          type === "create" ? createLocation.bind(null, token) : updateLocation.bind(null, token),
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
          toast(`Location has been ${type === "create" ? "created" : "updated"}!`, {toastId: 'unique-toast'});
          setOpen(false);
          router.refresh();
        }
      }, [state, router, type, setOpen])

      const {companies} = relatedData;

    return(
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
          <h1 className="text-xl font-semibold">{type === "create" ? "Create a new location" : "Update location"}</h1>
          <span className="text-xs text-gray-400 font-medium">
            Account Information
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
            <InputField
              label="Location Name"
              name="name"
              defaultValue={data?.name}
              register={register}
              error={errors?.name}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              defaultValue={data?.email}
              register={register}
              error={errors?.email}
            />
            <InputField
                label="Phone"
                name="phone"
                type="phone"
                defaultValue={data?.phone}
                register={register}
                error={errors?.phone}
            />
            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500">Parent Pharmacy</label>
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
           </div>
          <span className="text-xs text-gray-400 font-medium">
            Location Information
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