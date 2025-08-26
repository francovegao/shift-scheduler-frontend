'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import InputField from "../input-field";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

const schema = z.object({
  email: z.email({message: "Invalid email address."}),
  firstName: z.string().min(1,{message: "First name is required."}),
  lastName: z.string().min(1,{message: "Last name is required."}),
  phone: z.string().min(1,{message: "Phone is required."}),
  roles: z.string().optional(),
  files: z.instanceof(File),
});

type Inputs = z.infer<typeof schema>;

export default function UserForm({ 
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
            Roles Information
          </span>
          <div className="flex justify-between flex-wrap gap-4">
            <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs text-gray-500">Role</label>
                <select
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                  {...register("roles")}
                  defaultValue={data?.role}
                >
                  <option value=""></option>
                  <option value="relief_pharmacist">Relief Pharmacist</option>
                  <option value="pharmacy_manager">Pharmacy Manager</option>
                  <option value="admin">Administrator</option>
                </select>
                {errors.roles?.message && ( 
                  <p className="text-xs text-red-400">
                    {errors.roles?.message.toString()}
                  </p>
                )}
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
              <label
                className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                htmlFor="resume"
              >
                <CloudArrowUpIcon className="w-5" />
                <span>Upload files</span>
              </label>
              <input type="file" id="file" {...register("files")} className="hidden" />
              {errors.files?.message && (
                <p className="text-xs text-red-400">
                  {errors.files.message.toString()}
                </p>
              )}
            </div>
           </div>
          <button className="bg-blue-400 text-white p-2 rounded-md">
            {type === "create" ? "Create" : "Update"}
          </button>
        </form>
    );
}