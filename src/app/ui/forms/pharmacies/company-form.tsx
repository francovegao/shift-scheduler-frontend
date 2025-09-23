'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import InputField from "../input-field";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

const schema = z.object({
  approved: z.boolean({message: "Status is required."}),
  name: z.string().min(3,{message: "Name is required."}),
  email: z.email({message: "Invalid email address."}),
  phone: z.string().min(1,{message: "Phone is required."}),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().min(2,{message: "Province is required."}),
  postalCode: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

export default function CompanyForm({ 
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
          <h1 className="text-xl font-semibold">{type === "create" ? "Create a new company" : "Update company"}</h1>
          <span className="text-xs text-gray-400 font-medium">
            Account Information
          </span>
          <div className="flex justify-between flex-wrap gap-4">
            <InputField
              label="Name"
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
            <InputField
                label="Approved"
                name="approved"
                type="checkbox"
                defaultValue={data?.approved}
                register={register}
                error={errors?.approved}
            />
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
          <button className="bg-blue-400 text-white p-2 rounded-md">
            {type === "create" ? "Create" : "Update"}
          </button>
        </form>
    );
}