import { processCancelRequestSchema } from "@/app/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { processShiftCancelRequest } from "@/app/lib/actions";
import { toast } from "react-toastify";
import z from "zod";
import { useFormState } from "react-dom";
import { fetchPharmacists } from "@/app/lib/data";

type FormInput = z.input<typeof processCancelRequestSchema>;
type FormOutput = z.output<typeof processCancelRequestSchema>;

export default function ProcessCancelRequestForm({
  token,
  data,
  setOpen,
  adminName,
}: {
  adminName: string;
  data: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  token: string;
}) {
  const [isFetching, setIsFetching] = useState(true);
  const [pharmacists, setPharmacists] = useState<any>({});

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(processCancelRequestSchema),
    defaultValues: {
      status: data?.status || "",
      newShiftStatus: "open",
      pharmacistId: "",
    },
  });

  const currentStatus = watch("status");
  const currentNewShiftStatus = watch("newShiftStatus");

  const [state, formAction] = useFormState(
    processShiftCancelRequest.bind(null, token),
    {
      success: false,
      error: false,
    },
  );

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const pharmacistsRes = await fetchPharmacists("", 1, {}, token); //TODO: Update this fetch to get all the pharmacists without a pharmacist profile and not just the limited by page
        setPharmacists(pharmacistsRes?.data ?? []);
      } catch (err) {
        console.error("Failed to fetch related data", err);
      } finally {
        setIsFetching(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  useEffect(() => {
    if (state.success) {
      toast(`Request Processed!`, { toastId: "unique-toast" });
      setOpen(false);
      window.location.reload();
    }
  }, [state, setOpen]);

  if (!data || isFetching) {
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
      <input
        value={adminName}
        defaultValue={adminName}
        {...register("reviewedBy")}
        hidden
      />
      {errors.reviewedBy?.message && (
        <p className="text-xs text-red-400">
          {errors.reviewedBy?.message.toString()}
        </p>
      )}
      <h1 className="text-xl font-semibold">
        Process Shift Cancellation Request
      </h1>
      <div className="flex flex-col md:flex-row gap-4 items-start w-full">
        <div className="flex flex-col gap-2 w-full md:flex-1">
          <label className="text-xs text-gray-500 font-medium">
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
          <div className="flex flex-col gap-2 w-full md:flex-1">
            <label className="text-xs text-gray-500">Shift's New Status</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("newShiftStatus")}
            >
              <option value="open">Open</option>
              <option value="cancelled">Cancelled</option>
              <option value="taken">Assigned</option>
            </select>
            {errors.newShiftStatus?.message && (
              <p className="text-xs text-red-400">
                {errors.newShiftStatus?.message.toString()}
              </p>
            )}
          </div>
        )}
        {currentStatus === "approved" && currentNewShiftStatus === "taken" && (
          <div className="flex flex-col gap-2 w-full md:flex-1">
            <label className="text-xs text-gray-500">Relief Pharmacist</label>
            <select
              className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full transition-colors bg-white
          }`}
              {...register("pharmacistId")}
              //defaultValue={data?.pharmacistId}
            >
              <option value=""></option>
              {pharmacists
                .filter(
                  (pharmacist: { pharmacistProfile: any }) =>
                    pharmacist &&
                    pharmacist.pharmacistProfile &&
                    pharmacist.pharmacistProfile.id !== data?.pharmacistId,
                )
                .map(
                  (pharmacist: {
                    id: string;
                    firstName: string;
                    lastName: string;
                    pharmacistProfile: { id: string };
                  }) => (
                    <option
                      value={pharmacist.pharmacistProfile.id}
                      key={pharmacist.pharmacistProfile.id}
                    >
                      {pharmacist?.firstName + " " + pharmacist?.lastName}
                    </option>
                  ),
                )}
            </select>
            {errors.pharmacistId?.message && (
              <p className="text-xs text-red-400">
                {errors.pharmacistId.message.toString()}
              </p>
            )}
          </div>
        )}
      </div>
      {currentStatus === "rejected" && (
        <>
          <span className="text-center font-medium">
            Are you sure you want to REJECT this request?
          </span>
          <span className="text-center font-bold">
            Shift will not be cancelled
          </span>
        </>
      )}
      {currentStatus === "approved" && currentNewShiftStatus === "open" && (
        <>
          <span className="text-center font-medium">
            Are you sure you want to APPROVE this request and mark this shift as
            OPEN?
          </span>
          <span className="text-center font-bold">
            Shift will be available for other pharmacists to take
          </span>
        </>
      )}
      {currentStatus === "approved" &&
        currentNewShiftStatus === "cancelled" && (
          <>
            <span className="text-center font-medium">
              Are you sure you want to APPROVE this request and mark this shift
              as CANCELLED?
            </span>
            <span className="text-center font-bold">
              Shift will not be available for other pharmacists
            </span>
          </>
        )}
      {currentStatus === "approved" && currentNewShiftStatus === "taken" && (
        <>
          <span className="text-center font-medium">
            Are you sure you want to APPROVE this request and ASSIGN this shift?
          </span>
          <span className="text-center font-bold">
            Shift will be assigned to the selected pharmacist
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
