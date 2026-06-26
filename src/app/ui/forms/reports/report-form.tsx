import { generateAdminReport } from "@/app/lib/actions";
import { generateReportSchema } from "@/app/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

type FormInput = z.input<typeof generateReportSchema>;
type FormOutput = z.output<typeof generateReportSchema>;

export default function ReportForm({
  reportType,
  setOpen,
  token,
  filters,
}: {
  reportType: "shifts" | "companies" | "pharmacists";
  setOpen: Dispatch<SetStateAction<boolean>>;
  token: string;
  filters: {
    startDate?: string;
    endDate?: string;
    type: string;
  };
}) {
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(generateReportSchema),
  });

  const [state, formAction] = useFormState(
    generateAdminReport.bind(null, token),
    {
      success: false,
      error: false,
    },
  );

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  useEffect(() => {
    if (state.success && state.url) {
      toast(`Report generated!`, { toastId: "unique-toast" });
      window.open(state.url, "_blank");
      setOpen(false);
    }
  }, [state, setOpen]);

  if (!filters) return <div>Loading...</div>;
  const isDisabled = !filters.startDate || !filters.endDate;

  return (
    <form className="flex flex-col gap-8 text-black" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Create a {reportType} report</h1>
      <span className="text-sm text-gray-600 font-medium">
        You will generate a {reportType} report with the next parameters:
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <input
          value={filters.type}
          defaultValue={filters.type}
          {...register("type")}
          hidden
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-gray-500">From:</label>
          <input
            value={filters.startDate}
            defaultValue={filters.startDate}
            {...register("startDate")}
            //hidden
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-gray-500">To:</label>
          <input
            value={filters.endDate}
            defaultValue={filters.endDate}
            {...register("endDate")}
            //hidden
          />
        </div>
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button
        disabled={isDisabled}
        className="bg-primary text-white p-2 rounded-md hover:bg-primary-100 cursor-pointer"
      >
        Generate {reportType} report
      </button>
    </form>
  );
}
