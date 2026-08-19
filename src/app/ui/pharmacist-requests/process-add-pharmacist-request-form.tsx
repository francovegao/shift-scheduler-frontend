import { processAddPharmacistRequest } from "@/app/lib/actions";
import { processAddPharmacistRequestSchema } from "@/app/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import z from "zod";
import InputField from "../forms/input-field";

type FormInput = z.input<typeof processAddPharmacistRequestSchema>;
type FormOutput = z.output<typeof processAddPharmacistRequestSchema>;

export default function ProcessAddPharmacistRequestForm({
  token,
  data,
  setOpen,
}: {
  data: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  token: string;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(processAddPharmacistRequestSchema),
    defaultValues: {
      approved: false,
      canViewAllCompanies: false,
      canViewPayRates: false,
    },
  });

  const currentStatus = watch("status");

  const [state, formAction] = useFormState(
    processAddPharmacistRequest.bind(null, token),
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
      toast(`Request Processed!`, { toastId: "unique-toast" });
      setOpen(false);
      window.location.reload();
    }
  }, [state, setOpen]);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <form className="p-4 flex flex-col gap-4" onSubmit={onSubmit}>
      <input
        value={data?.id}
        defaultValue={data?.id}
        {...register("id")}
        hidden
      />
      {errors.id?.message && (
        <p className="text-xs text-red-400">{errors.id?.message.toString()}</p>
      )}
      <h1 className="text-xl font-semibold">Process Add Pharmacist Request</h1>
      <div className="flex flex-col md:flex-row gap-4 items-start w-full">
        <div className="flex flex-col gap-2 w-full md:w-auto md:min-w-[180px]">
          <label className="text-xs text-tx-body-muted font-medium">
            Request Action
          </label>
          <div className="flex flex-col gap-2 p-1">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                value="approved"
                {...register("status")}
                defaultChecked={data?.status === "approved"}
              />
              Approve
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                value="rejected"
                {...register("status")}
                defaultChecked={data?.status === "rejected"}
              />
              Reject
            </label>
          </div>
          {errors.status?.message && (
            <p className="text-xs text-red-400">
              {errors.status?.message.toString()}
            </p>
          )}
        </div>
        {currentStatus === "approved" && (
          <div className="flex flex-col sm:flex-row gap-4 w-full md:flex-1 items-end">
            <div className="flex flex-col gap-2 w-full sm:flex-1">
              <label className="text-xs text-tx-body-muted">Approved</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("approved", {
                  setValueAs: (value) => value === "true" || value === true,
                })}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              {"approved" in errors && errors.approved?.message && (
                <p className="text-xs text-red-400">
                  {errors.approved?.message.toString()}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full sm:flex-1">
              <label className="text-xs text-tx-body-muted">
                Can View All Pharmacies?
              </label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("canViewAllCompanies", {
                  setValueAs: (value) => value === "true" || value === true,
                })}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              {"canViewAllCompanies" in errors &&
                errors.canViewAllCompanies?.message && (
                  <p className="text-xs text-red-400">
                    {errors.canViewAllCompanies?.message.toString()}
                  </p>
                )}
            </div>
            <div className="flex flex-col gap-2 w-full sm:flex-1">
              <label className="text-xs text-tx-body-muted">
                Can View All Pay Rates?
              </label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("canViewPayRates", {
                  setValueAs: (value) => value === "true" || value === true,
                })}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              {"canViewPayRates" in errors &&
                errors.canViewPayRates?.message && (
                  <p className="text-xs text-red-400">
                    {errors.canViewPayRates?.message.toString()}
                  </p>
                )}
            </div>
          </div>
        )}
        {currentStatus === "rejected" && (
          <div className="flex flex-col gap-2 w-full md:flex-1">
            <InputField
              label="Enter the rejection reason:"
              name="rejectionReason"
              register={register}
              error={
                "rejectionReason" in errors
                  ? errors?.rejectionReason
                  : undefined
              }
              containerClassName="w-full"
            />
          </div>
        )}
      </div>
      {currentStatus === "rejected" && (
        <>
          <span className="text-center font-medium">
            Are you sure you want to REJECT this request?
          </span>
          <span className="text-center font-bold">
            Pharmacist will not be added to the system
          </span>
        </>
      )}
      <button
        type="submit"
        className="bg-primary text-white p-2 rounded-md hover:bg-primary-100 cursor-pointer"
      >
        Process Request
      </button>
      {state.error && (
        <span className="text-red-500 text-center">Something went wrong!</span>
      )}
    </form>
  );
}
