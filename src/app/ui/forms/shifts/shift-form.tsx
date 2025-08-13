'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import InputField from "../input-field";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

const schema = z.object({
  companyId: z.string().min(1,{message: "Company is required."}),
  locationId: z.string(),  //TODO Join location and company in a single select
  title: z.string().min(4,{message: "Title is required."}),
  description: z.string().optional(),
  startTime: z.date({message: "Start date is required"}),
  endTime: z.date({message: "End date is required"}),
  payRate: z.float32({message: "Pay rate is required."}),
  status: z.enum(["open", "taken", "cancelled", "completed"]),
  assignedTo: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

export default function ShiftForm({ 
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
          <h1 className="text-xl font-semibold">{type === "create" ? "Create a new shift" : "Update shift"}</h1>
          <span className="text-xs text-gray-400 font-medium">
            Shift Information
          </span>
          <div className="flex justify-between flex-wrap gap-4">
            <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Company</label>
                    <select
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    {...register("companyId")}
                    defaultValue={data?.locationId}
                    >
                    <option value=""></option>
                    <option value="company1">Test Company</option>
                    <option value="company2">Some Company</option>
                    <option value="company3">Other Company</option>
                    <option value="company4">Another Company</option>
                    <option value="company5">Service Company</option>
                    <option value="company6">My Company</option>
                    <option value="company7">Some Inc.</option>
                    <option value="company8">One Inc.</option>
                    <option value="company9">Not Real Pharmacy</option>
                    <option value="company10">My Pharmacy</option>
                    </select>
                    {errors.locationId?.message && ( 
                    <p className="text-xs text-red-400">
                        {errors.locationId?.message.toString()}
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
              error={errors?.startTime}
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
              type="number"
              defaultValue={data?.payRate}
              register={register}
              error={errors?.payRate}
            />
            <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Pharmacist</label>
                    <select
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    {...register("companyId")}
                    defaultValue={data?.assignedTo}
                    >
                    <option value=""></option>
                    <option value="pharmacist1">Jhin Doe</option>
                    <option value="pharmacist2">Leonard Snyder</option>
                    <option value="pharmacist3">Raj Patel</option>
                    <option value="pharmacist4">Sheldon Cooper</option>
                    <option value="pharmacist5">Laun Lehm</option>
                    <option value="pharmacist6">Nicole Nale</option>
                    </select>
                    {errors.assignedTo?.message && ( 
                    <p className="text-xs text-red-400">
                        {errors.assignedTo?.message.toString()}
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