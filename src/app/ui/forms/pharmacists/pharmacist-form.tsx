'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import InputField from "../input-field";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

const schema = z.object({
  firstName: z.string().min(1,{message: "First name is required."}),
  lastName: z.string().min(1,{message: "Last name is required."}),
  email: z.email({message: "Invalid email address."}),
  phone: z.string().min(1,{message: "Phone is required."}),
  resume: z.instanceof(File),
  licenseNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().min(2,{message: "Province is required."}),
  postalCode: z.string().optional(),
  etransferEmail: z.email({message: "Invalid email address."}).optional(),
  bio: z.string().optional(),
  experienceYears: z.string().optional(),
  approved: z.boolean({message: "Status is required."}),
});

type Inputs = z.infer<typeof schema>;

export default function PharmacistForm({ 
    type,
    data, 
    }:{
    type: "create" | "update";
    data?: any; 
    }){

      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<Inputs>({
        resolver: zodResolver(schema),
      });

      const onSubmit = handleSubmit((data) => {
        console.log(data)
      })


    return(
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
          <h1 className="text-xl font-semibold">{type === "create" ? "Create a new pharmacist" : "Update pharmacist"}</h1>
          <span className="text-xs text-gray-400 font-medium">
            User Information
          </span>
          <div className="flex justify-between flex-wrap gap-4">
            <InputField
              label="First Name"
              name="firstName"
              defaultValue={data?.firstName}
              register={register}
              error={errors?.firstName}
            />
              <InputField
              label="Last Name"
              name="lastName"
              defaultValue={data?.lastName}
              register={register}
              error={errors?.lastName}
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
              name="etransferEmail"
              type="email"
              defaultValue={data?.etransferEmail}
              register={register}
              error={errors?.etransferEmail}
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
            <InputField
              label="Approved"
              name="approved"
              type="checkbox"
              defaultValue={data?.approved}
              register={register}
              error={errors?.approved}
            />
            <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
              <label
                className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                htmlFor="resume"
              >
                <CloudArrowUpIcon className="w-5" />
                <span>Upload resume</span>
              </label>
              <input type="file" id="resume" {...register("resume")} className="hidden" />
              {errors.resume?.message && (
                <p className="text-xs text-red-400">
                  {errors.resume.message.toString()}
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
          <button className="bg-blue-400 text-white p-2 rounded-md">
            {type === "create" ? "Create" : "Update"}
          </button>
        </form>
    );
}