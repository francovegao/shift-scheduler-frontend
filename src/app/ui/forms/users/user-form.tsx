'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../input-field";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { userSchema, UserSchema } from "@/app/lib/formValidationSchemas";
import { createUser, updateUser } from "@/app/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";



export default function UserForm({ 
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
      } = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
      });

      const [state, formAction] = useFormState(
          type === "create" ? createUser.bind(null, token) : updateUser.bind(null, token),
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
          toast(`User has been ${type === "create" ? "created" : "updated"}!`, {toastId: 'unique-toast'});
          setOpen(false);
          router.refresh();
        }
      }, [state, router, type, setOpen])

    return(
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
          <h1 className="text-xl font-semibold">{type === "create" ? "Create a new user" : "Update user"}</h1>
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
                hidden
              />
            )}
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
                  {...register("role")}
                  defaultValue={data?.role}
                >
                  <option value=""></option>
                  <option value="relief_pharmacist">Relief Pharmacist</option>
                  <option value="pharmacy_manager">Pharmacy Manager</option>
                  <option value="location_manager">Location Manager</option>
                  <option value="admin">Administrator</option>
                </select>
                {errors.role?.message && ( 
                  <p className="text-xs text-red-400">
                    {errors.role?.message.toString()}
                  </p>
                )}
            </div>
            {/*<div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
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
            </div>*/}
           </div>
           {state.error && <span className="text-red-500">Something went wrong!</span>}
          <button className="bg-blue-400 text-white p-2 rounded-md">
            {type === "create" ? "Create" : "Update"}
          </button>
        </form>
    );
}