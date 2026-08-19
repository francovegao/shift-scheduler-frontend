import { Dispatch, SetStateAction, useActionState, useEffect } from "react";
import z from "zod";
import InputField from "../input-field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { addPharmacistRequestSchema } from "@/app/lib/formValidationSchemas";
import {
  createAddPharmacistRequest,
  updateAddPharmacistRequest,
} from "@/app/lib/actions";

// Infer the input and output types from the schema
type FormInput = z.input<typeof addPharmacistRequestSchema>;
type FormOutput = z.output<typeof addPharmacistRequestSchema>;

export default function AddPharmacistRequestForm({
  type,
  data,
  setOpen,
  token,
  relatedData,
  userId,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  token: string;
  relatedData?: any;
  userId?: string;
}) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(addPharmacistRequestSchema),
    //   defaultValues: {
    //     ...data,
    //     approved: data?.approved ?? false,
    //     canViewAllCompanies: data?.canViewAllCompanies ?? false,
    //     canViewPayRates: data?.canViewPayRates ?? false,
    //   },
  });

  const [state, formAction] = useActionState(
    type === "create"
      ? createAddPharmacistRequest.bind(null, token)
      : updateAddPharmacistRequest.bind(null, token),
    {
      success: false,
      error: false,
    },
  );

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  useEffect(() => {
    if (state.success) {
      toast(
        `Request to Add a Pharmacist has been ${type === "create" ? "created" : "updated"}!`,
        {
          toastId: "unique-toast",
        },
      );
      setOpen(false);
      window.location.reload();
    }
  }, [state, type, setOpen]);

  return (
    <form className="flex flex-col gap-8 text-foreground" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create Request to Add a Pharmacist"
          : "Update Pharmacist Request Information"}
      </h1>
      <span className="text-xs text-tx-disabled font-medium">
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
          inputProps={
            data
              ? {
                  disabled: true,
                  className:
                    "border border-surface-muted bg-surface text-tx-primary p-2 rounded-md text-sm w-full disabled:bg-surface-muted/50 disabled:text-tx-disabled disabled:cursor-not-allowed",
                }
              : undefined
          }
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
      <span className="text-xs text-tx-disabled font-medium">
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
          label="E-Transfer Email"
          name="eTransferEmail"
          type="email"
          defaultValue={data?.eTransferEmail}
          register={register}
          error={errors?.eTransferEmail}
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
      </div>
      <span className="text-xs text-tx-disabled font-medium">
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
          <label className="text-xs text-tx-body-muted">Province</label>
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
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-primary text-white p-2 rounded-md hover:bg-primary-100 cursor-pointer">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
}
