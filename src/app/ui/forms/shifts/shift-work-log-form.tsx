import { upsertShiftWorKLog } from "@/app/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import z from "zod";
import InputField from "../input-field";
import { shiftWorkLogSchema } from "@/app/lib/formValidationSchemas";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

// Infer the input and output types from the schema
type FormInput = z.input<typeof shiftWorkLogSchema>;
type FormOutput = z.output<typeof shiftWorkLogSchema>;

export default function ShiftWorkLogForm({
  token,
  data,
  setOpen,
  workLogId,
}: {
  data: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  token: string;
  workLogId?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(shiftWorkLogSchema),
    defaultValues: {
      id: workLogId || "",
      shiftId: data?.id || "",
      pharmacistId: data?.pharmacist?.id || "",
      startMinutes: data.workLogs?.[0]?.clockIn
        ? formatInTimeZone(
            data.workLogs?.[0]?.clockIn,
            data.company?.timezone,
            "HH:mm",
          )
        : "",
      endMinutes: data.workLogs?.[0]?.clockOut
        ? formatInTimeZone(
            data.workLogs?.[0]?.clockOut,
            data.company?.timezone,
            "HH:mm",
          )
        : "",
    },
  });

  const [state, formAction] = useFormState(
    upsertShiftWorKLog.bind(null, token),
    {
      success: false,
      error: false,
    },
  );

  const onSubmit = handleSubmit((formData) => {
    formAction(formData);
  });

  useEffect(() => {
    if (state.success) {
      toast(`Woklog upserted!`, { toastId: "unique-toast" });
      setOpen(false);
      window.location.reload();
    }
  }, [state, setOpen]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Upsert Shift Work Log</h1>
      <input {...register("id")} hidden />
      {errors.id?.message && (
        <p className="text-xs text-red-400">{errors.id?.message.toString()}</p>
      )}
      <input {...register("shiftId")} hidden />
      {errors.shiftId?.message && (
        <p className="text-xs text-red-400">
          {errors.shiftId?.message.toString()}
        </p>
      )}
      <input {...register("pharmacistId")} hidden />
      {errors.pharmacistId?.message && (
        <p className="text-xs text-red-400">
          {errors.pharmacistId?.message.toString()}
        </p>
      )}
      <div className="flex justify-around flex-wrap gap-4">
        <InputField
          label="Clock In Time"
          name="startMinutes"
          type="time"
          register={register}
          error={errors?.startMinutes}
        />

        <InputField
          label="Clock Out Time"
          name="endMinutes"
          type="time"
          register={register}
          error={errors?.endMinutes}
        />
      </div>
      <span className="text-center font-medium">
        Are you sure you want to upsert a work log for this shift?
      </span>
      <span className="text-center font-medium">
        Please verify all the information before submitting
      </span>
      <button
        type="submit"
        className="bg-primary text-white py-2 px-4 rounded-md border-none w-max self-center hover:bg-primary-100 cursor-pointer"
      >
        Upsert Work Log
      </button>
      {state.error && (
        <span className="text-red-500 text-center">Something went wrong!</span>
      )}
    </form>
  );
}
